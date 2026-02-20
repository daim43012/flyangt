<section class="hub">
  <div class="hub-header">
    <h2 class="hub-title">
      CYPRUS IS YOUR AIRPORT IN THE CENTER OF THE WORLD
    </h2>

    <p class="hub-subtitle">Direct flights without schedules</p>

    <p class="hub-lead">
      Living in Cyprus, you are already in the perfect geographic hub.
      One hour to Tel Aviv, two and a half to Athens.
      Breakfast at home. Lunch in another country.
    </p>
  </div>

  <div class="hub-table">

    <div class="hub-row">
      <div class="cell city">TEL AVIV</div>
      <div class="cell time">≈ 1 H</div>
      <div class="cell cost">≈ €36</div>

      <div class="cell city">BEIRUT</div>
      <div class="cell time">≈ 0.5 H</div>
      <div class="cell cost">≈ €18</div>
    </div>

    <div class="hub-row">
      <div class="cell city">ATHENS</div>
      <div class="cell time">≈ 2.5 H</div>
      <div class="cell cost">≈ €91</div>

      <div class="cell city">CAIRO</div>
      <div class="cell time">≈ 1.5 H</div>
      <div class="cell cost">≈ €55</div>
    </div>

    <div class="hub-row">
      <div class="cell city">ISTANBUL</div>
      <div class="cell time">≈ 2.5 H</div>
      <div class="cell cost">≈ €87</div>

      <div class="cell city">TBILISI</div>
      <div class="cell time">≈ 3.5 H</div>
      <div class="cell cost">≈ €127</div>
    </div>

    <div class="hub-row">
      <div class="cell city">ROME</div>
      <div class="cell time">≈ 5.5 H</div>
      <div class="cell cost">≈ €200</div>

      <div class="cell city">BARCELONA</div>
      <div class="cell time">≈ 7 H</div>
      <div class="cell cost">≈ €255</div>
    </div>

  </div>

  <div class="hub-foot">
    Estimate: 28 L/h × €1.30/L × flight time
  </div>
</section>

<style>
  .hub {
    padding: 96px 16px 96px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hub-header {
    text-align: center;
    margin-bottom: 56px;
  }

  /* Your strong headline style */
  .hub-title {
    font-size: 46px;
    font-weight: 950;
    letter-spacing: -0.05em;
    font-style: italic;
    line-height: 1;
    margin: 0;
    text-transform: uppercase;
    color: #0f172a;
  }

  .hub-subtitle {
    margin-top: 16px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    font-weight: 900;
    color: #64748b;
  }

  .hub-lead {
    margin: 26px auto 0;
    max-width: 70ch;
    font-size: 14px;
    line-height: 1.7;
    font-weight: 700;
    color: #64748b;
  }

  /* TABLE BLOCK */

  .hub-table {
    margin-top: 56px;
    border-radius: 26px;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
  }

  .hub-row {
    display: grid;
    grid-template-columns: 1.4fr 0.7fr 0.7fr 1.4fr 0.7fr 0.7fr;
    align-items: center;
    min-height: 86px;
    border-top: 1px solid rgba(15, 23, 42, 0.06);
    transition: background 0.3s ease;
  }

  .hub-row:first-child {
    border-top: none;
  }

  .hub-row:hover {
    background: rgba(15, 23, 42, 0.02);
  }

  .cell {
    padding: 20px 24px;
  }

  /* 🔥 Gradient cities */
  .cell.city {
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

  .hub-row:hover .cell.city {
    transform: translateX(4px);
    letter-spacing: -0.02em;
  }

  .cell.time,
  .cell.cost {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    text-align: right;
    color: rgba(15, 23, 42, 0.75);
    white-space: nowrap;
  }

  .hub-row .cell:nth-child(4) {
    border-left: 1px solid rgba(15, 23, 42, 0.06);
  }

  .hub-foot {
    margin-top: 28px;
    text-align: center;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: rgba(15, 23, 42, 0.55);
  }

  /* Responsive */

  @media (max-width: 1024px) {
    .hub-title {
      font-size: 36px;
    }

    .hub-row {
      grid-template-columns: 1.3fr 0.7fr 0.7fr 1.3fr 0.7fr 0.7fr;
    }
  }

  @media (max-width: 720px) {
    .hub {
      padding: 72px 16px;
    }

    .hub-title {
      font-size: 24px;
      letter-spacing: -0.03em;
    }

    .hub-table {
      border-radius: 20px;
    }

    .hub-row {
      grid-template-columns: 1fr 0.7fr 0.7fr;
      min-height: unset;
    }

    .hub-row .cell:nth-child(4) {
      border-left: none;
      border-top: 1px solid rgba(15, 23, 42, 0.06);
    }

    .cell {
      padding: 18px;
    }

    .cell.city {
      font-size: 18px;
    }
  }
</style>
