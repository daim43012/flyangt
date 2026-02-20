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
          {shownAmount} <span class="t">ANG</span>
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
  .card {
    border-radius: 26px;
    padding: 22px 22px 18px;
    overflow: hidden;
    position: relative;

    background: linear-gradient(135deg, rgba(79, 70, 229, 1), rgba(147, 51, 234, 1));
    box-shadow: 0 26px 70px rgba(79, 70, 229, 0.28);

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
.claim {
  height: 42px;
  width: 100%;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-size: 12px;
  font-weight: 950;
  letter-spacing: -0.02em;

  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.85);

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);
  cursor: not-allowed;

  transition:
    filter 0.12s ease,
    transform 0.12s ease;
}

.claim.disabled {
  opacity: 0.55;
}

.claim:not(.disabled):hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

  .top {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    align-items: start;
  }

  .left {
    display: grid;
    gap: 8px;
  }

  .k {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: rgba(255, 255, 255, 0.78);
  }

  .v {
    font-size: 46px;
    font-weight: 950;
    letter-spacing: -0.05em;
    font-style: italic;
    line-height: 1;
    color: white;
    display: inline-flex;
    align-items: baseline;
    gap: 8px;
  }

  .t {
    font-size: 16px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: rgba(255, 255, 255, 0.72);
    font-style: normal;
  }

  .green {
    color: rgba(110, 231, 183, 1);
  }

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
    font-weight: 950;
    letter-spacing: -0.02em;
    color: rgba(255, 255, 255, 0.8);
    white-space: nowrap;
  }

  .bar {
    position: relative;
    height: 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.22);
    overflow: hidden;
  }

  .fill {
    height: 100%;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 10px 22px rgba(255, 255, 255, 0.16);
  }

  @media (max-width: 980px) {
    .card {
      padding: 16px;
      border-radius: 20px;
      min-height: 0;
    }
    .v {
      font-size: 30px;
    }
  }
</style>
