<section class="hero" id="ecosystem">
  <div class="hero-wrap">
    <div class="hero-badge">
      <span class="hero-dot"></span>
      Unified Aviation Ownership Infrastructure
    </div>

    <h1 class="hero-title">Unified Aviation Ownership Ecosystem</h1>

    <p class="hero-subtitle">
      FlyANGT is a unified ecosystem that combines aircraft ownership, shared
      access, digital management, and tokenized participation — built for the
      European aviation market.
    </p>

    <div class="hero-trust">
      Built with certified aircraft platforms, operational infrastructure, and a
      professional team of aviation engineers, flight consultants, and industry
      partners.
    </div>

    <div class="hero-actions">
      <a class="btn btn-primary" href="#ecosystem">Explore the Ecosystem</a>
      <a class="btn btn-secondary" href="#paths">Choose Your Path</a>
    </div>

    <div class="hero-micro">
      Flying. Ownership. Investment. Participation. One ecosystem.
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    padding: 92px 16px 46px;
    overflow: hidden;
  }

  .hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
        900px 460px at 50% -140px,
        rgba(59, 130, 246, 0.1),
        transparent 62%
      ),
      radial-gradient(
        700px 420px at 18% -120px,
        rgba(15, 23, 42, 0.06),
        transparent 60%
      ),
      radial-gradient(
        700px 420px at 82% -120px,
        rgba(15, 23, 42, 0.06),
        transparent 60%
      );
    pointer-events: none;
  }

  .hero::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 64px;
    width: min(980px, 92vw);
    height: 1px;
    transform: translateX(-50%);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(15, 23, 42, 0.08),
      transparent
    );
    pointer-events: none;
  }

  .hero-wrap {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }

  .hero-badge {
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

  .hero-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: rgba(59, 130, 246, 0.95);
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.14);
  }

  .hero-title {
    margin: 0;
    font-size: 58px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    color: #0f172a;
    line-height: 1.03;
  }

  .hero-subtitle {
    max-width: 880px;
    margin: 18px auto 0;
    font-size: 16px;
    line-height: 1.7;
    color: #64748b;
  }

  .hero-trust {
    max-width: 920px;
    margin: 18px auto 0;
    padding: 12px 18px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.06);
    color: #475569;
    font-size: 13px;
    line-height: 1.6;
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.06),
      0 6px 18px rgba(15, 23, 42, 0.04);
  }

  .hero-actions {
    margin-top: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .hero-micro {
    margin-top: 14px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  @media (max-width: 1024px) {
    .hero {
      padding: 76px 16px 40px;
    }

    .hero-title {
      font-size: 44px;
    }
  }

  @media (max-width: 640px) {
    .hero {
      padding: 58px 16px 34px;
    }

    .hero-badge {
      padding: 9px 14px;
      letter-spacing: 0.18em;
    }

    .hero-title {
      font-size: 28px;
      letter-spacing: -0.02em;
    }

    .hero-subtitle {
      font-size: 14px;
    }

    .hero-trust {
      border-radius: 18px;
      padding: 12px 14px;
    }

    .hero-actions {
      gap: 10px;
    }
  }
</style>
