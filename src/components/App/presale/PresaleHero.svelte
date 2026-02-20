<script lang="ts">
  import { browser } from "$app/environment";
  import { onDestroy } from "svelte";

  // MOCK DATA (без export, всё внутри)
  const totalTokens = 5_000_000;
  const soldTokensTarget = 2_850_000; // чуть больше половины
  const whitepaperUrl = "/whitepaper"; // поменяй на реальную ссылку при необходимости

  const targetPct = Math.round((soldTokensTarget / totalTokens) * 100);

  let shownSold = 0;
  let shownPct = 0;

  let raf = 0;

  function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateTo(opts: {
    fromSold: number;
    toSold: number;
    fromPct: number;
    toPct: number;
    durationMs?: number;
  }) {
    if (!browser) return;

    const { fromSold, toSold, fromPct, toPct, durationMs = 450 } = opts;

    if (raf) cancelAnimationFrame(raf);

    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const e = easeOutCubic(t);

      shownSold = Math.round(fromSold + (toSold - fromSold) * e);
      shownPct = Math.round(fromPct + (toPct - fromPct) * e);

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
  }

  // SSR fallback
  if (!browser) {
    shownSold = soldTokensTarget;
    shownPct = targetPct;
  }

  // Animate on client
  $: if (browser) {
    animateTo({
      fromSold: shownSold,
      toSold: soldTokensTarget,
      fromPct: shownPct,
      toPct: targetPct,
      durationMs: 520
    });
  }

  $: safePct = Math.max(0, Math.min(100, shownPct));

  function fmt(n: number) {
    return n.toLocaleString("en-US");
  }

  onDestroy(() => {
    if (browser && raf) cancelAnimationFrame(raf);
  });
</script>

<div class="dash">
  <section class="card">
    <div class="top">
      <div class="left">
        <div class="k">PRESALE FILLED</div>
        <div class="v">
          {safePct}% <span class="t">of cap</span>
        </div>
      </div>
    </div>

    <div class="mid">
      <div class="k">Presale Progress</div>
      <div class="meta">{fmt(shownSold)} / {fmt(totalTokens)} Tokens</div>
    </div>

    <div class="bar" aria-label="presale progress">
      <div
        class="fill"
        style="width: {safePct}%; transition: width 520ms cubic-bezier(.2,.9,.2,1);"
      />
    </div>

    <a class="btn" href={whitepaperUrl} target="_blank" rel="noreferrer">
      Read Whitepaper
    </a>
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

  /* Button like твоих pill-кнопок */
  .btn {
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
  

  .btn:hover {
    transform: translateY(-1px);
    filter: brightness(1.06);
  }

  .btn:active {
    transform: translateY(0px);
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
