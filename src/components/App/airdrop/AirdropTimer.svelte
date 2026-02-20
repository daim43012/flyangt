<script lang="ts">
  const endAt = new Date(Date.UTC(2026, 3, 25, 23, 59, 59));

  let d = 0;
  let h = 0;
  let m = 0;
  let s = 0;

  let timer: any;
  let isEnded = false;

  function tick() {
    const diff = Math.max(0, endAt.getTime() - Date.now());
    const total = Math.floor(diff / 1000);

    d = Math.floor(total / 86400);
    h = Math.floor((total % 86400) / 3600);
    m = Math.floor((total % 3600) / 60);
    s = total % 60;

    isEnded = diff === 0;
  }

  tick();

  if (typeof window !== "undefined") {
    clearInterval(timer);
    timer = setInterval(tick, 1000);
  }
</script>

<div class="dash">
  <section class="box">
    <div class="top">
      <header class="head">
        <div class="left">
          <div class="k">AIRDROP STATUS</div>
          <span class="pill warn">UPCOMING</span>
        </div>

        <div class="right">
          <div class="k muted">PHASE</div>
          <div class="phase">Seed Epoch</div>
        </div>
      </header>

      <div class="timer">
        <div class="tbox">
          <div class="num">{String(d).padStart(2, "0")}</div>
          <div class="unit">D</div>
        </div>

        <div class="tbox">
          <div class="num">{String(h).padStart(2, "0")}</div>
          <div class="unit">H</div>
        </div>

        <div class="tbox">
          <div class="num">{String(m).padStart(2, "0")}</div>
          <div class="unit">M</div>
        </div>

        <div class="tbox">
          <div class="num">{String(s).padStart(2, "0")}</div>
          <div class="unit">S</div>
        </div>
      </div>
    </div>

    {#if !isEnded}
      <div class="claim-info">
        Rewards will be available after the countdown ends
      </div>
    {:else}
      <!--  -->
    {/if}
  </section>
</div>

<style>
  .box {
    position: relative;
    border-radius: 26px;
    padding: 22px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 22px 60px rgba(15, 23, 42, 0.1),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    height: 100%;
    min-height: 188px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 12px;
  }

  .box::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
        1000px 360px at 18% 0%,
        rgba(37, 99, 235, 0.14),
        transparent 58%
      ),
      radial-gradient(
        900px 320px at 85% 35%,
        rgba(99, 102, 241, 0.12),
        transparent 62%
      );
    pointer-events: none;
  }
  .claim-info {
    height: 42px;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    font-weight: 900;
    letter-spacing: -0.02em;

    color: rgba(15, 23, 42, 0.65);
    text-align: center;
  }

  .top {
    position: relative;
    display: grid;
    gap: 12px;
  }

  .head {
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    align-items: start;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .right {
    text-align: right;
    display: grid;
    gap: 4px;
  }

  .k {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: rgba(15, 23, 42, 0.7);
  }

  .k.muted {
    color: rgba(15, 23, 42, 0.5);
  }

  .phase {
    font-size: 22px;
    font-weight: 950;
    letter-spacing: -0.03em;
    font-style: italic;
    color: #0f172a;
    line-height: 1.1;
  }

  .pill {
    height: 26px;
    padding: 0 12px;
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

  .pill.warn {
    background: rgba(255, 255, 255, 0.92);
    border-color: rgba(245, 158, 11, 0.35);
    color: rgba(161, 98, 7, 0.95);
    box-shadow: 0 10px 24px rgba(245, 158, 11, 0.12);
  }

  .timer {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .tbox {
    border-radius: 16px;
    padding: 14px 12px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow:
      0 16px 36px rgba(15, 23, 42, 0.06),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;

    display: grid;
    justify-items: center;
    gap: 6px;
  }

  .num {
    font-size: 28px;
    font-weight: 950;
    letter-spacing: -0.03em;
    color: #0f172a;
    line-height: 1;
  }

  .unit {
    font-size: 11px;
    font-weight: 950;
    letter-spacing: 0.06em;
    color: rgba(15, 23, 42, 0.55);
  }

  @media (max-width: 980px) {
    .box {
      padding: 16px;
      border-radius: 20px;
      min-height: 0;
    }
    .phase {
      font-size: 18px;
    }
    .num {
      font-size: 24px;
    }
  }
</style>
