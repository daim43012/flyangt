<section class="roadmap">
  <div class="roadmap-header">
    <h2 class="roadmap-title">ROADMAP</h2>
    <p class="roadmap-subtitle">A flight path from launch to scale.</p>
  </div>

  <div class="timeline">
    <div class="vline" aria-hidden="true"></div>

    <!-- 1 -->
    <div class="item left y0">
      <div class="pin done" aria-hidden="true"></div>
      <div class="hlink done" aria-hidden="true"></div>

      <div class="card done">
        <div class="top">
          <div class="icon">✈️</div>
          <div class="head">
            <h3>AIRCRAFT VISUALIZATION</h3>
            <p>Interactive aircraft view and key specs inside the platform.</p>
          </div>
          <span class="badge done">completed</span>
        </div>
      </div>
    </div>

    <!-- 2 -->
    <div class="item right y1">
      <div class="pin done" aria-hidden="true"></div>
      <div class="hlink done" aria-hidden="true"></div>

      <div class="card done">
        <div class="top">
          <div class="icon">🧩</div>
          <div class="head">
            <h3>CONFIGURATOR</h3>
            <p>Pick aircraft, package, and ownership model — ready-to-use flow.</p>
          </div>
          <span class="badge done">completed</span>
        </div>
      </div>
    </div>

    <!-- 3 -->
    <div class="item left y2">
      <div class="pin done" aria-hidden="true"></div>
      <div class="hlink done" aria-hidden="true"></div>

      <div class="card done">
        <div class="top">
          <div class="icon">🪙</div>
          <div class="head">
            <h3>TOKEN &amp; REWARDS</h3>
            <p>On-chain token utility, perks, and reward loops across the ecosystem.</p>
          </div>
          <span class="badge done">completed</span>
        </div>
      </div>
    </div>

    <!-- 4 -->
    <div class="item right y3">
      <div class="pin done" aria-hidden="true"></div>
      <div class="hlink done" aria-hidden="true"></div>

      <div class="card done">
        <div class="top">
          <div class="icon">🧑‍✈️</div>
          <div class="head">
            <h3>ADVISOR / SUPPORT</h3>
            <p>Human guidance and support layer for onboarding and operations.</p>
          </div>
          <span class="badge done">completed</span>
        </div>
      </div>
    </div>

    <!-- 5 -->
    <div class="item left y4">
      <div class="pin planned" aria-hidden="true"></div>
      <div class="hlink planned" aria-hidden="true"></div>

      <div class="card planned">
        <div class="top">
          <div class="icon">🖨️</div>
          <div class="head">
            <h3>3D PRINTED MODELS FOR HOLDERS</h3>
            <p>Physical limited models shipped to holders as collectible rewards.</p>
          </div>
          <span class="badge planned">planned</span>
        </div>
      </div>
    </div>

    <!-- 6 -->
    <div class="item right y5">
      <div class="pin planned" aria-hidden="true"></div>
      <div class="hlink planned" aria-hidden="true"></div>

      <div class="card planned">
        <div class="top">
          <div class="icon">📱</div>
          <div class="head">
            <h3>MOBILE APPLICATION</h3>
            <p>Mobile access for portfolio, missions, rewards, and flight actions.</p>
          </div>
          <span class="badge planned">planned</span>
        </div>
      </div>
    </div>

    <!-- 7 -->
    <div class="item left y6">
      <div class="pin planned" aria-hidden="true"></div>
      <div class="hlink planned" aria-hidden="true"></div>

      <div class="card planned">
        <div class="top">
          <div class="icon">🛡️</div>
          <div class="head">
            <h3>GOVERNANCE / TRUST</h3>
            <p>Transparent rules, audits, trust mechanisms, and community decisions.</p>
          </div>
          <span class="badge planned">planned</span>
        </div>
      </div>
    </div>

    <!-- 8 -->
    <div class="item right y7">
      <div class="pin planned" aria-hidden="true"></div>
      <div class="hlink planned" aria-hidden="true"></div>

      <div class="card planned">
        <div class="top">
          <div class="icon">🌍</div>
          <div class="head">
            <h3>SCALING</h3>
            <p>More aircraft, more regions, more partners — faster deployment.</p>
          </div>
          <span class="badge planned">planned</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .roadmap {
    padding: 72px 16px 110px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .roadmap-header {
    text-align: center;
    margin-bottom: 56px;
  }

  .roadmap-title {
    font-size: 36px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    margin: 0;
    color: #0f172a;
  }

  .roadmap-subtitle {
    margin-top: 6px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  .timeline {
    position: relative;
    max-width: 980px;
    margin: 0 auto;
    height: 1120px;
  }

  .vline {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 6px;
    transform: translateX(-50%);
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.10);
    box-shadow:
      0 0 0 1px rgba(15, 23, 42, 0.06),
      0 14px 40px rgba(15, 23, 42, 0.10);
  }

  .item {
    position: absolute;
    left: 0;
    right: 0;
    height: 0;
    --cardW: min(440px, 44vw);
  }

  .y0 { top: 0px; }
  .y1 { top: 140px; }
  .y2 { top: 280px; }
  .y3 { top: 420px; }
  .y4 { top: 560px; }
  .y5 { top: 700px; }
  .y6 { top: 840px; }
  .y7 { top: 980px; }

  .card {
    position: absolute;
    top: 0;
    width: var(--cardW);
    padding: 22px;
    border-radius: 24px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
  }

  .item.left .card  { left: 0; }
  .item.right .card { right: 0; }

  .pin {
    position: absolute;
    left: 50%;
    top: 22px;
    width: 14px;
    height: 14px;
    transform: translateX(-50%);
    border-radius: 999px;
    background: #fff;
    border: 2px solid rgba(15, 23, 42, 0.22);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
    z-index: 3;
  }

  .hlink {
    position: absolute;
    top: 29px;
    height: 2px;
    border-radius: 999px;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
    z-index: 2;
  }

  .item.left .hlink {
    right: calc(50% + 7px);
    width: calc(50% - var(--cardW) - 7px);
  }

  .item.right .hlink {
    left: calc(50% + 7px);
    width: calc(50% - var(--cardW) - 7px);
  }

  .pin.done { border-color: rgba(22, 163, 74, 0.55); }
  .hlink.done { background: rgba(22, 163, 74, 0.30); }

  .pin.planned { border-color: rgba(15, 23, 42, 0.22); }
  .hlink.planned { background: rgba(15, 23, 42, 0.14); }

  .top {
    display: grid;
    grid-template-columns: 42px 1fr auto;
    gap: 14px;
    align-items: start;
  }

  .icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: rgba(15, 23, 42, 0.04);
    display: grid;
    place-items: center;
    font-size: 20px;
  }

  .head h3 {
    margin: 2px 0 8px;
    font-size: 16px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .head p {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: #64748b;
  }

  .badge {
    margin-top: 2px;
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    color: #0f172a;
    background: rgba(15, 23, 42, 0.03);
    white-space: nowrap;
  }

  .badge.done {
    border-color: rgba(22, 163, 74, 0.35);
    background: rgba(22, 163, 74, 0.16);
    color: #14532d;
  }

  .badge.planned {
    border-color: rgba(15, 23, 42, 0.14);
    background: rgba(15, 23, 42, 0.06);
    color: rgba(15, 23, 42, 0.78);
  }

  /* =========================
     MOBILE: fixed heights + fixed gaps + clamps
     ========================= */
  @media (max-width: 720px) {
    .roadmap {
      padding: 56px 14px 72px;
    }

    .roadmap-title {
      font-size: 22px;
      letter-spacing: 0.10em;
    }

    /* fixed rhythm */
    .timeline {
      --stepY: 150px;    /* одинаковое расстояние между карточками */
      --cardH: 124px;    /* одинаковая высота карточек */
      height: calc(var(--stepY) * 8 + 20px);
    }

    /* left rail */
    .vline {
      left: 18px;
      transform: none;
    }

    /* stack */
    .item {
      --cardW: calc(100% - 58px);
    }

    .y0 { top: calc(var(--stepY) * 0); }
    .y1 { top: calc(var(--stepY) * 1); }
    .y2 { top: calc(var(--stepY) * 2); }
    .y3 { top: calc(var(--stepY) * 3); }
    .y4 { top: calc(var(--stepY) * 4); }
    .y5 { top: calc(var(--stepY) * 5); }
    .y6 { top: calc(var(--stepY) * 6); }
    .y7 { top: calc(var(--stepY) * 7); }

    .card {
      left: 46px !important;
      right: auto !important;
      width: var(--cardW);
      height: var(--cardH);     /* ВОТ ЭТО фиксирует высоту */
      padding: 16px;
      border-radius: 22px;
      overflow: hidden;         /* чтобы ничего не ломало высоту */
    }

    /* pin in vertical center of the fixed-height card */
    .pin {
      left: 18px;
      top: calc((var(--cardH) / 2) - 7px); /* 7px = half of 14px pin */
      transform: translateX(-50%);
    }

    /* short connector aligned with pin center */
    .hlink {
      left: 24px !important;
      right: auto !important;
      width: 18px !important;
      top: calc((var(--cardH) / 2));
    }

    /* content clamp to keep card height stable */
    .head h3 {
      font-size: 14px;
      line-height: 1.15;
      margin: 0 0 6px;
      display: -webkit-box;
      -webkit-line-clamp: 2;     /* максимум 2 строки заголовок */
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .head p {
      font-size: 12.5px;
      line-height: 1.45;
      display: -webkit-box;
      -webkit-line-clamp: 2;     /* максимум 2 строки описание */
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* tighter layout inside fixed card */
    .top {
      grid-template-columns: 38px 1fr auto;
      gap: 12px;
      align-items: start;
    }

    .icon {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      font-size: 18px;
    }

    .badge {
      font-size: 9px;
      padding: 7px 10px;
      letter-spacing: 0.18em;
    }
  }
</style>
