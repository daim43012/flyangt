<div class="dash">
  <section class="box">
    <header class="head">
      <h2 class="title">TERMS</h2>
      <p class="sub">
        Simple rules. Predictable outcome. No hidden complexity.
      </p>
    </header>

    <div class="grid">
      <article class="card">
        <div class="icon">🔒</div>
        <div class="meta">
          <h3>Lock period</h3>
          <p>180 days fixed</p>
        </div>
        <span class="pill">Fixed</span>
      </article>

      <article class="card">
        <div class="icon">💸</div>
        <div class="meta">
          <h3>Rewards</h3>
          <p>Paid monthly</p>
        </div>
        <span class="pill">Monthly</span>
      </article>

      <article class="card">
        <div class="icon">🔓</div>
        <div class="meta">
          <h3>Unlock</h3>
          <p>Full amount after lock ends</p>
        </div>
        <span class="pill">180D</span>
      </article>
    </div>
  </section>
</div>

<style>

  .box {
    position: relative;
    border-radius: 26px;
    padding: 26px;
    overflow: hidden;

    background: white;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 22px 60px rgba(15, 23, 42, 0.1),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;

    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .box::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
        1100px 360px at 20% 0%,
        rgba(15, 23, 42, 0.06),
        transparent 58%
      ),
      radial-gradient(
        900px 320px at 85% 25%,
        rgba(15, 23, 42, 0.05),
        transparent 62%
      );
    pointer-events: none;
  }

  .head {
    position: relative;
    display: grid;
    gap: 6px;
    margin-bottom: 14px;
    max-width: 760px;
  }

  .title {
    margin: 0;
    font-size: 18px;
    font-weight: 950;
    letter-spacing: -0.03em;
    font-style: italic;
    color: #0f172a;
  }

  .sub {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: rgba(15, 23, 42, 0.65);
  }

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
      margin-top: 6px;

  }

  .card {
    position: relative;
    border-radius: 18px;
    padding: 16px;

    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow:
      0 18px 40px rgba(15, 23, 42, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.8) inset;

    display: grid;
    grid-template-columns: 36px 1fr auto;
    align-items: center;
    gap: 12px;

    transition:
      transform 0.12s ease,
      border-color 0.12s ease,
      filter 0.12s ease;
  }

  .card:hover {
    transform: translateY(-1px);
    border-color: rgba(15, 23, 42, 0.12);
    filter: brightness(1.02);
  }

  .icon {
    height: 36px;
    width: 36px;
    display: grid;
    place-items: center;
    border-radius: 12px;

    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);

    font-size: 16px;
  }

  .meta h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .meta p {
    margin: 4px 0 0;
    font-size: 12px;
    color: rgba(15, 23, 42, 0.62);
  }

  .pill {
    height: 26px;
    padding: 0 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 950;
    letter-spacing: -0.02em;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(15, 23, 42, 0.1);
    color: rgba(15, 23, 42, 0.85);
  }

  @media (max-width: 980px) {
    .dash {
      padding: 0 14px 14px;
    }
    .box {
      padding: 16px;
      border-radius: 20px;
    }
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
