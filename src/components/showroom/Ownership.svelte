<section class="ao">
  <div class="ao-header">
    <div class="ao-chip">
      <span class="ao-chipIcon">🔑</span>
      Participation Models
    </div>

    <h2 class="ao-title">Aircraft Ordering & Ownership</h2>

    <p class="ao-text">
      Aircraft within the FlyANGT ecosystem can be accessed through different ownership and usage
      models, depending on individual or business needs.
    </p>

    <p class="ao-text">
      Options may include full ownership, shared or collective ownership, managed access, or
      operational participation through the ecosystem.
    </p>

    <ul class="ao-list">
      <li>Full ownership</li>
      <li>Shared or collective ownership</li>
      <li>Managed access</li>
      <li>Operational participation</li>
    </ul>

    <p class="ao-text">
      Each model is designed to balance flexibility, cost efficiency, and operational transparency.
    </p>
  </div>
</section>

<style>
  .ao {
    padding: 72px 16px 96px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .ao-header {
    max-width: 760px;
    margin: 0 auto;
    text-align: center;
  }

  .ao-chip {
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

  .ao-chipIcon {
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

  .ao-title {
    margin: 0 0 20px;
    font-size: 36px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    color: #0f172a;
  }

  .ao-text {
    margin: 0 auto 14px;
    max-width: 640px;
    font-size: 13px;
    line-height: 1.65;
    color: #64748b;
  }

  .ao-list {
    list-style: none;
    padding: 0;
    margin: 10px auto 16px;
    max-width: 560px;
    display: grid;
    gap: 10px;
    text-align: left;
  }

  .ao-list li {
    position: relative;
    padding: 10px 12px 10px 38px;
    border-radius: 16px;
    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.06);
    color: #475569;
    font-size: 13px;
    line-height: 1.5;
  }

  .ao-list li::before {
    content: '';
    position: absolute;
    left: 14px;
    top: 50%;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    transform: translateY(-50%);
    background: rgba(15, 23, 42, 0.22);
    box-shadow: 0 0 0 6px rgba(15, 23, 42, 0.06);
  }

  @media (max-width: 640px) {
    .ao {
      padding: 56px 16px 72px;
    }
    .ao-title {
      font-size: 20px;
      letter-spacing: 0.12em;
    }
    .ao-list {
      max-width: 640px;
    }
  }
</style>
