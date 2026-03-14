<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  const BRAND = "FLYANGT";

  const nav = [
    { label: "Models", href: "/models" },
    { label: "Showroom", href: "/showroom" },
    { label: "Configurator", href: "/configurator" },
    { label: "Vision", href: "/vision" },
    { label: "Tokenization", href: "/tokenization" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Hub", href: "/app/dashboard" },
  ];

  let mobileOpen = false;

  function toggleMobile() {
    mobileOpen = !mobileOpen;
  }

  function closeMobile() {
    mobileOpen = false;
  }

  $: $page.url.pathname, (mobileOpen = false);

  onMount(() => {
    const onResize = () => {
      if (window.innerWidth > 860) mobileOpen = false;
    };
    window.addEventListener("resize", onResize);

    const onKeyDown = (e: any) => {
      if (e.key === "Escape") mobileOpen = false;
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  });
</script>

<header class="header">
  <div class="header-glow" aria-hidden="true"></div>

  <div class="container">
    <a href="/" class="logo" aria-label="Home">
      <span class="logo-mark">{BRAND}</span>
      <span class="logo-tag">Aviation ecosystem</span>
    </a>

    <nav class="nav" aria-label="Primary">
      {#each nav as item}
        <a
          href={item.href}
          class="nav-link"
          class:active={$page.url.pathname.startsWith(item.href)}
        >
          <span class="nav-label">{item.label}</span>
          <span class="nav-underline" aria-hidden="true"></span>
        </a>
      {/each}

      <div class="nav-divider" aria-hidden="true"></div>

      {#if $page.data?.user}
        <a class="user-pill" href="/app/dashboard" aria-label="Go to dashboard">
          <span class="avatar" aria-hidden="true">
            {String($page.data.user.email ?? "U").slice(0, 1)}
          </span>
          <span class="user-meta">
            <span class="user-kicker">SIGNED IN</span>
            <span class="user-email">{String($page.data.user.email)}</span>
          </span>
        </a>
      {:else}
        <a class="login-btn" href="/login">
          <span class="login-dot" aria-hidden="true"></span>
          Login
        </a>
      {/if}
    </nav>

    <button
      class="burger"
      type="button"
      aria-label="Open menu"
      aria-expanded={mobileOpen}
      on:click={toggleMobile}
    >
      <span class:open={mobileOpen}></span>
      <span class:open={mobileOpen}></span>
      <span class:open={mobileOpen}></span>
    </button>
  </div>
</header>

{#if mobileOpen}
  <div class="overlay" aria-hidden="false">
    <button
      class="backdrop"
      type="button"
      aria-label="Close menu"
      on:click={closeMobile}
    ></button>

    <aside class="drawer" role="dialog" aria-label="Menu">
      <div class="drawer-top">
        <div class="drawer-title">Menu</div>
        <button
          class="close"
          type="button"
          aria-label="Close menu"
          on:click={closeMobile}
        >
          ✕
        </button>
      </div>

      <nav class="drawer-links">
        {#each nav as item}
          <a
            href={item.href}
            class="drawer-link"
            class:active={$page.url.pathname.startsWith(item.href)}
            on:click={closeMobile}
          >
            <span>{item.label}</span>
            <span class="drawer-chevron" aria-hidden="true">›</span>
          </a>
        {/each}

        <div class="drawer-auth">
          {#if $page.data?.user}
            <a class="drawer-user" href="/app/dashboard" on:click={closeMobile}>
              <span class="avatar" aria-hidden="true">
                {String($page.data.user.email ?? "U").slice(0, 1)}
              </span>
              <span class="user-meta">
                <span class="user-kicker">SIGNED IN</span>
                <span class="user-email">{String($page.data.user.email)}</span>
              </span>
            </a>
          {:else}
            <a class="drawer-login" href="/login" on:click={closeMobile}
              >Login</a
            >
          {/if}
        </div>
      </nav>

      <div class="drawer-hint">
        Structured access to aircraft, services, documentation, and
        participation.
      </div>
    </aside>
  </div>
{/if}

<style>
  /* =========================
   HEADER — premium smoked glass (brighter text + brighter pill borders)
   ========================= */

  .header {
    position: sticky;
    top: 0;
    z-index: 60;
    overflow: visible;

    background: linear-gradient(
        180deg,
        rgba(15, 23, 42, 0.58) 0%,
        rgba(15, 23, 42, 0.36) 100%
      ),
      radial-gradient(
        900px 240px at 25% 0%,
        rgba(56, 189, 248, 0.18),
        transparent 60%
      ),
      radial-gradient(
        900px 260px at 75% 0%,
        rgba(37, 99, 235, 0.12),
        transparent 62%
      );

    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);

    border-bottom: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 18px 60px rgba(2, 6, 23, 0.38);
  }

  .header-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;

    background: radial-gradient(
        900px 240px at 25% 0%,
        rgba(56, 189, 248, 0.18),
        transparent 58%
      ),
      radial-gradient(
        800px 240px at 75% 0%,
        rgba(37, 99, 235, 0.14),
        transparent 60%
      );

    filter: blur(16px);
    opacity: 0.95;
  }

  .container {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 18px 24px;
    min-height: 78px;

    display: flex;
    align-items: center;
    gap: 18px;
  }

  /* =========================
   LOGO
   ========================= */

  .logo {
    display: grid;
    gap: 4px;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.98);
  }

  .logo-mark {
    font-weight: 900;
    letter-spacing: 0.12em;
    font-size: 14px;
    text-transform: uppercase;
    font-style: italic;
    color: rgba(255, 255, 255, 0.98);
  }

  .logo-tag {
    font-size: 10px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(226, 232, 240, 0.82);
  }

  /* =========================
   NAV
   ========================= */

  .nav {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .nav-divider {
    width: 1px;
    height: 22px;
    background: rgba(255, 255, 255, 0.16);
    margin: 0 4px;
  }

  /* =========================
   PILLS (nav + auth)
   ========================= */

  .nav-link,
  .login-btn,
  .user-pill {
    border: 1px solid rgba(255, 255, 255, 0.22);
    background: rgba(15, 23, 42, 0.3);

    box-shadow:
      0 22px 70px rgba(2, 6, 23, 0.25),
      0 8px 22px rgba(2, 6, 23, 0.2);

    transition:
      transform 0.45s ease,
      box-shadow 0.45s ease,
      background 0.45s ease,
      border-color 0.45s ease,
      color 0.45s ease;
  }

  /* Nav link */
  .nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;

    padding: 10px 14px;
    border-radius: 999px;
    text-decoration: none;

    color: rgba(255, 255, 255, 0.92);
    font-size: 13px;
    font-weight: 600;
  }

  .nav-link:hover {
    transform: translateY(-2px);
    color: rgba(255, 255, 255, 0.98);

    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.35);

    box-shadow:
      0 28px 90px rgba(2, 6, 23, 0.35),
      0 10px 26px rgba(2, 6, 23, 0.25);
  }

  .nav-link.active {
    transform: translateY(-1px);
    color: #ffffff;

    background: rgba(56, 189, 248, 0.25);
    border-color: rgba(186, 230, 253, 0.35);

    box-shadow:
      0 30px 95px rgba(56, 189, 248, 0.28),
      0 10px 30px rgba(2, 6, 23, 0.3);
  }

  /* underline */
  .nav-underline {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 6px;

    height: 2px;
    border-radius: 999px;

    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0),
      rgba(186, 230, 253, 0.95),
      rgba(255, 255, 255, 0)
    );

    transform: scaleX(0);
    opacity: 0;

    transition:
      transform 0.45s ease,
      opacity 0.45s ease;
  }

  .nav-link:hover .nav-underline,
  .nav-link.active .nav-underline {
    transform: scaleX(1);
    opacity: 1;
  }

  /* =========================
   LOGIN
   ========================= */

  .login-btn {
    margin-left: 8px;
    display: inline-flex;
    align-items: center;
    gap: 10px;

    padding: 10px 16px;
    border-radius: 999px;

    color: #ffffff;
    text-decoration: none;
    font-size: 13px;
    font-weight: 900;
  }

  .login-btn:hover {
    transform: translateY(-2px);
    background: rgba(56, 189, 248, 0.25);
    border-color: rgba(186, 230, 253, 0.4);
  }

  .login-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;

    background: linear-gradient(
      135deg,
      rgba(56, 189, 248, 0.92),
      rgba(37, 99, 235, 0.92)
    );

    box-shadow: 0 10px 22px rgba(56, 189, 248, 0.22);
  }

  /* =========================
   USER
   ========================= */

  .user-pill {
    margin-left: 8px;
    display: inline-flex;
    align-items: center;
    gap: 10px;

    padding: 8px 12px 8px 10px;
    border-radius: 999px;

    text-decoration: none;
    color: #ffffff;
    max-width: 320px;
  }

  .user-pill:hover {
    transform: translateY(-2px);
    background: rgba(56, 189, 248, 0.22);
    border-color: rgba(186, 230, 253, 0.35);

    box-shadow:
      0 30px 95px rgba(56, 189, 248, 0.22),
      0 10px 30px rgba(2, 6, 23, 0.3);
  }

  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 999px;

    display: grid;
    place-items: center;

    font-weight: 900;
    font-size: 13px;
    letter-spacing: 0.02em;

    color: #ffffff;

    background: radial-gradient(
        10px 10px at 30% 30%,
        rgba(255, 255, 255, 0.35),
        rgba(255, 255, 255, 0)
      ),
      rgba(56, 189, 248, 0.35);

    border: 1px solid rgba(186, 230, 253, 0.35);
  }

  .user-meta {
    display: grid;
    line-height: 1.1;
    min-width: 0;
  }

  .user-kicker {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 900;
    color: rgba(226, 232, 240, 0.82);
  }

  .user-email {
    font-size: 12px;
    font-weight: 900;
    color: #ffffff;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* =========================
   BURGER
   ========================= */

  .burger {
    display: none;
    margin-left: auto;

    width: 44px;
    height: 44px;
    border-radius: 14px;

    border: 1px solid var(--border-soft);
    background: var(--bg-white);

    cursor: pointer;
    position: relative;
    padding: 0;

    box-shadow:
      0 8px 22px rgba(18, 20, 22, 0.08),
      0 2px 8px rgba(18, 20, 22, 0.05);

    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease;
  }

  .burger:hover {
    transform: translateY(-2px);
    box-shadow:
      0 18px 50px rgba(18, 20, 22, 0.1),
      0 6px 16px rgba(18, 20, 22, 0.07);
  }

  .burger span {
    position: absolute;
    left: 12px;
    right: 12px;

    height: 2px;
    border-radius: 999px;
    background: var(--text-main);

    transition:
      transform 0.22s ease,
      top 0.22s ease,
      opacity 0.22s ease;
  }

  .burger span:nth-child(1) {
    top: 15px;
  }
  .burger span:nth-child(2) {
    top: 21px;
  }
  .burger span:nth-child(3) {
    top: 27px;
  }

  .burger span.open:nth-child(1) {
    top: 21px;
    transform: rotate(45deg);
  }
  .burger span.open:nth-child(2) {
    opacity: 0;
  }
  .burger span.open:nth-child(3) {
    top: 21px;
    transform: rotate(-45deg);
  }

  /* =========================
   OVERLAY + DRAWER
   ========================= */

  .overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(18, 20, 22, 0.32);
    border: none;
    width: 100%;
    height: 100%;
  }

  .drawer {
    position: absolute;
    top: 0;
    right: 0;

    height: 100%;
    width: 82vw;
    max-width: 360px;

    background: #ffffff;
    border-left: 1px solid rgba(18, 20, 22, 0.08);
    box-shadow: -20px 0 60px rgba(18, 20, 22, 0.14);

    padding: 16px;
    z-index: 1000;

    animation: slideIn 0.25s ease;

    display: flex;
    flex-direction: column;

    /* Скруглённый левый край — "карточный" вид */
    border-radius: 24px 0 0 24px;
  }

  @keyframes slideIn {
    from {
      transform: translateX(14px);
      opacity: 0.7;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .drawer-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    padding: 10px 4px 14px;
    border-bottom: 1px solid var(--border-soft);
  }

  .drawer-title {
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    font-weight: 900;
    color: var(--text-muted);
  }

  .close {
    width: 42px;
    height: 42px;
    border-radius: 14px;

    border: 1px solid var(--border-soft);
    background: rgba(18, 20, 22, 0.03);
    color: var(--text-muted);

    cursor: pointer;

    box-shadow:
      0 8px 22px rgba(18, 20, 22, 0.06),
      0 2px 8px rgba(18, 20, 22, 0.04);

    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease,
      background 0.35s ease,
      border-color 0.35s ease,
      color 0.35s ease;
  }

  .close:hover {
    transform: translateY(-2px);
    background: rgba(176, 141, 87, 0.08);
    border-color: rgba(176, 141, 87, 0.28);
    color: var(--accent-dark);

    box-shadow:
      0 18px 50px rgba(176, 141, 87, 0.12),
      0 6px 16px rgba(18, 20, 22, 0.06);
  }

  .drawer-links {
    display: grid;
    gap: 10px;
    padding: 14px 0;
  }

  .drawer-link {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 14px 16px;
    border-radius: 18px;

    border: 1px solid var(--border-soft);
    background: rgba(18, 20, 22, 0.02);

    color: var(--text-main);
    text-decoration: none;

    font-weight: 700;
    font-size: 14px;

    box-shadow:
      0 8px 22px rgba(18, 20, 22, 0.05),
      0 2px 8px rgba(18, 20, 22, 0.03);

    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease,
      background 0.35s ease,
      border-color 0.35s ease;
  }

  .drawer-link:hover {
    transform: translateY(-2px);
    background: rgba(176, 141, 87, 0.06);
    border-color: rgba(176, 141, 87, 0.22);

    box-shadow:
      0 18px 50px rgba(176, 141, 87, 0.1),
      0 6px 16px rgba(18, 20, 22, 0.06);
  }

  .drawer-link.active {
    background: rgba(176, 141, 87, 0.1);
    border-color: rgba(176, 141, 87, 0.3);
    color: var(--accent-dark);
  }

  .drawer-chevron {
    color: var(--text-muted);
    font-size: 18px;
    transform: translateY(-1px);
  }

  .drawer-auth {
    padding-top: 6px;
  }

  .drawer-user {
    display: flex;
    align-items: center;
    gap: 10px;

    padding: 10px 14px;
    border-radius: 18px;

    border: 1px solid var(--border-soft);
    background: rgba(18, 20, 22, 0.02);

    text-decoration: none;
    color: var(--text-main);
  }

  .drawer-login {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    padding: 13px 14px;
    border-radius: 18px;

    border: 1px solid rgba(122, 90, 45, 0.35);
    background: linear-gradient(
      135deg,
      rgba(176, 141, 87, 0.95),
      rgba(120, 86, 36, 0.92)
    );

    color: #ffffff;
    text-decoration: none;
    font-weight: 900;
    font-size: 14px;
    letter-spacing: 0.02em;

    box-shadow:
      0 18px 46px rgba(176, 141, 87, 0.22),
      0 8px 20px rgba(18, 20, 22, 0.08);

    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease;
  }

  .drawer-login:hover {
    transform: translateY(-2px);
    box-shadow:
      0 26px 70px rgba(176, 141, 87, 0.26),
      0 10px 26px rgba(18, 20, 22, 0.1);
  }

  .drawer-hint {
    margin-top: auto;
    padding-top: 12px;

    font-size: 12px;
    line-height: 1.55;

    color: var(--text-muted);
    border-top: 1px solid var(--border-soft);
  }

  /* =========================
   RESPONSIVE
   ========================= */

  @media (max-width: 860px) {
    .nav {
      display: none;
    }
    .burger {
      display: inline-block;
    }
    .container {
      padding: 16px 16px;
      min-height: 72px;
    }
  }

  /* =========================
   REDUCED MOTION
   ========================= */

  @media (prefers-reduced-motion: reduce) {
    .nav-link,
    .nav-underline,
    .burger,
    .burger span,
    .drawer,
    .close,
    .login-btn,
    .user-pill,
    .drawer-link,
    .drawer-login {
      transition: none;
      animation: none;
    }
  }
</style>
