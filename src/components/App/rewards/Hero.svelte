<div class="dash">
  <section class="card">
    <div class="top">
      <div class="left">
        <div class="k">ANNUAL YIELD</div>
        <div class="v">
          12<span class="t">% APY</span>
        </div>
      </div>
    </div>

    <div class="mid">
      <div class="k">Staking Terms</div>
      <div class="meta">Fixed · Monthly rewards</div>
    </div>

    <div class="desc">
      Your tokens accumulate yield continuously. Staking rewards and
      withdrawal activate immediately after the ANGT token listing.
    </div>

    <button class="claim disabled" type="button" disabled>
      Withdraw Rewards →
    </button>
  </section>
</div>

<style>
  .dash {
    width: 100%;
  }

  .card {
    position: relative;
    border-radius: 26px;
    padding: 22px 22px 18px;

    background: var(--bg-white);
    border: 1px solid var(--border-soft);

    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);

    height: 100%;
    min-height: 188px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 12px;
  }

  .card::before {
    content: none;
  }

  /* TOP */
  .top {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    align-items: start;
  }

  .left {
    display: grid;
    gap: 10px;
  }

  .k {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  /* VALUE */
  .v {
    font-family: var(--font-heading);
    font-size: 46px;
    font-weight: 600;
    letter-spacing: -0.05em;
    line-height: 1;

    display: inline-flex;
    align-items: baseline;
    gap: 6px;

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

  .t {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    -webkit-text-fill-color: var(--text-muted);
    color: var(--text-muted);
  }

  /* MID */
  .mid {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 6px;
  }

  .meta {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    white-space: nowrap;
  }

  /* DESC */
  .desc {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.55;
    color: var(--text-muted);
    letter-spacing: -0.01em;
  }

  /* CLAIM */
  .claim {
    height: 42px;
    width: 100%;
    border-radius: 999px;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    font-size: 13px;
    font-weight: 600;

    border: 1px solid var(--border-soft);
    background: rgba(15, 23, 42, 0.02);
    color: var(--text-muted);

    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.06),
      0 6px 18px rgba(18, 20, 22, 0.04);

    cursor: not-allowed;

    transition:
      transform 0.45s ease,
      box-shadow 0.45s ease,
      border-color 0.45s ease;
  }

  .claim.disabled {
    opacity: 0.6;
  }

  @media (max-width: 980px) {
    .card {
      padding: 16px;
      border-radius: 22px;
      min-height: 0;
    }

    .v {
      font-size: 30px;
    }

    .t {
      font-size: 12px;
    }
  }
</style>
