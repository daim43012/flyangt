<script lang="ts">
  import { page } from "$app/stores";
  import { findTourForRoute, startPageTour, pageTourActive } from "$lib/stores/pageTour";
  import { onboardingActive } from "$lib/stores/onboarding";

  $: tour = findTourForRoute($page.url.pathname);
  $: visible = !!tour && !$pageTourActive && !$onboardingActive;

  function handleClick() {
    if (tour) startPageTour(tour.pageId);
  }
</script>

{#if visible}
  <button
    class="tour-help"
    type="button"
    on:click={handleClick}
    aria-label="Page guide"
    title="Page guide"
  >
    ?
  </button>
{/if}

<style>
  .tour-help {
    position: fixed;
    bottom: 24px;
    left: 24px;
    width: 40px;
    height: 40px;
    border-radius: 14px;
    z-index: 90;

    display: grid;
    place-items: center;
    cursor: pointer;

    font-family: var(--font-heading);
    font-size: 18px;
    font-weight: 700;
    color: var(--accent-dark);

    background: var(--bg-white);
    border: 1px solid rgba(176, 141, 87, 0.22);
    box-shadow:
      0 12px 40px rgba(18, 20, 22, 0.06),
      0 4px 12px rgba(18, 20, 22, 0.04);
    transition: all 0.25s ease;
  }

  .tour-help:hover {
    transform: translateY(-2px);
    border-color: var(--accent);
    box-shadow:
      0 18px 50px rgba(176, 141, 87, 0.14),
      0 6px 18px rgba(18, 20, 22, 0.06);
  }

  @media (max-width: 980px) {
    .tour-help {
      left: 14px;
      bottom: 14px;
    }
  }
</style>
