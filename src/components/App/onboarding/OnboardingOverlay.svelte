<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";
  import { browser } from "$app/environment";
  import {
    onboardingActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    prevStep,
    skipOnboarding,
  } from "$lib/stores/onboarding";

  let spotRect = { top: 0, left: 0, width: 0, height: 0 };
  let tooltipStyle = "";
  let isMobile = false;
  let currentEl: Element | null = null;

  function checkMobile() {
    if (browser) isMobile = window.innerWidth <= 980;
  }

  function updateSpotRect() {
    if (!currentEl) return;
    const rect = currentEl.getBoundingClientRect();
    const pad = 8;
    spotRect = {
      top: rect.top - pad,
      left: rect.left - pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    };
    positionTooltip();
  }

  async function positionSpotlight(selector: string) {
    await tick();
    if (!browser) return;

    const el = document.querySelector(selector);
    if (!el) return;
    currentEl = el;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    await new Promise((r) => setTimeout(r, 450));
    updateSpotRect();
  }

  function positionTooltip() {
    if (isMobile || !$currentStep) return;

    const pos = $currentStep.tooltipPosition;
    const gap = 16;
    let top = 0;
    let left = 0;

    if (pos === "bottom") {
      top = spotRect.top + spotRect.height + gap;
      left = spotRect.left;
    } else if (pos === "top") {
      top = spotRect.top - gap - 200;
      left = spotRect.left;
    } else if (pos === "right") {
      top = spotRect.top;
      left = spotRect.left + spotRect.width + gap;
    } else {
      top = spotRect.top;
      left = spotRect.left - gap - 340;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (left + 340 > vw - 16) left = vw - 340 - 16;
    if (left < 16) left = 16;
    if (top + 200 > vh - 16) top = vh - 200 - 16;
    if (top < 16) top = 16;

    tooltipStyle = `top: ${top}px; left: ${left}px;`;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!$onboardingActive) return;
    if (e.key === "Escape") skipOnboarding();
    if (e.key === "ArrowRight") nextStep();
    if (e.key === "ArrowLeft") prevStep();
  }

  function onScroll() {
    if ($onboardingActive && currentEl) updateSpotRect();
  }

  function onResize() {
    checkMobile();
    if ($currentStep) positionSpotlight($currentStep.selector);
  }

  $: if ($onboardingActive && $currentStep && browser) {
    checkMobile();
    positionSpotlight($currentStep.selector);
  }

  onMount(() => {
    if (!browser) return;
    checkMobile();
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
  });

  onDestroy(() => {
    if (!browser) return;
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("scroll", onScroll, true);
    currentEl = null;
  });
</script>

