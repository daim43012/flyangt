<!-- src/routes/vision/+page.svelte -->

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
          />
        </figure>

        <figure class="mediaCard">
          <div class="mediaLabel">Airport placement</div>
          <img
            class="heroImg"
            src="/images/airport-concept.png"
            alt="Airport placement, concept map"
            loading="eager"
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
          <img class="img imgTall" src="/images/hangar-out.png" alt="Hangar exterior, concept photo" loading="lazy" />
          <figcaption class="cap">Hangar exterior, concept photo</figcaption>
        </figure>

        <figure class="shot">
          <img class="img imgTall" src="/images/hangar-in.png" alt="Hangar interior, concept photo" loading="lazy" />
          <figcaption class="cap">Hangar interior, concept photo</figcaption>
        </figure>

        <figure class="shot">
          <img class="img imgTall" src="/images/staff-room.png" alt="Workshop / operational area, concept photo" loading="lazy" />
          <figcaption class="cap">Workshop / operational area, concept photo</figcaption>
        </figure>

        <figure class="shot">
          <img class="img imgTall" src="/images/developing.png" alt="Development / buildout phase, concept photo" loading="lazy" />
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
          <img class="img imgBig" src="/images/airport-concept.png" alt="Airport location, overview" loading="lazy" />
          <figcaption class="cap">Airport location, overview</figcaption>
        </figure>

        <figure class="shot">
          <img class="img imgBig" src="/images/staff.png" alt="Team / engineering presence, concept photo" loading="lazy" />
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

        <div class="ctaRight">
          <a class="btnPrimaryDark" href="/contact">Request a call →</a>
          <a class="btnGhostDark" href="/partners">Partner program</a>
        </div>
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

  .hero {
    border-radius: 28px;
    overflow: hidden;
    padding: 26px;
    background: linear-gradient(135deg, rgba(15, 23, 42, 1), rgba(79, 70, 229, 1));
    box-shadow: 0 26px 70px rgba(15, 23, 42, 0.18);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .heroTitle {
    margin: 0;
    font-size: 48px;
    font-weight: 950;
    letter-spacing: -0.04em;
    font-style: italic;
    color: #fff;
    max-width: 920px;
  }
  @media (max-width: 640px) {
    .heroTitle {
      font-size: 32px;
    }
  }

  .heroText {
    margin: 0;
    color: rgba(255, 255, 255, 0.86);
    max-width: 820px;
    line-height: 1.55;
    font-weight: 800;
    font-size: 14px;
  }

  .heroCtas {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 6px;
  }

  .btnPrimary {
    height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    background: #fff;
    color: #0f172a;
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.28);
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.18);
    transition: transform 0.12s ease, filter 0.12s ease;
  }
  .btnPrimary:hover {
    transform: translateY(-1px);
    filter: brightness(1.03);
  }

  .btnGhost {
    height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.92);
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.18);
    transition: transform 0.12s ease, filter 0.12s ease;
  }
  .btnGhost:hover {
    transform: translateY(-1px);
    filter: brightness(1.03);
  }

  .heroMedia {
    margin-top: 8px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  @media (max-width: 820px) {
    .heroMedia {
      grid-template-columns: 1fr;
    }
  }

  .mediaCard {
    border-radius: 22px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.08);
    padding: 14px;
    overflow: hidden;
    margin: 0;
  }
  .mediaLabel {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 10px;
  }
  .heroImg {
    width: 100%;
    height: 240px; /* bigger in hero */
    object-fit: cover;
    border-radius: 18px;
    display: block;
    border: 1px solid rgba(255, 255, 255, 0.14);
  }
  @media (max-width: 640px) {
    .heroImg {
      height: 260px;
    }
  }

  .section {
    padding: 34px 0;
  }
  .sectionHeader {
    margin-bottom: 18px;
  }
  .title {
    margin: 0;
    font-size: 22px;
    font-weight: 950;
    letter-spacing: -0.03em;
    font-style: italic;
    color: #0f172a;
  }

  .sub {
    margin: 8px 0 0;
    color: rgba(15, 23, 42, 0.6);
    font-weight: 800;
    font-size: 13px;
    max-width: 860px;
  }

  .cards3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 26px;
  }
  @media (max-width: 1024px) {
    .cards3 {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 640px) {
    .cards3 {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  .infoCard {
    text-align: left;
    padding: 28px 26px 30px;
    border-radius: 24px;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08), 0 6px 18px rgba(15, 23, 42, 0.06);
  }

  .ico {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: rgba(15, 23, 42, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .cardTitle {
    margin-top: 16px;
    font-size: 18px;
    font-weight: 800;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
  }
  .cardText {
    margin-top: 10px;
    font-size: 13px;
    line-height: 1.55;
    color: #64748b;
    font-weight: 800;
  }

  /* BIGGER + MOBILE-FRIENDLY GALLERIES */
  .gallery {
    display: grid;
    gap: 16px;
  }

  /* Hangar gallery: 2 columns on desktop, 1 column on mobile (big cards) */
  .galleryHangar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 860px) {
    .galleryHangar {
      grid-template-columns: 1fr;
    }
  }

  /* Airport gallery: 2 columns on desktop, 1 column on mobile (big) */
  .galleryAirport {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 860px) {
    .galleryAirport {
      grid-template-columns: 1fr;
    }
  }

  .shot {
    margin: 0;
    border-radius: 24px;
    overflow: hidden;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08), 0 6px 18px rgba(15, 23, 42, 0.06);
  }

  .img {
    width: 100%;
    object-fit: cover;
    display: block;
    background: rgba(15, 23, 42, 0.04);
  }

  /* Larger images by default */
  .imgTall {
    height: 360px;
  }
  .imgBig {
    height: 420px;
  }

  /* Mobile: keep them large and readable */
  @media (max-width: 640px) {
    .imgTall {
      height: 300px;
    }
    .imgBig {
      height: 320px;
    }
  }

  .cap {
    padding: 12px 14px;
    font-size: 12px;
    font-weight: 900;
    color: rgba(15, 23, 42, 0.55);
  }

  .locationGrid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 26px;
    margin-bottom: 16px;
  }
  @media (max-width: 1024px) {
    .locationGrid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  .mapCard {
    border-radius: 24px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08), 0 6px 18px rgba(15, 23, 42, 0.06);
    overflow: hidden;
  }
  .mapTop {
    padding: 16px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  }
  .mapTitle {
    font-weight: 950;
    letter-spacing: -0.02em;
    color: #0f172a;
  }
  .mapHint {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 900;
    color: rgba(15, 23, 42, 0.55);
  }

  .mapImg {
    width: 100%;
    height: 360px; /* bigger map */
    object-fit: cover;
    display: block;
    background: rgba(15, 23, 42, 0.03);
  }
  @media (max-width: 640px) {
    .mapImg {
      height: 300px;
    }
  }

  .locationSide {
    display: grid;
    gap: 20px;
  }

  .sideCard {
    border-radius: 24px;
    padding: 18px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08), 0 6px 18px rgba(15, 23, 42, 0.06);
  }
  .k {
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 900;
  }
  .v {
    margin-top: 10px;
    font-size: 13px;
    line-height: 1.55;
    color: #64748b;
    font-weight: 800;
  }

  .timeline {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 26px;
  }
  @media (max-width: 1024px) {
    .timeline {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 640px) {
    .timeline {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  .milestone {
    border-radius: 24px;
    padding: 18px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08), 0 6px 18px rgba(15, 23, 42, 0.06);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .badge {
    width: fit-content;
    height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);
    color: rgba(15, 23, 42, 0.72);
  }
  .msTitle {
    font-size: 18px;
    font-weight: 800;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
  }
  .msText {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: #64748b;
    font-weight: 800;
  }

  .cta {
    padding: 16px 0 0;
  }
  .ctaCard {
    border-radius: 24px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08), 0 6px 18px rgba(15, 23, 42, 0.06);
    padding: 22px;
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }
  @media (max-width: 1024px) {
    .ctaCard {
      flex-direction: column;
    }
  }

  .ctaTitle {
    font-size: 18px;
    font-weight: 900;
    letter-spacing: -0.03em;
    color: #0f172a;
  }
  .ctaText {
    margin-top: 10px;
    font-size: 13px;
    line-height: 1.55;
    color: #64748b;
    font-weight: 800;
    max-width: 720px;
  }
  .ctaRight {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .btnPrimaryDark {
    height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    background: #0f172a;
    color: #fff;
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    border: 1px solid rgba(15, 23, 42, 0.12);
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.18);
    transition: transform 0.12s ease, filter 0.12s ease;
  }
  .btnPrimaryDark:hover {
    transform: translateY(-1px);
    filter: brightness(1.03);
  }

  .btnGhostDark {
    height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.04);
    color: #0f172a;
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    border: 1px solid rgba(15, 23, 42, 0.1);
    transition: transform 0.12s ease, filter 0.12s ease;
  }
  .btnGhostDark:hover {
    transform: translateY(-1px);
    filter: brightness(1.03);
  }
</style>
