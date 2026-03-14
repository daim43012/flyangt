<script lang="ts">
  import { onMount } from "svelte";
  import { BrowserProvider, JsonRpcProvider } from "ethers";

  import { wallet } from "$lib/wallet/wallet.store";
  import { chainKey } from "$lib/wallet/chains";
  import { ADDRESSES } from "$lib/web3/addresses";
  import { PRESALE_ABI } from "$lib/web3/abi/presale.abi";

  type WeekItem = { week: number; price: number; desc: string };

  let loading = false;
  let errorText: string | null = null;

  let onchainCurrentWeek = 0;
  let onchainWeeks: WeekItem[] = [];

  const money = (v: any) => `$${Number(v).toFixed(4)}`;

  // Always show polygon roadmap by default, regardless of wallet
  // If wallet is connected to localhost, you can still show localhost by chainKey.
  $: net = chainKey($wallet.chainId) ?? "polygon";
  $: C = (ADDRESSES as any)[net] ?? ADDRESSES.polygon;

  $: currentWeek = Math.max(
    1,
    Math.min(onchainWeeks.length || 1, Number(onchainCurrentWeek || 1)),
  );

  function statusOf(w: number) {
    if (w < currentWeek) return "past";
    if (w === currentWeek) return "current";
    return "future";
  }

  function getReadProvider() {
    if ($wallet.provider) return new BrowserProvider($wallet.provider as any);
    const url = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com/';
    return new JsonRpcProvider(url, { chainId: 137, name: 'matic' });
  }

  async function loadRoadmap() {
    loading = true;
    errorText = null;

    try {
      const rp = getReadProvider();
      const c: any = new (await import("ethers")).Contract(C.presale, PRESALE_ABI, rp);

      const [lenBn, cwBn] = await Promise.all([c.pricesLength(), c.currentWeek()]);
      const len = Number(lenBn);
      const cw = Number(cwBn);

      const pricesMicro: bigint[] = await Promise.all(
        Array.from({ length: len }, (_, i) => c.priceForWeek(i + 1)),
      );

      onchainWeeks = pricesMicro.map((p, i) => ({
        week: i + 1,
        price: Number(p) / 1e6,
        desc: i === 0 ? "Launch price" : "+10% from start",
      }));

      onchainCurrentWeek = cw;
    } catch (e: any) {
      errorText = e?.shortMessage ?? e?.message ?? "Failed to load presale roadmap";
      onchainWeeks = [];
      onchainCurrentWeek = 0;
    } finally {
      loading = false;
    }
  }

  // Load once, and refresh when contract address changes (network switch)
  onMount(loadRoadmap);

  $: if (C?.presale) {
    C.presale;
    loadRoadmap();
  }
</script>

<div class="wrap">
  <div class="head">
    <div class="left">
      <span class="icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M6 19V5a2 2 0 0 1 2-2h8"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M18 5v14a2 2 0 0 1-2 2H8"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M9 8h6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M9 12h6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M9 16h6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </span>
      <div class="title">PRESALE PRICE ROADMAP</div>
    </div>

    <div class="meta">
      <div class="pill">{onchainWeeks.length || 0} weeks</div>
      <div class="pill blue">On chain</div>
    </div>
  </div>

  <div class="divider"></div>
