<script lang="ts">
  const actions = [
    {
      label: "Buy ANGT Tokens",
      desc: "Participate in the presale",
      href: "/app/presale",
      icon: "cart",
    },
    {
      label: "Earn Airdrop",
      desc: "Complete tasks & earn rewards",
      href: "/app/airdrop",
      icon: "gift",
    },
    {
      label: "Rewards Station",
      desc: "Check your reward balance",
      href: "/app/rewards",
      icon: "star",
    },
    {
      label: "Read Whitepaper",
      desc: "Learn about the project",
      href: "/whitepaper",
      icon: "doc",
    },
  ];
</script>

<section class="card">
  <header class="header">
    <div class="kicker">QUICK ACTIONS</div>
    <div class="title">Get Started</div>
  </header>

  <div class="list">
    {#each actions as action}
      <a class="item" href={action.href}>
        <div class="icon" data-icon={action.icon}>
          {#if action.icon === "cart"}
            <svg viewBox="0 0 24 24" fill="none"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 6h18" stroke="currentColor" stroke-width="1.8"/><path d="M16 10a4 4 0 01-8 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          {:else if action.icon === "gift"}
            <svg viewBox="0 0 24 24" fill="none"><path d="M20 12v10H4V12" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M2 7h20v5H2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 22V7" stroke="currentColor" stroke-width="1.8"/><path d="M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 7h4.5a2.5 2.5 0 100-5C13 2 12 7 12 7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
          {:else if action.icon === "star"}
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
          {:else}
            <svg viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 2v6h6" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          {/if}
        </div>
        <div class="content">
          <div class="ititle">{action.label}</div>
          <div class="meta">{action.desc}</div>
        </div>
        <div class="arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </a>
    {/each}
  </div>
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
    margin-bottom: 12px;
  }

  .kicker {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: var(--text-muted);
  }

  .title {
    margin-top: 4px;
    font-size: 18px;
    font-weight: 600;
    font-family: var(--font-heading);
    color: var(--text-main);
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .item {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid var(--border-soft);
    background: rgba(15, 23, 42, 0.02);
    text-decoration: none;
    color: inherit;
    transition: 0.25s ease;
    cursor: pointer;
  }

  .item:hover {
    background: rgba(176, 141, 87, 0.04);
    border-color: rgba(176, 141, 87, 0.22);
    transform: translateX(2px);
  }

  .icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: rgba(176, 141, 87, 0.08);
    color: var(--accent);
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }

  .icon :global(svg) {
    width: 18px;
    height: 18px;
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  .ititle {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-main);
  }

  .meta {
    margin-top: 2px;
    font-size: 11px;
    color: var(--text-muted);
  }

  .arrow {
    color: var(--text-muted);
    opacity: 0.4;
    flex-shrink: 0;
    transition: 0.25s ease;
  }

  .item:hover .arrow {
    opacity: 0.8;
    color: var(--accent);
  }
</style>
