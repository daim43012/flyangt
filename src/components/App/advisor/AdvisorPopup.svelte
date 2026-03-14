<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import {
    advisorOpen,
    toggleAdvisor,
    closeAdvisor,
    advisorPendingError,
    openAdvisorWithError,
    clearAdvisorError,
  } from "$lib/stores/advisor";
  import AssistantChat from "./AssistantChat.svelte";

  let toastVisible = false;
  let toastText = "";
  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  // Watch for new errors — show toast near FAB
  $: if ($advisorPendingError && !$advisorOpen) {
    toastText = $advisorPendingError;
    toastVisible = true;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastVisible = false;
      clearAdvisorError();
    }, 12000);
  }

  // Hide toast when advisor opens
  $: if ($advisorOpen && toastVisible) {
    toastVisible = false;
    if (toastTimer) clearTimeout(toastTimer);
  }

  function handleToastClick() {
    toastVisible = false;
    if (toastTimer) clearTimeout(toastTimer);
    openAdvisorWithError();
  }

  function dismissToast() {
    toastVisible = false;
    clearAdvisorError();
    if (toastTimer) clearTimeout(toastTimer);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && $advisorOpen) {
      closeAdvisor();
    }
  }

  onMount(() => {
    if (browser) window.addEventListener("keydown", handleKeydown);
  });

  onDestroy(() => {
    if (browser) window.removeEventListener("keydown", handleKeydown);
    if (toastTimer) clearTimeout(toastTimer);
  });
</script>

<button
  class="advisor-fab"
  class:open={$advisorOpen}
  on:click={toggleAdvisor}
  type="button"
  aria-label={$advisorOpen ? "Close advisor" : "Open advisor"}
>
  {#if $advisorOpen}
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  {:else}
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    </svg>
  {/if}
</button>

{#if toastVisible}
  <div class="advisor-toast" role="alert">
    <button class="advisor-toast__body" type="button" on:click={handleToastClick}>
      <span class="advisor-toast__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="advisor-toast__text">Something went wrong — Ask Advisor for help</span>
    </button>
    <button class="advisor-toast__dismiss" type="button" on:click={dismissToast} aria-label="Dismiss">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
{/if}

{#if $advisorOpen}
  <div class="advisor-popup" role="dialog" aria-label="Flight Advisor">
    <AssistantChat />
  </div>
{/if}

<style>
  .advisor-fab {
    position: fixed;
    right: 24px;
    bottom: 24px;
    width: 56px;
    height: 56px;
    border-radius: 18px;
    z-index: 100;
    border: none;
    cursor: pointer;
    display: grid;
    place-items: center;
    color: white;
    background: linear-gradient(135deg, var(--accent-light), var(--accent), var(--accent-dark));
    box-shadow:
      0 18px 50px rgba(176, 141, 87, 0.3),
      0 6px 18px rgba(18, 20, 22, 0.08);
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .advisor-fab:hover {
    transform: translateY(-3px);
    box-shadow:
      0 24px 60px rgba(176, 141, 87, 0.35),
      0 8px 22px rgba(18, 20, 22, 0.1);
  }

  .advisor-fab.open {
    background: var(--bg-white);
    color: var(--text-muted);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 18px 50px rgba(18, 20, 22, 0.08),
      0 6px 18px rgba(18, 20, 22, 0.04);
  }

  .advisor-fab.open:hover {
    color: var(--text-main);
  }

  .advisor-popup {
    position: fixed;
    right: 24px;
    bottom: 92px;
    width: 400px;
    height: min(70vh, 640px);
    z-index: 100;
    border-radius: 20px;
    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.12),
      0 8px 22px rgba(18, 20, 22, 0.08);
    overflow: hidden;
    animation: advisor-slide-up 0.3s ease;
  }

  @keyframes advisor-slide-up {
    from {
      opacity: 0;
      transform: translateY(16px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Error toast */
  .advisor-toast {
    position: fixed;
    right: 24px;
    bottom: 92px;
    z-index: 101;
    display: flex;
    align-items: center;
    gap: 0;
    max-width: 340px;
    border-radius: 16px;
    background: var(--bg-white);
    border: 1px solid rgba(245, 158, 11, 0.3);
    box-shadow:
      0 18px 50px rgba(18, 20, 22, 0.1),
      0 6px 18px rgba(18, 20, 22, 0.06);
    animation: advisor-slide-up 0.3s ease;
    overflow: hidden;
  }

  .advisor-toast__body {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.2s ease;
  }

  .advisor-toast__body:hover {
    background: rgba(176, 141, 87, 0.04);
  }

  .advisor-toast__icon {
    flex: 0 0 auto;
    width: 28px;
    height: 28px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    background: rgba(245, 158, 11, 0.1);
    color: rgba(180, 110, 20, 0.9);
  }

  .advisor-toast__text {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-main);
    line-height: 1.35;
  }

  .advisor-toast__dismiss {
    flex: 0 0 auto;
    width: 36px;
    height: 100%;
    min-height: 48px;
    border: none;
    background: none;
    cursor: pointer;
    display: grid;
    place-items: center;
    color: var(--text-muted);
    border-left: 1px solid var(--border-soft);
    transition: color 0.2s ease, background 0.2s ease;
  }

  .advisor-toast__dismiss:hover {
    color: var(--text-main);
    background: rgba(15, 23, 42, 0.03);
  }

  @media (max-width: 980px) {
    .advisor-fab {
      right: 14px;
      bottom: 80px;
      width: 54px;
      height: 54px;
      z-index: 60;
    }

    .advisor-popup {
      inset: 0;
      width: 100%;
      height: 100dvh;
      right: auto;
      bottom: auto;
      border-radius: 0;
      border: none;
      z-index: 9999;
      animation: none;
    }

    .advisor-toast {
      right: 14px;
      bottom: 146px;
      max-width: calc(100vw - 28px);
    }
  }
</style>
