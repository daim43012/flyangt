<script lang="ts">
  const currentYear = new Date().getFullYear();

  const nav = [
    { label: "Tokenization", href: "/tokenization" },
    { label: "Showroom",     href: "/showroom" },
    { label: "Vision",       href: "/vision" },
    { label: "Configurator", href: "/configurator" },
    { label: "Blog",         href: "/blog" },
    { label: "Hub",          href: "/app/dashboard" },
  ];

  const legal = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use",   href: "/terms" },
    { label: "Documentation",  href: "/docs" },
  ];

  const contact = [
    { label: "info@flyangt.com",    href: "mailto:info@flyangt.com" },
    { label: "Limassol, Cyprus",    href: null },
  ];
</script>

<footer class="footer">
  <div class="footer-glow" aria-hidden="true"></div>

  <div class="container">

    <!-- Brand column -->
    <div class="col col-brand">
      <a href="/" class="logo" aria-label="Home">
        <span class="logo-mark">FLYANGT</span>
        <span class="logo-tag">Aviation ecosystem</span>
      </a>

      <p class="brand-desc">
        Unified aviation ownership infrastructure. Aircraft, tokenization, shared access and investment tools for the European market.
      </p>

      <div class="badges">
        <span class="badge">🛩 KIT Aircraft</span>
        <span class="badge">🪙 Tokenized</span>
        <span class="badge">🌍 EU Market</span>
      </div>
    </div>

    <!-- Navigation column -->
    <div class="col">
      <div class="col-title">Navigation</div>
      <nav class="col-links">
        {#each nav as item}
          <a href={item.href} class="col-link">{item.label}</a>
        {/each}
      </nav>
    </div>

    <!-- Legal column -->
    <div class="col">
      <div class="col-title">Legal</div>
      <nav class="col-links">
        {#each legal as item}
          <a href={item.href} class="col-link">{item.label}</a>
        {/each}
      </nav>
    </div>

    <!-- Contact column -->
    <div class="col">
      <div class="col-title">Contact</div>
      <div class="col-links">
        {#each contact as item}
          {#if item.href}
            <a href={item.href} class="col-link">{item.label}</a>
          {:else}
            <span class="col-text">{item.label}</span>
          {/if}
        {/each}
      </div>

      <a href="/app/dashboard" class="cta-btn">
        <span class="cta-dot" aria-hidden="true"></span>
        Enter Hub
      </a>
    </div>

  </div>

  <!-- Bottom bar -->
  <div class="bottom">
    <div class="bottom-inner">
      <span class="copy">© {currentYear} FlyANGT. All rights reserved.</span>
      <span class="tagline">Flying. Ownership. Investment. Participation.</span>
    </div>
  </div>
</footer>

<style>
/* =========================
   FOOTER — matches header glass
   ========================= */

.footer {
  position: relative;
  overflow: hidden;

  background:
    /* Cloud wisps */
    radial-gradient(ellipse 65% 35% at 28% 18%, rgba(255, 255, 255, 0.50), transparent 58%),
    radial-gradient(ellipse 45% 25% at 72% 12%, rgba(255, 255, 255, 0.38), transparent 52%),
    /* Sun glow — horizon right */
    radial-gradient(ellipse 52% 65% at 80% 88%, rgba(255, 155, 55, 0.42), transparent 60%),
    /* Warm golden horizon band */
    radial-gradient(ellipse 100% 55% at 50% 100%, rgba(255, 190, 100, 0.52), transparent 62%),
    /* Bronze accent halo — left */
    radial-gradient(ellipse 70% 50% at 12% 85%, rgba(176, 141, 87, 0.28), transparent 65%),
    /* Pale sky — upper */
    radial-gradient(ellipse 85% 55% at 55% 0%, rgba(186, 218, 252, 0.62), transparent 68%),
    /* Base: sky → sunset */
    linear-gradient(
      180deg,
      #d6e9f8 0%,
      #eacfa0 52%,
      #f5c08a 78%,
      #f0ad74 100%
    );

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  border-top: 1px solid rgba(200, 155, 80, 0.22);
  box-shadow: 0 -12px 48px rgba(176, 120, 40, 0.10);
}

.footer-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;

  background:
    /* Atmospheric haze */
    radial-gradient(ellipse 58% 42% at 60% 65%, rgba(255, 215, 120, 0.38), transparent 58%),
    radial-gradient(ellipse 38% 28% at 18% 78%, rgba(255, 175, 90, 0.22), transparent 52%),
    /* Soft sky light */
    radial-gradient(ellipse 50% 35% at 40% 10%, rgba(200, 230, 255, 0.30), transparent 60%);

  filter: blur(22px);
  opacity: 0.85;
}

/* =========================
   MAIN GRID
   ========================= */

.container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 24px 48px;

  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 40px;
}

/* =========================
   BRAND COLUMN
   ========================= */

.col-brand {
  padding-right: 20px;
}

.logo {
  display: grid;
  gap: 4px;
  text-decoration: none;
  width: fit-content;
  margin-bottom: 18px;
}

.logo-mark {
  font-weight: 900;
  letter-spacing: 0.12em;
  font-size: 14px;
  text-transform: uppercase;
  font-style: italic;
  color: rgba(15, 23, 42, 0.92);
}

.logo-tag {
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.55);
}

.brand-desc {
  font-size: 13px;
  line-height: 1.65;
  color: rgba(15, 23, 42, 0.60);
  margin: 0 0 20px;
  max-width: 28ch;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: rgba(15, 23, 42, 0.65);

  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid rgba(18, 20, 22, 0.10);
  background: rgba(18, 20, 22, 0.04);
}

/* =========================
   NAV COLUMNS
   ========================= */

.col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.col-title {
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.40);
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(18, 20, 22, 0.08);
}

