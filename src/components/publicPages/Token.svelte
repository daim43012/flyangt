<!-- src/sections/TokenomicsSection.svelte -->
<script lang="ts">
  import DigitalBook from "./Wallpaper.svelte";
  import TokenomicsDonut from "./TokenomicsPie.svelte";

  const total = 500_000_000;

  const fmt = (n: number) => n.toLocaleString("en-US");
  const amount = (pct: number) => Math.round((total * pct) / 100);

  const segments = [
    { key: "treasury", label: "Treasury Fund", pct: 35, cls: "s1", icon: "👑", sub: "Governance allocation" },
    { key: "dev", label: "Dev Team", pct: 5, cls: "s2", icon: "🧑‍💻", sub: "Vesting incentives" },
    { key: "presale", label: "Presale", pct: 10, cls: "s3", icon: "🎟️", sub: "Early distribution" },
    { key: "airdrop", label: "Airdrop", pct: 3, cls: "s4", icon: "🎁", sub: "Community launch" },
    { key: "marketing", label: "Marketing", pct: 10, cls: "s5", icon: "📣", sub: "Growth & partnerships" },
    { key: "lp", label: "Limited Partners", pct: 12, cls: "s6", icon: "🤝", sub: "Strategic & LP" },
    { key: "community", label: "Community & Ecosystem", pct: 10, cls: "s7", icon: "🧭", sub: "Rewards & missions" },
    { key: "liquidity", label: "Liquidity & Listings", pct: 8, cls: "s8", icon: "💧", sub: "DEX/CEX support" },
    { key: "advisors", label: "Advisors", pct: 4, cls: "s9", icon: "🧠", sub: "Expert support" },
    { key: "reserve", label: "Reserve", pct: 3, cls: "s10", icon: "🛟", sub: "Operations buffer" }
  ];

  const split = [
    { label: "Treasury / Collateral", note: "(not market)", pct: 50, cls: "t1" },
    { label: "Ecosystem / Market", note: "(distribution below)", pct: 50, cls: "t2" }
  ];

  let activeKey: string | null = null;

  $: slices = [...segments]
    .map((s) => ({ ...s, amt: amount(s.pct) }))
    .sort((a, b) => b.pct - a.pct);

  $: active = activeKey ? slices.find((x) => x.key === activeKey) : null;
</script>

