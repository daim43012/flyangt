<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";
  import { browser } from "$app/environment";
  import {
    pageTourActive,
    currentPageTourStep,
    pageTourIndex,
    totalPageTourSteps,
    nextPageTourStep,
    prevPageTourStep,
    skipPageTour,
  } from "$lib/stores/pageTour";

  let spotRect = { top: 0, left: 0, width: 0, height: 0 };
  let tooltipStyle = "";
  let isMobile = false;
  let currentEl: Element | null = null;
  let positioned = false;

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
    positioned = true;
  }

  function positionTooltip() {
    if (isMobile || !$currentPageTourStep) return;

    const pos = $currentPageTourStep.tooltipPosition;
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
    if (!$pageTourActive) return;
    if (e.key === "Escape") skipPageTour();
    if (e.key === "ArrowRight") nextPageTourStep();
    if (e.key === "ArrowLeft") prevPageTourStep();
  }

  function onScroll() {
    if ($pageTourActive && currentEl) updateSpotRect();
  }

  function onResize() {
    checkMobile();
    if ($currentPageTourStep) positionSpotlight($currentPageTourStep.selector);
  }

  $: if ($pageTourActive && $currentPageTourStep && browser) {
    checkMobile();
    positionSpotlight($currentPageTourStep.selector);
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

{#if $pageTourActive && $currentPageTourStep}
  {#if isMobile}
    <div class="pt-backdrop" aria-hidden="true"></div>
    <div class="pt-mobile" role="dialog" aria-label="Page tour">
      <div class="pt-mobile-card">
        <div class="pt-mobile-header">
          <span class="pt-step-badge">{$pageTourIndex + 1} / {$totalPageTourSteps}</span>
          <button class="pt-skip" type="button" on:click={skipPageTour}>Skip</button>
        </div>

        <div class="pt-mobile-icon">
          <i class={$currentPageTourStep.icon}></i>
        </div>

        <h4 class="pt-title">{$currentPageTourStep.title}</h4>
        <p class="pt-desc">{$currentPageTourStep.description}</p>

        <div class="pt-dots">
          {#each Array($totalPageTourSteps) as _, i}
            <span class="pt-dot" class:active={i === $pageTourIndex}></span>
          {/each}
        </div>

        <div class="pt-nav">
          {#if $pageTourIndex > 0}
            <button class="pt-btn pt-btn--ghost" type="button" on:click={prevPageTourStep}>Back</button>
          {/if}
          <button class="pt-btn pt-btn--primary" type="button" on:click={nextPageTourStep}>
            {$pageTourIndex === $totalPageTourSteps - 1 ? "Got it!" : "Next"}
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- Loading backdrop: visible until spotlight is positioned -->
    {#if !positioned}
      <div class="pt-backdrop-loading" aria-hidden="true"></div>
    {/if}

    <!-- Spotlight: creates the hole via box-shadow, transitions smoothly -->
    <div
      class="pt-spotlight"
      class:pt-spotlight--visible={positioned}
      style="top: {spotRect.top}px; left: {spotRect.left}px; width: {spotRect.width}px; height: {spotRect.height}px;"
      aria-hidden="true"
    ></div>

    <!-- Tooltip: transitions position smoothly -->
    {#if positioned}
      <div class="pt-tooltip" style={tooltipStyle} role="dialog" aria-label="Page tour">
        <div class="pt-tooltip-header">
          <span class="pt-step-badge">{$pageTourIndex + 1} / {$totalPageTourSteps}</span>
          <button class="pt-skip" type="button" on:click={skipPageTour}>Skip</button>
        </div>

        <h4 class="pt-title">{$currentPageTourStep.title}</h4>
        <p class="pt-desc">{$currentPageTourStep.description}</p>

        <div class="pt-nav">
          {#if $pageTourIndex > 0}
            <button class="pt-btn pt-btn--ghost" type="button" on:click={prevPageTourStep}>Back</button>
          {/if}
          <button class="pt-btn pt-btn--primary" type="button" on:click={nextPageTourStep}>
            {$pageTourIndex === $totalPageTourSteps - 1 ? "Got it!" : "Next"}
          </button>
        </div>
      </div>
    {/if}
  {/if}
{/if}

<style>
  /* Loading backdrop: only shown before first spotlight position */
  .pt-backdrop-loading {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(18, 20, 22, 0.55);
    pointer-events: none;
  }

  /* Spotlight: box-shadow creates the dimmed overlay with a clear hole */
  .pt-spotlight {
    position: fixed;
    z-index: 10000;
    border-radius: 16px;
    box-shadow: 0 0 0 9999px rgba(18, 20, 22, 0.55);
    border: 2px solid var(--accent);
    pointer-events: none;
    opacity: 0;
    transition:
      top 0.45s ease,
      left 0.45s ease,
      width 0.45s ease,
      height 0.45s ease;
  }

  .pt-spotlight--visible {
    opacity: 1;
  }

  .pt-tooltip {
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
    transition:
      top 0.45s ease,
      left 0.45s ease;
    animation: pt-appear 0.3s ease;
  }

  @keyframes pt-appear {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Mobile */
  .pt-backdrop {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(18, 20, 22, 0.55);
  }

  .pt-mobile {
    position: fixed;
    inset: 0;
    z-index: 10001;
    display: grid;
    place-items: center;
    padding: 24px;
  }

  .pt-mobile-card {
    width: 100%;
    max-width: 360px;
    padding: 24px;
    border-radius: 24px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.15),
      0 8px 22px rgba(18, 20, 22, 0.08);
    animation: pt-appear 0.35s ease;
    text-align: center;
  }

  .pt-mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .pt-mobile-icon {
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

  /* Shared */
  .pt-tooltip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .pt-step-badge {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--accent-dark);
    background: rgba(176, 141, 87, 0.1);
    padding: 5px 12px;
    border-radius: 999px;
  }

  .pt-skip {
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

  .pt-skip:hover {
    color: var(--text-main);
    background: rgba(15, 23, 42, 0.04);
  }

  .pt-title {
    font-family: var(--font-heading);
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-main);
    margin: 0 0 8px;
    line-height: 1.2;
  }

  .pt-desc {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.6;
    color: var(--text-muted);
    margin: 0 0 18px;
  }

  .pt-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 18px;
  }

  .pt-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.1);
    transition: all 0.3s ease;
  }

  .pt-dot.active {
    width: 24px;
    background: var(--accent);
  }

  .pt-nav {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .pt-btn {
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

  .pt-btn--primary {
    background: rgba(176, 141, 87, 0.1);
    border-color: rgba(176, 141, 87, 0.25);
    color: var(--accent-dark);
  }

  .pt-btn--primary:hover {
    background: rgba(176, 141, 87, 0.16);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(176, 141, 87, 0.12);
  }

  .pt-btn--ghost {
    background: transparent;
    border-color: var(--border-soft);
    color: var(--text-muted);
  }

  .pt-btn--ghost:hover {
    background: rgba(15, 23, 42, 0.03);
    color: var(--text-main);
  }

  @media (max-width: 640px) {
    .pt-mobile-card {
      max-width: 100%;
    }

    .pt-title {
      font-size: 18px;
    }

    .pt-nav {
      justify-content: center;
    }
  }
</style>
