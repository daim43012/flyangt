<script lang="ts">
  import { wallet } from "$lib/wallet/wallet.store";
  import { balancesStore } from "$lib/wallet/store/balances";
  import type { BalanceItem } from "$lib/wallet/store/balances";

  $: w = $wallet;
  $: state = $balancesStore;

  $: address = w?.address ?? "";
  $: status = w?.status ?? "idle";

  let lastLoadedAddress = "";

  const rows = [
    { key: "ANGT", label: "ANGT", sub: "Project token" },
    { key: "POL", label: "POL", sub: "Network gas" },
    { key: "USDT", label: "USDT", sub: "Stable balance" }
  ] as const;

  function hasItem(item: BalanceItem | undefined): item is BalanceItem {
    return !!item;
  }

  function shortAddr(a: string) {
    if (!a || a.length < 10) return a;
    return `${a.slice(0, 6)}…${a.slice(-4)}`;
  }

  function prettyAmount(v: string, maxFrac = 6) {
    const n = Number(v);
    if (!Number.isFinite(n)) return v;
    const abs = Math.abs(n);
    const frac = abs >= 1000 ? 2 : abs >= 1 ? 4 : maxFrac;
    return n.toLocaleString(undefined, { maximumFractionDigits: frac });
  }

  function canLoad() {
    return status === "connected" && !!address;
  }

  $: totalUsd = (() => {
    if (!state?.data?.balances) return 0;
    const usdt = Number(state.data.balances.USDT?.amount ?? 0);
    return Number.isFinite(usdt) ? usdt : 0;
  })();

  $: if (canLoad() && address !== lastLoadedAddress) {
    lastLoadedAddress = address;
    balancesStore.load(address);
  }
  $: if (!address || status !== "connected") {
    lastLoadedAddress = "";
  }

  function isAvailable(item: any) {
    return item?.available !== false && item != null;
  }

  async function connectWallet() {
    await wallet.connect();
  }
</script>

