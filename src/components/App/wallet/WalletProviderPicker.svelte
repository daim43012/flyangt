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
  .pp {
    margin: 6px 6px 2px;
    padding: 12px;
    border-radius: 16px;
    border: 1px solid var(--border-soft);
    background: rgba(176, 141, 87, 0.02);
  }

  .pp-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 10px;
  }

  .pp-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .pp-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    cursor: pointer;
    transition:
      transform 0.3s ease,
      background 0.3s ease,
      border-color 0.3s ease,
      box-shadow 0.3s ease;
  }

  .pp-btn:hover {
    transform: translateY(-2px);
    border-color: rgba(176, 141, 87, 0.25);
    box-shadow:
      0 8px 22px rgba(18, 20, 22, 0.06),
      0 2px 6px rgba(18, 20, 22, 0.04);
  }

  .pp-btn.active {
    border-color: rgba(176, 141, 87, 0.4);
    background: linear-gradient(
      135deg,
      rgba(176, 141, 87, 0.04),
      rgba(176, 141, 87, 0.08)
    );
    box-shadow:
      0 0 0 3px rgba(176, 141, 87, 0.08),
      0 4px 12px rgba(176, 141, 87, 0.1);
  }

  .pp-ico {
    width: 22px;
    height: 22px;
    border-radius: 8px;
  }

  .pp-ico-fallback {
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: rgba(176, 141, 87, 0.08);
    border: 1px solid rgba(176, 141, 87, 0.12);
    font-size: 12px;
    color: var(--accent);
  }

  .pp-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-main);
  }

  .pp-check {
    margin-left: auto;
    font-weight: 700;
    font-size: 14px;
    color: var(--accent);
  }

  .pp-hint {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    opacity: 0.75;
  }
</style>
