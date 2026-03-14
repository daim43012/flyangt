<script>
  /** Добавляет shimmer на родителя и fade-in на изображение при загрузке */
  function imgReveal(node) {
    const parent = node.parentElement;
    if (parent) parent.dataset.imgState = "loading";

    function reveal() {
      node.style.opacity = "1";
      if (parent) parent.dataset.imgState = "loaded";
    }

    if (node.complete && node.naturalHeight !== 0) {
      reveal();
    } else {
      node.addEventListener("load", reveal, { once: true });
    }

    return {
      destroy() {
        node.removeEventListener("load", reveal);
      },
    };
  }
</script>

<section class="vision">
  <div class="wrap">
    <!-- HERO -->
    <header class="hero">
      <h1 class="heroTitle">Building the FlyANG ecosystem in Cyprus</h1>

      <p class="heroText">
        A physical aviation hub plus a digital platform: hangars, operations,
        safety standards, and a scalable partner network.
      </p>

      <div class="heroCtas">
        <a class="btnPrimary" href="/contact">Talk to us →</a>
        <a class="btnGhost" href="/docs">Explore documentation</a>
      </div>

      <!-- Replace placeholders with real images -->
      <div class="heroMedia">
        <figure class="mediaCard">
          <div class="mediaLabel">Hangar concept</div>
          <img
            class="heroImg"
            src="/images/hangar-out.png"
            alt="Hangar exterior, concept photo"
            loading="eager"
            fetchpriority="high"
            use:imgReveal
          />
        </figure>

        <figure class="mediaCard">
          <div class="mediaLabel">Airport placement</div>
          <img
            class="heroImg"
            src="/images/airport-concept.png"
            alt="Airport placement, concept map"
            loading="eager"
            fetchpriority="high"
            use:imgReveal
          />
        </figure>
      </div>
    </header>

    <!-- WHY -->
    <section class="section">
      <div class="sectionHeader">
        <h2 class="title">Why this matters</h2>
        <p class="sub">
          We connect aircraft build support, operational readiness, and a modern
          digital layer that scales across partners.
        </p>
      </div>

      <div class="cards3">
        <article class="infoCard">
          <div class="ico">✈️</div>
          <div class="cardTitle">Physical hub</div>
          <div class="cardText">
            Hangar infrastructure, build support, storage, and maintenance-ready
            workflows.
          </div>
        </article>

        <article class="infoCard">
          <div class="ico">🧭</div>
          <div class="cardTitle">Airport operations</div>
          <div class="cardText">
            Runway access, apron logistics, safety and compliance standards.
          </div>
        </article>

        <article class="infoCard">
          <div class="ico">🧠</div>
          <div class="cardTitle">Digital platform</div>
          <div class="cardText">
            Knowledge base, QA gates, weight and balance, and partner-ready
            modules.
          </div>
        </article>
      </div>
    </section>

    <!-- HANGARS -->
    <section class="section">
      <div class="sectionHeader">
        <h2 class="title">Hangars and facilities</h2>
        <p class="sub">
          Space for assembly, tooling, training, and operational readiness.
        </p>
      </div>

      <div class="gallery galleryHangar">
        <figure class="shot">
          <img class="img imgTall" src="/images/hangar-out.png" alt="Hangar exterior, concept photo" loading="lazy" use:imgReveal />
          <figcaption class="cap">Hangar exterior, concept photo</figcaption>
        </figure>

        <figure class="shot">
          <img class="img imgTall" src="/images/hangar-in.png" alt="Hangar interior, concept photo" loading="lazy" use:imgReveal />
          <figcaption class="cap">Hangar interior, concept photo</figcaption>
        </figure>

        <figure class="shot">
          <img class="img imgTall" src="/images/staff-room.png" alt="Workshop / operational area, concept photo" loading="lazy" use:imgReveal />
          <figcaption class="cap">Workshop / operational area, concept photo</figcaption>
        </figure>

        <figure class="shot">
          <img class="img imgTall" src="/images/developing.png" alt="Development / buildout phase, concept photo" loading="lazy" use:imgReveal />
          <figcaption class="cap">Development / buildout phase, concept photo</figcaption>
        </figure>
      </div>
    </section>

    <!-- LOCATION -->
    <section class="section">
      <div class="sectionHeader">
        <h2 class="title">Airport location and access</h2>
        <p class="sub">
          Placement, apron routing, and a clear path from build to flight
          operations.
        </p>
      </div>

      <div class="locationGrid">
        <div class="mapCard">
          <div class="mapTop">
            <div class="mapTitle">Airport placement</div>
            <div class="mapHint">Runway access, apron logistics, compliance-ready</div>
          </div>

          <img
            class="mapImg"
            src="/images/fly-hangar.png"
            alt="Airport location, overview map"
            loading="lazy"
            use:imgReveal
          />
        </div>

        <div class="locationSide">
          <div class="sideCard">
            <div class="k">Placement</div>
            <div class="v">Hangar zone near apron and service access.</div>
          </div>

          <div class="sideCard">
            <div class="k">Logistics</div>
            <div class="v">Tooling, parts, and aircraft movement flow.</div>
          </div>

          <div class="sideCard">
            <div class="k">Operations</div>
            <div class="v">Safety processes, checklists, and readiness gates.</div>
          </div>
        </div>
      </div>

      <div class="gallery galleryAirport">
        <figure class="shot">
          <img class="img imgBig" src="/images/airport-concept.png" alt="Airport location, overview" loading="lazy" use:imgReveal />
          <figcaption class="cap">Airport location, overview</figcaption>
        </figure>

        <figure class="shot">
          <img class="img imgBig" src="/images/staff.png" alt="Team / engineering presence, concept photo" loading="lazy" use:imgReveal />
          <figcaption class="cap">Team / engineering presence, concept photo</figcaption>
        </figure>
      </div>
    </section>

    <!-- ROADMAP -->
    <section class="section">
      <div class="sectionHeader">
        <h2 class="title">Roadmap</h2>
        <p class="sub">
          A clear sequence from physical setup to scalable digital growth.
        </p>
      </div>

      <div class="timeline">
        <div class="milestone">
          <div class="badge">Q1</div>
          <div class="msTitle">Site selection & permits</div>
          <div class="msText">Finalize airport placement, DCA alignment, legal pack.</div>
        </div>

        <div class="milestone">
          <div class="badge">Q2</div>
          <div class="msTitle">Hangar buildout & tooling</div>
          <div class="msText">Infrastructure, tooling, workflows, safety processes.</div>
        </div>

        <div class="milestone">
          <div class="badge">Q3</div>
          <div class="msTitle">Training & operations launch</div>
          <div class="msText">Build support, QA gates, pilot and maintenance readiness.</div>
        </div>

        <div class="milestone">
          <div class="badge">Q4</div>
          <div class="msTitle">Scale & digital platform</div>
          <div class="msText">FlyANG platform modules, partner onboarding, token utility.</div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="ctaCard">
        <div class="ctaLeft">
          <div class="ctaTitle">Want to partner with FlyANG?</div>
          <div class="ctaText">
            We can share the full roadmap, operational structure, and onboarding
            path for partners, dealers, and investors.
          </div>
        </div>

        <!-- <div class="ctaRight">
          <a class="btnPrimaryDark" href="/contact">Request a call →</a>
          <a class="btnGhostDark" href="/partners">Partner program</a>
        </div> -->
      </div>
    </section>
  </div>
