<script lang="ts">
  const endAt = new Date(Date.UTC(2026, 4, 4, 23, 59, 59));

  const statusText = "LIVE";
  const phaseName = "Early Bird";

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
          <div class="k">PRESALE STATUS</div>
          <span class="pill live">{statusText}</span>
        </div>

        <div class="right">
          <div class="k muted">PHASE</div>
          <div class="phase">{phaseName}</div>
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
        Presale ends when the countdown reaches zero
      </div>
    {:else}
      <div class="claim-info ended">
        Presale has ended
      </div>
    {/if}
  </section>
</div>

<style>
.dash {
  width: 100%;
}

.box {
  position: relative;
  border-radius: 26px;
  padding: 22px;

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

.box::before {
  content: none;
}

.claim-info {
  height: 42px;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.02em;

  color: var(--text-muted);
  text-align: center;
}

.claim-info.ended {
  color: rgba(239, 68, 68, 0.8);
}

.top {
  position: relative;
  display: grid;
  gap: 14px;
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
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.k.muted {
  opacity: 0.85;
}

.phase {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text-main);
  line-height: 1.1;
}

.pill {
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  background: rgba(15, 23, 42, 0.02);
  border: 1px solid var(--border-soft);
  color: var(--text-muted);
}

.pill.live {
  background: rgba(34, 197, 94, 0.08);
  border-color: rgba(34, 197, 94, 0.25);
  color: rgba(22, 101, 52, 0.95);
}

/* TIMER */
.timer {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.tbox {
  border-radius: 18px;
  padding: 14px 12px;

  background: var(--bg-white);
  border: 1px solid var(--border-soft);

  box-shadow:
    0 18px 60px rgba(18, 20, 22, 0.06),
    0 6px 18px rgba(18, 20, 22, 0.04);

  display: grid;
  justify-items: center;
  gap: 6px;
}

.num {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--text-main);
  line-height: 1;
}

.unit {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--text-muted);
}

@media (max-width: 980px) {
  .box {
    padding: 16px;
    border-radius: 22px;
    min-height: 0;
  }

  .phase {
    font-size: 18px;
  }

  .num {
    font-size: 24px;
  }

  .tbox {
    border-radius: 16px;
    padding: 12px 10px;
  }
}
</style>
