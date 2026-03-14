<script>
  import Benefits from "./rewards/Benefits.svelte";
  import Hero from "./rewards/Hero.svelte";
  import RewardsStation from "./rewards/RewardsStation.svelte";
  import RewardsTimer from "./rewards/RewardsTimer.svelte";
</script>

<section class="rewards">
  <div class="main-col">
    <div class="top">
      <div data-tour-page="rewards-timer"><RewardsTimer /></div>
      <div data-tour-page="rewards-yield"><Hero /></div>
    </div>
    <div data-tour-page="rewards-terms"><Benefits /></div>
    <div data-tour-page="rewards-station"><RewardsStation /></div>
  </div>
</section>

<style>
  .rewards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    align-items: start;
  }

  .main-col {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
  }

  .top {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 18px;
    align-items: stretch;
  }

  @media (max-width: 980px) {
    .top {
      grid-template-columns: 1fr;
    }
  }
</style>
