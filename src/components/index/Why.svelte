<section class="crown">
  <div class="crown-header">
    <h2 class="crown-title">WHY ANG CROWN</h2>
    <p class="crown-subtitle">
      Performance metrics that redefine regional aviation.
    </p>
  </div>

  <div class="crown-grid">
    <div class="crown-card">
      <div class="metric">
        <div class="metric-value">370</div>
        <div class="metric-unit">KM/H</div>
      </div>
      <p class="metric-text">
        Four times faster than a conventional automobile.
      </p>
    </div>

    <div class="crown-card">
      <div class="metric">
        <div class="metric-value">8–10</div>
        <div class="metric-unit">L / 100 KM</div>
      </div>
      <p class="metric-text">
        Fuel consumption comparable to a car. Standard 95 octane gasoline.
      </p>
    </div>

    <div class="crown-card">
      <div class="metric">
        <div class="metric-value">2 500+</div>
        <div class="metric-unit">KM</div>
      </div>
      <p class="metric-text">
        Non-stop range. From Cyprus to Barcelona without refueling.
      </p>
    </div>
  </div>
</section>

<style>
  .crown {
    padding: 72px 16px 96px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .crown-header {
    text-align: center;
    margin-bottom: 56px;
  }

  .crown-title {
    font-size: 36px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    margin: 0;
    color: #0f172a;
  }

  .crown-subtitle {
    margin-top: 6px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  .crown-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 26px;
  }

  .crown-card {
    text-align: center;
    padding: 28px 26px 30px;
    border-radius: 24px;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
    transition:
      transform 0.45s ease,
      box-shadow 0.45s ease,
      border-color 0.45s ease;
  }

  .crown-card:hover {
    transform: translateY(-6px);
    box-shadow:
      0 26px 80px rgba(15, 23, 42, 0.12),
      0 10px 28px rgba(15, 23, 42, 0.08);
  }

  .metric {
    display: grid;
    gap: 6px;
    justify-items: center;
  }

  .metric-value {
    font-size: 46px;
    font-weight: 950;
    font-style: italic;
    line-height: 1;

    background: linear-gradient(90deg, #2563eb, #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .metric-unit {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  .metric-text {
    margin: 18px auto 0;
    max-width: 28ch;
    font-size: 13px;
    line-height: 1.55;
    color: #64748b;
  }

  @media (max-width: 1024px) {
    .crown-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .crown {
      padding: 56px 16px 72px;
    }

    .crown-title {
      font-size: 20px;
      letter-spacing: 0.12em;
    }

    .crown-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .crown-card {
      padding: 24px 22px 26px;
      border-radius: 20px;
    }
  }
</style>