{#if $onboardingActive && $currentStep}
  {#if isMobile}
    <!-- Mobile: simple card carousel over dimmed background -->
    <div class="ob-backdrop" aria-hidden="true"></div>
    <div class="ob-mobile" role="dialog" aria-label="Onboarding">
      <div class="ob-mobile-card">
        <div class="ob-mobile-header">
          <span class="ob-step-badge">{$currentStepIndex + 1} / {totalSteps}</span>
          <button class="ob-skip" type="button" on:click={skipOnboarding}>Skip</button>
        </div>

        <div class="ob-mobile-icon">
          <i class={$currentStep.icon}></i>
        </div>

        <h4 class="ob-title">{$currentStep.title}</h4>
        <p class="ob-desc">{$currentStep.description}</p>

        <div class="ob-dots">
          {#each Array(totalSteps) as _, i}
            <span class="ob-dot" class:active={i === $currentStepIndex}></span>
          {/each}
        </div>

        <div class="ob-nav">
          {#if $currentStepIndex > 0}
            <button class="ob-btn ob-btn--ghost" type="button" on:click={prevStep}>Back</button>
          {/if}
          <button class="ob-btn ob-btn--primary" type="button" on:click={nextStep}>
            {$currentStepIndex === totalSteps - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- Desktop: spotlight + tooltip -->
    <div
      class="ob-spotlight"
      style="top: {spotRect.top}px; left: {spotRect.left}px; width: {spotRect.width}px; height: {spotRect.height}px;"
      aria-hidden="true"
    ></div>

    <div class="ob-tooltip" style={tooltipStyle} role="dialog" aria-label="Onboarding">
      <div class="ob-tooltip-header">
        <span class="ob-step-badge">{$currentStepIndex + 1} / {totalSteps}</span>
        <button class="ob-skip" type="button" on:click={skipOnboarding}>Skip</button>
      </div>

      <h4 class="ob-title">{$currentStep.title}</h4>
      <p class="ob-desc">{$currentStep.description}</p>

      <div class="ob-nav">
        {#if $currentStepIndex > 0}
          <button class="ob-btn ob-btn--ghost" type="button" on:click={prevStep}>Back</button>
        {/if}
        <button class="ob-btn ob-btn--primary" type="button" on:click={nextStep}>
          {$currentStepIndex === totalSteps - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  {/if}
{/if}

<style>
  /* ===== DESKTOP: Spotlight ===== */
  .ob-spotlight {
    position: fixed;
    z-index: 10000;
    border-radius: 16px;
    box-shadow: 0 0 0 9999px rgba(18, 20, 22, 0.55);
    border: 2px solid var(--accent);
    pointer-events: none;
    transition: all 0.4s ease;
  }

  .ob-tooltip {
    position: fixed;
    z-index: 10001;
    width: 340px;
    padding: 20px;
    border-radius: 20px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.12),
      0 8px 22px rgba(18, 20, 22, 0.08);
    animation: ob-appear 0.35s ease;
  }

  @keyframes ob-appear {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ===== MOBILE: Card carousel ===== */
  .ob-backdrop {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(18, 20, 22, 0.55);
  }

  .ob-mobile {
    position: fixed;
    inset: 0;
    z-index: 10001;
    display: grid;
    place-items: center;
    padding: 24px;
  }

  .ob-mobile-card {
    width: 100%;
    max-width: 360px;
    padding: 24px;
    border-radius: 24px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.15),
      0 8px 22px rgba(18, 20, 22, 0.08);
    animation: ob-appear 0.35s ease;
    text-align: center;
  }

  .ob-mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .ob-mobile-icon {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    margin: 0 auto 16px;
    display: grid;
    place-items: center;
    background: rgba(176, 141, 87, 0.08);
    border: 1px solid rgba(176, 141, 87, 0.18);
    color: var(--accent);
    font-size: 22px;
  }

  /* ===== SHARED ===== */
  .ob-tooltip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .ob-step-badge {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--accent-dark);
    background: rgba(176, 141, 87, 0.1);
    padding: 5px 12px;
    border-radius: 999px;
  }

  .ob-skip {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 8px;
    transition: color 0.2s ease, background 0.2s ease;
  }

  .ob-skip:hover {
    color: var(--text-main);
    background: rgba(15, 23, 42, 0.04);
  }

  .ob-title {
    font-family: var(--font-heading);
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-main);
    margin: 0 0 8px;
    line-height: 1.2;
  }

  .ob-desc {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.6;
    color: var(--text-muted);
    margin: 0 0 18px;
  }

  .ob-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 18px;
  }

  .ob-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.1);
    transition: all 0.3s ease;
  }

  .ob-dot.active {
    width: 24px;
    background: var(--accent);
  }

  .ob-nav {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .ob-btn {
    height: 40px;
    padding: 0 20px;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.01em;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }

  .ob-btn--primary {
    background: rgba(176, 141, 87, 0.1);
    border-color: rgba(176, 141, 87, 0.25);
    color: var(--accent-dark);
  }

  .ob-btn--primary:hover {
    background: rgba(176, 141, 87, 0.16);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(176, 141, 87, 0.12);
  }

  .ob-btn--ghost {
    background: transparent;
    border-color: var(--border-soft);
    color: var(--text-muted);
  }

  .ob-btn--ghost:hover {
    background: rgba(15, 23, 42, 0.03);
    color: var(--text-main);
  }

  @media (max-width: 640px) {
    .ob-mobile-card {
      max-width: 100%;
    }

    .ob-title {
      font-size: 18px;
    }

    .ob-nav {
      justify-content: center;
    }
  }
</style>
