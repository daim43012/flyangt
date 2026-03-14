<script lang="ts">
  import { onMount } from "svelte";
  import QRCode from "qrcode";

  const SLIDES = [
    { id: "slide-1", label: "01" },
    { id: "slide-2", label: "02" },
    { id: "slide-3", label: "03" },
    { id: "slide-4", label: "04" },
    { id: "slide-5", label: "05" },
    { id: "slide-final", label: "✦" },
  ];

  let activeIndex = 0;
  let qrSite = "";

  function goTo(index: number) {
    document.getElementById(SLIDES[index].id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function prev() { if (activeIndex > 0) goTo(activeIndex - 1); }
  function next() { if (activeIndex < SLIDES.length - 1) goTo(activeIndex + 1); }

  function handleKey(e: KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next();
    if (e.key === "ArrowUp"   || e.key === "ArrowLeft")  prev();
  }

  /** Fade-in on image load */
  function imgReveal(node: HTMLImageElement) {
    const parent = node.parentElement as HTMLElement | null;
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

    return { destroy() { node.removeEventListener("load", reveal); } };
  }

  onMount(async () => {
    // QR codes
    const opts = (color: string) => ({
      width: 480,
      margin: 2,
      color: { dark: color, light: "#00000000" },
    });
    qrSite = await QRCode.toDataURL("https://flyangt.com", opts("#B08D57"));

    // Track active slide: fire when slide center crosses viewport midpoint
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = SLIDES.findIndex((s) => s.id === entry.target.id);
            if (idx >= 0) activeIndex = idx;
          }
        }
      },
      { rootMargin: "-49% 0px -49% 0px", threshold: 0 },
    );

    for (const s of SLIDES) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  });
</script>

<svelte:window on:keydown={handleKey} />

<!-- ═══════════════════════════════════════════
     SLIDE 1 — HERO
═══════════════════════════════════════════ -->
<section class="slide slide-hero" id="slide-1">
  <div class="hero-overlay"></div>
  <div class="hero-body">
    <div class="hero-badge">
      <span class="hero-dot"></span>
      Aviation Ownership Ecosystem · Cyprus
    </div>

    <h1 class="hero-title">FlyANG</h1>
    <p class="hero-tagline">Aviation Ownership. Service. Digital Ecosystem.</p>

    <p class="hero-desc">
      FlyANG — авиационная экосистема нового поколения на Кипре.
    </p>

    <ul class="hero-list">
      <li>KIT самолёта ANG-01</li>
      <li>Owner Assisted Build</li>
      <li>Сервис и техническое обслуживание</li>
      <li>Обучение пилотов</li>
      <li>Цифровая платформа управления</li>
      <li>Токенизация как координационный слой</li>
    </ul>

    <p class="hero-mission">
      Наша цель — сделать владение самолётом понятным, прозрачным и доступным.
    </p>
  </div>

  <div class="slide-num">01</div>
</section>

<!-- ═══════════════════════════════════════════
     SLIDE 2 — ЧТО МЫ СОЗДАЁМ
═══════════════════════════════════════════ -->
<section class="slide slide-light" id="slide-2">
  <div class="slide-inner">
    <header class="slide-header">
      <div class="slide-kicker">Slide 02</div>
      <h2 class="slide-title">Что мы создаём</h2>
      <p class="slide-sub">
        FlyANG — это не просто продажа самолёта. Это полноценная инфраструктура.
      </p>
    </header>

    <div class="two-col">
      <div class="text-col">
        <ul class="feat-list">
          <li>
            <span class="feat-icon">📦</span>
            <div>
              <strong>Поставка KIT</strong>
              <p>С официальной документацией и поддержкой по типу</p>
            </div>
          </li>
          <li>
            <span class="feat-icon">🔧</span>
            <div>
              <strong>Owner Assisted Build</strong>
              <p>Организованная сборка под руководством инженеров</p>
            </div>
          </li>
          <li>
            <span class="feat-icon">🛠️</span>
            <div>
              <strong>Сервисный центр</strong>
              <p>Склад запчастей и ТО на Кипре</p>
            </div>
          </li>
          <li>
            <span class="feat-icon">🎓</span>
            <div>
              <strong>Обучение</strong>
              <p>Программа перехода на тип и сопровождение пилотов</p>
            </div>
          </li>
          <li>
            <span class="feat-icon">📋</span>
            <div>
              <strong>Документация и регистрация</strong>
              <p>Поддержка на всех этапах оформления</p>
            </div>
          </li>
          <li>
            <span class="feat-icon">🏛️</span>
            <div>
              <strong>Хранение</strong>
              <p>Ангары с полным сервисным сопровождением</p>
            </div>
          </li>
        </ul>

        <div class="accent-note">
          Мы строим авиационную среду, а не просто продукт.
        </div>
      </div>

      <div class="img-col">
        <div class="img-card img-card-tall">
          <img src="/images/hangar-out.png" alt="Hangar exterior" loading="lazy" use:imgReveal />
        </div>
        <div class="img-card">
          <img src="/images/hangar-in.png" alt="Hangar interior" loading="lazy" use:imgReveal />
        </div>
      </div>
    </div>
  </div>

  <div class="slide-num">02</div>
