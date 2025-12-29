<header class="app-header">
  <div class="app-title">FLYANGT</div>

  <div class="app-actions">
    <!-- <div class="lang">
      <button class="lang-btn is-active" type="button">EN</button>
      <button class="lang-btn" type="button">RU</button>
    </div> -->

    <button class="wallet" type="button">
      <span class="dot"></span>
      0x742D...F44E
    </button>
  </div>
</header>

<style>
  .app-header {
    padding: 18px 22px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  .app-title {
    font-size: 13px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .app-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .lang {
    display: inline-flex;
    padding: 4px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
  }

  .lang-btn {
    padding: 7px 10px;
    border-radius: 999px;
    border: 0;
    background: transparent;
    cursor: pointer;
    font-size: 11px;
    font-weight: 800;
    color: #64748b;
  }

  .lang-btn.is-active {
    background: #2563eb;
    color: #fff;
  }

  .wallet {
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: rgba(255, 255, 255, 0.9);
    border-radius: 999px;
    padding: 9px 12px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 800;
    color: #0f172a;
    box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.14);
  }

  @media (max-width: 980px) {
    .app-header {
      padding: 14px 14px 6px;
    }
  }
</style>
