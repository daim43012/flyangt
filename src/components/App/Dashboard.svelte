<script>
  import Hero from "./dashboard/Hero.svelte";
  // import TokenPerformanceCard from "./dashboard/TokenPerformanceCard.svelte";
  import InvestmentPoolCard from "./dashboard/InvestmentPoolCard.svelte";
  import RoadmapCard from "./dashboard/RoadmapCard.svelte";
  import CommunityActivityCard from "./dashboard/CommunityActivityCard.svelte";
  import BalancesCard from "./dashboard/BalancesCard.svelte";
  import Weather from "./dashboard/Weather.svelte";
</script>

<section class="dashboard">
  <div class="area-hero" data-tour-page="hero"><Hero /></div>
  <div class="area-bal" data-tour-page="balances"><BalancesCard /></div>
  <div class="area-invest" data-tour-page="investment"><InvestmentPoolCard /></div>
  <div class="area-roadmap" data-tour-page="roadmap"><RoadmapCard /></div>
  <!-- <div class="area-token"><TokenPerformanceCard /></div> -->
  <div class="area-comm" data-tour-page="community"><CommunityActivityCard /></div>
  <!-- <div class="area-weather"><Weather /></div> -->
</section>

<style>
  .dashboard {
    display: grid;
    grid-template-columns: 1fr 380px;
    grid-template-areas:
      "hero    bal"
      "invest  bal"
      "roadmap bal"
      "comm    bal"
      "weather bal";
    gap: 20px;
    align-items: start;
  }

  .area-hero    { grid-area: hero; }
  .area-bal     { grid-area: bal; }
  .area-invest  { grid-area: invest; }
  .area-roadmap { grid-area: roadmap; }
  .area-comm    { grid-area: comm; }
  .area-weather { grid-area: weather; }

  @media (max-width: 1100px) {
    .dashboard {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        "hero    hero"
        "bal     bal"
        "invest  roadmap"
        "comm    comm"
        "weather weather";
      gap: 16px;
    }
  }

  @media (max-width: 640px) {
    .dashboard {
      grid-template-columns: 1fr;
      grid-template-areas:
        "hero"
        "bal"
        "invest"
        "roadmap"
        "comm"
        "weather";
      gap: 12px;
    }
  }
</style>
