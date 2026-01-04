<script lang="ts">
  import { page } from "$app/stores";
  import { wallet } from "$lib/wallet/wallet.store";
</script>

<div class="dash">
  <section class="hero">
    <div class="hero-bg" aria-hidden="true"></div>

    <div class="hero-main">
      <h1 class="hero-title">GET YOUR REWARDS</h1>

      <p class="hero-sub">
        Your unified access to aircraft tokenization, liquidity pools and
        on-chain rewards.
      </p>

      <div class="hero-actions">
  

        <a class="btn ghost" href="/app/finance"> Add Liquidity </a>
      </div>
    </div>
  </section>
</div>

<style>
  .dash {
    padding: 22px 22px 40px;
  }

  .hero {
    position: relative;
    border-radius: 26px;
    padding: 26px;
    overflow: hidden;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 22px 60px rgba(15, 23, 42, 0.1),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;

    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(
        1200px 420px at 20% 10%,
        rgba(37, 99, 235, 0.34),
        transparent 55%
      ),
      radial-gradient(
        900px 360px at 70% 30%,
        rgba(99, 102, 241, 0.24),
        transparent 60%
      ),
      linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(99, 102, 241, 0.06));
    filter: saturate(1.05);
  }

  .hero-main {
    position: relative;
    max-width: 820px;
  }

  .hero-title {
    margin: 0;
    font-size: 28px;
    font-weight: 950;
    letter-spacing: -0.03em;
    font-style: italic;
    color: #0f172a;
  }

  .accent {
    background: linear-gradient(90deg, #2563eb, #6366f1);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .hero-sub {
    margin: 10px 0 0;
    font-size: 14px;
    line-height: 1.5;
    color: rgba(15, 23, 42, 0.65);
    max-width: 620px;
  }

  .hero-actions {
    margin-top: 18px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .btn {
    height: 40px;
    padding: 0 18px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: -0.01em;

    border: 1px solid rgba(15, 23, 42, 0.1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    cursor: pointer;
    user-select: none;
    text-decoration: none;

    transition:
      transform 0.12s ease,
      filter 0.12s ease,
      background 0.12s ease,
      border-color 0.12s ease;
  }

  .btn.primary {
    background: #0f172a;
    color: #fff;
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.16);
  }

  .btn.primary:hover {
    filter: brightness(1.08);
  }

  .btn.primary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .btn.ghost {
    background: rgba(255, 255, 255, 0.78);
    color: #0f172a;
  }

  .btn.ghost:hover {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(15, 23, 42, 0.14);
    transform: translateY(-1px);
  }

  @media (max-width: 980px) {
    .dash {
      padding: 14px 14px 30px;
    }
    .hero {
      padding: 18px;
      border-radius: 20px;
    }
    .hero-title {
      font-size: 22px;
    }
  }
</style>
