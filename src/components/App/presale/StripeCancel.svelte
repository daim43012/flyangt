<script lang="ts">
  import { goto } from "$app/navigation";
  const back = () => goto("/app/presale");
</script>

<div class="page">
  <section class="card">
    <div class="top">
      <div class="badge">
        <span class="k">PRESALE</span>
        <span class="pill warn">CANCELED</span>
      </div>

      <div class="iconWrap warn">
        <div class="icon">❌</div>
      </div>

      <h1>Payment canceled</h1>
      <p class="sub">
        No worries. You can try again anytime.
      </p>
    </div>

    <div class="actions">
      <button class="btn primary" on:click={back}>Back to Presale</button>
    </div>
  </section>
</div>

<style>
  .page {
    min-height: 80vh;
    display: grid;
    place-items: center;
  }

  .card {
    position: relative;
    width: min(520px, 92vw);
    border-radius: 26px;
    padding: 22px;
    overflow: hidden;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 22px 60px rgba(15, 23, 42, 0.10),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(1000px 360px at 18% 0%, rgba(37, 99, 235, 0.14), transparent 58%),
      radial-gradient(900px 320px at 85% 35%, rgba(99, 102, 241, 0.12), transparent 62%);
    pointer-events: none;
  }

  .top {
    position: relative;
    display: grid;
    gap: 10px;
    text-align: center;
    padding: 6px 2px 2px;
  }

  .badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .k {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: rgba(15, 23, 42, 0.7);
  }

  .pill {
    height: 26px;
    padding: 0 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 950;
    letter-spacing: -0.02em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(15, 23, 42, 0.1);
    color: rgba(15, 23, 42, 0.85);
  }

  .pill.warn {
    border-color: rgba(245, 158, 11, 0.35);
    color: rgba(146, 64, 14, 0.95);
    box-shadow: 0 10px 24px rgba(245, 158, 11, 0.12);
  }

  .iconWrap {
    margin: 8px auto 4px;
    width: 54px;
    height: 54px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow:
      0 16px 36px rgba(15, 23, 42, 0.06),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;
    display: grid;
    place-items: center;
  }

  .iconWrap.warn { border-color: rgba(245, 158, 11, 0.30); }

  .icon {
    font-size: 26px;
    line-height: 1;
  }

  h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 950;
    letter-spacing: -0.03em;
    color: #0f172a;
    line-height: 1.15;
  }

  .sub {
    margin: 0 auto;
    max-width: 46ch;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: rgba(15, 23, 42, 0.65);
  }

  .actions {
    position: relative;
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 16px;
  }

  .btn {
    height: 42px;
    padding: 0 14px;
    border-radius: 14px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(255, 255, 255, 0.9);
    color: rgba(15, 23, 42, 0.9);
    font-size: 13px;
    font-weight: 950;
    letter-spacing: -0.02em;
    cursor: pointer;
    box-shadow:
      0 16px 36px rgba(15, 23, 42, 0.06),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;
    transition: transform 0.12s ease, filter 0.12s ease;
  }

  .btn:hover { transform: translateY(-1px); }
  .btn:active { transform: translateY(0px); }

  .btn.primary {
    border-color: rgba(59, 130, 246, 0.26);
  }

  @media (max-width: 520px) {
    .card { padding: 16px; border-radius: 20px; }
  }
</style>
