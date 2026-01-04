<script lang="ts">
  const posts = [
    {
      title: "New aircraft added to fleet",
      source: "FlyANG Blog",
      time: "2h ago"
    },
    {
      title: "Yield payout completed",
      source: "Community Update",
      time: "6h ago"
    },
    {
      title: "Liquidity pool milestone reached",
      source: "Governance",
      time: "1d ago"
    }
  ];
</script>

<section class="card">
  <header class="header">
    <div class="kicker">COMMUNITY</div>
    <div class="title">Latest Updates</div>
  </header>

  <div class="list">
    {#each posts as post}
      <div class="item">
        <div class="dot"></div>
        <div class="content">
          <div class="ititle">{post.title}</div>
          <div class="meta">{post.source} • {post.time}</div>
        </div>
      </div>
    {/each}
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
    margin-bottom: 12px;
  }

  .kicker {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.12em;
    color: rgba(15, 23, 42, 0.45);
  }

  .title {
    margin-top: 4px;
    font-size: 18px;
    font-weight: 950;
    color: rgba(15, 23, 42, 0.95);
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .item {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }

  .dot {
    width: 8px;
    height: 8px;
    margin-top: 6px;
    border-radius: 999px;
    background: #2563eb;
    flex: 0 0 auto;
  }

  .ititle {
    font-size: 13px;
    font-weight: 800;
    color: rgba(15, 23, 42, 0.95);
  }

  .meta {
    margin-top: 2px;
    font-size: 12px;
    color: rgba(15, 23, 42, 0.55);
  }
</style>
