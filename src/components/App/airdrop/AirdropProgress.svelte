<div class="dash">
  <section class="card">
    <div class="top">
      <!-- LEFT: only amount (no label) -->
      <div class="earned">
        <div class="big">
          1&nbsp;500 <span class="tok">ANG</span>
        </div>
      </div>

      <!-- RIGHT: claimable -->
      <div class="claimable">
        <div class="k">CLAIMABLE NOW</div>
        <div class="big right">
          <span class="green">1&nbsp;500</span> <span class="tok">ANG</span>
        </div>
      </div>
    </div>

    <!-- CLAIM BOX (as on screenshot) -->
    <div class="claimBox">
      <div class="claimTitle">Claiming Starts Soon</div>
      <div class="claimSub">See Timer</div>
    </div>

    <div class="claimNote">
      Claiming consumes gas (ETH). Make sure you have sufficient funds.
    </div>

    <div class="progress">
      <div class="prow">
        <div class="k2">Mission Progress</div>
        <div class="meta">2 / 4 Completed</div>
      </div>

      <div class="bar" aria-label="progress">
        <div class="fill" style="width: 50%"></div>
      </div>
    </div>
  </section>
</div>

<style>
  .card {
    border-radius: 26px;
    padding: 22px;
    overflow: hidden;
    position: relative;

    background: linear-gradient(135deg, rgba(79, 70, 229, 1), rgba(147, 51, 234, 1));
    box-shadow: 0 26px 70px rgba(79, 70, 229, 0.28);

    /* same visual "mass" as timer card */
    height: 100%;
    min-height: 188px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 12px;
  }

  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(900px 360px at 20% 10%, rgba(255, 255, 255, 0.22), transparent 55%),
      radial-gradient(800px 320px at 90% 40%, rgba(255, 255, 255, 0.14), transparent 60%);
    pointer-events: none;
  }

  .top {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    align-items: start;
  }

  .earned {
    display: grid;
    gap: 6px;
  }

  .claimable {
    display: grid;
    gap: 8px;
    text-align: right;
  }

  .k {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: rgba(255, 255, 255, 0.78);
  }

  .big {
    font-size: 44px;
    font-weight: 950;
    letter-spacing: -0.06em;
    font-style: italic;
    line-height: 1;
    color: white;

    display: inline-flex;
    align-items: baseline;
    gap: 10px;
    white-space: nowrap;
  }

  .big.right {
    justify-content: flex-end;
  }

  .tok {
    font-size: 18px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: rgba(255, 255, 255, 0.72);
    font-style: normal;
  }

  .green {
    color: rgba(110, 231, 183, 1);
  }

  /* Claim box like screenshot */
  .claimBox {
    position: relative;
    border-radius: 16px;
    padding: 14px 16px;
    text-align: center;

    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.22);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
  }

  .claimTitle {
    font-size: 18px;
    font-weight: 950;
    letter-spacing: -0.03em;
    color: rgba(255, 255, 255, 0.92);
  }

  .claimSub {
    margin-top: 2px;
    font-size: 13px;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.65);
  }

  .claimNote {
    position: relative;
    text-align: center;
    font-size: 13px;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.72);
    padding: 0 6px;
  }

  /* Progress */
  .progress {
    position: relative;
    display: grid;
    gap: 8px;
  }

  .prow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .k2 {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: rgba(255, 255, 255, 0.82);
  }

  .meta {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: rgba(255, 255, 255, 0.82);
    white-space: nowrap;
  }

  .bar {
    position: relative;
    height: 12px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.24);
    overflow: hidden;
  }

  .fill {
    height: 100%;
    border-radius: 999px;
    background: rgba(34, 197, 94, 1);
    box-shadow: 0 10px 22px rgba(34, 197, 94, 0.22);
  }

  @media (max-width: 980px) {
    .card {
      padding: 16px;
      border-radius: 20px;
      min-height: 0;
    }

    .big {
      font-size: 38px;
    }

    .tok {
      font-size: 16px;
    }

    .claimTitle {
      font-size: 16px;
    }
  }
</style>
