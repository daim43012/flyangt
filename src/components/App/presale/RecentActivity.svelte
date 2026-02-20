<script lang="ts">
  import { wallet } from "$lib/wallet/wallet.store";
  import { chainKey } from "$lib/wallet/chains";
  import { ADDRESSES } from "$lib/web3/addresses";
  import {
    presaleUserPurchases,
    type PresalePurchaseEvent,
  } from "$lib/web3/presale";
  import { BrowserProvider } from "ethers";

  export let data: {
    presaleTotal?: { totalTokenAmount: number; updatedAt: string | null };
    offchainPurchases?: Array<{
      sessionId: string | null;
      status: string;
      week: number | null;
      price: number;
      payAmount: number;
      amount: number;
      createdAt: string;
    }>;
    user?: { walletAddress: string | null };
  };

  let loading = false;
  let errorText: string | null = null;

  let onchain: PresalePurchaseEvent[] = [];
  let onchainLoaded = false;

  let activeKey = "";

  $: net = chainKey($wallet.chainId) ?? "polygon";
  $: C = (ADDRESSES as any)[net] ?? ADDRESSES.polygon;

  const fmt6 = (x: bigint) => {
    const whole = x / 1_000_000n;
    const frac = (x % 1_000_000n)
      .toString()
      .padStart(6, "0")
      .replace(/0+$/, "");
    return whole.toString() + (frac ? "." + frac : "");
  };

  const fmtUsd = (n: number, d = 2) =>
    Number.isFinite(n)
      ? n.toLocaleString("en-US", {
          minimumFractionDigits: d,
          maximumFractionDigits: d,
        })
      : "0.00";

  const fmtAngt = (n: number) =>
    Number.isFinite(n)
      ? n.toLocaleString("en-US", { maximumFractionDigits: 4 })
      : "0";

  const fmtAngtWei = (wei: bigint) => {
    const n = Number(wei) / 1e18;
    return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
  };

  const tokenSymbol = (addr: string) => {
    const a = addr.toLowerCase();
    if (a === C.usdt.toLowerCase()) return "USDT";
    if (a === C.usdc.toLowerCase()) return "USDC";
    return "TOKEN";
  };

  const shortHash = (h: string) => `${h.slice(0, 6)}…${h.slice(-4)}`;
  const shortId = (h: string) => (h ? `${h.slice(0, 8)}…${h.slice(-4)}` : "");

  const statusLabel = (s: string) => {
    const v = (s || "").toLowerCase();
    if (v === "paid") return "PAID";
    if (v === "pending") return "PENDING";
    if (v === "expired") return "EXPIRED";
    if (v === "failed") return "FAILED";
    return (s || "UNKNOWN").toUpperCase();
  };

  async function loadOnchainInner() {
    if (
      $wallet.status !== "connected" ||
      !$wallet.provider ||
      !$wallet.address
    ) {
      onchain = [];
      onchainLoaded = true;
      loading = false;
      return;
    }

    const eip1193 = $wallet.provider; // ✅ то, что ждёт presaleUserPurchases
    const address = $wallet.address;

    const ethersProvider = new BrowserProvider(eip1193); // ✅ для getBlock()

    try {
      const fromBlock = Number((C as any).presaleFromBlock ?? 0);

      // ✅ как было: передаём EIP-1193
      const raw = await presaleUserPurchases(
        eip1193,
        C.presale,
        address,
        fromBlock,
        50,
      );

      // ✅ получаем ts блоков через ethers provider
      const enriched = await Promise.all(
        raw.map(async (item) => {
          const block = await ethersProvider.getBlock(item.blockNumber);
          return {
            ...item,
            blockTimestamp: Number(block?.timestamp ?? 0),
          };
        }),
      );

      onchain = enriched as any;
    } catch (e: any) {
      errorText = e?.shortMessage ?? e?.message ?? "Failed to load activity";
      onchain = [];
    } finally {
      loading = false;
      onchainLoaded = true;
    }
  }

  $: if ($wallet.status === "connected") {
    C?.presale;

    const key = `${net}:${$wallet.address ?? ""}`;
    if (key && key !== activeKey) {
      activeKey = key;

      loading = true;
      onchainLoaded = false;
      errorText = null;
      onchain = [];

      loadOnchainInner();
    }
  }

  $: if ($wallet.status !== "connected") {
    activeKey = "";
    onchainLoaded = true;
    loading = false;
  }

  type UnifiedItem =
    | {
        kind: "onchain";
        ts: number;
        txHash: string;
        week: number;
        priceUsd: number;
        payTokenLabel: string;
        payAmountLabel: string;
        receiveLabel: string;
        href: string;
      }
    | {
        kind: "offchain";
        ts: number;
        status: string;
        week: number | null;
        priceUsd: number;
        receive: number;
        payAmount: number;
        sessionId: string | null;
      };

  $: offchain = (data?.offchainPurchases ?? []).map((p) => ({
    kind: "offchain" as const,
    ts: Date.parse(p.createdAt) || 0,
    status: p.status,
    week: p.week,
    priceUsd: p.price,
    receive: p.amount,
    payAmount: p.payAmount,
    sessionId: p.sessionId ?? null,
  }));

  $: onchainUnified = onchain.map((it) => ({
    kind: "onchain" as const,
    ts: (it as any).blockTimestamp ?? 0,
    txHash: it.txHash,
    week: it.week,
    priceUsd: Number(it.priceMicro) / 1e6,
    payTokenLabel: tokenSymbol(it.payToken),
    payAmountLabel: `${fmt6(it.payAmount6)} ${tokenSymbol(it.payToken)}`,
    receiveLabel: `+ ${fmtAngtWei(it.tokenAmountWei)} ANGT`,
    href: `https://polygonscan.com/tx/${it.txHash}`,
  }));

  $: merged = [...offchain, ...onchainUnified].sort(
    (a, b) => (b.ts ?? 0) - (a.ts ?? 0),
  );

  $: totalOffchain = data?.presaleTotal?.totalTokenAmount ?? 0;

  $: onchainWeiSum = onchain.reduce(
    (acc, it) => acc + (it.tokenAmountWei ?? 0n),
    0n,
  );
  $: totalOnchain = Number(onchainWeiSum) / 1e18;

  $: showOnchain = $wallet.status === "connected";
  $: totalAll = totalOffchain + (showOnchain ? totalOnchain : 0);

  $: serverReady = !!data;
  $: needOnchain = $wallet.status === "connected";
  $: isReady = serverReady && (!needOnchain || onchainLoaded) && !loading;
