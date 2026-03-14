<script>
  import PresaleHero from "./presale/PresaleHero.svelte";
  import PresaleRoadmap from "./presale/PresaleRoadmap.svelte";

  import PresaleTimer from "./presale/PresaleTimer.svelte";
  import RecentActivity from "./presale/RecentActivity.svelte";
  import TokenTerminal from "./presale/TokenTerminal.svelte";
  export let data; 
</script>

<section class="airdrop">
  <div class="main-col">
    <div class="top">
      <div data-tour-page="presale-timer"><PresaleTimer /></div>
      <div data-tour-page="presale-progress"><PresaleHero {data} /></div>
    </div>

    <div class="bottom">
      <div class="left-col">
        <div data-tour-page="terminal"><TokenTerminal {data}/></div>
        <div data-tour-page="recent-activity"><RecentActivity {data}/></div>
      </div>

      <div class="right-col" data-tour-page="price-roadmap">
        <PresaleRoadmap/>
      </div>
    </div>
  </div>
</section>

<style>
  .airdrop {
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

.bottom {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 18px;
  align-items: stretch; /* важно */
}

.left-col {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
  height: 100%; /* важно */
}


  .right-col {
    min-width: 0;
  }

  @media (max-width: 980px) {
    .top {
      grid-template-columns: 1fr;
    }

    .bottom {
      grid-template-columns: 1fr;
    }
  }
</style>