<section class="asset-card">
  <header class="asset-top">
    <div class="asset-icon" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="6"
          width="18"
          height="12"
          rx="3"
          stroke="currentColor"
          stroke-width="1.6"
        />
        <path
          d="M7 10h6M7 14h10"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        />
      </svg>
    </div>

    <div class="asset-meta">
      <div class="asset-kicker">TOTAL ASSET VALUE</div>
      <div class="asset-value">
        ${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </div>

      <div class="asset-hint">
        {#if status === "connected" && address}
          Wallet: {shortAddr(address)}
        {:else if status === "wrong_network"}
          <span class="hint-warn">Wrong network (Polygon required)</span>
        {:else if status === "no_provider"}
          <span class="hint-warn">No wallet provider</span>
        {:else}
          <span>Connect wallet to view balances</span>
        {/if}
      </div>
    </div>

    {#if status !== "connected"}
      <button class="connect" type="button" on:click={connectWallet}>
        Connect
      </button>
    {/if}
  </header>

  <div class="asset-body">
    {#if status === "connected" && state.error}
      <div class="notice notice-error">
        <div class="notice-title">Failed to load balances</div>
        <div class="notice-text">{state.error}</div>
      </div>
    {:else if status === "connected" && state.loading && !state.data}
      <div class="list">
        {#each rows as r}
          <div class="row skel">
            <div class="token">
              <div class="token-badge sk"></div>
            </div>
            <div class="txt">
              <div class="sk sk1"></div>
              <div class="sk sk2"></div>
            </div>
            <div class="right">
              <div class="sk sk3"></div>
              <div class="sk sk4"></div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="list">
        {#each rows as r}
          {@const item = state.data?.balances?.[r.key]}
          {@const amt = hasItem(item) && isAvailable(item) ? Number(item.amount) : 0}
          {@const isZero = !Number.isFinite(amt) || amt === 0}

          <div class="row">
            <div class="token">
              <div class="token-badge" aria-hidden="true">
                {r.label.slice(0, 2)}
              </div>
            </div>

            <div class="txt">
              <div class="name">{r.label}</div>
              <div class="sub">{r.sub}</div>
            </div>

            <div class="right">
              <div class={"amount " + (isZero ? "muted" : "")}>
                {prettyAmount(String(amt), 6)}
              </div>
              <div class={"units " + (isZero ? "muted" : "")}>
                {prettyAmount(String(amt), 6)} units
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .asset-card {
    width: 100%;
    border-radius: 20px;
    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    overflow: hidden;
  }

  .asset-card::before {
    content: none;
  }

  .asset-top,
  .asset-body {
    position: relative;
    z-index: 1;
  }

  /* ===== Header ===== */
  .asset-top {
    padding: 18px 18px 12px 18px;
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }

  .asset-icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: rgba(176, 141, 87, 0.06);
    border: 1px solid var(--border-soft);
    color: var(--accent);
    display: grid;
    place-items: center;
    flex: 0 0 auto;
  }

  .asset-meta {
    flex: 1 1 auto;
    min-width: 0;
  }

  .asset-kicker {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .asset-value {
    margin-top: 6px;
    font-size: 30px;
    line-height: 1.05;
    font-weight: 600;
    font-family: var(--font-heading);
    letter-spacing: -0.03em;
    color: var(--text-main);
    font-variant-numeric: tabular-nums;
  }

  .asset-hint {
    margin-top: 8px;
    font-size: 12px;
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hint-warn {
    color: #9a3412;
    font-weight: 600;
  }

  .connect {
    flex: 0 0 auto;
    border: 1px solid var(--border-soft);
    background: rgba(176, 141, 87, 0.06);
    color: var(--text-main);
    font-weight: 600;
    font-size: 12px;
    padding: 9px 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.12s ease, background 0.12s ease;
    user-select: none;
  }
  .connect:hover {
    background: rgba(176, 141, 87, 0.1);
  }
  .connect:active {
    transform: scale(0.98);
  }

  /* ===== Body ===== */
  .asset-body {
    padding: 10px 18px 18px 18px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 12px;
    border-radius: 16px;
    background: rgba(176, 141, 87, 0.03);
    border: 1px solid var(--border-soft);
    transition: background 0.12s ease, border-color 0.12s ease,
      transform 0.12s ease;
  }

  .row:hover {
    background: rgba(176, 141, 87, 0.06);
    border-color: rgba(176, 141, 87, 0.22);
    transform: translateY(-1px);
  }

  /* ===== Token badge (neutral) ===== */
  .token {
    flex: 0 0 auto;
  }

  .token-badge {
    width: 38px;
    height: 38px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--accent-dark);
    background: rgba(176, 141, 87, 0.08);
    border: 1px solid rgba(176, 141, 87, 0.22);
    box-shadow: 0 8px 18px rgba(18, 20, 22, 0.06);
  }

  /* ===== Text ===== */
  .txt {
    flex: 1 1 auto;
    min-width: 0;
  }

  .name {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text-main);
  }

  .sub {
    margin-top: 3px;
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .right {
    flex: 0 0 auto;
    text-align: right;
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: flex-end;
  }

  .amount {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-main);
    font-variant-numeric: tabular-nums;
  }

  .units {
    font-size: 12px;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }

  .muted {
    color: rgba(18, 20, 22, 0.35) !important;
  }

  /* ===== Notice ===== */
  .notice {
    border-radius: 16px;
    padding: 12px 12px;
    border: 1px solid var(--border-soft);
    background: rgba(176, 141, 87, 0.03);
  }

  .notice-error {
    background: rgba(254, 226, 226, 0.9);
    border-color: rgba(254, 202, 202, 0.9);
  }

  .notice-title {
    font-weight: 600;
    color: #7f1d1d;
    font-size: 13px;
  }

  .notice-text {
    margin-top: 4px;
    color: #991b1b;
    font-size: 12px;
  }

  /* ===== Skeleton ===== */
  .skel {
    pointer-events: none;
  }

  .sk {
    background: rgba(18, 20, 22, 0.08);
    border-radius: 10px;
    animation: pulse 1.1s ease-in-out infinite;
  }

  .sk1 {
    height: 12px;
    width: 70px;
  }
  .sk2 {
    height: 10px;
    width: 120px;
    margin-top: 6px;
  }
  .sk3 {
    height: 12px;
    width: 72px;
  }
  .sk4 {
    height: 10px;
    width: 88px;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.45;
    }
    50% {
      opacity: 0.9;
    }
  }

  /* На планшете: горизонтальный layout header */
  @media (max-width: 1100px) {
    .asset-top {
      padding: 16px 16px 10px;
      align-items: center;
    }

    .asset-body {
      padding: 8px 16px 16px;
    }

    /* Balances в 2 колонки на планшете */
    .list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .row {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      padding: 12px;
    }

    .right {
      align-items: flex-start;
      text-align: left;
    }
  }

  /* Мобайл: compact, вертикальный список */
  @media (max-width: 640px) {
    .asset-top {
      padding: 14px 14px 10px;
      gap: 10px;
    }

    .asset-icon {
      width: 36px;
      height: 36px;
      border-radius: 12px;
    }

    .asset-value {
      font-size: 24px;
    }

    .asset-hint {
      white-space: normal;
    }

    .asset-body {
      padding: 8px 14px 14px;
    }

    .list {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .row {
      flex-direction: row;
      align-items: center;
      padding: 10px 12px;
    }

    .right {
      align-items: flex-end;
      text-align: right;
    }
  }
</style>
