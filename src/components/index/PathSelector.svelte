<section class="paths">
  <div class="paths-header">
    <h2 class="paths-title">DEFINE YOUR PATH</h2>
    <p class="paths-subtitle">
      Select your primary engagement model within the ecosystem.
    </p>
  </div>

  <div class="paths-grid">
    <button class="path-card">
      <div class="path-icon">✈️</div>
      <h3>I WANT TO FLY</h3>
      <p>
        Fly using charter flights or owned aircraft, with flexible payment
        options and access.
      </p>
    </button>

    <button class="path-card">
      <div class="path-icon">👥</div>
      <h3>I WANT TO FLY TOGETHER</h3>
      <p>
        Join a flying club or shared ownership structure to access aircraft
        collectively.
      </p>
    </button>

    <button class="path-card">
      <div class="path-icon">📈</div>
      <h3>I WANT TO EARN</h3>
      <p>
        Earn income from aircraft operations, rentals, staking, and partner
        pools.
      </p>
    </button>

    <button class="path-card">
      <div class="path-icon">🔑</div>
      <h3>I WANT TO OWN</h3>
      <p>
        Own an aircraft fully or fractionally — for personal use or as a
        business asset.
      </p>
    </button>

    <button class="path-card">
      <div class="path-icon">💼</div>
      <h3>I WANT TO INVEST</h3>
      <p>
        Participate as an investor through presales, pools, or asset-backed
        structures.
      </p>
    </button>

    <button class="path-card">
      <div class="path-icon">⚙️</div>
      <h3>I WANT TO PARTNER</h3>
      <p>
        Join the ecosystem as an operator, advisor, manager, or strategic
        partner.
      </p>
    </button>
  </div>
</section>

<style>
  /* === SECTION === */

  .paths {
    padding: 72px 16px 96px;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* === HEADER === */

  .paths-header {
    text-align: center;
    margin-bottom: 56px;
  }

  .paths-title {
    font-size: 36px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    margin: 0;
    color: #0f172a;
  }

  .paths-subtitle {
    margin-top: 6px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  /* === GRID === */

  .paths-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 26px;
  }

  /* === CARD === */

  .path-card {
    text-align: left;
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
    cursor: pointer;
  }

  .path-card:hover {
    transform: translateY(-6px);
    box-shadow:
      0 26px 80px rgba(15, 23, 42, 0.12),
      0 10px 28px rgba(15, 23, 42, 0.08);
  }

  /* === ICON === */

  .path-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: rgba(15, 23, 42, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  /* === TEXT === */

  .path-card h3 {
    margin: 16px 0 10px;
    font-size: 18px;
    font-weight: 800;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .path-card p {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: #64748b;
  }

  /* === RESPONSIVE === */

  @media (max-width: 1024px) {
    .paths-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .paths {
      padding: 56px 16px 72px;
    }

    .paths-title {
      font-size: 20px;
      letter-spacing: 0.12em;
    }

    .paths-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .path-card {
      padding: 24px 22px 26px;
      border-radius: 20px;
    }
  }
</style>
