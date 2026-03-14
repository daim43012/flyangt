<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";

  let carouselEl: HTMLDivElement;
  let canScrollLeft = false;
  let canScrollRight = true;
  let mounted = false;

  function updateScrollButtons() {
    if (!carouselEl) return;
    canScrollLeft = carouselEl.scrollLeft > 10;
    canScrollRight = carouselEl.scrollLeft < carouselEl.scrollWidth - carouselEl.clientWidth - 10;
  }

  function scrollCarousel(dir: any) {
    if (!carouselEl) return;
    carouselEl.scrollBy({ left: dir * 360, behavior: "smooth" });
  }

  onMount(() => {
    mounted = true;
    if (browser && carouselEl) {
      updateScrollButtons();
      carouselEl.addEventListener("scroll", updateScrollButtons, { passive: true });
    }
  });

  // ===== COLOR PICKER =====
  // Add more colors: place images at /images/models/ang01-{id}.png
  const colors = [
    { id: "silver", name: "Moonlight Silver", hex: "#a8a9ad" },
    { id: "blue", name: "Atlantic Blue", hex: "#2c5f8a" },
    { id: "gold", name: "Desert Gold", hex: "#b8943e" },
    { id: "orange", name: "Sunset Orange", hex: "#d4722a" },
    { id: "red", name: "Crimson Red", hex: "#b03025" },
  ];

  let selectedColor = colors[0];
  $: modelImg = `/images/models/${selectedColor.id}.webp`;

  const features = [
    {
      title: "Glass Cockpit",
      desc: "Dynon SkyView HDX dual-screen avionics suite with synthetic vision, integrated autopilot, and engine monitoring — everything at your fingertips.",
      img: "/images/cabin.webp",
    },
    {
      title: "Carbon Composite Airframe",
      desc: "Full carbon-fiber composite construction reduces weight to just 380 kg empty while achieving exceptional structural rigidity and a glide ratio of 18.6.",
      img: "/images/carbon.webp",
    },
    {
      title: "Ballistic Parachute",
      desc: "GRS 6/800-990 SDS whole-aircraft recovery system. In an emergency, the parachute deploys and brings the entire aircraft safely to the ground.",
      img: "/images/parashute.webp",
    },
    {
      title: "Rotax 915 iS Engine",
      desc: "Turbocharged 141 HP four-cylinder engine with electronic fuel injection. Runs on regular automotive fuel (A-95/A-98) or Avgas 100LL.",
      img: "/images/rotax.webp",
    },
    {
      title: "Retractable Landing Gear",
      desc: "Hydraulically operated tricycle gear with oleo-pneumatic shock absorption on all struts. Clean aerodynamics when retracted for maximum cruise speed.",
      img: "/images/landing.webp",
    },
    {
      title: "5-Seat Cabin",
      desc: "1.35 m wide cabin comfortably seats five. 780 L baggage volume. The widest cabin in its class, designed for long-range comfort.",
      img: "/images/seats.webp",
    },
  ];

  const timeline = [
    { year: "2019", title: "First Flight", desc: "ANG-01 prototype takes to the sky, designed by leading Ukrainian aerospace engineers." },
    { year: "2020", title: "Structural Testing", desc: "Full carbon composite airframe passes rigorous load and fatigue testing programs." },
    { year: "2022", title: "Cyprus Relocation", desc: "Production and R&D base established near Cyprus international airport." },
    { year: "2024", title: "Platform Launch", desc: "FlyANGT digital platform launches with tokenized participation model." },
    { year: "2025", title: "Presale Live", desc: "ANGT token presale opens, connecting aviation with blockchain investment." },
  ];
</script>

