<section class="paths" id="paths">
  <div class="paths-header">
    <h2 class="paths-title">Define your path</h2>
    <p class="paths-subtitle">
      Select your primary engagement model within the ecosystem
    </p>
  </div>
  <div class="paths-grid">
    <a class="path-card" href="/configurator">
      <div class="path-icon">✈️</div>
      <h3>I want to fly</h3>
      <p>
        Fly using charter flights or owned aircraft, with flexible payment
        options and access.
      </p>
    </a>

    <a class="path-card" href="/app/dashboard">
      <div class="path-icon">📈</div>
      <h3>I want to earn</h3>
      <p>
        Earn income from aircraft operations, rentals, staking, and partner
        pools.
      </p>
    </a>

    <a class="path-card" href="/app/dashboard">
      <div class="path-icon">💼</div>
      <h3>I want to invest</h3>
      <p>
        Participate as an investor through presales, pools, or asset backed
        structures.
      </p>
    </a>

    <a class="path-card" href="/partner">
      <div class="path-icon">⚙️</div>
      <h3>I want to partner</h3>
      <p>
        Join the ecosystem as an operator, advisor, manager, or strategic
        partner.
      </p>
    </a>
  </div>
</section>

<style>
  .paths {
    padding: 120px 16px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .paths-header {
    text-align: center;
    margin-bottom: 70px;
  }

  .paths-title {
    font-size: 44px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .paths-subtitle {
    margin-top: 14px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .paths-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  .path-card {
    appearance: none;
    border: 1px solid var(--border-soft);
    background: var(--bg-white);

    border-radius: 26px;
    padding: 30px 28px 32px;
    text-align: left;

    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);

    cursor: pointer;

    transition:
      transform 0.45s ease,
      box-shadow 0.45s ease,
      border-color 0.45s ease,
      background 0.45s ease;
  }

  .path-card:hover {
    transform: translateY(-8px);
    box-shadow:
      0 40px 120px rgba(18, 20, 22, 0.12),
      0 12px 34px rgba(18, 20, 22, 0.08);
    border-color: rgba(176, 141, 87, 0.3);
  }

  .path-card:focus-visible {
    outline: none;
    border-color: rgba(176, 141, 87, 0.38);
    box-shadow:
      0 40px 120px rgba(18, 20, 22, 0.12),
      0 12px 34px rgba(18, 20, 22, 0.08),
      0 0 0 10px rgba(176, 141, 87, 0.12);
  }

  .path-icon {
    width: 46px;
    height: 46px;
    border-radius: 16px;

    display: grid;
    place-items: center;
    font-size: 20px;

    border: 1px solid rgba(176, 141, 87, 0.22);
    background: radial-gradient(
      120% 160% at 15% 10%,
      rgba(255, 255, 255, 0.9),
      rgba(230, 210, 168, 0.4)
    );

    box-shadow:
      0 16px 40px rgba(18, 20, 22, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .path-card h3 {
    margin: 18px 0 10px;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.2;
    color: var(--text-main);
  }

  .path-card p {
    margin: 0;
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);
  }

  @media (max-width: 1024px) {
    .paths-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .paths {
      padding: 80px 16px;
    }

    .paths-title {
      font-size: 30px;
    }

    .paths-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .path-card {
      padding: 26px 22px 28px;
      border-radius: 22px;
    }
  }
</style>
