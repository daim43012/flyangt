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
  <a href="/app/presale" class="btn btn-primary">
  Buy ANGT
</a>

      <a class="btn btn-ghost" href="/app/presale">Add Liquidity</a>
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
    border-radius: 20px;
    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    overflow: hidden;
    width: 100%;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(
        1200px 420px at 25% 20%,
        rgba(176, 141, 87, 0.1),
        transparent 60%
      ),
      radial-gradient(
        1100px 420px at 80% 20%,
        rgba(122, 90, 45, 0.07),
        transparent 62%
      );
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
    font-weight: 600;
    letter-spacing: 0.12em;
    color: var(--text-muted);
  }

  .hero-title {
    margin: 10px 0 0;
    font-size: 30px;
    line-height: 1.1;
    font-weight: 600;
    font-family: var(--font-heading);
    letter-spacing: -0.03em;
    color: var(--text-main);
  }

  .accent {
    background: linear-gradient(90deg, var(--accent), var(--accent-dark));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .hero-sub {
    margin: 10px 0 0;
    font-size: 14px;
    line-height: 1.5;
    color: var(--text-muted);
    max-width: 640px;
  }

  .hero-actions {
    margin-top: 18px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  /* ===== Buttons ===== */
  .btn {
    height: 40px;
    padding: 0 18px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: -0.01em;
    border: 1px solid var(--border-soft);

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

  .btn:active {
    transform: scale(0.98);
  }

  .btn-primary {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 14px 34px rgba(176, 141, 87, 0.22);
    border-color: rgba(176, 141, 87, 0.3);
  }

  .btn-primary:hover {
    filter: brightness(1.08);
  }

  .btn-primary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .btn-ghost {
    background: var(--bg-white);
    color: var(--text-main);
  }

  .btn-ghost:hover {
    background: rgba(176, 141, 87, 0.06);
    border-color: rgba(176, 141, 87, 0.22);
    transform: translateY(-1px);
  }

  @media (max-width: 980px) {
    .hero-card {
      border-radius: 20px;
    }
    .hero-content {
      padding: 18px;
    }
    .hero-title {
      font-size: 22px;
    }
  }
</style>
