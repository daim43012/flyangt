<script lang="ts">
  const steps = [
    {
      key: "presale",
      label: "Presale",
      desc: "Token presale is live",
      active: true,
    },
    {
      key: "vesting",
      label: "Vesting",
      desc: "Token distribution & vesting",
      active: false,
    },
    {
      key: "airdrop",
      label: "Airdrop",
      desc: "Reward distribution to holders",
      active: false,
    },

    {
      key: "listing",
      label: "Token Listing",
      desc: "CEX / DEX listing",
      active: false,
    },
  ];
</script>

<section class="card">
  <header class="header">
    <div class="kicker">ROADMAP</div>
    <div class="title">Launch Timeline</div>
  </header>

  <div class="steps">
    {#each steps as step, i}
      <div class="step" class:active={step.active}>
        <div class="dot-wrap">
          <div class="dot">
            {#if step.active}
              <div class="pulse"></div>
            {/if}
          </div>
          {#if i < steps.length - 1}
            <div class="line" class:active-line={step.active}></div>
          {/if}
        </div>

        <div class="block">
          <div class="step-label">{step.label}</div>
          <div class="step-desc">{step.desc}</div>
          {#if step.active}
            <span class="badge-active">In Progress</span>
          {/if}
        </div>
      </div>
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
    margin-bottom: 14px;
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

  .steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }

  .step {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  /* Dot + horizontal line row */
  .dot-wrap {
    display: flex;
    align-items: center;
    height: 20px;
    margin-bottom: 10px;
  }

  .dot {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    background: rgba(18, 20, 22, 0.12);
    position: relative;
    flex-shrink: 0;
  }

  .step.active .dot {
    background: var(--accent);
    box-shadow: 0 0 0 4px rgba(176, 141, 87, 0.15);
  }

  .pulse {
    position: absolute;
    inset: -3px;
    border-radius: 999px;
    border: 2px solid var(--accent);
    opacity: 0.5;
    animation: pulse-ring 2s ease-out infinite;
  }

  @keyframes pulse-ring {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    100% {
      transform: scale(1.8);
      opacity: 0;
    }
  }

  .line {
    flex: 1;
    height: 2px;
    background: rgba(18, 20, 22, 0.08);
    margin: 0 0 0 4px;
  }

  .active-line {
    background: linear-gradient(90deg, var(--accent), rgba(18, 20, 22, 0.08));
  }

  /* Content block */
  .block {
    padding: 12px;
    border-radius: 14px;
    border: 1px solid var(--border-soft);
    background: rgba(15, 23, 42, 0.02);
    margin-right: 8px;
    flex: 1;
  }

  .step:last-child .block {
    margin-right: 0;
  }

  .step.active .block {
    border-color: rgba(176, 141, 87, 0.25);
    background: rgba(176, 141, 87, 0.04);
  }

  .step-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-main);
    line-height: 1.2;
  }

  .step:not(.active) .step-label {
    color: var(--text-muted);
  }

  .step-desc {
    margin-top: 4px;
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.4;
  }

  .badge-active {
    display: inline-flex;
    align-items: center;
    margin-top: 8px;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
    background: rgba(176, 141, 87, 0.1);
    color: var(--accent-dark);
    border: 1px solid rgba(176, 141, 87, 0.18);
  }

  @media (max-width: 640px) {
    .steps {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .line {
      display: none;
    }

    .block {
      margin-right: 0;
    }
  }
</style>
