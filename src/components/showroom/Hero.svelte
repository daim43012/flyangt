<section class="howHero" id="how">
  <div class="howHero-wrap">
    <div class="howHero-badge">
      <span class="howHero-dot"></span>
      Process Overview
    </div>

    <h2 class="howHero-title">HOW IT WORKS</h2>

    <p class="howHero-subtitle">How the FlyANGT Ecosystem Operates How It Works</p>

    <div class="howHero-trust">
      FlyANGT is designed as a structured aviation ecosystem where aircraft, operations, digital
      tools, and participation models are connected through clear processes and professional
      oversight.
    </div>

    <div class="howHero-rail" aria-label="Process steps">
      <div class="howHero-line"></div>

      <div class="howHero-steps">
        <div class="howHero-step">
          <span class="howHero-node"></span>
          <span class="howHero-label">Model</span>
        </div>
        <div class="howHero-step">
          <span class="howHero-node"></span>
          <span class="howHero-label">Ownership</span>
        </div>
        <div class="howHero-step">
          <span class="howHero-node"></span>
          <span class="howHero-label">Configurator</span>
        </div>
        <div class="howHero-step">
          <span class="howHero-node"></span>
          <span class="howHero-label">Compliance</span>
        </div>
        <div class="howHero-step">
          <span class="howHero-node isActive"></span>
          <span class="howHero-label isActive">Flight</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .howHero {
    position: relative;
    padding: 84px 16px 56px;
    overflow: hidden;
  }

  .howHero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(900px 460px at 50% -140px, rgba(59, 130, 246, 0.1), transparent 62%),
      radial-gradient(700px 420px at 18% -120px, rgba(15, 23, 42, 0.06), transparent 60%),
      radial-gradient(700px 420px at 82% -120px, rgba(15, 23, 42, 0.06), transparent 60%);
    pointer-events: none;
  }

  .howHero::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 64px;
    width: min(980px, 92vw);
    height: 1px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, transparent, rgba(15, 23, 42, 0.08), transparent);
    pointer-events: none;
  }

  .howHero-wrap {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }

  .howHero-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.08);
    font-size: 11px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 18px;
  }

  .howHero-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: rgba(59, 130, 246, 0.95);
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.14);
  }

  .howHero-title {
    margin: 0;
    font-size: 46px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    color: #0f172a;
    line-height: 1.05;
  }

  .howHero-subtitle {
    max-width: 880px;
    margin: 12px auto 0;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  .howHero-trust {
    max-width: 920px;
    margin: 18px auto 0;
    padding: 12px 18px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.06);
    color: #475569;
    font-size: 13px;
    line-height: 1.6;
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.06), 0 6px 18px rgba(15, 23, 42, 0.04);
  }

  .howHero-rail {
    position: relative;
    max-width: 820px;
    margin: 26px auto 0;
    padding: 18px 18px 16px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.06), 0 6px 18px rgba(15, 23, 42, 0.04);
  }

  .howHero-line {
    position: absolute;
    left: 36px;
    right: 36px;
    top: 30px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(15, 23, 42, 0.14), transparent);
  }

  .howHero-steps {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    align-items: start;
  }

  .howHero-step {
    display: grid;
    gap: 10px;
    justify-items: center;
  }

  .howHero-node {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.18);
    box-shadow: 0 0 0 6px rgba(15, 23, 42, 0.06);
  }

  .howHero-node.isActive {
    background: rgba(59, 130, 246, 0.95);
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.14);
  }

  .howHero-label {
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #64748b;
  }

  .howHero-label.isActive {
    color: #0f172a;
    font-weight: 800;
  }

  @media (max-width: 1024px) {
    .howHero {
      padding: 72px 16px 52px;
    }
    .howHero-title {
      font-size: 38px;
    }
  }

  @media (max-width: 640px) {
    .howHero {
      padding: 56px 16px 44px;
    }
    .howHero-title {
      font-size: 26px;
      letter-spacing: -0.02em;
    }
    .howHero-trust {
      border-radius: 18px;
      padding: 12px 14px;
    }
    .howHero-rail {
      padding: 16px 14px 14px;
      border-radius: 18px;
    }
    .howHero-line {
      left: 18px;
      right: 18px;
    }
    .howHero-label {
      letter-spacing: 0.16em;
      font-size: 10px;
    }
  }
</style>
