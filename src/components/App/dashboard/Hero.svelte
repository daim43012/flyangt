<script lang="ts">
  import { page } from "$app/stores";
  import { wallet } from "$lib/wallet/wallet.store";
  import Buy from "./Buy.svelte";

  $: user = $page.data?.user;
  $: email = user?.email ?? null;
  let buyOpen = false;

  function displayName() {
    if (!email) return "Aviation Enthusiast";
    return email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ");
  }

  function buyToken() {
    wallet.connect();
  }
</script>

<section class="hero-card">
  <div class="hero-bg" aria-hidden="true"></div>

  <div class="hero-content">
    <h1 class="hero-title">
      CLEAR SKIES{#if email}, <span class="accent"
          >{displayName().toUpperCase()}</span
        >{/if}
    </h1>

    <p class="hero-sub">
      Unified access to aircraft tokenization, liquidity pools and on-chain
      rewards.
    </p>

    <div class="hero-actions">
      <button
        class="btn btn-primary"
        type="button"
        on:click={() => (buyOpen = true)}
      >
        Buy ANGT
      </button>

      <a class="btn btn-ghost" href="/app/finance">Add Liquidity</a>
    </div>
  </div>
</section>
{#if buyOpen}
  <Buy
    on:close={() => (buyOpen = false)}
    on:swapped={(e) => console.log(e.detail.hash)}
  />
{/if}

<style>
  .hero-card {
    position: relative;
    border-radius: 28px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
    box-shadow:
      0 30px 80px rgba(15, 23, 42, 0.1),
      0 10px 25px rgba(15, 23, 42, 0.06);
    overflow: hidden;
    width: 100%;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(
        1200px 420px at 25% 20%,
        rgba(37, 99, 235, 0.2),
        transparent 60%
      ),
      radial-gradient(
        1100px 420px at 80% 20%,
        rgba(124, 58, 237, 0.18),
        transparent 62%
      ),
      linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(99, 102, 241, 0.06));
    filter: saturate(1.05);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    padding: 22px 22px 22px 22px;
    max-width: 820px;
  }

  .hero-kicker {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.12em;
    color: rgba(15, 23, 42, 0.45);
  }

  .hero-title {
    margin: 10px 0 0;
    font-size: 30px;
    line-height: 1.1;
    font-weight: 950;
    letter-spacing: -0.03em;
    color: #0f172a;
    font-style: italic;
  }

  .accent {
    background: linear-gradient(90deg, #2563eb, #7c3aed);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .hero-sub {
    margin: 10px 0 0;
    font-size: 14px;
    line-height: 1.5;
    color: rgba(15, 23, 42, 0.65);
    max-width: 640px;
  }

  .hero-actions {
    margin-top: 18px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  /* ===== Buttons in your style ===== */
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
    backdrop-filter: blur(10px);
  }

  .btn:active {
    transform: scale(0.98);
  }

  .btn-primary {
    background: #0f172a;
    color: #fff;
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.16);
    border-color: rgba(15, 23, 42, 0.14);
  }

  .btn-primary:hover {
    filter: brightness(1.08);
  }

  .btn-primary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .btn-ghost {
    background: rgba(255, 255, 255, 0.78);
    color: #0f172a;
  }

  .btn-ghost:hover {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(15, 23, 42, 0.14);
    transform: translateY(-1px);
  }

  @media (max-width: 980px) {
    .hero-card {
      border-radius: 22px;
    }
    .hero-content {
      padding: 18px;
    }
    .hero-title {
      font-size: 22px;
    }
  }
</style>