</section>

<!-- ═══════════════════════════════════════════
     SLIDE 3 — БИЗНЕС-МОДЕЛЬ
═══════════════════════════════════════════ -->
<section class="slide slide-dark" id="slide-3">
  <div class="slide-inner">
    <header class="slide-header slide-header-light">
      <div class="slide-kicker slide-kicker-light">Slide 03</div>
      <h2 class="slide-title slide-title-light">Бизнес-модель</h2>
      <p class="slide-sub slide-sub-light">
        Многослойная модель с повторяющимися доходами, а не разовая продажа.
      </p>
    </header>

    <div class="revenue-grid">
      {#each [
        { n: "01", title: "Маржа с KIT",           desc: "Продажа авиационного KIT с официальной документацией и поддержкой" },
        { n: "02", title: "Owner Assisted Build",   desc: "Услуга сборки под руководством — организация, инженеры, процессы" },
        { n: "03", title: "Сервис и ТО",            desc: "Техническое обслуживание, склад запчастей, ангарное хранение" },
        { n: "04", title: "Обучение",               desc: "Программы перехода на тип, сопровождение пилотов, консультации" },
        { n: "05", title: "Пакеты владения",         desc: "Коллективное владение, клубный формат, пакеты часов" },
        { n: "06", title: "Цифровая платформа",     desc: "Инструменты управления, документация, партнёрские модули" },
      ] as item}
        <div class="rev-card">
          <div class="rev-num">{item.n}</div>
          <div class="rev-title">{item.title}</div>
          <div class="rev-desc">{item.desc}</div>
        </div>
      {/each}
    </div>

    <div class="biz-img-row">
      <div class="biz-img-card">
        <img src="/images/staff-room.png" alt="Workshop" loading="lazy" use:imgReveal />
      </div>
      <div class="biz-img-card">
        <img src="/images/developing.png" alt="Development phase" loading="lazy" use:imgReveal />
      </div>
    </div>
  </div>

  <div class="slide-num slide-num-light">03</div>
</section>

<!-- ═══════════════════════════════════════════
     SLIDE 4 — ДЛЯ КОГО
═══════════════════════════════════════════ -->
<section class="slide slide-light" id="slide-4">
  <div class="slide-inner">
    <header class="slide-header">
      <div class="slide-kicker">Slide 04</div>
      <h2 class="slide-title">Для кого FlyANG</h2>
      <p class="slide-sub">
        Мы соединяем реальную авиацию и цифровую экономику.
      </p>
    </header>

    <div class="audience-grid">
      <div class="audience-card audience-fly">
        <div class="aud-icon">✈️</div>
        <div class="aud-label">Для клиентов</div>
        <ul class="aud-list">
          <li>Частное владение самолётом</li>
          <li>Владение через компанию</li>
          <li>Коллективное владение</li>
          <li>Пакеты лётных часов</li>
          <li>Клубный формат</li>
        </ul>
      </div>

      <div class="audience-card audience-inv">
        <div class="aud-icon">💼</div>
        <div class="aud-label">Для инвесторов</div>
        <ul class="aud-list">
          <li>Участие в развитии инфраструктуры</li>
          <li>Участие в цифровой платформе</li>
          <li>Токенизированная координационная модель</li>
          <li>Пресейл этап — 10 недель</li>
        </ul>
      </div>
    </div>

    <div class="audience-img">
      <div class="aud-img-wrap">
        <img src="/images/airport-concept.png" alt="Airport concept" loading="lazy" use:imgReveal />
      </div>
      <div class="aud-img-wrap">
        <img src="/images/staff.png" alt="Team" loading="lazy" use:imgReveal />
      </div>
    </div>
  </div>

  <div class="slide-num">04</div>
