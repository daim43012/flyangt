<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let loaded = false;

  onMount(() => {
    const img = new Image();
    img.src = "/images/main.webp";
    if (img.complete) {
      loaded = true;
    } else {
      img.onload = () => (loaded = true);
    }
  });
</script>

<section class="hero" class:hero-loaded={loaded} id="ecosystem">
  <div class="hero-wrap">
    <div class="hero-badge">
      <span class="hero-dot"></span>
      Unified Aviation Ownership Infrastructure
    </div>

    <h1 class="hero-title">Unified Aviation Ownership Ecosystem</h1>

    <p class="hero-subtitle">
      FlyANGT is a unified ecosystem that combines aircraft ownership, shared
      access, digital management, and tokenized participation built for the
      European aviation market.
    </p>

    <!-- <div class="hero-trust">
      Built with certified aircraft platforms, operational infrastructure,
      and a professional team of aviation engineers, flight consultants,
      and industry partners.
    </div> -->

    <div class="hero-actions">
      <a class="btn btn-primary" href="/app/dashboard">
        Explore the Ecosystem
      </a>
      <a class="btn btn-secondary" href="#paths"> Choose Your Path </a>
    </div>

    <div class="hero-micro">
      Flying. Ownership. Investment. Participation. One ecosystem.
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 92vh;
    padding: 120px 16px 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    /* Tiny inline placeholder — instant render */
    background-image: url("data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAwBACdASogABEAPzmIuFOvKSUwsAgCECcJZQC/avIDTdsE7awQY8uYSfAA4XZVraXj58JiDErZC1REf7n91pzOhzcd/odFZDYXP5bHdL0NAAAA");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  /* Cinematic overlay */
  .hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
        900px 600px at 78% 32%,
        rgba(176, 141, 87, 0.35),
        transparent 60%
      ),
      radial-gradient(
        700px 500px at 70% 20%,
        rgba(255, 255, 255, 0.18),
        transparent 55%
      ),
      linear-gradient(
        90deg,
        rgba(18, 20, 22, 0.72) 0%,
        rgba(18, 20, 22, 0.48) 40%,
        rgba(18, 20, 22, 0.22) 70%,
        rgba(18, 20, 22, 0.1) 100%
      );
    pointer-events: none;
  }

  .hero-wrap {
    position: relative;
    max-width: 1100px;
    margin: 0 auto;
    text-align: center;
    z-index: 2;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 18px;
    border-radius: 999px;

    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.18);

    font-size: 11px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #ffffff;

    margin-bottom: 24px;
  }

  .hero-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--accent);
    box-shadow: 0 0 0 6px rgba(176, 141, 87, 0.25);
  }

  .hero-title {
    font-size: 64px;
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1.05;
    color: #ffffff;
  }

  .hero-subtitle {
    max-width: 820px;
    margin: 40px auto 0;
    font-size: 17px;
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.88);
  }

  .hero-trust {
    max-width: 880px;
    margin: 44px auto 0;
    padding: 14px 20px;
    border-radius: 999px;

    backdrop-filter: blur(14px);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.18);

    font-size: 13px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.85);

    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
  }

  .hero-actions {
    margin-top: 160px;
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .hero-micro {
    margin-top: 24px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.65);
  }

  @media (max-width: 1024px) {
    .hero-title {
      font-size: 46px;
    }
  }

  /* Full image after load */
  .hero-loaded {
    background-image: url("/images/main.webp");
    transition: background-image 0s;
  }

  @media (max-width: 640px) {
    .hero {
      padding: 90px 16px 60px;
      min-height: 80vh;
    }

    .hero-title {
      font-size: 30px;
    }
    .hero-subtitle {
      font-size: 15px;
    }

    .hero-trust {
      border-radius: 18px;
      padding: 14px;
    }

    .hero-loaded {
      background-image: url("/images/main-mobile.webp");
    }
  }
</style>
