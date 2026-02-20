<section class="flow">
  <div class="flow-header">
    <div class="flow-chip">
      <span class="flow-chipIcon">✈️</span>
      Guided Journey
    </div>

    <h2 class="flow-title">From Order to Flight</h2>

    <p class="flow-text">
      The journey from initial interest to active operation follows a clear and guided process.
    </p>

    <div class="flow-timeline" aria-label="Order to flight timeline">
      <div class="flow-tline"></div>

      <div class="flow-items">
        <div class="flow-item"><span class="flow-dot"></span><span class="flow-name">Interest</span></div>
        <div class="flow-item"><span class="flow-dot"></span><span class="flow-name">Configuration</span></div>
        <div class="flow-item"><span class="flow-dot"></span><span class="flow-name">Order</span></div>
        <div class="flow-item"><span class="flow-dot"></span><span class="flow-name">Production</span></div>
        <div class="flow-item"><span class="flow-dot"></span><span class="flow-name">Training</span></div>
        <div class="flow-item"><span class="flow-dot isActive"></span><span class="flow-name isActive">Flight</span></div>
      </div>
    </div>

    <p class="flow-text">
      This may include configuration, ordering, production coordination, training requirements,
      operational onboarding, and ongoing support.
    </p>

    <p class="flow-text">
      FlyANGT provides a structured environment where each stage is transparent and professionally
      managed.
    </p>
  </div>
</section>

<style>
  .flow {
    padding: 72px 16px 96px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .flow-header {
    max-width: 760px;
    margin: 0 auto;
    text-align: center;
  }

  .flow-chip {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.06);
    color: #64748b;
    font-size: 11px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .flow-chipIcon {
    width: 26px;
    height: 26px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);
    letter-spacing: 0;
  }

  .flow-title {
    margin: 0 0 20px;
    font-size: 36px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    color: #0f172a;
  }

  .flow-text {
    margin: 0 auto 14px;
    max-width: 640px;
    font-size: 13px;
    line-height: 1.65;
    color: #64748b;
  }

  .flow-timeline {
    position: relative;
    max-width: 920px;
    margin: 18px auto 18px;
    padding: 18px 18px 14px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.06), 0 6px 18px rgba(15, 23, 42, 0.04);
  }

  .flow-tline {
    position: absolute;
    left: 28px;
    right: 28px;
    top: 30px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(15, 23, 42, 0.14), transparent);
  }

  .flow-items {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    align-items: start;
  }

  .flow-item {
    display: grid;
    gap: 10px;
    justify-items: center;
  }

  .flow-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.18);
    box-shadow: 0 0 0 6px rgba(15, 23, 42, 0.06);
  }

  .flow-dot.isActive {
    background: rgba(59, 130, 246, 0.95);
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.14);
  }

  .flow-name {
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #64748b;
  }

  .flow-name.isActive {
    color: #0f172a;
    font-weight: 800;
  }

  @media (max-width: 640px) {
    .flow {
      padding: 56px 16px 72px;
    }
    .flow-title {
      font-size: 20px;
      letter-spacing: 0.12em;
    }
    .flow-timeline {
      border-radius: 18px;
      padding: 16px 14px 12px;
    }
    .flow-tline {
      left: 18px;
      right: 18px;
    }
    .flow-items {
      grid-template-columns: repeat(3, 1fr);
      row-gap: 14px;
    }
    .flow-name {
      letter-spacing: 0.16em;
      font-size: 10px;
    }
  }
</style>
