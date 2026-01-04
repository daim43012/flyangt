<script>
  import Hero from "./dashboard/Hero.svelte";
  import TokenPerformanceCard from "./dashboard/TokenPerformanceCard.svelte";
  import InvestmentPoolCard from "./dashboard/InvestmentPoolCard.svelte";
  import CommunityActivityCard from "./dashboard/CommunityActivityCard.svelte";
  import BalancesCard from "./dashboard/BalancesCard.svelte";
</script>

<section class="dashboard">
  <div class="main-col">
    <Hero />
    <TokenPerformanceCard />
    <InvestmentPoolCard />
    <CommunityActivityCard />
  </div>

  <aside class="side-col">
    <BalancesCard />
  </aside>
</section>

<style>
  .dashboard {
    display: grid;
    grid-template-columns: 1fr 460px;
    gap: 24px;
    align-items: start;
  }

  .main-col {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
  }

  .side-col {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  @media (max-width: 1100px) {
    .dashboard {
      grid-template-columns: 1fr;
    }

    .side-col {
      order: -1;
    }
  }
</style>
