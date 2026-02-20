<script>
  import Benefits from "./rewards/Benefits.svelte";
  import Hero from "./rewards/Hero.svelte";
  import RewardsStation from "./rewards/RewardsStation.svelte";
</script>

<section class="rewards">
  <div class="main-col">
    <Hero />
    <Benefits />
    <RewardsStation />
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

  @media (max-width: 1100px) {
    .rewards {
      grid-template-columns: 1fr;
    }
  }
</style>
