<section class="hub">
  <div class="hub-overlay" aria-hidden="true"></div>
  <div class="hub-inner">
  <div class="hub-header">
    <h2 class="hub-title">
      Cyprus is your airport in the center of the world
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
      <div class="cell city">Tel Aviv</div>
      <div class="cell time">≈ 1 H</div>
      <div class="cell cost">≈ €36</div>

      <div class="cell city">Beirut</div>
      <div class="cell time">≈ 0.5 H</div>
      <div class="cell cost">≈ €18</div>
    </div>

    <div class="hub-row">
      <div class="cell city">Athens</div>
      <div class="cell time">≈ 2.5 H</div>
      <div class="cell cost">≈ €91</div>

      <div class="cell city">Cairo</div>
      <div class="cell time">≈ 1.5 H</div>
      <div class="cell cost">≈ €55</div>
    </div>

    <div class="hub-row">
      <div class="cell city">Istanbul</div>
      <div class="cell time">≈ 2.5 H</div>
      <div class="cell cost">≈ €87</div>

      <div class="cell city">Tbilisi</div>
      <div class="cell time">≈ 3.5 H</div>
      <div class="cell cost">≈ €127</div>
    </div>

    <div class="hub-row">
      <div class="cell city">Rome</div>
      <div class="cell time">≈ 5.5 H</div>
      <div class="cell cost">≈ €200</div>

      <div class="cell city">Barcelona</div>
      <div class="cell time">≈ 7 H</div>
      <div class="cell cost">≈ €255</div>
    </div>

  </div>

  <div class="hub-foot">
    Estimate: 28 L/h × €1.30/L × flight time
  </div>
  </div><!-- /hub-inner -->
</section>

<style>
  .hub {
    position: relative;
    overflow: hidden;

    background-image: url('/images/main2.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }

  .hub-overlay {
    position: absolute;
    inset: 0;
    background: rgba(246, 242, 234, 0.88);
    backdrop-filter: blur(1px);
    pointer-events: none;
    z-index: 0;
  }

  .hub-inner {
    position: relative;
    z-index: 1;
    padding: 120px 16px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hub-header {
    text-align: center;
    margin-bottom: 70px;
  }

  .hub-title {
    font-size: 44px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .hub-subtitle {
    margin-top: 16px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .hub-lead {
    margin: 28px auto 0;
    max-width: 70ch;
    font-size: 16px;
    line-height: 1.75;
    color: var(--text-muted);
  }

  /* TABLE */

  .hub-table {
    margin-top: 60px;
    border-radius: 28px;
    overflow: hidden;

    background: var(--bg-white);
    border: 1px solid var(--border-soft);

    box-shadow:
      0 30px 90px rgba(18,20,22,0.08),
      0 8px 22px rgba(18,20,22,0.06);
  }

  .hub-row {
    display: grid;
    grid-template-columns: 1.4fr 0.7fr 0.7fr 1.4fr 0.7fr 0.7fr;
    align-items: center;
    min-height: 88px;

    border-top: 1px solid var(--border-soft);
    transition: background 0.3s ease;
  }

  .hub-row:first-child {
    border-top: none;
  }

  .hub-row:hover {
    background: rgba(176,141,87,0.05);
  }

  .cell {
    padding: 22px 26px;
  }

  .cell.city {
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
    background-clip: text;
    color: transparent;

    transition: transform 0.35s ease;
  }

  .hub-row:hover .cell.city {
    transform: translateX(4px);
  }

  .cell.time,
  .cell.cost {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    text-align: right;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .hub-row .cell:nth-child(4) {
    border-left: 1px solid var(--border-soft);
  }

  .hub-foot {
    margin-top: 32px;
    text-align: center;
    font-size: 12px;
    letter-spacing: 0.08em;
    color: rgba(18,20,22,0.55);
  }

  /* Responsive */

  @media (max-width: 1024px) {
    .hub-title {
      font-size: 34px;
    }

    .hub-row {
      grid-template-columns: 1.3fr 0.7fr 0.7fr 1.3fr 0.7fr 0.7fr;
    }
  }

  @media (max-width: 720px) {
    .hub-inner {
      padding: 80px 16px;
    }

    .hub-title {
      font-size: 26px;
    }

    .hub-table {
      border-radius: 22px;
    }

    .hub-row {
      grid-template-columns: 1fr 0.7fr 0.7fr;
    }

    .hub-row .cell:nth-child(4) {
      border-left: none;
      border-top: 1px solid var(--border-soft);
    }

    .cell {
      padding: 18px;
    }

    .cell.city {
      font-size: 18px;
    }
  }
</style>