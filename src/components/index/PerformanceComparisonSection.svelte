<script lang="ts">
  let open = false;

  const toggle = () => (open = !open);

  const rows = [
    {
      label: "CYPRUS → ATHENS",
      car: "24 H (ferry + car)",
      crown: "≈ 2.5 H",
    },
    {
      label: "CYPRUS → ROME",
      car: "Not possible direct",
      crown: "≈ 5.5 H",
    },
    {
      label: "Fuel per 100 km",
      car: "8 L",
      crown: "8–10 L",
    },
    {
      label: "Cost",
      car: "€45 000–90 000",
      crown: "from €370 000",
    },
  ] as const;

  const specs = [
    { k: "ENGINE", v: "Rotax 916, Austria" },
    { k: "AIRFRAME", v: "100% carbon fiber" },
    { k: "SEATS", v: "5 (pilot + 4 passengers)" },
    { k: "PAYLOAD", v: "570 kg" },
    { k: "AVIONICS", v: "Garmin, autopilot" },
    { k: "FUEL", v: "Unleaded 95 (regular gasoline)" },
    { k: "MAX SPEED", v: "370 km/h" },
    { k: "RANGE", v: "2 500+ km" },
    { k: "CONSUMPTION", v: "28 L/h (≈ 8–10 L/100 km)" },
  ] as const;
</script>

<section class="compare">
  <div class="compare-header">
    <h2 class="compare-title">Same gasoline - Four times faster</h2>
    <p class="compare-kicker">NUMBERS SPEAK FOR THEMSELVES</p>

    <div class="compare-headRow">
      <div class="head-spacer"></div>
      <div class="head-col">CAR</div>
      <div class="head-col">ANG CROWN</div>
    </div>
  </div>

  <div class="compare-table" role="table" aria-label="Comparison table">
    {#each rows as r}
      <div class="t-row" role="row">
        <div class="t-label" role="cell">{r.label}</div>
        <div class="t-val" role="cell">{r.car}</div>
        <div class="t-val crown" role="cell">{r.crown}</div>
      </div>
    {/each}
  </div>

  <div class="compare-foot">
    <span class="muted">5 seats · Unleaded 95 · Full freedom of movement</span>
  </div>

  <div class="specs">
    <button
      class="btn btn-primary specs-btn"
      type="button"
      aria-expanded={open}
      on:click={toggle}
    >
      <span>TECHNICAL SPECIFICATIONS</span>

      <span class="chev" class:open={open} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </button>

    {#if open}
      <div class="specs-drop" role="region" aria-label="Technical specifications">
        {#each specs as s}
          <div class="s-row">
            <div class="s-k">{s.k}</div>
            <div class="s-line" aria-hidden="true"></div>
            <div class="s-v">{s.v}</div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .compare {
    padding: 96px 16px 96px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .compare-header {
    text-align: center;
  }

  /* requested text style */
  .compare-kicker {
    margin-top: 6px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 900;
  }

  .compare-title {
    margin: 0;
    font-size: 46px;
    font-weight: 950;
    letter-spacing: -0.05em;
    font-style: italic;
    line-height: 1;
    text-transform: uppercase;
    color: #0f172a;
  }

  .compare-headRow {
    margin: 46px auto 0;
    max-width: 980px;
    display: grid;
    grid-template-columns: 1.4fr 0.8fr 0.8fr;
    align-items: end;
    gap: 18px;
  }

  .head-spacer {
    height: 1px;
  }

  /* requested text style */
  .head-col {
    margin-top: 6px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 900;
    text-align: center;
  }

  .compare-table {
    margin: 14px auto 0;
    max-width: 980px;
    border-top: 1px solid rgba(15, 23, 42, 0.1);
  }

  .t-row {
    display: grid;
    grid-template-columns: 1.4fr 0.8fr 0.8fr;
    gap: 18px;
    align-items: center;
    padding: 26px 0;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  }

  /* requested label style (purple gradient + italic) */
  .t-label {
    font-size: 20px;
    font-weight: 950;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    font-style: italic;

    background: linear-gradient(90deg, #2563eb, #7c3aed);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;

    transition: transform 0.35s ease, letter-spacing 0.35s ease;
  }

  .t-row:hover .t-label {
    transform: translateX(4px);
    letter-spacing: -0.02em;
  }

  /* requested value style */
  .t-val {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    text-align: right;
    color: rgba(15, 23, 42, 0.75);
    white-space: nowrap;
  }

  .t-val.crown {
    background: linear-gradient(90deg, #2563eb, #7c3aed);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .compare-foot {
    margin-top: 22px;
    text-align: center;
  }

  /* requested text style */
  .muted {
    margin-top: 6px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 900;
  }

  /* ===== button base (.btn) — as requested ===== */
  .btn {
    height: 40px;
    padding: 0 18px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: -0.01em;
    border: 1px solid rgba(15, 23, 42, 0.1);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    cursor: pointer;
    user-select: none;
    text-decoration: none;

    transition:
      transform 0.12s ease,
      filter 0.12s ease,
      background 0.12s ease,
      border-color 0.12s ease;
    backdrop-filter: blur(10px);
  }

  /* ===== primary button style — as requested ===== */
  .btn-primary {
    background: #0f172a;
    color: #fff;
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.16);
    border-color: rgba(15, 23, 42, 0.14);
  }

  .btn-primary:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }

  .btn-primary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  /* ===== specs dropdown ===== */

  .specs {
    max-width: 980px;
    margin: 36px auto 0;
  }

  /* keep width full but adopt btn sizes */
  .specs-btn {
    width: 100%;
    height: 54px; /* keep your larger CTA */
    padding: 0 20px;
    justify-content: space-between;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: -0.01em;
  }

  .chev {
    width: 18px;
    height: 18px;
    display: grid;
    place-items: center;
    transition: transform 0.25s ease;
    opacity: 0.95;
  }

  .chev.open {
    transform: rotate(180deg);
  }

  .specs-drop {
    margin-top: 14px;
    border-radius: 24px;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
    overflow: hidden;
  }

  .s-row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 16px;
    padding: 22px 22px;
    border-top: 1px solid rgba(15, 23, 42, 0.06);
  }

  .s-row:first-child {
    border-top: 0;
  }

  /* requested “small uppercase” style */
  .s-k {
    margin-top: 6px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 900;
    white-space: nowrap;
  }

  .s-line {
    height: 1px;
    background: rgba(15, 23, 42, 0.08);
  }

  /* requested value style */
  .s-v {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    text-align: right;
    color: rgba(15, 23, 42, 0.75);
    white-space: nowrap;
  }

  @media (max-width: 900px) {
    .compare-title {
      font-size: 30px;
      letter-spacing: -0.04em;
    }

    .compare-headRow,
    .t-row {
      grid-template-columns: 1fr;
    }

    .t-val {
      text-align: left;
    }

    .specs-btn {
      height: 52px;
    }

    .s-row {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .s-line {
      display: none;
    }

    .s-v {
      text-align: left;
      white-space: normal;
    }
  }

  @media (max-width: 640px) {
    .compare {
      padding: 72px 16px 72px;
    }

    .compare-title {
      font-size: 22px;
      letter-spacing: -0.03em;
    }

    .compare-headRow {
      display: none;
    }

    .t-row {
      gap: 10px;
      padding: 18px 0;
    }
  }
</style>