.col-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.col-link {
  font-size: 13px;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.70);
  text-decoration: none;

  padding: 6px 0;

  border-bottom: 1px solid transparent;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.col-link:hover {
  color: rgba(15, 23, 42, 0.95);
  border-bottom-color: rgba(176, 141, 87, 0.35);
}

.col-text {
  font-size: 13px;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.45);
  padding: 6px 0;
}

/* CTA */
.cta-btn {
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 10px;

  padding: 10px 16px;
  border-radius: 999px;
  width: fit-content;

  border: 1px solid rgba(122, 90, 45, 0.28);
  background: linear-gradient(135deg, rgba(176, 141, 87, 0.88), rgba(120, 86, 36, 0.85));

  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
  text-decoration: none;
  letter-spacing: 0.02em;

  box-shadow:
    0 10px 30px rgba(176, 141, 87, 0.18),
    0 4px 12px rgba(18, 20, 22, 0.08);

  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    0 20px 50px rgba(176, 141, 87, 0.24),
    0 8px 22px rgba(18, 20, 22, 0.10);
}

.cta-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    rgba(56, 189, 248, 0.92),
    rgba(37, 99, 235, 0.92)
  );
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.30);
  flex-shrink: 0;
}

/* =========================
   BOTTOM BAR
   ========================= */

.bottom {
  position: relative;
  border-top: 1px solid rgba(18, 20, 22, 0.07);
}

.bottom-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.copy {
  font-size: 12px;
  color: rgba(15, 23, 42, 0.42);
  font-weight: 500;
}

.tagline {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(15, 23, 42, 0.30);
  font-weight: 600;
}

/* =========================
   RESPONSIVE
   ========================= */

@media (max-width: 980px) {
  .container {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  .col-brand {
    grid-column: 1 / -1;
    padding-right: 0;
  }

  .brand-desc {
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .container {
    grid-template-columns: 1fr 1fr;
    padding: 40px 16px 32px;
    gap: 28px;
  }

  .col-brand {
    grid-column: 1 / -1;
  }

  .bottom-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 16px;
  }

  .tagline {
    display: none;
  }
}

/* =========================
   REDUCED MOTION
   ========================= */

@media (prefers-reduced-motion: reduce) {
  .col-link,
  .cta-btn {
    transition: none;
  }
}
</style>
