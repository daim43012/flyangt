<script lang="ts">
  import { onMount } from "svelte";

  const TOKEN_ADDRESS = "0xDa517744d51E5028db6624B5048aCC9C6bE67A7E";

  type PriceApiResponse = {
    tokenAddress: string;
    network: "polygon";
    symbol: string;
    name: string;
    priceUsd: number;
    source: "dexscreener";
    updatedAt: string;
  };

  type UiData = {
    symbol: string;
    name: string;

    price: number;
    changePct24h: number;
    changeUsd24h: number;

    high24h: number;
    low24h: number;
    volume24h: number;

    spark: number[];
  };

  let data: UiData = {
    symbol: "—",
    name: "—",
    price: NaN,
    changePct24h: 0,
    changeUsd24h: 0,
    high24h: NaN,
    low24h: NaN,
    volume24h: NaN,
    spark: [],
  };

  let loading = false;
  let err: string | null = null;

  async function load() {
    loading = true;
    err = null;

    try {
      const r = await fetch(
        `/api/token/price?address=${encodeURIComponent(TOKEN_ADDRESS)}`,
      );
      const j = await r.json();

      data = {
        symbol: j.symbol,
        name: j.name,

        price: j.priceUsd,
        changePct24h: j.changePct24h,
        changeUsd24h: (j.priceUsd * j.changePct24h) / 100,

        high24h: NaN,
        low24h: NaN,

        volume24h: j.volume24h,
        spark: Array.from({ length: 12 }, () => j.priceUsd),
      };
    } catch (e) {
      err = e instanceof Error ? e.message : "Unknown error";
    } finally {
      loading = false;
    }
  }

  onMount(load);

  function fmtUsd(v: number, maxFrac = 6) {
    if (!Number.isFinite(v)) return "-";
    const abs = Math.abs(v);
    const frac = abs >= 1000 ? 2 : abs >= 1 ? 4 : maxFrac;
    return `$${v.toLocaleString(undefined, { maximumFractionDigits: frac })}`;
  }

  function fmtNum(v: number, maxFrac = 2) {
    if (!Number.isFinite(v)) return "-";
    return v.toLocaleString(undefined, { maximumFractionDigits: maxFrac });
  }

  $: isUp = data.changePct24h >= 0;
  $: deltaPctText = `${isUp ? "+" : ""}${fmtNum(data.changePct24h)}%`;
  $: deltaUsdText = `${isUp ? "+" : ""}${fmtUsd(data.changeUsd24h)}`;

  function sparkPath(values: number[], w = 140, h = 42, pad = 4) {
    if (!values?.length) return "";
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const step = (w - pad * 2) / Math.max(values.length - 1, 1);

    return values
      .map((v, i) => {
        const x = pad + i * step;
        const y = pad + (1 - (v - min) / span) * (h - pad * 2);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");
  }

  $: spark = sparkPath(data.spark);
</script>

<section class="card">
  <header class="top">
    <div>
      <div class="kicker">TOKEN • LAST 24H</div>
      <div class="title">
        <span class="sym">{data.symbol}</span>
        <span class="name">{data.name}</span>
      </div>
    </div>

    <div class={"badge " + (isUp ? "up" : "down")}>
      <span class="dot"></span>
      {deltaPctText}
    </div>
  </header>

  <div class="main">
    <div class="price">
      <div class="label">Price</div>
      <div class="value">{fmtUsd(data.price)}</div>
      <div class={"delta " + (isUp ? "up" : "down")}>
        {deltaUsdText} • 24h
      </div>
    </div>

    <div class="spark">
      <svg viewBox="0 0 140 42">
        <path d={spark} class="sparkline" />
      </svg>
    </div>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="slabel">24h High</div>
      <div class="sval">{fmtUsd(data.high24h)}</div>
    </div>
    <div class="stat">
      <div class="slabel">24h Low</div>
      <div class="sval">{fmtUsd(data.low24h)}</div>
    </div>
    <div class="stat">
      <div class="slabel">24h Volume</div>
      <div class="sval">{fmtUsd(data.volume24h, 2)}</div>
    </div>
  </div>
</section>

<style>
  .card {
    border-radius: 22px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: #ffffff;
    box-shadow:
      0 18px 40px rgba(15, 23, 42, 0.08),
      0 6px 14px rgba(15, 23, 42, 0.05);
    overflow: hidden;
    padding: 16px 16px 14px;
  }

  .top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .kicker {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.12em;
    color: rgba(15, 23, 42, 0.45);
  }

  .title {
    margin-top: 6px;
    display: flex;
    gap: 10px;
    align-items: baseline;
    flex-wrap: wrap;
  }

  .sym {
    font-size: 16px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: rgba(15, 23, 42, 0.95);
  }

  .name {
    font-size: 12px;
    font-weight: 800;
    color: rgba(15, 23, 42, 0.55);
  }

  .badge {
    flex: 0 0 auto;
    height: 32px;
    padding: 0 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 950;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: rgba(15, 23, 42, 0.03);
    color: rgba(15, 23, 42, 0.9);
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.25);
  }

  .badge.up {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.18);
    color: rgba(6, 95, 70, 0.95);
  }
  .badge.up .dot {
    background: rgba(16, 185, 129, 0.9);
  }

  .badge.down {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.18);
    color: rgba(153, 27, 27, 0.95);
  }
  .badge.down .dot {
    background: rgba(239, 68, 68, 0.9);
  }

  .main {
    margin-top: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  .price .label {
    font-size: 12px;
    color: rgba(15, 23, 42, 0.55);
    font-weight: 800;
  }

  .price .value {
    margin-top: 6px;
    font-size: 26px;
    line-height: 1.05;
    font-weight: 950;
    letter-spacing: -0.03em;
    color: rgba(15, 23, 42, 0.95);
    font-variant-numeric: tabular-nums;
  }

  .delta {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 900;
    color: rgba(15, 23, 42, 0.55);
  }
  .delta.up {
    color: rgba(6, 95, 70, 0.9);
  }
  .delta.down {
    color: rgba(153, 27, 27, 0.9);
  }

  .spark {
    width: 150px;
    height: 54px;
    border-radius: 16px;
    border: 1px solid rgba(15, 23, 42, 0.06);
    background: rgba(15, 23, 42, 0.02);
    display: grid;
    place-items: center;
  }

  .sparkline {
    fill: none;
    stroke: rgba(37, 99, 235, 0.9);
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .spark-placeholder {
    width: 120px;
    height: 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.08);
  }

  .stats {
    margin-top: 14px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  .stat {
    border-radius: 16px;
    padding: 10px 10px;
    border: 1px solid rgba(15, 23, 42, 0.06);
    background: rgba(15, 23, 42, 0.02);
  }

  .slabel {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.1em;
    color: rgba(15, 23, 42, 0.45);
    text-transform: uppercase;
  }

  .sval {
    margin-top: 6px;
    font-size: 13px;
    font-weight: 950;
    color: rgba(15, 23, 42, 0.95);
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 520px) {
    .main {
      flex-direction: column;
      align-items: flex-start;
    }
    .spark {
      width: 100%;
    }
    .stats {
      grid-template-columns: 1fr;
    }
  }
</style>
