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
    border-radius: 20px;
    padding: 26px;
    overflow: hidden;

    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
  }

  .box::before {
    content: none;
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
    font-weight: 600;
    font-family: var(--font-heading);
    letter-spacing: -0.03em;
    color: var(--text-main);
  }

  .sub {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: var(--text-muted);
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
    border-radius: 16px;
    padding: 16px;

    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.06),
      0 6px 18px rgba(18, 20, 22, 0.04);

    display: grid;
    grid-template-columns: 36px 1fr auto;
    align-items: center;
    gap: 12px;

    transition:
      transform 0.12s ease,
      border-color 0.12s ease;
  }

  .card:hover {
    transform: translateY(-1px);
    border-color: rgba(176, 141, 87, 0.22);
  }

  .icon {
    height: 36px;
    width: 36px;
    display: grid;
    place-items: center;
    border-radius: 12px;

    background: rgba(176, 141, 87, 0.08);
    border: 1px solid rgba(176, 141, 87, 0.22);

    font-size: 16px;
  }

  .meta h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    font-family: var(--font-heading);
    letter-spacing: -0.02em;
    color: var(--text-main);
  }

  .meta p {
    margin: 4px 0 0;
    font-size: 12px;
    color: var(--text-muted);
  }

  .pill {
    height: 26px;
    padding: 0 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    background: rgba(176, 141, 87, 0.08);
    border: 1px solid rgba(176, 141, 87, 0.22);
    color: var(--accent-dark);
  }

  @media (max-width: 980px) {
    .box {
      padding: 16px;
      border-radius: 20px;
    }
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
