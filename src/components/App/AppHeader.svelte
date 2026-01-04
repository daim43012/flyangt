<script lang="ts">
  import ConnectWallet from "./wallet/ConnectWallet.svelte";
</script>

<header class="app-header-wrap">
  <div class="app-header">
    <div class="left">
    </div>

    <div class="right">
      <ConnectWallet />
    </div>
  </div>
</header>

<style>
  .app-header-wrap {
    padding: 18px 22px 12px;
  }

  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;

    padding: 14px 18px;
    border-radius: 22px;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(15, 23, 42, 0.06);

    box-shadow:
      0 18px 40px rgba(15, 23, 42, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.9) inset;

    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .app-title {
    font-size: 13px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
    user-select: none;
  }

  /* Responsive */
  @media (max-width: 980px) {
    .app-header-wrap {
      padding: 14px 14px 8px;
    }

    .app-header {
      padding: 12px 14px;
      border-radius: 18px;
    }
  }
</style>
