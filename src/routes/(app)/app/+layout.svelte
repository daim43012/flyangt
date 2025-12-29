<script>
  import AppHeader from '../../../components/App/AppHeader.svelte';
  import Sidebar from '../../../components/App/Sidebar.svelte';
</script>

<div class="app-shell">
  <!-- Mobile toggle (CSS-only) -->
  <input id="app-nav" class="nav-toggle" type="checkbox" hidden />
  <label class="nav-backdrop" for="app-nav" aria-hidden="true"></label>

  <aside class="app-sidebar" aria-label="Sidebar navigation">
    <Sidebar />
  </aside>

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
</div>

<style>
  .app-shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 280px 1fr;
    background: #f6f8fc;
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
    max-width: 1200px;
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
