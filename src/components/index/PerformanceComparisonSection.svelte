<script lang="ts">
  let open = false;
  const toggle = () => (open = !open);

  const rows = [
    { label: "Cyprus → Athens", car: "24 H ferry + car", crown: "≈ 2.5 H" },
    { label: "Cyprus → Tbilisi", car: "36 H+ via Turkey", crown: "≈ 3.5 H" },
    { label: "Fuel per 100 km", car: "8 L", crown: "8–10 L" },
    { label: "Cost", car: "€45 000–90 000", crown: "from €370 000" }
  ];

  const specs = [
    { k: "Engine", v: "Rotax 916, Austria" },
    { k: "Airframe", v: "100% carbon fiber" },
    { k: "Seats", v: "5 passengers" },
    { k: "Payload", v: "570 kg" },
    { k: "Avionics", v: "Garmin, autopilot" },
    { k: "Fuel", v: "Unleaded 95 regular gasoline" },
    { k: "Max speed", v: "370 km/h" },
    { k: "Range", v: "2 500+ km" },
    { k: "Consumption", v: "28 L/h ≈ 8–10 L/100 km" }
  ];
</script>

<section class="compare">
  <div class="compare-overlay" aria-hidden="true"></div>
  <div class="compare-inner">
  <div class="compare-header">
    <p class="compare-kicker">5 seats · Unleaded 95 · Full freedom of movement</p>
  </div>

  <div class="compare-table">
    {#each rows as r}
      <div class="t-row">
        <div class="t-label">{r.label}</div>
        <div class="t-val">{r.car}</div>
        <div class="t-val crown">{r.crown}</div>
      </div>
    {/each}
  </div>

  <div class="compare-foot">
    5 seats · Unleaded 95 · Full freedom of movement
  </div>

  <div class="specs">
    <button
      class="btn btn-primary specs-btn"
      type="button"
      aria-expanded={open}
      on:click={toggle}
    >
      Technical specifications
      <span class="chev" class:open={open}>
        ▼
      </span>
    </button>

    {#if open}
      <div class="specs-drop">
        {#each specs as s}
          <div class="s-row">
            <div class="s-k">{s.k}</div>
            <div class="s-v">{s.v}</div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .compare {
    padding: 120px 16px;
    max-width: 1100px;
    margin: 0 auto;
  }

  .compare-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .compare-title {
    font-size: 44px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .compare-kicker {
    margin-top: 14px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .compare-table {
    border-top: 1px solid var(--border-soft);
  }

  .t-row {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    padding: 26px 0;
    border-bottom: 1px solid var(--border-soft);
    align-items: center;
    transition: background 0.3s ease;
  }

  .t-row:hover {
    background: rgba(176,141,87,0.05);
  }

  .t-label {
    font-family: var(--font-heading);
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.01em;

    background: linear-gradient(
      135deg,
      var(--accent-light),
      var(--accent),
      var(--accent-dark)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .t-val {
    font-size: 13px;
    text-align: right;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .t-val.crown {
    font-weight: 600;
    color: var(--accent-dark);
  }

  .compare-foot {
    margin-top: 26px;
    text-align: center;
    font-size: 12px;
    letter-spacing: 0.14em;
    color: var(--text-muted);
  }

  .specs {
    margin-top: 42px;
  }

  .specs-btn {
    width: 100%;
    height: 54px;
    justify-content: space-between;
  }

  .chev {
    transition: transform 0.25s ease;
  }

  .chev.open {
    transform: rotate(180deg);
  }

  .specs-drop {
    margin-top: 16px;
    border-radius: 26px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow: var(--shadow-soft);
    overflow: hidden;
  }

  .s-row {
    display: flex;
    justify-content: space-between;
    padding: 20px 24px;
    border-top: 1px solid var(--border-soft);
  }

  .s-row:first-child {
    border-top: 0;
  }

  .s-k {
    font-size: 11px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .s-v {
    font-size: 13px;
    color: var(--text-main);
  }

  @media (max-width: 900px) {
    .t-row {
      grid-template-columns: 1fr;
      gap: 6px;
    }

    .t-val {
      text-align: left;
    }
  }
</style>