</section>

<!-- ═══════════════════════════════════════════
     SLIDE 5 — ПОЧЕМУ СЕЙЧАС
═══════════════════════════════════════════ -->
<section class="slide slide-accent" id="slide-5">
  <div class="slide-inner">
    <header class="slide-header slide-header-light">
      <div class="slide-kicker slide-kicker-light">Slide 05</div>
      <h2 class="slide-title slide-title-light">Почему сейчас</h2>
      <p class="slide-sub slide-sub-light">
        FlyANG — точка входа в новую модель авиационного владения.
      </p>
    </header>

    <div class="why-layout">
      <div class="why-points">
        <div class="why-card">
          <div class="why-ico">📈</div>
          <div>
            <div class="why-title">Рост частной авиации</div>
            <div class="why-text">Интерес к частному владению самолётом растёт по всей Европе</div>
          </div>
        </div>
        <div class="why-card">
          <div class="why-ico">🏗️</div>
          <div>
            <div class="why-title">Дефицит инфраструктуры</div>
            <div class="why-text">Недостаток сервисной инфраструктуры в Средиземноморском регионе</div>
          </div>
        </div>
        <div class="why-card">
          <div class="why-ico">🔑</div>
          <div>
            <div class="why-title">Новые модели владения</div>
            <div class="why-text">Спрос на альтернативные и коллективные форматы участия</div>
          </div>
        </div>
        <div class="why-card">
          <div class="why-ico">⛓️</div>
          <div>
            <div class="why-title">Авиация и Web3</div>
            <div class="why-text">Синергия реальных активов и цифровых координационных инструментов</div>
          </div>
        </div>
      </div>

      <div class="why-img">
        <div class="why-img-inner">
          <img src="/images/fly-hangar.png" alt="Airport overview" loading="lazy" use:imgReveal />
        </div>
      </div>
    </div>
  </div>

  <div class="slide-num slide-num-light">05</div>
</section>

<!-- ═══════════════════════════════════════════
     FINAL — JOIN THE ECOSYSTEM
