<script lang="ts">
  import { browser } from "$app/environment";
  import { onDestroy } from "svelte";

  export let data: any;

  // целевые значения (SSR)
  $: totals = data?.data?.totals ?? {};
  $: targetAmount = Math.round(totals.totalAmount ?? 0);
  $: targetCompleted = totals.completedCount ?? 0;
  $: totalTasks = totals.totalTasks ?? 5;

  $: targetPct = totalTasks
    ? Math.round((targetCompleted / totalTasks) * 100)
    : 0;

  let shownAmount = 0;
  let shownPct = 0;

  let raf = 0;

  function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateTo(opts: {
    fromAmount: number;
    toAmount: number;
    fromPct: number;
    toPct: number;
    durationMs?: number;
  }) {
    if (!browser) return; 

    const { fromAmount, toAmount, fromPct, toPct, durationMs = 450 } = opts;

    if (raf) cancelAnimationFrame(raf);

    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const e = easeOutCubic(t);

      shownAmount = Math.round(fromAmount + (toAmount - fromAmount) * e);
      shownPct = Math.round(fromPct + (toPct - fromPct) * e);

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
  }

  if (!browser) {
    shownAmount = targetAmount;
    shownPct = targetPct;
  }

  $: if (browser && totals) {
    animateTo({
      fromAmount: shownAmount,
      toAmount: targetAmount,
      fromPct: shownPct,
      toPct: targetPct,
      durationMs: 420
    });
  }

  $: safePct = Math.max(0, Math.min(100, shownPct));

  onDestroy(() => {
    if (browser && raf) cancelAnimationFrame(raf);
  });
</script>

<div class="dash">
  <section class="card">
    <div class="top">
      <div class="left">
        <div class="k">TOTAL EARNED</div>
        <div class="v">
          {shownAmount} <span class="t">ANGT</span>
        </div>
      </div>
    </div>

    <div class="mid">
      <div class="k">Mission Progress</div>
      <div class="meta">{targetCompleted} / {totalTasks} Completed</div>
    </div>

    <div class="bar" aria-label="progress">
      <div
        class="fill"
        style="width: {safePct}%; transition: width 420ms cubic-bezier(.2,.9,.2,1);"
      />
    </div>

    <button class="claim disabled" type="button" disabled>
      Claim Reward →
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

/* убрали glow */
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
  gap: 8px;

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
  letter-spacing: 0.18em;
  text-transform: uppercase;
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

/* BAR */
.bar {
  position: relative;
  height: 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.fill {
  height: 100%;
  border-radius: 999px;

  background: linear-gradient(
    135deg,
    var(--accent-light),
    var(--accent),
    var(--accent-dark)
  );

  box-shadow:
    0 12px 26px rgba(18, 20, 22, 0.10);
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

.claim:not(.disabled):hover {
  transform: translateY(-3px);
  box-shadow:
    0 26px 80px rgba(18, 20, 22, 0.10),
    0 10px 28px rgba(18, 20, 22, 0.06);
  border-color: rgba(176, 141, 87, 0.35);
}

/* keep if used elsewhere */
.green {
  color: rgba(34, 197, 94, 1);
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