<section class="tokenomics">
  <div class="tokenomics-header">
    <h2 class="tokenomics-title">ANGT TOKENOMICS</h2>
    <p class="tokenomics-subtitle">
      Fixed supply on Polygon • clear allocation • no additional mint.
    </p>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-icon">🪙</div>
      <div class="stat-body">
        <div class="stat-kicker">Token</div>
        <div class="stat-value">ANGT</div>
        <div class="stat-note">Polygon (ERC-20)</div>
      </div>
    </div>

    <div class="stat">
      <div class="stat-icon">📦</div>
      <div class="stat-body">
        <div class="stat-kicker">Total Supply</div>
        <div class="stat-value">{fmt(total)}</div>
        <div class="stat-note">ANGT</div>
      </div>
    </div>

    <div class="stat">
      <div class="stat-icon">🔒</div>
      <div class="stat-body">
        <div class="stat-kicker">Emission</div>
        <div class="stat-value">Fixed</div>
        <div class="stat-note">No additional mint</div>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panel-head">
      <h3>SUPPLY SPLIT</h3>
      <p>{fmt(total)} ANGT total. {split[0].pct}/{split[1].pct} between treasury collateral and market ecosystem.</p>
    </div>

    <div class="split">
      {#each split as row}
        <div class="row">
          <div class="label">
            <span class={"dot " + row.cls} aria-hidden="true"></span>
            <span class="label-main">{row.label}</span>
            <span class="muted">{row.note}</span>
          </div>

          <div class="bar">
            <span class={"fill " + row.cls} style={"width:" + row.pct + "%"}></span>
          </div>

          <div class="meta">
            <b>{fmt(amount(row.pct))}</b>
            <span class="muted">ANGT</span>
            <span class="pct">{row.pct}%</span>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="panel">
    <div class="panel-head head-row">
      <div>
        <h3>TOKEN DISTRIBUTION</h3>
        <p>Hover a segment to see details. Total supply: <b>{fmt(total)}</b> ANGT.</p>
      </div>
      <span class="pill done">interactive</span>
    </div>

    <div class="dist-grid" on:mouseleave={() => (activeKey = null)}>
      <div class="dist-left">
        <div class="donut-wrap">
          <TokenomicsDonut {total} segments={slices} bind:activeKey />
        </div>

        <div class="mini-cards">
          <div class="mini-card">
            <div class="mini-kicker">Policy</div>
            <div class="mini-value">No mint</div>
            <div class="mini-note">Fixed cap supply policy.</div>
          </div>

          <div class="mini-card">
            <div class="mini-kicker">Allocation</div>
            <div class="mini-value">{active ? active.pct + "%" : "100%"}</div>
            <div class="mini-note">
              {active ? active.label : "Move cursor over segments to explore"}
            </div>
          </div>
        </div>
      </div>

      <div class="table">
        <div class="thead">
          <div>Category</div>
          <div class="right">Amount</div>
          <div class="right">Share</div>
        </div>

        {#each slices as s}
          <button
            type="button"
            class={"trow " + (activeKey === s.key ? "is-active" : "")}
            on:mouseenter={() => (activeKey = s.key)}
            on:focus={() => (activeKey = s.key)}
          >
            <div class="cat">
              <span class="chip" aria-hidden="true">{s.icon}</span>
              <div class="cat-text">
                <div class="cat-name">{s.label}</div>
                <div class="cat-sub">{s.sub}</div>
              </div>
            </div>

            <div class="right num">{fmt(s.amt)}</div>

            <div class="right share">
              <span class={"percent " + s.cls}>{s.pct}%</span>
              <span class="mini">
                <span class={"mini-fill " + s.cls} style={"width:" + s.pct + "%"}></span>
              </span>
            </div>
          </button>
        {/each}

        <div class="tfoot">
          <div class="total">
            <span class="total-left">Total</span>
            <span class="total-mid"><b>{fmt(total)}</b> <span class="muted">ANGT</span></span>
            <span class="total-right">100%</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid2">
    <div class="panel">
      <div class="panel-head">
        <h3>VESTING & LOCKS</h3>
        <p>Transparent release logic to align long-term incentives (edit to your real schedule).</p>
      </div>

      <div class="timeline">
        <div class="tl-item">
          <div class="tl-dot"></div>
          <div class="tl-body">
            <div class="tl-title">Team</div>
            <div class="tl-sub">Cliff 3 months, then linear 12 months</div>
          </div>
          <span class="pill">vesting</span>
        </div>

        <div class="tl-item">
          <div class="tl-dot green"></div>
          <div class="tl-body">
            <div class="tl-title">Liquidity</div>
            <div class="tl-sub">Initial seed + gradual increase for stability</div>
          </div>
          <span class="pill done">locked</span>
        </div>

        <div class="tl-item">
          <div class="tl-dot"></div>
          <div class="tl-body">
            <div class="tl-title">Ecosystem rewards</div>
            <div class="tl-sub">Distributed via campaigns, missions and usage</div>
          </div>
          <span class="pill">program</span>
        </div>
      </div>
    </div>
  </div>
</section>

<DigitalBook />

<style>
  /* =========================
     SECTION
     ========================= */
  .tokenomics {
    padding: 110px 16px 120px;
    max-width: 1200px;
    margin: 0 auto;
    color: var(--text-main);
  }

  .tokenomics-header {
    text-align: center;
    margin-bottom: 56px;
  }

  .tokenomics-title {
    font-size: 42px;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin: 0;
  }

  .tokenomics-subtitle {
    margin-top: 14px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  /* =========================
     STATS
     ========================= */
  .stats {
    max-width: 1000px;
    margin: 0 auto 22px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .stat {
    text-align: left;
    padding: 22px 22px 22px;
    border-radius: 26px;

    background: var(--bg-white);
    border: 1px solid var(--border-soft);

    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);

    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 14px;
    align-items: start;

    transition:
      transform 0.45s ease,
      box-shadow 0.45s ease,
      border-color 0.45s ease;
  }

  .stat:hover {
    transform: translateY(-6px);
    box-shadow:
      0 40px 110px rgba(18, 20, 22, 0.12),
      0 12px 32px rgba(18, 20, 22, 0.08);
    border-color: rgba(176, 141, 87, 0.28);
  }

  .stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 16px;

    display: grid;
    place-items: center;

    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);

    font-size: 20px;
  }

  .stat-kicker {
    font-size: 11px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
  }

  .stat-value {
    margin-top: 8px;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.05;

    background: linear-gradient(
      135deg,
      var(--accent-light),
      var(--accent),
      var(--accent-dark)
    );

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .stat-note {
    margin-top: 8px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-muted);
  }

  /* =========================
     PANELS
     ========================= */
  .panel {
    max-width: 1000px;
    margin: 0 auto 18px;
    padding: 26px;
    border-radius: 26px;

    background: var(--bg-white);
    border: 1px solid var(--border-soft);

    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
  }

  .panel-head h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text-main);
  }

  .panel-head p {
    margin: 10px 0 18px;
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);
  }

  .head-row {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    justify-content: space-between;
  }

  /* =========================
     PILLS
     ========================= */
  .pill {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.26em;
    text-transform: uppercase;

    padding: 8px 12px;
    border-radius: 999px;

    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(15, 23, 42, 0.03);
    color: rgba(15, 23, 42, 0.72);

    white-space: nowrap;
    height: fit-content;
  }

  .pill.done {
    border-color: rgba(22, 163, 74, 0.35);
    background: rgba(22, 163, 74, 0.12);
    color: #14532d;
  }

  /* =========================
     SUPPLY SPLIT
     ========================= */
  .split { display: grid; gap: 12px; }

  .row {
    display: grid;
    grid-template-columns: 1.4fr 2fr 1.2fr;
    gap: 14px;
    align-items: center;

    padding: 14px 14px;
    border-radius: 18px;

    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.06);
  }

  .label {
    font-size: 14px;
    color: var(--text-main);
    display: flex;
    gap: 10px;
    align-items: center;
    min-width: 0;
    flex-wrap: wrap;
  }

  .label-main {
    font-weight: 500;
  }

  .muted { color: var(--text-muted); }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    border: 2px solid rgba(15, 23, 42, 0.16);
    background: #fff;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    flex: 0 0 auto;
  }

  .dot.t1 { border-color: rgba(15, 23, 42, 0.22); }
  .dot.t2 { border-color: rgba(22, 163, 74, 0.55); }

  .bar {
    height: 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.08);
    overflow: hidden;
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.06);
  }

  .fill {
    height: 100%;
    display: block;
    border-radius: 999px;
  }

  .fill.t1 { background: rgba(15, 23, 42, 0.22); }
  .fill.t2 { background: rgba(22, 163, 74, 0.28); }

  .meta {
    text-align: right;
    font-size: 14px;
    color: var(--text-main);

    display: inline-flex;
    gap: 10px;
    justify-content: flex-end;
    align-items: baseline;
    flex-wrap: wrap;
  }

  .pct {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;

    padding: 7px 10px;
    border-radius: 999px;

    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(15, 23, 42, 0.03);
    color: rgba(15, 23, 42, 0.72);
  }

  /* =========================
     DISTRIBUTION GRID
     ========================= */
  .dist-grid {
    display: grid;
    grid-template-columns: 1fr 1.25fr;
    gap: 16px;
    align-items: stretch;
  }

  .dist-left {
    border-radius: 22px;
    background: rgba(15, 23, 42, 0.02);
    border: 1px solid rgba(15, 23, 42, 0.06);
    padding: 16px;
    overflow: hidden;
  }

  .donut-wrap {
    border-radius: 20px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    padding: 14px;
  }

  .mini-cards {
    margin-top: 12px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .mini-card {
    padding: 16px;
    border-radius: 20px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.06);
  }

  .mini-kicker {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .mini-value {
    margin-top: 10px;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-main);
  }

  .mini-note {
    margin-top: 8px;
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);
  }

  /* =========================
     TABLE
     ========================= */
  .table {
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: #fff;
  }

  .thead {
    display: grid;
    grid-template-columns: 1.6fr 0.7fr 0.7fr;
    gap: 12px;
    padding: 12px 14px;

    background: rgba(15, 23, 42, 0.04);
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);

    font-size: 11px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: rgba(15, 23, 42, 0.72);
    font-weight: 600;
  }

  .trow {
    width: 100%;
    text-align: left;
    border: 0;

    display: grid;
    grid-template-columns: 1.6fr 0.7fr 0.7fr;
    gap: 12px;
    padding: 14px;

    background: #fff;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    cursor: pointer;

    transition:
      background 0.25s ease,
      transform 0.25s ease;
  }

  .trow:hover,
  .trow:focus {
    background: rgba(15, 23, 42, 0.02);
    transform: translateY(-1px);
    outline: none;
  }

  .trow.is-active {
    background: rgba(22, 163, 74, 0.06);
  }

  .cat {
    display: flex;
    gap: 12px;
    align-items: center;
    min-width: 0;
  }

  .chip {
    width: 36px;
    height: 36px;
    border-radius: 14px;

    display: grid;
    place-items: center;

    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);

    font-size: 16px;
    flex: 0 0 auto;
  }

  .cat-text { min-width: 0; }

  .cat-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-main);

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cat-sub {
    margin-top: 4px;
    font-size: 13px;
    color: var(--text-muted);

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .right { text-align: right; }

  .num {
    font-weight: 600;
    color: var(--text-main);
    font-size: 14px;
    align-self: center;
  }

  .share {
    display: grid;
    justify-items: end;
    gap: 8px;
    align-content: center;
  }

  .percent {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;

    padding: 7px 10px;
    border-radius: 999px;

    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(15, 23, 42, 0.03);
    color: rgba(15, 23, 42, 0.72);
  }

  .mini {
    width: 120px;
    height: 8px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.08);
    overflow: hidden;
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.06);
  }

  .mini-fill { height: 100%; display: block; border-radius: 999px; }

  .tfoot {
    padding: 12px 14px;
    background: rgba(15, 23, 42, 0.03);
    border-top: 1px solid rgba(15, 23, 42, 0.06);
  }

  .total {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 12px;
    align-items: center;
    font-size: 14px;
  }

  .total-left {
    font-size: 11px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: rgba(15, 23, 42, 0.72);
    font-weight: 600;
  }

  .total-right {
    font-size: 11px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: rgba(15, 23, 42, 0.72);
    font-weight: 600;
  }

  /* =========================
     TIMELINE
     ========================= */
  .grid2 { max-width: 1000px; margin: 0 auto; }

  .timeline { display: grid; gap: 12px; }

  .tl-item {
    padding: 14px;
    border-radius: 20px;

    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.06);

    display: grid;
    grid-template-columns: 14px 1fr auto;
    gap: 12px;
    align-items: center;
  }

  .tl-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    border: 2px solid rgba(15, 23, 42, 0.18);
    background: #fff;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.10);
  }

  .tl-dot.green { border-color: rgba(22, 163, 74, 0.55); }

  .tl-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-main);
  }

  .tl-sub {
    margin-top: 4px;
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.55;
  }

  /* =========================
     SEGMENT COLORS (subtle)
     ========================= */
  .mini-fill.s1 { background: rgba(15, 23, 42, 0.26); }
  .mini-fill.s2 { background: rgba(30, 41, 59, 0.22); }
  .mini-fill.s3 { background: rgba(51, 65, 85, 0.22); }
  .mini-fill.s4 { background: rgba(100, 116, 139, 0.22); }
  .mini-fill.s5 { background: rgba(22, 163, 74, 0.28); }
  .mini-fill.s6 { background: rgba(21, 128, 61, 0.26); }
  .mini-fill.s7 { background: rgba(34, 197, 94, 0.24); }
  .mini-fill.s8 { background: rgba(16, 185, 129, 0.22); }
  .mini-fill.s9 { background: rgba(6, 95, 70, 0.22); }
  .mini-fill.s10 { background: rgba(75, 85, 99, 0.22); }

  .percent.s5,
  .percent.s6,
  .percent.s7,
  .percent.s8 {
    border-color: rgba(22, 163, 74, 0.35);
    background: rgba(22, 163, 74, 0.12);
    color: #14532d;
  }

  /* =========================
     RESPONSIVE
     ========================= */
  @media (max-width: 980px) {
    .dist-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .tokenomics {
      padding: 80px 14px 90px;
    }

    .tokenomics-title {
      font-size: 30px;
    }

    .stats {
      grid-template-columns: 1fr;
      gap: 14px;
      margin-bottom: 18px;
    }

    .panel {
      padding: 18px;
      border-radius: 22px;
    }

    .row {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .meta {
      justify-content: flex-start;
      text-align: left;
    }

    .thead { display: none; }

    .trow {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .right { text-align: left; }
    .share { justify-items: start; }
    .mini { width: 100%; }

    .total {
      grid-template-columns: 1fr;
      text-align: center;
      justify-items: center;
      gap: 8px;
    }

    .mini-cards {
      grid-template-columns: 1fr;
    }
  }
</style>