═══════════════════════════════════════════ -->
<section class="slide slide-final" id="slide-final">
  <div class="final-overlay"></div>
  <div class="final-inner">

    <!-- Left: text -->
    <div class="final-left">
      <div class="final-eyebrow">FlyANG Ecosystem</div>
      <h2 class="final-title">Join the<br>Ecosystem</h2>
      <p class="final-tagline">Invest. Build. Fly.</p>

      <div class="final-actions">
        <a class="btn-primary" href="/app/dashboard">Open App</a>
        <a class="btn-ghost" href="/app/presale">Join Presale</a>
      </div>

      <div class="final-links">
        <a href="/whitepaper">Whitepaper</a>
        <span>·</span>
        <a href="/vision">Vision</a>
        <span>·</span>
        <a href="/token">Token</a>
      </div>
    </div>

    <!-- Right: big QR -->
    <div class="final-right">
      {#if qrSite}
        <img class="qr-big" src={qrSite} alt="QR flyangt.com" />
      {:else}
        <div class="qr-big-placeholder"></div>
      {/if}
      <div class="qr-big-label">flyangt.com</div>
    </div>

  </div>
</section>

<!-- ═══════════════════════════════════════════
     FIXED NAVIGATION
═══════════════════════════════════════════ -->
<nav class="slide-nav">
  <button class="nav-arrow" on:click={prev} disabled={activeIndex === 0} aria-label="Previous slide">
    ←
  </button>

  <div class="nav-dots">
    {#each SLIDES as slide, i}
      <button
        class="nav-dot"
        class:active={i === activeIndex}
        on:click={() => goTo(i)}
        aria-label="Go to slide {i + 1}"
      ></button>
    {/each}
  </div>

  <button class="nav-arrow" on:click={next} disabled={activeIndex === SLIDES.length - 1} aria-label="Next slide">
    →
  </button>
</nav>

<style>
  /* ───────────────────────────────────────────
     BASE
  ─────────────────────────────────────────── */
  :global(body) {
    margin: 0;
    padding: 0;
  }

  .slide {
    position: relative;
    width: 100%;
    overflow: hidden;
    /* extra bottom padding so content never hides behind nav bar */
    padding-bottom: 80px;
  }

  .slide-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 96px 24px 0;
  }

  .slide-num {
    position: absolute;
    bottom: 88px; /* above nav bar */
    right: 32px;
    font-size: 80px;
    font-weight: 700;
    letter-spacing: -0.04em;
    color: rgba(18, 20, 22, 0.04);
    pointer-events: none;
    user-select: none;
    line-height: 1;
  }

  .slide-num-light {
    color: rgba(255, 255, 255, 0.06);
  }

  /* ───────────────────────────────────────────
     SLIDE HEADER
  ─────────────────────────────────────────── */
  .slide-header {
    text-align: center;
    margin-bottom: 56px;
  }

  .slide-kicker {
    display: inline-block;
    font-size: 13px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--accent, #B08D57);
    font-weight: 600;
    margin-bottom: 14px;
  }

  .slide-title {
    margin: 0;
    font-size: 54px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-main, #121416);
  }

  .slide-sub {
    margin: 16px auto 0;
    max-width: 70ch;
    font-size: 20px;
    line-height: 1.75;
    color: var(--text-muted, rgba(18,20,22,0.6));
  }

  .slide-kicker-light  { color: rgba(176, 141, 87, 0.85); }
  .slide-title-light   { color: #ffffff; }
  .slide-sub-light     { color: rgba(255, 255, 255, 0.72); }
  .slide-header-light  { margin-bottom: 48px; }

  /* ───────────────────────────────────────────
     SLIDE 1 — HERO
  ─────────────────────────────────────────── */
  .slide-hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url("/images/main.webp");
    background-size: cover;
    background-position: center;
    padding-bottom: 80px;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(900px 600px at 80% 20%, rgba(176, 141, 87, 0.25), transparent 60%),
      linear-gradient(155deg, rgba(18,20,22,0.88) 0%, rgba(18,20,22,0.72) 50%, rgba(18,20,22,0.55) 100%);
    pointer-events: none;
  }

  .hero-body {
    position: relative;
    z-index: 2;
    max-width: 760px;
    padding: 120px 24px 40px;
    margin: 0 auto;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 9px 18px;
    border-radius: 999px;
    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.16);
    font-size: 14px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 28px;
  }

  .hero-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: var(--accent, #B08D57);
    box-shadow: 0 0 0 5px rgba(176, 141, 87, 0.25);
  }

  .hero-title {
    margin: 0;
    font-size: 108px;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 0.95;
    background: linear-gradient(135deg, #ffffff 0%, rgba(176,141,87,0.9) 60%, rgba(176,141,87,0.7) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .hero-tagline {
    margin: 18px 0 0;
    font-size: 28px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.82);
    letter-spacing: 0.01em;
  }

  .hero-desc {
    margin: 32px 0 0;
    font-size: 20px;
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.70);
  }

  .hero-list {
    margin: 24px 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .hero-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.82);
  }

  .hero-list li::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--accent, #B08D57);
    flex-shrink: 0;
  }

  .hero-mission {
    margin: 36px 0 0;
    padding: 18px 22px;
    border-radius: 16px;
    background: rgba(176, 141, 87, 0.12);
    border: 1px solid rgba(176, 141, 87, 0.28);
    font-size: 18px;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
  }

  /* ───────────────────────────────────────────
     SLIDE VARIANTS
  ─────────────────────────────────────────── */
  .slide-light {
    background: var(--bg-main, #F6F2EA);
  }

  .slide-dark {
    background:
      radial-gradient(1200px 800px at 80% -10%, rgba(176,141,87,0.12), transparent 60%),
      radial-gradient(900px 600px at -10% 60%, rgba(37,99,235,0.08), transparent 55%),
      #0f1318;
  }

  .slide-accent {
    background:
      radial-gradient(1000px 700px at 10% 10%, rgba(176,141,87,0.18), transparent 60%),
      radial-gradient(800px 500px at 90% 90%, rgba(176,141,87,0.12), transparent 55%),
      #121416;
  }

  /* ───────────────────────────────────────────
     SLIDE 2
  ─────────────────────────────────────────── */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
  }

  .feat-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .feat-list li {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .feat-icon {
    width: 40px;
    height: 40px;
    border-radius: 14px;
    background: rgba(176, 141, 87, 0.10);
    border: 1px solid rgba(176, 141, 87, 0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .feat-list li strong {
    display: block;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-main, #121416);
    margin-bottom: 4px;
  }

  .feat-list li p {
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
    color: var(--text-muted, rgba(18,20,22,0.6));
  }

  .accent-note {
    margin-top: 32px;
    padding: 16px 20px;
    border-radius: 16px;
    background: rgba(176, 141, 87, 0.10);
    border: 1px solid rgba(176, 141, 87, 0.26);
    font-size: 18px;
    font-weight: 500;
    color: rgba(120, 86, 36, 0.92);
    line-height: 1.55;
  }

  .img-col {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .img-card {
    border-radius: 22px;
    overflow: hidden;
    border: 1px solid var(--border-soft, rgba(18,20,22,0.08));
    box-shadow: 0 20px 60px rgba(18,20,22,0.10);
  }

  .img-card img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .img-card-tall img { height: 300px; }

  /* ───────────────────────────────────────────
     SLIDE 3
  ─────────────────────────────────────────── */
  .revenue-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .rev-card {
    padding: 24px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .rev-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.24);
    border-color: rgba(176, 141, 87, 0.24);
  }

  .rev-num {
    font-size: 13px;
    letter-spacing: 0.3em;
    font-weight: 700;
    color: var(--accent, #B08D57);
    margin-bottom: 14px;
  }

  .rev-title {
    font-size: 21px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 10px;
    letter-spacing: -0.01em;
  }

  .rev-desc {
    font-size: 15px;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.55);
  }

  .biz-img-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 24px;
  }

  .biz-img-card {
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .biz-img-card img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  /* ───────────────────────────────────────────
     SLIDE 4
  ─────────────────────────────────────────── */
  .audience-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  .audience-card {
    padding: 32px;
    border-radius: 28px;
    border: 1px solid var(--border-soft, rgba(18,20,22,0.08));
    box-shadow: 0 30px 90px rgba(18,20,22,0.08), 0 8px 22px rgba(18,20,22,0.06);
    background: var(--bg-white, #fff);
  }

  .audience-fly {
    background:
      radial-gradient(600px 300px at 90% -20%, rgba(176,141,87,0.10), transparent 60%),
      var(--bg-white, #fff);
  }

  .audience-inv {
    background:
      radial-gradient(600px 300px at 10% -20%, rgba(37,99,235,0.06), transparent 60%),
      var(--bg-white, #fff);
  }

  .aud-icon {
    font-size: 42px;
    margin-bottom: 16px;
  }

  .aud-label {
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin-bottom: 20px;
    background: linear-gradient(135deg, var(--accent-light, #C9A96E), var(--accent, #B08D57), var(--accent-dark, #8C6B3E));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .aud-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .aud-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 17px;
    color: var(--text-muted, rgba(18,20,22,0.6));
  }

  .aud-list li::before {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: var(--accent, #B08D57);
    flex-shrink: 0;
  }

  .audience-img {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 20px;
  }

  .aud-img-wrap {
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--border-soft, rgba(18,20,22,0.08));
    box-shadow: 0 16px 48px rgba(18,20,22,0.08);
  }

  .aud-img-wrap img {
    width: 100%;
    height: 240px;
    object-fit: cover;
    display: block;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  /* ───────────────────────────────────────────
     SLIDE 5
  ─────────────────────────────────────────── */
  .why-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
  }

  .why-points {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .why-card {
    padding: 22px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.10);
    display: flex;
    gap: 16px;
    align-items: flex-start;
    transition: transform 0.35s ease;
  }

  .why-card:hover { transform: translateX(4px); border-color: rgba(176,141,87,0.28); }

  .why-ico { font-size: 30px; flex-shrink: 0; margin-top: 2px; }

  .why-title {
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 6px;
  }

  .why-text {
    font-size: 16px;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.55);
  }

  .why-img { position: sticky; top: 40px; }

  .why-img-inner {
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.30);
  }

  .why-img-inner img {
    width: 100%;
    height: 480px;
    object-fit: cover;
    display: block;
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  /* ───────────────────────────────────────────
     FINAL SLIDE
  ─────────────────────────────────────────── */
  .slide-final {
    min-height: 100vh;
    display: flex;
    align-items: stretch;
    background-image: url("/images/main.webp");
    background-size: cover;
    background-position: center 40%;
    padding-bottom: 80px;
  }

  .final-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(18,20,22,0.90) 0%, rgba(18,20,22,0.78) 60%, rgba(18,20,22,0.86) 100%);
    pointer-events: none;
  }

  /* Two-column inner */
  .final-inner {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 48px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .final-left {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .final-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
  }

  /* QR — fills right column */
  .qr-big {
    width: 100%;
    max-width: 480px;
    height: auto;
    aspect-ratio: 1 / 1;
    display: block;
    border-radius: 28px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.14);
    backdrop-filter: blur(8px);
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.40);
  }

  .qr-big-placeholder {
    width: 100%;
    max-width: 480px;
    aspect-ratio: 1 / 1;
    border-radius: 28px;
    animation: shimmer 1.8s ease-in-out infinite;
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 200% 100%;
  }

  .qr-big-label {
    font-size: 17px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);
    font-weight: 600;
  }

  .final-eyebrow {
    font-size: 14px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--accent, #B08D57);
    margin-bottom: 20px;
    font-weight: 600;
  }

  .final-title {
    margin: 0;
    font-size: 88px;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.0;
    background: linear-gradient(135deg, #ffffff 0%, rgba(176,141,87,0.85) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .final-tagline {
    margin: 18px 0 0;
    font-size: 26px;
    color: rgba(255, 255, 255, 0.65);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 400;
  }

  .final-actions {
    margin-top: 44px;
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  .btn-primary, .btn-ghost {
    height: 48px;
    padding: 0 28px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
    white-space: nowrap;
  }

  .btn-primary {
    background: var(--accent, #B08D57);
    color: #fff;
    box-shadow: 0 16px 44px rgba(176,141,87,0.40);
    border: 1px solid rgba(176,141,87,0.40);
  }

  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 24px 64px rgba(176,141,87,0.50); }

  .btn-ghost {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.90);
    border: 1px solid rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(12px);
  }

  .btn-ghost:hover { transform: translateY(-2px); background: rgba(255,255,255,0.12); }

  .final-links {
    margin-top: 36px;
    display: flex;
    gap: 12px;
    align-items: center;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.12em;
  }

  .final-links a {
    color: rgba(255, 255, 255, 0.50);
    text-decoration: none;
    transition: color 0.25s ease;
  }

  .final-links a:hover { color: rgba(255, 255, 255, 0.85); }

  /* ───────────────────────────────────────────
     FIXED NAVIGATION BAR
  ─────────────────────────────────────────── */
  .slide-nav {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;

    display: flex;
    align-items: center;
    gap: 16px;

    padding: 10px 20px;
    border-radius: 999px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    background: rgba(18, 20, 22, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.32),
      0 2px 8px rgba(0, 0, 0, 0.20);
  }

  .nav-arrow {
    width: 32px;
    height: 32px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.80);
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
    padding: 0;
    line-height: 1;
  }

  .nav-arrow:hover:not(:disabled) {
    background: rgba(176, 141, 87, 0.20);
    border-color: rgba(176, 141, 87, 0.40);
    color: #fff;
  }

  .nav-arrow:disabled {
    opacity: 0.25;
    cursor: default;
  }

  .nav-dots {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.28);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: background 0.25s ease, transform 0.25s ease, width 0.25s ease;
  }

  .nav-dot.active {
    background: var(--accent, #B08D57);
    width: 22px;
    box-shadow: 0 0 0 3px rgba(176, 141, 87, 0.22);
  }

  .nav-dot:hover:not(.active) {
    background: rgba(255, 255, 255, 0.55);
    transform: scale(1.2);
  }

  /* ───────────────────────────────────────────
     IMAGE SHIMMER
  ─────────────────────────────────────────── */
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  [data-img-state="loading"] {
    background: linear-gradient(90deg, rgba(18,20,22,0.05) 25%, rgba(18,20,22,0.10) 50%, rgba(18,20,22,0.05) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.8s ease-in-out infinite;
  }

  [data-img-state="loaded"] {
    animation: none;
    background: none;
  }

  /* ───────────────────────────────────────────
     RESPONSIVE
  ─────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .revenue-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .hero-title   { font-size: 72px; }
  }

  @media (max-width: 860px) {
    .two-col, .audience-grid, .audience-img,
    .why-layout, .biz-img-row { grid-template-columns: 1fr; }
    .why-img { position: static; }
  }

  @media (max-width: 860px) {
    .final-inner {
      grid-template-columns: 1fr;
      padding: 64px 24px 100px;
      min-height: unset;
      gap: 40px;
    }

    .final-right { align-items: flex-start; }
  }

  @media (max-width: 640px) {
    .slide-inner  { padding: 64px 16px 0; }
    .hero-title   { font-size: 56px; }
    .final-title  { font-size: 44px; }
    .slide-title  { font-size: 30px; }
    .revenue-grid { grid-template-columns: 1fr; }
    .slide-num    { font-size: 56px; bottom: 96px; right: 18px; }
    .final-inner  { padding: 56px 16px 90px; }
  }
</style>