</script>

<div class="wrap">
  {#if !isReady}
    <div class="loadingBox">
      <div class="spinner" aria-hidden="true" />
      <div class="loadingText">
        {#if $wallet.status === "connected"}
          Loading onchain and offchain activity…
        {:else}
          Loading offchain activity…
        {/if}
      </div>
    </div>
  {:else}
    <div class="head">
      <div class="left">
        <span class="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M8 6h13"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M8 12h13"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M8 18h13"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M3.5 6h.01"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
            />
            <path
              d="M3.5 12h.01"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
            />
            <path
              d="M3.5 18h.01"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg>
        </span>
        <div class="title">RECENT ACTIVITY</div>
      </div>

      <button
        class="refresh"
        type="button"
        on:click={() => {
          if ($wallet.status !== "connected") return;
          loading = true;
          onchainLoaded = false;
          errorText = null;
          onchain = [];
          loadOnchainInner();
        }}
        disabled={$wallet.status !== "connected"}
      >
        Refresh
      </button>
    </div>

    <div class="totalBox">
      <div class="tLeft">
        <div class="k">TOTAL ANGT</div>
        <div class="big">{fmtAngt(totalAll)} <span class="sym">ANGT</span></div>
      </div>
      <div class="tRight"></div>
    </div>

    <div class="divider" />

    {#if $wallet.status !== "connected" && !data?.offchainPurchases?.length}
      <div class="empty">
        <div class="emptyIcon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M7 3h10a2 2 0 0 1 2 2v16l-2-1-2 1-2-1-2 1-2-1-2 1-2-1V5a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
            <path
              d="M9 8h6"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <path
              d="M9 12h6"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div class="emptyText">
          Connect wallet to see onchain purchases. Offchain will appear here
          too.
        </div>
      </div>
    {:else if errorText}
      <div class="error">{errorText}</div>
    {:else if !merged.length}
      <div class="empty">
        <div class="emptyIcon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M7 3h10a2 2 0 0 1 2 2v16l-2-1-2 1-2-1-2 1-2-1-2 1-2-1V5a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
            <path
              d="M9 8h6"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <path
              d="M9 12h6"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div class="emptyText">Your transaction history will appear here.</div>
      </div>
    {:else}
      <div class="listWrap">
        <div class="list">
          {#each merged as it}
            {#if it.kind === "onchain"}
              <a class="row" href={it.href} target="_blank" rel="noreferrer">
                <div class="leftcol">
                  <div class="line1">
                    <span class="tag onchain">ONCHAIN</span>
                    <span class="tag">{it.payTokenLabel}</span>
                    <span class="mono">{shortHash(it.txHash)}</span>
                  </div>
                  <div class="line2">
                    Week {it.week} · Price ${fmtUsd(it.priceUsd, 4)}
                  </div>
                </div>

                <div class="rightcol">
                  <div class="amt">{it.payAmountLabel}</div>
                  <div class="recv">{it.receiveLabel}</div>
                </div>
              </a>
            {:else}
              <div class="row offchain">
                <div class="leftcol">
                  <div class="line1">
                    <span class="tag off">OFFCHAIN</span>
                    <span class="tag status" data-s={it.status}
                      >{statusLabel(it.status)}</span
                    >
                    {#if it.sessionId}
                      <span class="mono">session {shortId(it.sessionId)}</span>
                    {/if}
                  </div>
                  <div class="line2">
                    Week {it.week ?? "-"} · Price ${fmtUsd(it.priceUsd, 4)}
                  </div>
                </div>

                <div class="rightcol">
                  <div class="amt">${it.payAmount} USD</div>
                  <div class="recv">+ {fmtAngt(it.receive)} ANGT</div>
                </div>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .wrap {
    position: relative;
    background: #fff;
    border-radius: 20px;
    padding: 20px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow:
      0 18px 40px rgba(15, 23, 42, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;
    transition:
      transform 0.12s ease,
      filter 0.12s ease;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;

    /* ключевое: блок не раздувает страницу */
    max-height: min(640px, 70vh);
  }

  .wrap:hover {
    transform: translateY(-1px);
    filter: brightness(1.01);
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .icon {
    width: 26px;
    height: 26px;
    color: rgba(37, 99, 235, 0.95);
    display: inline-grid;
    place-items: center;
  }
  .icon svg {
    width: 26px;
    height: 26px;
  }

  .title {
    margin: 0;
    font-size: 22px;
    font-weight: 950;
    letter-spacing: -0.03em;
    font-style: italic;
    color: #0f172a;
  }

  .refresh {
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(248, 250, 252, 0.9);
    padding: 8px 12px;
    border-radius: 12px;
    font-weight: 900;
    font-size: 12px;
    cursor: pointer;
  }
  .refresh:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .totalBox {
    margin-top: 12px;
    border-radius: 16px;
    padding: 12px 12px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow:
      0 16px 36px rgba(15, 23, 42, 0.06),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
  }

  .tLeft {
    display: grid;
    gap: 6px;
  }

  .tRight {
    display: grid;
    gap: 4px;
    text-align: right;
  }

  .k {
    font-size: 11px;
    font-weight: 950;
    letter-spacing: 0.06em;
    color: rgba(15, 23, 42, 0.55);
  }
  .k.muted {
    color: rgba(15, 23, 42, 0.45);
  }

  .big {
    font-size: 20px;
    font-weight: 950;
    letter-spacing: -0.03em;
    color: #0f172a;
    line-height: 1;
  }

  .sym {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: 0.06em;
    color: rgba(37, 99, 235, 0.95);
    margin-left: 6px;
  }

  .mini {
    font-size: 12px;
    font-weight: 900;
    color: rgba(15, 23, 42, 0.8);
  }

  .divider {
    height: 1px;
    background: rgba(15, 23, 42, 0.07);
    margin: 14px 0 0;
  }

  .error {
    margin-top: 12px;
    font-size: 13px;
    color: #ff5a5a;
    font-weight: 800;
  }

  /* loader — в том же стиле */
  .loadingBox {
    margin-top: 12px;
    border-radius: 16px;
    padding: 18px 12px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow:
      0 16px 36px rgba(15, 23, 42, 0.06),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;
    display: grid;
    place-items: center;
    gap: 10px;
    min-height: 260px;
    flex: 1;
  }

  .spinner {
    width: 34px;
    height: 34px;
    border-radius: 999px;
    border: 3px solid rgba(15, 23, 42, 0.12);
    border-top-color: rgba(37, 99, 235, 0.95);
    animation: spin 0.9s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loadingText {
    font-size: 14px;
    font-weight: 950;
    letter-spacing: -0.01em;
    color: rgba(100, 116, 139, 0.9);
    text-align: center;
  }

  /* scroll area */
  .listWrap {
    margin-top: 12px;
    min-height: 0;
    flex: 1;
    overflow: auto;
    padding-right: 4px;

    /* ключевое: скролл внутри списка */
    max-height: min(420px, 52vh);
  }

  .listWrap::-webkit-scrollbar {
    width: 10px;
  }
  .listWrap::-webkit-scrollbar-thumb {
    background: rgba(15, 23, 42, 0.14);
    border-radius: 999px;
    border: 3px solid rgba(255, 255, 255, 0.9);
  }
  .listWrap::-webkit-scrollbar-track {
    background: transparent;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 4px;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 12px;
    border-radius: 14px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    text-decoration: none;
    color: inherit;
    background: rgba(255, 255, 255, 0.92);
  }

  .row:hover {
    background: rgba(37, 99, 235, 0.03);
    border-color: rgba(37, 99, 235, 0.18);
  }

  .row.offchain {
    cursor: default;
  }

  .leftcol {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .line1 {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .tag {
    font-size: 11px;
    font-weight: 950;
    padding: 4px 8px;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.1);
    color: rgba(37, 99, 235, 0.95);
  }

  .tag.onchain {
    background: rgba(16, 185, 129, 0.1);
    color: rgba(16, 185, 129, 0.95);
  }
  .tag.off {
    background: rgba(99, 102, 241, 0.1);
    color: rgba(79, 70, 229, 0.95);
  }

  .tag.status {
    background: rgba(15, 23, 42, 0.06);
    color: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(15, 23, 42, 0.08);
  }

  .tag.status[data-s="paid"] {
    background: rgba(34, 197, 94, 0.12);
    color: rgba(22, 101, 52, 0.95);
    border-color: rgba(34, 197, 94, 0.18);
  }
  .tag.status[data-s="pending"] {
    background: rgba(59, 130, 246, 0.1);
    color: rgba(30, 64, 175, 0.92);
    border-color: rgba(59, 130, 246, 0.16);
  }
  .tag.status[data-s="failed"],
  .tag.status[data-s="expired"] {
    background: rgba(239, 68, 68, 0.1);
    color: rgba(127, 29, 29, 0.95);
    border-color: rgba(239, 68, 68, 0.16);
  }

  .mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", monospace;
    font-size: 12px;
    opacity: 0.85;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .line2 {
    font-size: 12px;
    opacity: 0.7;
  }

  .rightcol {
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-align: right;
    white-space: nowrap;
  }

  .amt {
    font-weight: 950;
    font-size: 13px;
    color: #0f172a;
  }

  .recv {
    font-weight: 900;
    font-size: 12px;
    color: rgba(16, 185, 129, 0.95);
  }

  .empty {
    flex: 1;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 12px;
    padding: 24px 12px;
  }

  .emptyIcon {
    width: 42px;
    height: 42px;
    color: rgba(148, 163, 184, 0.9);
    display: grid;
    place-items: center;
  }

  .emptyIcon svg {
    width: 42px;
    height: 42px;
  }

  .emptyText {
    font-size: 16px;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: rgba(100, 116, 139, 0.9);
    text-align: center;
  }

  @media (max-width: 980px) {
    .wrap {
      padding: 16px;
      border-radius: 20px;
      min-height: 320px;
      max-height: min(620px, 80vh);
    }
    .title {
      font-size: 16px;
    }
    .emptyText {
      font-size: 14px;
    }
    .listWrap {
      max-height: min(420px, 60vh);
    }
  }
</style>
