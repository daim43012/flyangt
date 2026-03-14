<section class="crown">
  <div class="crown-header">
    <h2 class="crown-title">Why ANG Crown</h2>
    <p class="crown-subtitle">
      Performance metrics that redefine regional aviation
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
        Fuel consumption comparable to a car.
        Standard 95 octane gasoline.
      </p>
    </div>

    <div class="crown-card">
      <div class="metric">
        <div class="metric-value">2 500+</div>
        <div class="metric-unit">KM</div>
      </div>
      <p class="metric-text">
        Non-stop range. From Cyprus to Barcelona
        without refueling.
      </p>
    </div>
  </div>
</section>

<style>
  .crown {
    padding: 110px 16px 120px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .crown-header {
    text-align: center;
    margin-bottom: 72px;
  }

  .crown-title {
    font-size: 42px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .crown-subtitle {
    margin-top: 14px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .crown-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 34px;
  }

  .crown-card {
    text-align: center;
    padding: 38px 30px 40px;
    border-radius: 26px;

    background: var(--bg-white);
    border: 1px solid var(--border-soft);

    box-shadow:
      0 30px 90px rgba(18,20,22,0.08),
      0 8px 22px rgba(18,20,22,0.06);

    transition:
      transform 0.45s ease,
      box-shadow 0.45s ease,
      border-color 0.45s ease;
  }

  .crown-card:hover {
    transform: translateY(-8px);
    box-shadow:
      0 40px 110px rgba(18,20,22,0.12),
      0 12px 32px rgba(18,20,22,0.08);
    border-color: rgba(176,141,87,0.35);
  }

  .metric {
    display: grid;
    gap: 8px;
    justify-items: center;
  }

  .metric-value {
    font-family: var(--font-heading);
    font-size: 52px;
    font-weight: 600;
    line-height: 1;

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

  .metric-unit {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .metric-text {
    margin: 22px auto 0;
    max-width: 30ch;
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);
  }

  @media (max-width: 1024px) {
    .crown-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .crown {
      padding: 80px 16px 90px;
    }

    .crown-title {
      font-size: 30px;
    }

    .crown-grid {
      grid-template-columns: 1fr;
      gap: 26px;
    }

    .crown-card {
      padding: 30px 24px 32px;
      border-radius: 22px;
    }
  }
</style>