<script lang="ts">
  import AppHeader from "../../../components/App/AppHeader.svelte";
  import Sidebar from "../../../components/App/Sidebar.svelte";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { wallet } from "$lib/wallet/wallet.store";
  import FlyingPlanes from "../../../components/FlyingPlanes.svelte";
  import { clog } from "$lib/utils/clientLog";
  import AdvisorPopup from "../../../components/App/advisor/AdvisorPopup.svelte";
  import PageTourOverlay from "../../../components/App/onboarding/PageTourOverlay.svelte";
  import TourHelpButton from "../../../components/App/onboarding/TourHelpButton.svelte";
  import { findTourForRoute, isPageTourDone, startPageTour } from "$lib/stores/pageTour";

  afterNavigate(({ to }) => {
    const toggle = document.getElementById("app-nav") as HTMLInputElement | null;
    if (toggle) toggle.checked = false;

    // Auto-start page tour on first visit
    const pathname = to?.url?.pathname ?? "";
    const tour = findTourForRoute(pathname);
    if (tour && !isPageTourDone(tour.pageId)) {
      setTimeout(() => startPageTour(tour.pageId), 600);
    }
  });

  onMount(() => {
    wallet.init();

    // iOS bfcache guard: reload on restore so animations/timers aren't frozen
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        clog.warn("app", "pageshow persisted=true → reload");
        window.location.reload();
      }
    };

    // Global JS error catcher → pm2 logs
    const onError = (e: ErrorEvent) => {
      clog.error("app:uncaught", e.message, {
        file: e.filename, line: e.lineno, col: e.colno,
        stack: e.error?.stack?.slice(0, 500),
      });
    };
    const onUnhandled = (e: PromiseRejectionEvent) => {
      const r = e.reason;
      clog.error("app:unhandled-rejection", String(r?.message ?? r), {
        stack: r?.stack?.slice(0, 500),
      });
    };

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandled);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandled);
    };
  });
</script>

<div class="app-shell">
  <!-- SKY -->
  <div class="sky" aria-hidden="true">
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

  <!-- Mobile toggle (CSS-only) -->
  <input id="app-nav" class="nav-toggle" type="checkbox" hidden />
  <label class="nav-backdrop" for="app-nav" aria-hidden="true"></label>

  <aside class="app-sidebar" aria-label="Sidebar navigation">
    <Sidebar />
  </aside>

  <FlyingPlanes />

  <div class="app-main">
    <AppHeader />
    <main class="app-content">
      <slot />
    </main>
  </div>

  <!-- Floating mobile button -->
  <label class="nav-fab" for="app-nav" aria-label="Open menu">
    <span class="nav-fab-lines"></span>
  </label>

  <AdvisorPopup />
  <TourHelpButton />
  <PageTourOverlay />
</div>

<style>
  .app-shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 280px 1fr;

    position: relative;
    overflow: hidden;

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

  /* SKY layer */
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

    background: linear-gradient(
      180deg,
      rgba(255,255,255,1) 0%,
      rgba(255,255,255,0.92) 45%,
      rgba(255,255,255,0.55) 100%
    );

    box-shadow:
      0 18px 60px rgba(255,255,255,0.35),
      0 10px 30px rgba(0,40,90,0.06);
  }

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
  .c1 { width: 520px; height: 160px; top: 6%; left: 6%; }
  .c2 { width: 420px; height: 140px; top: 16%; left: 62%; }
  .c3 { width: 620px; height: 190px; top: 30%; left: 28%; }
  .c4 { width: 480px; height: 150px; top: 52%; left: 70%; }

  .c5 { width: 720px; height: 220px; top: 12%; left: 32%; }
  .c6 { width: 560px; height: 180px; top: 38%; left: 10%; }
  .c7 { width: 780px; height: 230px; top: 55%; left: 40%; }
  .c8 { width: 520px; height: 170px; top: 72%; left: 68%; }

  .c9  { width: 900px; height: 260px; top: 22%; left: -2%; }
  .c10 { width: 700px; height: 230px; top: 40%; left: 55%; }
  .c11 { width: 980px; height: 280px; top: 64%; left: 12%; }
  .c12 { width: 640px; height: 210px; top: 78%; left: 45%; }

  /* Поднимаем реальный UI поверх облаков */
  .app-sidebar,
  .app-main {
    position: relative;
    z-index: 2;
  }

  /* Планеры поверх облаков (если надо) */
  :global(.flying-planes),
  :global(.FlyingPlanes) {
    position: relative;
    z-index: 2;
  }

  .app-sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    padding: 18px 14px;
  }

  .app-main {
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .app-content {
    padding: 22px 22px 40px;
    width: 100%;
  }

  /* --- Mobile: превращаем sidebar в drawer --- */
  .nav-backdrop {
    display: none;
  }

  .nav-fab {
    display: none;
  }

  @media (max-width: 980px) {
    .app-shell {
      grid-template-columns: 1fr;
    }

    .app-sidebar {
      position: fixed;
      z-index: 50;
      inset: 0 auto 0 0;
      width: 300px;
      transform: translateX(-105%);
      transition: transform 0.35s ease;
      background: rgba(246, 248, 252, 0.92);
      backdrop-filter: blur(14px);
      border-right: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
    }

    .nav-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 40;
      opacity: 0;
      pointer-events: none;
      background: rgba(15, 23, 42, 0.35);
      transition: opacity 0.35s ease;
    }

    .nav-toggle:checked ~ .app-sidebar {
      transform: translateX(0);
    }

    .nav-toggle:checked ~ .nav-backdrop {
      opacity: 1;
      pointer-events: auto;
    }

    .app-content {
      padding: 18px 14px 32px;
    }

    .nav-fab {
      display: grid;
      place-items: center;
      position: fixed;
      right: 14px;
      bottom: 14px;
      width: 54px;
      height: 54px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(15, 23, 42, 0.08);
      box-shadow:
        0 18px 60px rgba(15, 23, 42, 0.12),
        0 6px 18px rgba(15, 23, 42, 0.08);
      cursor: pointer;
      z-index: 60;
    }

    .nav-fab-lines {
      width: 18px;
      height: 12px;
      position: relative;
      display: block;
    }

    .nav-fab-lines::before,
    .nav-fab-lines::after,
    .nav-fab-lines {
      content: "";
      background: #0f172a;
      border-radius: 999px;
    }

    .nav-fab-lines {
      background: #0f172a;
      height: 2px;
    }

    .nav-fab-lines::before {
      position: absolute;
      top: -5px;
      left: 0;
      width: 18px;
      height: 2px;
    }

    .nav-fab-lines::after {
      position: absolute;
      top: 5px;
      left: 0;
      width: 18px;
      height: 2px;
    }
  }
</style>