<svelte:head>
  {#each colors as c}
    <link rel="preload" as="image" href="/images/models/{c.id}.webp" />
  {/each}
</svelte:head>

<!-- ==================== ANG-01 HERO ==================== -->
<section class="ang-hero">
  <div class="ang-hero__bg">
    <img src="/images/models/bg.webp" alt="" aria-hidden="true" />
  </div>

  <div class="ang-hero__watermark" aria-hidden="true">ANG-01</div>

  <div class="ang-hero__sidebar">
    <div class="ang-hero__sidebar-line"></div>
    <span>Overview</span>
  </div>

  <div class="ang-hero__body">
    <div class="ang-hero__model">
      {#key selectedColor.id}
        <img
          in:fade={{ duration: mounted ? 380 : 0, delay: mounted ? 220 : 0 }}
          out:fade={{ duration: mounted ? 220 : 0 }}
          src={modelImg}
          alt="ANG-01 in {selectedColor.name}"
          fetchpriority="high"
          decoding="async"
        />
      {/key}
    </div>

    <div class="ang-hero__color-name">{selectedColor.name}</div>

    <div class="ang-hero__swatches">
      {#each colors as c}
        <button
          class="ang-swatch"
          class:active={selectedColor.id === c.id}
          style="--swatch: {c.hex}"
          type="button"
          on:click={() => (selectedColor = c)}
          aria-label={c.name}
          title={c.name}
        />
      {/each}
    </div>
  </div>

  
</section>

<!-- ==================== HISTORY ==================== -->
<section class="models-section models-section--dark">
  <div class="models-inner">
    <div class="models-label">Heritage</div>
    <h2 class="models-heading">Built on decades of aerospace engineering</h2>
    <p class="models-sub">
      From first flight in 2019 to a global digital platform — the ANG-01 journey.
    </p>

    <div class="timeline">
      {#each timeline as t, i}
        <div class="timeline__item">
          <div class="timeline__year">{t.year}</div>
          <div class="timeline__dot"></div>
          <div class="timeline__body">
            <h3 class="timeline__title">{t.title}</h3>
            <p class="timeline__desc">{t.desc}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ==================== SHOWCASE (alternating) ==================== -->
<section class="models-section">
  <div class="models-inner">
    <div class="showcase">
      <div class="showcase__img">
        <img src="/images/precision.webp" alt="Precision engineering" loading="lazy" />
      </div>
      <div class="showcase__text">
        <div class="showcase__label">Engineering</div>
        <h2 class="showcase__title">Precision on point</h2>
        <p class="showcase__desc">
          Navigate with confidence. The ANG-01 offers unparalleled precision and smooth handling,
          powered by a composite pushrod flight control system with spherical bearings at every pivot point.
          No cables, no springs — pure mechanical feedback.
        </p>
      </div>
    </div>

    <div class="showcase showcase--reverse">
      <div class="showcase__img">
        <img src="/images/hangar-in.webp" alt="Production facility" loading="lazy" />
      </div>
      <div class="showcase__text">
        <div class="showcase__label">Production</div>
        <h2 class="showcase__title">Iconic aviation companion</h2>
        <p class="showcase__desc">
          A fusion of technology and craftsmanship. Every ANG-01 is assembled at our Cyprus facility
          under the supervision of Major General of Aviation Vladimir Morgunov — where military-grade
          quality meets next-generation design.
        </p>
      </div>
    </div>

    <div class="showcase">
      <div class="showcase__img">
        <img src="/images/hangar-out.webp" alt="Ready for takeoff" loading="lazy" />
      </div>
      <div class="showcase__text">
        <div class="showcase__label">Performance</div>
        <h2 class="showcase__title">Born to fly far</h2>
        <p class="showcase__desc">
          With a cruise speed of 345 km/h and a service ceiling of 7,200 meters,
          the ANG-01 delivers exceptional range and efficiency. Its Rotax 915 iS engine
          runs on regular automotive fuel — making every journey practical and affordable.
        </p>
      </div>
    </div>
  </div>а 
</section>

<!-- ==================== FEATURES CAROUSEL ==================== -->
<section class="models-section models-section--dark">
  <div class="models-inner">
    <div class="carousel-header">
      <div>
        <div class="models-label">Features</div>
        <h2 class="models-heading">What's inside</h2>
      </div>
      <div class="carousel-nav">
        <button
          class="carousel-btn"
          type="button"
          disabled={!canScrollLeft}
          on:click={() => scrollCarousel(-1)}
          aria-label="Scroll left"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button
          class="carousel-btn"
          type="button"
          disabled={!canScrollRight}
          on:click={() => scrollCarousel(1)}
          aria-label="Scroll right"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="carousel" bind:this={carouselEl}>
      {#each features as f}
        <div class="feature-card">
          <div class="feature-card__img">
            <img src={f.img} alt={f.title} loading="lazy" />
          </div>
          <div class="feature-card__body">
            <h3 class="feature-card__title">{f.title}</h3>
            <p class="feature-card__desc">{f.desc}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ==================== CTA ==================== -->
<section class="models-cta">
  <div class="models-cta__bg">
    <img src="/images/airport-concept.webp" alt="" aria-hidden="true" />
    <div class="models-cta__overlay"></div>
  </div>
  <div class="models-cta__content">
    <h2 class="models-cta__title">Ready to explore?</h2>
    <p class="models-cta__sub">Discover the full specifications or configure your own ANG-01.</p>
    <div class="models-cta__actions">
      <a class="models-cta__btn models-cta__btn--primary" href="/showroom">Full Specifications</a>
      <a class="models-cta__btn models-cta__btn--ghost" href="/app/presale">Join Presale</a>
    </div>
  </div>
</section>

<style>
  /* ===== ANG HERO ===== */
  .ang-hero {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 640px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    background: #0e1012;
  }

  .ang-hero__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .ang-hero__bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.65;
  }

  .ang-hero__watermark {
    position: absolute;
    top: 6%;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--font-heading);
    font-size: clamp(100px, 18vw, 260px);
    font-weight: 400;
    letter-spacing: -0.04em;
    color: rgba(255, 255, 255, 0.2);
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
    z-index: 1;
    line-height: 1;
  }

  .ang-hero__sidebar {
    position: absolute;
    left: 32px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    z-index: 3;
  }

  .ang-hero__sidebar-line {
    width: 1px;
    height: 48px;
    background: rgba(255, 255, 255, 0.2);
  }

  .ang-hero__sidebar span {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
  }

  .ang-hero__body {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex: 1;
    justify-content: center;
    padding: 60px 40px 16px;
  }

  .ang-hero__model {
    position: relative;
    width: 100%;
    max-width: 1100px;
    height: clamp(300px, 52vh, 580px);
  }

  .ang-hero__model img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center top;
    transform: translateY(40px);
    filter: drop-shadow(0 40px 80px rgba(0, 0, 0, 0.55));
  }

  .ang-hero__color-name {
    margin-top: 24px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
  }

  .ang-hero__swatches {
    display: flex;
    gap: 10px;
    margin-top: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .ang-swatch {
    width: 36px;
    height: 36px;
    border-radius: 999px;
    border: 2px solid transparent;
    background: var(--swatch);
    cursor: pointer;
    transition: all 0.25s ease;
    padding: 0;
    box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.2),
      0 2px 8px rgba(0, 0, 0, 0.35);
  }

  .ang-swatch:hover {
    transform: scale(1.18);
  }

  .ang-swatch.active {
    border-color: rgba(255, 255, 255, 0.85);
    transform: scale(1.12);
    box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.2),
      0 0 0 3px rgba(255, 255, 255, 0.15);
  }

  .ang-hero__specs {
    position: relative;
    z-index: 3;
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 48px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(16px);
    flex-wrap: wrap;
    gap: 0;
  }

  .ang-spec {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 0 32px;
  }

  .ang-spec__val {
    font-family: var(--font-heading);
    font-size: 26px;
    font-weight: 400;
    letter-spacing: -0.03em;
    color: #fff;
    line-height: 1;
  }

  .ang-spec__unit {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
  }

  .ang-spec-divider {
    width: 1px;
    height: 36px;
    background: rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
  }

  .ang-spec__link {
    margin-left: auto;
    font-size: 13px;
    font-weight: 600;
    color: var(--accent);
    text-decoration: none;
    letter-spacing: 0.02em;
    padding: 8px 20px;
    border-radius: 999px;
    border: 1px solid rgba(176, 141, 87, 0.35);
    transition: all 0.25s ease;
    white-space: nowrap;
  }

  .ang-spec__link:hover {
    background: rgba(176, 141, 87, 0.1);
    border-color: var(--accent);
  }

  /* ===== SECTIONS ===== */
  .models-section {
    padding: 100px 0;
  }

  .models-section--dark {
    background: #0a0c0e;
    color: #fff;
  }

  .models-section--dark .models-heading,
  .models-section--dark .models-sub {
    color: #fff;
  }

  .models-section--dark .models-sub {
    color: rgba(255, 255, 255, 0.6);
  }

  .models-section--dark .models-label {
    color: var(--accent);
  }

  .models-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
  }

  .models-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 12px;
  }

  .models-heading {
    font-family: var(--font-heading);
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 400;
    letter-spacing: -0.02em;
    color: var(--text-main);
    line-height: 1.1;
    margin: 0 0 16px;
  }

  .models-sub {
    font-size: 17px;
    font-weight: 500;
    line-height: 1.6;
    color: var(--text-muted);
    max-width: 600px;
    margin: 0 0 48px;
  }

  /* ===== TIMELINE ===== */
  .timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
    padding-left: 32px;
  }

  .timeline::before {
    content: "";
    position: absolute;
    left: 7px;
    top: 8px;
    bottom: 8px;
    width: 1px;
    background: rgba(255, 255, 255, 0.12);
  }

  .timeline__item {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 20px;
    padding: 24px 0;
    position: relative;
  }

  .timeline__year {
    position: absolute;
    left: -32px;
    top: 24px;
    transform: translateX(-100%);
    font-family: var(--font-heading);
    font-size: 14px;
    font-weight: 600;
    color: var(--accent);
    white-space: nowrap;
    padding-right: 20px;
  }

  .timeline__dot {
    position: absolute;
    left: -32px;
    top: 30px;
    width: 15px;
    height: 15px;
    border-radius: 999px;
    background: #0a0c0e;
    border: 2px solid var(--accent);
    transform: translateX(-50%);
    left: -25px;
  }

  .timeline__body {
    padding-left: 8px;
  }

  .timeline__title {
    font-family: var(--font-heading);
    font-size: 22px;
    font-weight: 500;
    color: #fff;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }

  .timeline__desc {
    font-size: 15px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.55);
    margin: 0;
    line-height: 1.6;
    max-width: 480px;
  }

  /* ===== SHOWCASE ===== */
  .showcase {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    margin-bottom: 80px;
  }

  .showcase:last-child {
    margin-bottom: 0;
  }

  .showcase--reverse {
    direction: rtl;
  }

  .showcase--reverse > * {
    direction: ltr;
  }

  .showcase__img {
    border-radius: 20px;
    overflow: hidden;
    aspect-ratio: 4/3;
  }

  .showcase__img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }

  .showcase:hover .showcase__img img {
    transform: scale(1.03);
  }

  .showcase__label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 12px;
  }

  .showcase__title {
    font-family: var(--font-heading);
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 400;
    letter-spacing: -0.02em;
    color: var(--text-main);
    margin: 0 0 16px;
    line-height: 1.15;
  }

  .showcase__desc {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.7;
    color: var(--text-muted);
    margin: 0;
    max-width: 460px;
  }

  /* ===== CAROUSEL ===== */
  .carousel-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 32px;
  }

  .carousel-header .models-label {
    margin-bottom: 8px;
  }

  .carousel-header .models-heading {
    margin-bottom: 0;
  }

  .carousel-nav {
    display: flex;
    gap: 8px;
  }

  .carousel-btn {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.2s ease;
  }

  .carousel-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
  }

  .carousel-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .carousel {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 8px;
    scrollbar-width: none;
  }

  .carousel::-webkit-scrollbar {
    display: none;
  }

  .feature-card {
    flex: 0 0 340px;
    scroll-snap-align: start;
    border-radius: 20px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: border-color 0.3s ease, transform 0.3s ease;
  }

  .feature-card:hover {
    border-color: rgba(176, 141, 87, 0.3);
    transform: translateY(-3px);
  }

  .feature-card__img {
    aspect-ratio: 16/10;
    overflow: hidden;
  }

  .feature-card__img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .feature-card:hover .feature-card__img img {
    transform: scale(1.05);
  }

  .feature-card__body {
    padding: 20px;
  }

  .feature-card__title {
    font-family: var(--font-heading);
    font-size: 18px;
    font-weight: 500;
    color: #fff;
    margin: 0 0 8px;
    letter-spacing: -0.01em;
  }

  .feature-card__desc {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
  }

  /* ===== CTA ===== */
  .models-cta {
    position: relative;
    min-height: 480px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
  }

  .models-cta__bg {
    position: absolute;
    inset: 0;
  }

  .models-cta__bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .models-cta__overlay {
    position: absolute;
    inset: 0;
    background: rgba(10, 12, 14, 0.75);
    backdrop-filter: blur(2px);
  }

  .models-cta__content {
    position: relative;
    z-index: 1;
    padding: 60px 40px;
  }

  .models-cta__title {
    font-family: var(--font-heading);
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 400;
    letter-spacing: -0.02em;
    color: #fff;
    margin: 0 0 12px;
  }

  .models-cta__sub {
    font-size: 17px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
    margin: 0 0 32px;
  }

  .models-cta__actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .models-cta__btn {
    height: 48px;
    padding: 0 28px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s ease;
  }

  .models-cta__btn--primary {
    background: var(--accent);
    color: #fff;
    border: 1px solid var(--accent);
  }

  .models-cta__btn--primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(176, 141, 87, 0.3);
  }

  .models-cta__btn--ghost {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .models-cta__btn--ghost:hover {
    background: rgba(255, 255, 255, 0.14);
    transform: translateY(-2px);
  }

  /* ===== MOBILE ===== */
  @media (max-width: 980px) {
    .ang-hero {
      min-height: 100svh;
    }

    .ang-hero__sidebar {
      display: none;
    }

    .ang-hero__watermark {
      font-size: clamp(72px, 22vw, 140px);
    }

    .ang-hero__body {
      padding: 48px 24px 12px;
    }

    .ang-hero__specs {
      padding: 14px 20px;
      gap: 0;
    }

    .ang-spec {
      padding: 0 16px;
    }

    .ang-spec__val {
      font-size: 20px;
    }

    .ang-spec__link {
      margin-left: 0;
      margin-top: 10px;
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
    }

    .models-section {
      padding: 60px 0;
    }

    .models-inner {
      padding: 0 24px;
    }

    .showcase {
      grid-template-columns: 1fr;
      gap: 24px;
      margin-bottom: 48px;
    }

    .showcase--reverse {
      direction: ltr;
    }

    .timeline {
      padding-left: 24px;
    }

    .timeline__year {
      position: static;
      transform: none;
      padding: 0;
      margin-bottom: 4px;
    }

    .timeline__dot {
      left: -24px;
      transform: translateX(-50%);
    }

    .timeline::before {
      left: 0;
    }

    .feature-card {
      flex: 0 0 280px;
    }
  }

  @media (max-width: 640px) {
    .ang-hero__specs {
      flex-wrap: wrap;
    }

    .ang-spec-divider {
      display: none;
    }

    .ang-spec {
      padding: 4px 14px;
    }

    .models-heading {
      font-size: 28px;
    }

    .showcase__title {
      font-size: 24px;
    }

    .carousel-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .models-cta__actions {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