</section>
<style>
  .vision {
    padding: 32px 16px 96px;
  }

  .wrap {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* =========================
     HERO (hub style)
     ========================= */

  .hero {
    border-radius: 28px;
    overflow: hidden;
    padding: 34px 28px;
    background:
      radial-gradient(900px 460px at 30% -140px, rgba(176, 141, 87, 0.16), transparent 62%),
      radial-gradient(760px 420px at 70% -120px, rgba(37, 99, 235, 0.10), transparent 60%),
      var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .heroTitle {
    margin: 0;
    font-size: 44px;
    font-weight: 600;
    letter-spacing: -0.02em;
    max-width: 980px;

    background: linear-gradient(
      135deg,
      var(--accent-light),
      var(--accent),
      var(--accent-dark)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .heroText {
    margin: 0;
    max-width: 78ch;
    font-size: 16px;
    line-height: 1.75;
    color: var(--text-muted);
  }

  .heroCtas {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 8px;
  }

  .btnPrimary,
  .btnGhost,
  .btnPrimaryDark,
  .btnGhostDark {
    height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease;
    white-space: nowrap;
  }

  .btnPrimary {
    background: var(--accent);
    color: #fff;
    border: 1px solid rgba(37, 99, 235, 0.18);
    box-shadow:
      0 18px 46px rgba(37, 99, 235, 0.26),
      0 8px 20px rgba(18, 20, 22, 0.10);
  }

  .btnPrimary:hover {
    transform: translateY(-2px);
    box-shadow:
      0 26px 70px rgba(37, 99, 235, 0.28),
      0 10px 26px rgba(18, 20, 22, 0.12);
  }

  .btnGhost {
    background: rgba(176, 141, 87, 0.08);
    color: rgba(120, 86, 36, 0.92);
    border: 1px solid rgba(176, 141, 87, 0.22);
    box-shadow: 0 14px 34px rgba(18, 20, 22, 0.06);
  }

  .btnGhost:hover {
    transform: translateY(-2px);
    border-color: rgba(176, 141, 87, 0.34);
    box-shadow: 0 22px 54px rgba(18, 20, 22, 0.08);
  }

  .heroMedia {
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .mediaCard {
    border-radius: 22px;
    border: 1px solid var(--border-soft);
    background: rgba(15, 23, 42, 0.02);
    padding: 14px;
    overflow: hidden;
    margin: 0;
    box-shadow: 0 14px 34px rgba(18, 20, 22, 0.06);
  }

  .mediaLabel {
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(15, 23, 42, 0.55);
    margin-bottom: 10px;
    font-weight: 600;
  }

  .heroImg {
    width: 100%;
    height: 240px;
    object-fit: cover;
    border-radius: 18px;
    display: block;
    border: 1px solid var(--border-soft);
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  /* =========================
     SECTIONS
     ========================= */

  .section {
    padding: 80px 0 0;
  }

  .sectionHeader {
    text-align: center;
    margin-bottom: 26px;
  }

  .title {
    margin: 0;
    font-size: 34px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .sub {
    margin: 14px auto 0;
    max-width: 70ch;
    font-size: 16px;
    line-height: 1.75;
    color: var(--text-muted);
  }

  /* =========================
     CARDS 3
     ========================= */

  .cards3 {
    margin-top: 26px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .infoCard {
    padding: 26px;
    border-radius: 28px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .infoCard:hover {
    transform: translateY(-3px);
    box-shadow:
      0 40px 110px rgba(18, 20, 22, 0.10),
      0 10px 28px rgba(18, 20, 22, 0.08);
  }

  .ico {
    width: 44px;
    height: 44px;
    border-radius: 16px;
    background: rgba(176, 141, 87, 0.10);
    border: 1px solid rgba(176, 141, 87, 0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .cardTitle {
    margin-top: 16px;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.01em;

    background: linear-gradient(
      135deg,
      var(--accent-light),
      var(--accent),
      var(--accent-dark)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .cardText {
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.75;
    color: var(--text-muted);
    max-width: 60ch;
  }

  /* =========================
     GALLERIES
     ========================= */

  .gallery {
    display: grid;
    gap: 16px;
    margin-top: 22px;
  }

  .galleryHangar,
  .galleryAirport {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .shot {
    margin: 0;
    border-radius: 28px;
    overflow: hidden;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
  }

  .img {
    width: 100%;
    object-fit: cover;
    display: block;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .imgTall {
    height: 360px;
  }

  .imgBig {
    height: 420px;
  }

  .cap {
    padding: 12px 14px;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(15, 23, 42, 0.55);
    font-weight: 600;
    border-top: 1px solid var(--border-soft);
    background: var(--bg-white);
    position: relative;
    z-index: 1;
  }

  /* =========================
     IMAGE SHIMMER
     ========================= */

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  [data-img-state="loading"] {
    background: linear-gradient(
      90deg,
      rgba(18, 20, 22, 0.04) 25%,
      rgba(18, 20, 22, 0.09) 50%,
      rgba(18, 20, 22, 0.04) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.8s ease-in-out infinite;
  }

  [data-img-state="loaded"] {
    animation: none;
    background: none;
  }

  /* =========================
     LOCATION
     ========================= */

  .locationGrid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 18px;
    margin-top: 22px;
    margin-bottom: 16px;
  }

  .mapCard {
    border-radius: 28px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    overflow: hidden;
  }

  .mapTop {
    padding: 16px 18px;
    border-bottom: 1px solid var(--border-soft);
    background:
      radial-gradient(620px 260px at 20% 0%, rgba(176, 141, 87, 0.12), transparent 60%),
      var(--bg-white);
  }

  .mapTitle {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(15, 23, 42, 0.80);
  }

  .mapHint {
    margin-top: 6px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-muted);
    max-width: 62ch;
  }

  .mapImg {
    width: 100%;
    height: 360px;
    object-fit: cover;
    display: block;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .locationSide {
    display: grid;
    gap: 18px;
  }

  .sideCard {
    border-radius: 28px;
    padding: 18px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
  }

  .k {
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
  }

  .v {
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.75;
    color: var(--text-muted);
  }

  /* =========================
     TIMELINE
     ========================= */

  .timeline {
    margin-top: 22px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
  }

  .milestone {
    border-radius: 28px;
    padding: 18px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .milestone:hover {
    transform: translateY(-3px);
    box-shadow:
      0 40px 110px rgba(18, 20, 22, 0.10),
      0 10px 28px rgba(18, 20, 22, 0.08);
  }

  .badge {
    width: fit-content;
    height: 28px;
    padding: 0 12px;
    border-radius: 999px;

    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 600;

    background: rgba(176, 141, 87, 0.10);
    border: 1px solid rgba(176, 141, 87, 0.22);
    color: rgba(120, 86, 36, 0.92);
  }

  .msTitle {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text-main);
  }

  .msText {
    margin: 0;
    font-size: 14px;
    line-height: 1.75;
    color: var(--text-muted);
  }

  /* =========================
     CTA
     ========================= */

  .cta {
    padding: 80px 0 0;
  }

  .ctaCard {
    border-radius: 28px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    padding: 22px;
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .ctaTitle {
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.01em;

    background: linear-gradient(
      135deg,
      var(--accent-light),
      var(--accent),
      var(--accent-dark)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .ctaText {
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.75;
    color: var(--text-muted);
    max-width: 72ch;
  }

  .ctaRight {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .btnPrimaryDark {
    background: var(--text-main);
    color: #fff;
    border: 1px solid rgba(15, 23, 42, 0.12);
    box-shadow:
      0 18px 46px rgba(15, 23, 42, 0.22),
      0 8px 20px rgba(18, 20, 22, 0.10);
  }

  .btnPrimaryDark:hover {
    transform: translateY(-2px);
    box-shadow:
      0 26px 70px rgba(15, 23, 42, 0.26),
      0 10px 26px rgba(18, 20, 22, 0.12);
  }

  .btnGhostDark {
    background: rgba(15, 23, 42, 0.04);
    color: var(--text-main);
    border: 1px solid var(--border-soft);
    box-shadow: 0 14px 34px rgba(18, 20, 22, 0.06);
  }

  .btnGhostDark:hover {
    transform: translateY(-2px);
    border-color: rgba(15, 23, 42, 0.12);
    box-shadow: 0 22px 54px rgba(18, 20, 22, 0.08);
  }

  /* =========================
     RESPONSIVE
     ========================= */

  @media (max-width: 1024px) {
    .heroTitle {
      font-size: 34px;
    }

    .title {
      font-size: 28px;
    }

    .cards3 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .timeline {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 860px) {
    .heroMedia {
      grid-template-columns: 1fr;
    }

    .galleryHangar,
    .galleryAirport {
      grid-template-columns: 1fr;
    }

    .locationGrid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .vision {
      padding: 28px 16px 80px;
    }

    .hero {
      padding: 26px 18px;
      border-radius: 22px;
    }

    .heroTitle {
      font-size: 26px;
    }

    .heroImg {
      height: 260px;
    }

    .title {
      font-size: 24px;
    }

    .imgTall {
      height: 300px;
    }

    .imgBig {
      height: 320px;
    }

    .mapImg {
      height: 300px;
    }

    .ctaCard {
      flex-direction: column;
    }
  }
</style>