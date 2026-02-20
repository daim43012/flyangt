<section class="dc">
  <div class="dc-header">
    <div class="dc-chip">
      <span class="dc-chipIcon">✔</span>
      Oversight & Records
    </div>

    <h2 class="dc-title">Documentation & Compliance</h2>

    <p class="dc-text">
      All aircraft orders and operational activities are supported by structured documentation
      processes aligned with applicable aviation regulations.
    </p>

    <ul class="dc-checks">
      <li>Structured documentation processes</li>
      <li>Compliance steps and required records</li>
      <li>Operational lifecycle traceability</li>
    </ul>

    <p class="dc-text">
      The platform assists users in managing required documents, compliance steps, and operational
      records throughout the aircraft lifecycle.
    </p>
  </div>
</section>

<style>
  .dc {
    padding: 72px 16px 96px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .dc-header {
    max-width: 760px;
    margin: 0 auto;
    text-align: center;
  }

  .dc-chip {
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

  .dc-chipIcon {
    width: 26px;
    height: 26px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);
    color: #0f172a;
    letter-spacing: 0;
    font-weight: 900;
    font-size: 12px;
  }

  .dc-title {
    margin: 0 0 20px;
    font-size: 36px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    color: #0f172a;
  }

  .dc-text {
    margin: 0 auto 14px;
    max-width: 640px;
    font-size: 13px;
    line-height: 1.65;
    color: #64748b;
  }

  .dc-checks {
    list-style: none;
    padding: 0;
    margin: 10px auto 16px;
    max-width: 640px;
    display: grid;
    gap: 10px;
    text-align: left;
  }

  .dc-checks li {
    position: relative;
    padding: 10px 12px 10px 38px;
    border-radius: 16px;
    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.06);
    color: #475569;
    font-size: 13px;
    line-height: 1.5;
  }

  .dc-checks li::before {
    content: '✓';
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);
    color: #0f172a;
    font-weight: 900;
    font-size: 12px;
  }

  @media (max-width: 640px) {
    .dc {
      padding: 56px 16px 72px;
    }
    .dc-title {
      font-size: 20px;
      letter-spacing: 0.12em;
    }
  }
</style>
