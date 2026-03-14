<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount, onDestroy } from "svelte";

  const GOAL = 50_000_000;

  let dbTokens = 0;
  let onchainTokens = 0;
  let shownSold = 0;
  let shownPct = 0;

  let raf = 0;

  function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  function update() {
    const total = dbTokens + onchainTokens;
    const pct = Math.round((total / GOAL) * 100);

    if (!browser) return;

    const fromSold = shownSold;
    const fromPct = shownPct;

    if (raf) cancelAnimationFrame(raf);
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 520);
      const e = easeOutCubic(t);
      shownSold = Math.round(fromSold + (total - fromSold) * e);
      shownPct = Math.round(fromPct + (pct - fromPct) * e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
  }

  async function fetchDbProgress() {
    try {
      const res = await fetch("/api/presale/progress");
      if (!res.ok) return;
      const resp = await res.json();
      dbTokens = resp.dbTokens ?? 0;
      onchainTokens = resp.onchainTokens ?? 0;
    } catch {
      // silent
    } finally {
      update();
    }
  }

  onMount(() => {
    fetchDbProgress();
  });

  $: safePct = Math.max(0, Math.min(100, shownPct));

  function fmt(n: number) {
    return n.toLocaleString("en-US");
  }

  onDestroy(() => {
    if (browser && raf) cancelAnimationFrame(raf);
  });
</script>

<section class="card">
  <header class="header">
    <div class="kicker">PRESALE PROGRESS</div>
    <div class="title">ANGT Token Presale</div>
  </header>

  <div class="pct-row">
    <span class="pct-value">{safePct}%</span>
    <span class="pct-label">filled</span>
  </div>

  <div class="progress-wrap">
    <div class="progress-bar">
      <div
        class="progress-fill"
        style="width: {safePct}%; transition: width 520ms cubic-bezier(.2,.9,.2,1);"
      ></div>
    </div>

    <div class="progress-meta">
      <span>{fmt(shownSold)} ANGT</span>
      <span>{fmt(GOAL)} ANGT</span>
    </div>
  </div>

  <a class="link" href="/app/presale">
    Go to Presale
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </a>
</section>

<style>
  .card {
    border-radius: 20px;
    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    padding: 16px;
  }

  .header {
    margin-bottom: 10px;
  }

  .kicker {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: var(--text-muted);
  }

  .title {
    margin-top: 4px;
    font-size: 16px;
    font-weight: 600;
    font-family: var(--font-heading);
    color: var(--text-main);
  }

  .pct-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-bottom: 10px;
  }

  .pct-value {
    font-family: var(--font-heading);
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1;
    background: linear-gradient(135deg, var(--accent-light), var(--accent), var(--accent-dark));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .pct-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .progress-wrap {
    margin-top: 4px;
  }

  .progress-bar {
    height: 10px;
    border-radius: 999px;
    background: rgba(18, 20, 22, 0.06);
    overflow: hidden;
    border: 1px solid rgba(18, 20, 22, 0.06);
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(135deg, var(--accent-light), var(--accent), var(--accent-dark));
    border-radius: 999px;
    box-shadow: 0 12px 26px rgba(18, 20, 22, 0.10);
  }

  .progress-meta {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
  }

  .link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    font-size: 13px;
    font-weight: 600;
    color: var(--accent);
    text-decoration: none;
    transition: gap 0.35s ease;
  }

  .link:hover {
    gap: 10px;
  }
</style>
