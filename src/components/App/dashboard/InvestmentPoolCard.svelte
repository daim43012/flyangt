<script lang="ts">
  const pool = {
    name: "Aircraft Leasing Pool A",
    filledPct: 72,
    raised: 7.2,
    target: 10
  };
</script>

<section class="card">
  <header class="header">
    <div class="kicker">INVESTMENT POOL</div>
    <div class="title">{pool.name}</div>
  </header>

  <div class="progress-wrap">
    <div class="progress-bar">
      <div
        class="progress-fill"
        style="width: {pool.filledPct}%"
      ></div>
    </div>

    <div class="progress-meta">
      <span>{pool.filledPct}% filled</span>
      <span>${pool.raised}M / ${pool.target}M</span>
    </div>
  </div>

  <div class="hint">
    Pool is actively funding aircraft acquisition and leasing operations.
  </div>
</section>

<style>
  .card {
    border-radius: 22px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: #fff;
    box-shadow:
      0 18px 40px rgba(15, 23, 42, 0.08),
      0 6px 14px rgba(15, 23, 42, 0.05);
    padding: 16px;
  }

  .header {
    margin-bottom: 14px;
  }

  .kicker {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.12em;
    color: rgba(15, 23, 42, 0.45);
  }

  .title {
    margin-top: 4px;
    font-size: 16px;
    font-weight: 950;
    color: rgba(15, 23, 42, 0.95);
  }

  .progress-wrap {
    margin-top: 10px;
  }

  .progress-bar {
    height: 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.08);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2563eb, #7c3aed);
    border-radius: 999px;
  }

  .progress-meta {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 800;
    color: rgba(15, 23, 42, 0.65);
  }

  .hint {
    margin-top: 10px;
    font-size: 12px;
    color: rgba(15, 23, 42, 0.55);
  }
</style>
