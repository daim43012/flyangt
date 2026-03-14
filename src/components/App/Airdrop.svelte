<script>
  import AirdropTimer from "./airdrop/AirdropTimer.svelte";
  import AirdropEarned from "./airdrop/AirdropEarned.svelte";
  import AirdropTasks from "./airdrop/AirdropTasks.svelte";
  export let data;  
</script>

<section class="airdrop">
  <div class="main-col">
    <div class="top">
      <div data-tour-page="airdrop-timer"><AirdropTimer /></div>
      <div data-tour-page="airdrop-earned"><AirdropEarned {data} /></div>
    </div>

    <div data-tour-page="airdrop-tasks"><AirdropTasks {data}/></div>
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

  @media (max-width: 980px) {
    .top {
      grid-template-columns: 1fr;
    }
  }
</style>