<!-- 
  {#if loading}
    <div style="padding: 12px; font-size: 13px; opacity: 0.85;">
      Loading on chain data…
    </div>
  {/if}

  {#if errorText}
    <div style="padding: 12px; font-size: 13px; color: #ff7a7a;">
      {errorText}
    </div>
  {/if} -->

  <div class="list">
    {#each onchainWeeks as w}
      {@const st = statusOf(w.week)}
      <div class="item {st} {st === 'current' ? 'full' : 'compact'}">
        <div class="dot" aria-hidden="true"></div>

        <div class="card">
          <div class="top">
            <div class="wkline">
              <div class="wk">Week {w.week}</div>

              {#if st !== "current"}
                <span class="mini">{w.desc}</span>
              {/if}

              {#if st === "current"}
                <span class="badge">Current week</span>
              {/if}
            </div>

            <div class="price">{money(w.price)}</div>
          </div>

          {#if st === "current"}
            <div class="desc">{w.desc}</div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="footer">
    <div class="goal">
      Target listing price:
      <b>{onchainWeeks.length ? money(onchainWeeks[onchainWeeks.length - 1].price) : "—"}</b>
    </div>
  </div>
</div>

<style>
.wrap {
  position: relative;
  background: var(--bg-white);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid var(--border-soft);
  box-shadow:
    0 30px 90px rgba(18, 20, 22, 0.08),
    0 8px 22px rgba(18, 20, 22, 0.06);
  align-items: start;
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  width: 26px;
  height: 26px;
  color: var(--accent);
  display: inline-grid;
  place-items: center;
}
.icon svg {
  width: 26px;
  height: 26px;
}

.title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text-main);
}

.meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pill {
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid var(--border-soft);
  color: var(--text-muted);
}

.pill.blue {
  background: rgba(176, 141, 87, 0.08);
  border-color: rgba(176, 141, 87, 0.22);
  color: var(--accent-dark);
}

.divider {
  height: 1px;
  background: var(--border-soft);
  margin: 14px 0 16px;
}

.list {
  display: grid;
  gap: 10px;
  position: relative;
}

.item {
  display: grid;
  grid-template-columns: 16px 1fr;
  gap: 12px;
  align-items: start;
  position: relative;
}

/* vertical line */
.item::before {
  content: "";
  position: absolute;
  left: 7px;
  top: 18px;
  bottom: -10px;
  width: 2px;
  background: var(--border-soft);
}
.item:last-child::before {
  display: none;
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.12);
  border: 2px solid var(--bg-white);
  box-shadow: 0 10px 18px rgba(18, 20, 22, 0.12);
  margin-top: 6px;
}

/* === CARD BASE === */
.card {
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid var(--border-soft);
  box-shadow: 0 12px 26px rgba(18, 20, 22, 0.05);
  transition: transform 0.12s ease;
}

.card:hover {
  transform: translateY(-1px);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.wkline {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.wk {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text-main);
  white-space: nowrap;
}

.mini {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  color: var(--accent-dark);
}

.desc {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

/* === COMPACT (past/future) === */
.item.compact .card {
  padding: 10px 12px;
  border-radius: 14px;
}

/* === FULL (current) === */
.item.full .card {
  padding: 14px;
  border-radius: 16px;
}

.badge {
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(176, 141, 87, 0.10);
  border: 1px solid rgba(176, 141, 87, 0.25);
  color: var(--accent-dark);
  white-space: nowrap;
}

/* === STATES === */

/* Past = зелёный */
.item.past .dot { background: #22c55e; }
.item.past .price { color: #22c55e; }
.item.past .card {
  background: rgba(34, 197, 94, 0.06);
  border-color: rgba(34, 197, 94, 0.16);
}

/* Current = выделение */
.item.current .dot { background: var(--accent); }
.item.current .card {
  background: rgba(176, 141, 87, 0.06);
  border-color: rgba(176, 141, 87, 0.22);
  box-shadow:
    0 18px 36px rgba(176, 141, 87, 0.12),
    0 12px 26px rgba(18, 20, 22, 0.05);
}

/* Future = нейтрально */
.item.future .dot { background: rgba(15, 23, 42, 0.12); }
.item.future .price { color: var(--accent); opacity: 0.75; }

.footer {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border-soft);
}

.goal {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text-muted);
  text-align: center;
}

.goal b {
  color: var(--text-main);
  font-weight: 600;
}

@media (max-width: 980px) {
  .wrap {
    padding: 16px;
    border-radius: 18px;
  }
  .title {
    font-size: 16px;
  }
}
</style>
