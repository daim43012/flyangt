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

  const C = 110;
  const R = 78;
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
    <!-- ✅ увеличили viewBox и размеры -->
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

      <!-- ✅ чуть больше отверстие тоже -->
      <circle cx={C} cy={C} r="52" class="pie-hole"></circle>
      <circle cx={C} cy={C} r="58" class="pie-ring"></circle>
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
    border-radius: 18px;
    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.02);
  }

  .pie-wrap {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 300px; /* чуть больше */
  }

  .pie {
    width: 300px;  /* ✅ было 260 */
    height: 300px;
    filter: drop-shadow(0 18px 44px rgba(15, 23, 42, 0.11));
  }

  .pie-base {
    fill: rgba(15, 23, 42, 0.035);
    stroke: rgba(15, 23, 42, 0.06);
    stroke-width: 1;
  }

  .pie-hole {
    fill: #fff;
    stroke: rgba(15, 23, 42, 0.06);
    stroke-width: 1;
  }

  /* тонкое декоративное кольцо */
  .pie-ring {
    fill: none;
    stroke: rgba(56, 189, 248, 0.18);
    stroke-width: 2;
  }

  .slice {
    cursor: pointer;
    opacity: 0.92;
    transform-origin: 110px 110px;
    transition: transform 170ms ease, opacity 170ms ease, filter 170ms ease;
    outline: none;

    /* ✅ “расстояние” между секциями: тонкий разделитель */
    stroke: rgba(255, 255, 255, 0.92);
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }

  /* ✅ сильнее выплывает */
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

  /* ✅ небесно голубая палитра (без зелени, без слишком тёмных) */
  .s1  { fill: rgba(30, 64, 175, 0.70); }  /* indigo soft */
  .s2  { fill: rgba(37, 99, 235, 0.64); }  /* blue */
  .s3  { fill: rgba(59, 130, 246, 0.58); } /* blue mid */
  .s4  { fill: rgba(96, 165, 250, 0.55); } /* light blue */

  .s5  { fill: rgba(14, 165, 233, 0.56); } /* sky */
  .s6  { fill: rgba(56, 189, 248, 0.52); } /* sky light */
  .s7  { fill: rgba(125, 211, 252, 0.52); }/* sky softer */
  .s8  { fill: rgba(186, 230, 253, 0.72); }/* pale sky */

  .s9  { fill: rgba(147, 197, 253, 0.46); }/* very soft */
  .s10 { fill: rgba(203, 213, 225, 0.60); }/* slate light */

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
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #64748b;
    margin-top: 2px;
  }

  .pie-title {
    margin-top: 8px;
    font-size: 18px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .pie-meta {
    margin-top: 10px;
    display: inline-flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    font-size: 12.5px;
  }

  .pill-lite {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(15, 23, 42, 0.03);
    color: rgba(15, 23, 42, 0.78);
    white-space: nowrap;
  }

  .pill-lite.neutral {
    border-color: rgba(15, 23, 42, 0.12);
    background: rgba(15, 23, 42, 0.03);
    color: rgba(15, 23, 42, 0.78);
  }

  /* tint pill borders a bit sky */
  .pill-lite.s1, .pill-lite.s2, .pill-lite.s3, .pill-lite.s4,
  .pill-lite.s5, .pill-lite.s6, .pill-lite.s7, .pill-lite.s8, .pill-lite.s9 {
    border-color: rgba(56, 189, 248, 0.30);
  }

  .muted { color: #64748b; }

  @media (max-width: 720px) {
    .pie { width: 270px; height: 270px; }
    .pie-wrap { min-height: 270px; }
  }
</style>
