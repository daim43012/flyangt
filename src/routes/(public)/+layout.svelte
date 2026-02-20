<script>
  import Header from '../../components/Header.svelte';
  import Footer from '../../components/Footer.svelte';
  import FlyingPlanes from '../../components/FlyingPlanes.svelte';
  import "leaflet/dist/leaflet.css";
</script>

<div class="public-layout">
  <!-- SKY -->
  <div class="sky">
    <!-- BACK -->
    <div class="cloud back c1"></div>
    <div class="cloud back c2"></div>
    <div class="cloud back c3"></div>
    <div class="cloud back c4"></div>

    <!-- MID -->
    <div class="cloud mid c5"></div>
    <div class="cloud mid c6"></div>
    <div class="cloud mid c7"></div>
    <div class="cloud mid c8"></div>

    <!-- FRONT -->
    <div class="cloud front c9"></div>
    <div class="cloud front c10"></div>
    <div class="cloud front c11"></div>
    <div class="cloud front c12"></div>
  </div>

  <Header />

  <main class="public-content">
    <FlyingPlanes />
    <slot />
  </main>

  <Footer />
</div>

<style>
  .public-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;

    /* ЯРЧЕ НЕБО, без белого старта */
    background:
      radial-gradient(circle at 18% 12%, rgba(255,255,255,0.45) 0%, transparent 42%),
      radial-gradient(circle at 82% 18%, rgba(255,255,255,0.35) 0%, transparent 45%),
      radial-gradient(circle at 50% 78%, rgba(255,255,255,0.25) 0%, transparent 55%),
      linear-gradient(
        180deg,
        #bfe6ff 0%,
        #a9dcff 28%,
        #b7e6ff 60%,
        #f4fbff 100%
      );
  }

  /* слой неба */
  .sky {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  /* облако */
  .cloud {
    position: absolute;
    border-radius: 1000px;

    /* облако более выделенное */
    background: linear-gradient(
      180deg,
      rgba(255,255,255,1) 0%,
      rgba(255,255,255,0.92) 45%,
      rgba(255,255,255,0.55) 100%
    );

    /* мягкая тень, чтобы облако читалось */
    box-shadow:
      0 18px 60px rgba(255,255,255,0.35),
      0 10px 30px rgba(0,40,90,0.06);
  }

  /* делаем облако объемным */
  .cloud::before,
  .cloud::after {
    content: "";
    position: absolute;
    border-radius: 1000px;
    background: inherit;
  }

  .cloud::before {
    width: 62%;
    height: 95%;
    left: 10%;
    top: -45%;
    opacity: 0.95;
    filter: blur(6px);
  }

  .cloud::after {
    width: 52%;
    height: 80%;
    right: 10%;
    top: -30%;
    opacity: 0.9;
    filter: blur(8px);
  }

  /* глубина */
  .back {
    opacity: 0.45;
    filter: blur(26px);
    transform: scale(0.95);
    animation: driftBack 140s ease-in-out infinite;
  }

  .mid {
    opacity: 0.65;
    filter: blur(18px);
    transform: scale(1);
    animation: driftMid 95s ease-in-out infinite;
  }

  .front {
    opacity: 0.85;
    filter: blur(12px);
    transform: scale(1.05);
    animation: driftFront 70s ease-in-out infinite;
  }

  /* движения в разные стороны */
  @keyframes driftBack {
    0%   { transform: translateX(0) scale(0.95); }
    50%  { transform: translateX(55px) scale(0.95); }
    100% { transform: translateX(0) scale(0.95); }
  }

  @keyframes driftMid {
    0%   { transform: translateX(0) scale(1); }
    50%  { transform: translateX(-85px) scale(1); }
    100% { transform: translateX(0) scale(1); }
  }

  @keyframes driftFront {
    0%   { transform: translateX(0) scale(1.05); }
    50%  { transform: translateX(120px) scale(1.05); }
    100% { transform: translateX(0) scale(1.05); }
  }

  /* Позиции (все видны сразу) */
  /* BACK */
  .c1 { width: 520px; height: 160px; top: 6%; left: 6%; }
  .c2 { width: 420px; height: 140px; top: 16%; left: 62%; }
  .c3 { width: 620px; height: 190px; top: 30%; left: 28%; }
  .c4 { width: 480px; height: 150px; top: 52%; left: 70%; }

  /* MID */
  .c5 { width: 720px; height: 220px; top: 12%; left: 32%; }
  .c6 { width: 560px; height: 180px; top: 38%; left: 10%; }
  .c7 { width: 780px; height: 230px; top: 55%; left: 40%; }
  .c8 { width: 520px; height: 170px; top: 72%; left: 68%; }

  /* FRONT */
  .c9  { width: 900px; height: 260px; top: 22%; left: -2%; }
  .c10 { width: 700px; height: 230px; top: 40%; left: 55%; }
  .c11 { width: 980px; height: 280px; top: 64%; left: 12%; }
  .c12 { width: 640px; height: 210px; top: 78%; left: 45%; }

  /* контент поверх */
  .public-content {
    flex: 1;
    position: relative;
    z-index: 2;
  }

</style>