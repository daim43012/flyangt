<script lang="ts">
  export let total = 500000000;

  export let segments = [
    { key: "treasury", label: "Treasury Fund", pct: 35, cls: "s1" },
    { key: "dev", label: "Dev Team", pct: 5, cls: "s2" },
    { key: "presale", label: "Presale", pct: 10, cls: "s3" },
    { key: "airdrop", label: "Airdrop", pct: 3, cls: "s4" },
    { key: "marketing", label: "Marketing", pct: 10, cls: "s5" },
    { key: "lp", label: "Limited Partners", pct: 12, cls: "s6" },
    { key: "community", label: "Community & Ecosystem", pct: 10, cls: "s7" },
    { key: "liquidity", label: "Liquidity & Listings", pct: 8, cls: "s8" },
    { key: "advisors", label: "Advisors", pct: 4, cls: "s9" },
    { key: "reserve", label: "Reserve", pct: 3, cls: "s10" }
  ];

  export let activeKey: string | null = null;

  let localActive: string | null = null;

  const C = 110;   // центр остаётся тем же
  const R = 92;    // увеличенный радиус
  const TAU = Math.PI * 2;

  const fmt = (n: number) => n.toLocaleString("en-US");
  const amount = (pct: number) => Math.round((total * pct) / 100);

  const polar = (cx: number, cy: number, r: number, a: number) => ({
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a)
  });

  const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
    const p0 = polar(cx, cy, r, a0);
    const p1 = polar(cx, cy, r, a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y} Z`;
  };

  $: slices = (() => {
    let a = -Math.PI / 2;
    return segments.map((s) => {
      const a0 = a;
      const a1 = a + (s.pct / 100) * TAU;
      a = a1;
      return { ...s, d: arc(C, C, R, a0, a1), amt: amount(s.pct) };
    });
  })();

  $: effectiveActive = activeKey ?? localActive;
  $: active = effectiveActive ? slices.find((x) => x.key === effectiveActive) : null;
</script>

<div class="pie-card" on:mouseleave={() => (localActive = null)}>
  <div class="pie-wrap">
    <svg viewBox="0 0 220 220" class="pie" role="img" aria-label="Allocation pie chart">
      <circle cx={C} cy={C} r={R} class="pie-base"></circle>

      {#each slices as s}
        <path
          class={"slice " + s.cls + (effectiveActive === s.key ? " is-active" : "")}
          d={s.d}
          tabindex="0"
          aria-label={s.label + " " + s.pct + "%"}
          on:mouseenter={() => (localActive = s.key)}
          on:focus={() => (localActive = s.key)}
        />
      {/each}

      <!-- увеличили внутреннюю дырку для сохранения пропорций -->
      <circle cx={C} cy={C} r="60" class="pie-hole"></circle>
      <circle cx={C} cy={C} r="66" class="pie-ring"></circle>
    </svg>

    <div class="pie-center">
      {#if active}
        <div class="pie-kicker">Selected</div>
        <div class="pie-title">{active.label}</div>
        <div class="pie-meta">
          <span class={"pill-lite " + active.cls}>{active.pct}%</span>
          <span class="muted">{fmt(active.amt)} ANGT</span>
        </div>
      {:else}
        <div class="pie-kicker">Total Supply</div>
        <div class="pie-title">{fmt(total)}</div>
        <div class="pie-meta">
          <span class="pill-lite neutral">100%</span>
          <span class="muted">ANGT</span>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .pie-card {
    padding: 18px;
    border-radius: 22px;
    background: rgba(15, 23, 42, 0.02);
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      inset 0 0 0 1px rgba(15, 23, 42, 0.02),
      0 18px 60px rgba(15, 23, 42, 0.06);
    transition:
      transform 0.45s ease,
      box-shadow 0.45s ease,
      border-color 0.45s ease;
  }

  .pie-card:hover {
    transform: translateY(-4px);
    box-shadow:
      inset 0 0 0 1px rgba(15, 23, 42, 0.02),
      0 28px 86px rgba(15, 23, 42, 0.10),
      0 10px 26px rgba(15, 23, 42, 0.06);
    border-color: rgba(176, 141, 87, 0.22);
  }

  .pie-wrap {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 320px;
  }

  .pie {
    width: 320px;
    height: 320px;
    filter: drop-shadow(0 18px 44px rgba(15, 23, 42, 0.11));
  }

  .pie-base {
    fill: rgba(15, 23, 42, 0.03);
    stroke: rgba(15, 23, 42, 0.06);
    stroke-width: 1;
  }

  .pie-hole {
    fill: var(--bg-white);
    stroke: rgba(15, 23, 42, 0.06);
    stroke-width: 1;
  }

  .pie-ring {
    fill: none;
    stroke: rgba(37, 99, 235, 0.16);
    stroke-width: 2;
  }

  .slice {
    cursor: pointer;
    opacity: 0.92;
    transform-origin: 110px 110px;
    outline: none;
    transition:
      transform 0.22s ease,
      opacity 0.22s ease,
      filter 0.22s ease;
    stroke: rgba(255, 255, 255, 0.92);
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }

  .slice:hover,
  .slice:focus {
    opacity: 1;
    transform: scale(1.045);
    filter: drop-shadow(0 16px 30px rgba(15, 23, 42, 0.18));
  }

  .slice.is-active {
    opacity: 1;
    transform: scale(1.06);
    filter: drop-shadow(0 18px 34px rgba(15, 23, 42, 0.20));
  }

  .s1  { fill: rgba(205, 170, 115, 0.85); }
  .s2  { fill: rgba(220, 185, 135, 0.82); }
  .s3  { fill: rgba(235, 200, 155, 0.80); }
  .s4  { fill: rgba(244, 214, 176, 0.78); }
  .s5  { fill: rgba(214, 176, 120, 0.80); }
  .s6  { fill: rgba(226, 192, 150, 0.78); }
  .s7  { fill: rgba(238, 210, 170, 0.78); }
  .s8  { fill: rgba(247, 225, 195, 0.85); }
  .s9  { fill: rgba(225, 215, 190, 0.75); }
  .s10 { fill: rgba(242, 235, 220, 0.90); }

  .pie-center {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    text-align: center;
    padding: 18px;
    pointer-events: none;
  }

  .pie-kicker {
    font-size: 11px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
  }

  .pie-title {
    margin-top: 10px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text-main);
  }

  .pie-meta {
    margin-top: 12px;
    display: inline-flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    font-size: 14px;
  }

  .pill-lite {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    padding: 7px 10px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(15, 23, 42, 0.03);
    color: rgba(15, 23, 42, 0.72);
    white-space: nowrap;
  }

  .pill-lite.neutral {
    border-color: rgba(15, 23, 42, 0.12);
    background: rgba(15, 23, 42, 0.03);
    color: rgba(15, 23, 42, 0.72);
  }

  .pill-lite.s1,
  .pill-lite.s2,
  .pill-lite.s3,
  .pill-lite.s4,
  .pill-lite.s5,
  .pill-lite.s6,
  .pill-lite.s7,
  .pill-lite.s8,
  .pill-lite.s9,
  .pill-lite.s10 {
    border-color: rgba(37, 99, 235, 0.22);
    background: rgba(37, 99, 235, 0.08);
  }

  .muted { color: var(--text-muted); }

  @media (max-width: 720px) {
    .pie {
      width: 290px;
      height: 290px;
    }
    .pie-wrap {
      min-height: 290px;
    }
  }
</style>