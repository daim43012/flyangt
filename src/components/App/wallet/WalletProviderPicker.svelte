<script lang="ts">
  import { onMount } from "svelte";
  import { wallet } from "$lib/wallet/wallet.store";

  // локальный список, чтобы EIP-6963 реально обновлял UI
  let providers: { id: string; name: string; icon?: string }[] = [];

  $: selected = $wallet.providerId;
  $: status = $wallet.status;

  function refreshProviders() {
    providers = wallet.listProviders();
  }

  onMount(() => {
    refreshProviders();

    // EIP-6963 может "доанонсить" провайдеры чуть позже
    const t = setInterval(refreshProviders, 250);
    const stop = setTimeout(() => clearInterval(t), 2500);

    return () => {
      clearInterval(t);
      clearTimeout(stop);
    };
  });
</script>

{#if status === "connected"}
  <!-- ✅ когда подключено — выбор провайдера не показываем вообще -->
{:else if providers.length > 1}
  <div class="pp">
    <div class="pp-title">Choose wallet</div>

    <div class="pp-grid">
      {#each providers as p (p.id)}
        <button
          class="pp-btn"
          class:active={p.id === selected}
          type="button"
          on:click={() => wallet.setProvider(p.id)}
        >
          {#if p.icon}
            <img class="pp-ico" src={p.icon} alt="" />
          {:else}
            <span class="pp-ico-fallback">◈</span>
          {/if}
          <span class="pp-name">{p.name}</span>
          {#if p.id === selected}
            <span class="pp-check">✓</span>
          {/if}
        </button>
      {/each}
    </div>

    <div class="pp-hint">
      Select a wallet first, then press Connect.
    </div>
  </div>
{:else if providers.length === 1}
  <div class="pp">
    <div class="pp-title">Wallet</div>
    <div class="pp-hint">Only one provider detected</div>
  </div>
{:else}
  <div class="pp">
    <div class="pp-title">Wallet</div>
    <div class="pp-hint">No provider detected</div>
  </div>
{/if}

<style>
  .pp{
    margin: 6px 6px 2px;
    padding: 10px;
    border-radius: 12px;
    border: 1px solid rgba(15,23,42,.08);
    background: rgba(15,23,42,.03);
  }

  .pp-title{
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .12em;
    text-transform: uppercase;
    opacity: .75;
    margin-bottom: 8px;
  }

  .pp-grid{
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .pp-btn{
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 10px;
    border-radius: 12px;
    border: 1px solid rgba(15,23,42,.08);
    background: rgba(255,255,255,.88);
    cursor: pointer;
    transition: transform .12s ease, background .12s ease, border-color .12s ease;
  }

  .pp-btn:hover{
    transform: translateY(-1px);
    background: rgba(255,255,255,.98);
    border-color: rgba(15,23,42,.12);
  }

  .pp-btn.active{
    border-color: rgba(34,197,94,.35);
    box-shadow: 0 0 0 3px rgba(34,197,94,.10);
  }

  .pp-ico{
    width: 18px;
    height: 18px;
    border-radius: 6px;
  }

  .pp-ico-fallback{
    width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: rgba(15,23,42,.08);
    font-size: 12px;
    opacity: .7;
  }

  .pp-name{
    font-size: 13px;
    font-weight: 750;
    opacity: .95;
  }

  .pp-check{
    margin-left: auto;
    font-weight: 900;
    color: #16a34a;
  }

  .pp-hint{
    margin-top: 8px;
    font-size: 12px;
    opacity: .65;
  }
</style>
