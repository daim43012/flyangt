<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  const BRAND = "FLYANGT";

  const nav = [
    { label: "Fleet", href: "/fleet" },
    { label: "Tokenization", href: "/tokenization" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Blog", href: "/blog" },
  ];

  let mobileOpen = false;

  function toggleMobile() {
    mobileOpen = !mobileOpen;
  }

  function closeMobile() {
    mobileOpen = false;
  }

  // закрывать меню при переходе по роуту
  $: $page.url.pathname, (mobileOpen = false);

  onMount(() => {
    const onResize = () => {
      // если уходим на десктоп — закрыть меню
      if (window.innerWidth > 860) mobileOpen = false;
    };
    window.addEventListener("resize", onResize);

    // ESC закрывает меню
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
  <div class="glow"></div>

  <div class="container">
    <a href="/" class="logo" aria-label="Home">
      {BRAND}
    </a>

    <!-- Desktop nav -->
    <nav class="nav" aria-label="Primary">
      {#each nav as item}
        <a
          href={item.href}
          class="nav-link"
          class:active={$page.url.pathname.startsWith(item.href)}
        >
          <span class="nav-label">{item.label}</span>
          <span class="nav-underline"></span>
        </a>
      {/each}
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
        <a class="login-btn" href="/login">Login</a>
      {/if}
    </nav>

    <!-- Mobile burger -->
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

  <!-- Mobile drawer -->
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
            on:click={closeMobile}>✕</button
          >
        </div>

        <nav class="drawer-links">
          {#each nav as item}
            <a
              href={item.href}
              class="drawer-link"
              class:active={$page.url.pathname.startsWith(item.href)}
              on:click={closeMobile}
            >
              {item.label}
            </a>
          {/each}
        </nav>

        <div class="drawer-hint">On-chain aircraft ownership experience.</div>
      </aside>
    </div>
  {/if}
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(248, 250, 252, 0.92);
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
    overflow: visible;
  }

  .glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
        900px 200px at 25% 0%,
        rgba(37, 99, 235, 0.16),
        transparent 55%
      ),
      radial-gradient(
        700px 200px at 75% 0%,
        rgba(99, 102, 241, 0.12),
        transparent 55%
      );
    filter: blur(6px);
    opacity: 0.9;
  }
  .login-btn {
    margin-left: 10px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.1);
    background: rgba(255, 255, 255, 0.88);
    color: #0f172a;
    text-decoration: none;
    font-size: 13px;
    font-weight: 900;
    box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      background 0.18s ease;
  }

  .login-btn:hover {
    transform: translateY(-1px);
    background: rgba(37, 99, 235, 0.12);
    box-shadow: 0 12px 30px rgba(37, 99, 235, 0.12);
  }

  .user-pill {
    margin-left: 10px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px 8px 10px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.1);
    background: rgba(255, 255, 255, 0.88);
    text-decoration: none;
    color: #0f172a;
    box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      background 0.18s ease;
    max-width: 320px;
  }

  .user-pill:hover {
    transform: translateY(-1px);
    background: rgba(37, 99, 235, 0.12);
    box-shadow: 0 12px 30px rgba(37, 99, 235, 0.12);
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
    color: #0f172a;
    background: radial-gradient(
        10px 10px at 30% 30%,
        rgba(255, 255, 255, 0.9),
        rgba(255, 255, 255, 0)
      ),
      rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(37, 99, 235, 0.2);
  }

  .user-meta {
    display: grid;
    line-height: 1.1;
    min-width: 0;
  }

  .user-kicker {
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 900;
  }

  .user-email {
    font-size: 12px;
    color: #0f172a;
    font-weight: 900;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .container {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 22px 24px;
    min-height: 78px;
    display: flex;
    align-items: center;
    gap: 28px;
  }

  .logo {
    font-weight: 900;
    letter-spacing: 0.1em;
    font-size: 14px;
    text-transform: uppercase;
    font-style: italic;
    color: #0f172a;
    text-decoration: none;
  }

  .nav {
    display: flex;
    gap: 10px;
    margin-left: auto;
    align-items: center;
  }

  .nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 10px 12px;
    border-radius: 999px;
    text-decoration: none;
    color: #475569;
    font-size: 13px;
    transition:
      transform 0.18s ease,
      background 0.18s ease,
      color 0.18s ease,
      box-shadow 0.18s ease;
  }

  .nav-underline {
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: 7px;
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      rgba(37, 99, 235, 0),
      rgba(37, 99, 235, 0.85),
      rgba(79, 70, 229, 0)
    );
    transform: scaleX(0);
    opacity: 0;
    transition:
      transform 0.22s ease,
      opacity 0.22s ease;
  }

  .nav-link:hover {
    color: #0f172a;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
    transform: translateY(-1px);
  }

  .nav-link:hover .nav-underline {
    transform: scaleX(1);
    opacity: 1;
  }

  .nav-link.active {
    color: #0f172a;
    background: rgba(37, 99, 235, 0.14);
    box-shadow: 0 12px 30px rgba(37, 99, 235, 0.12);
  }

  .nav-link.active .nav-underline {
    transform: scaleX(1);
    opacity: 1;
  }

  /* Burger */
  .burger {
    display: none;
    margin-left: auto;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: #fff; /* ✅ непрозрачный */
    cursor: pointer;
    position: relative;
    padding: 0;
    box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
  }

  .burger span {
    position: absolute;
    left: 12px;
    right: 12px;
    height: 2px;
    border-radius: 999px;
    background: #0f172a;
    transition:
      transform 0.2s ease,
      top 0.2s ease,
      opacity 0.2s ease;
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

  /* Overlay */
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(2, 6, 23, 0.62); /* ✅ темно */
    /* ✅ blur только на фоне, но он не влияет на drawer */
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: none;
    width: 100%;
    height: 100%;
  }

  /* Drawer — БЕТОН, никакого backdrop-filter */
  .drawer {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: min(360px, 86vw);

    background: #ffffff !important; /* ✅ железно */
    opacity: 1 !important; /* ✅ на всякий */
    isolation: isolate; /* ✅ отдельный слой */
    transform: translateZ(0); /* ✅ форс GPU слой */

    border-left: 1px solid rgba(15, 23, 42, 0.12);
    box-shadow: -24px 0 70px rgba(2, 6, 23, 0.35);

    padding: 16px;
    z-index: 1000;
    animation: slideIn 0.18s ease;
    display: flex;
    flex-direction: column;
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
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  }

  .drawer-title {
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 900;
  }

  .close {
    width: 40px;
    height: 40px;
    border-radius: 14px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: #ffffff; /* ✅ непрозрачный */
    cursor: pointer;
    box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
  }

  .drawer-links {
    display: grid;
    gap: 10px;
    padding: 14px 0;
  }

  .drawer-link {
    padding: 13px 14px;
    border-radius: 16px;
    border: 1px solid rgba(15, 23, 42, 0.1);
    background: #f8fafc; /* ✅ плотный */
    color: #0f172a;
    text-decoration: none;
    font-weight: 900;
    font-size: 14px;
  }

  .drawer-link.active {
    background: rgba(37, 99, 235, 0.14);
    border-color: rgba(37, 99, 235, 0.24);
  }

  .drawer-hint {
    margin-top: auto;
    padding-top: 12px;
    font-size: 12px;
    color: #64748b;
    line-height: 1.4;
    border-top: 1px solid rgba(15, 23, 42, 0.06);
  }

  @media (max-width: 860px) {
    .nav {
      display: none;
    }
    .burger {
      display: inline-block;
    }
    .container {
      padding: 18px 16px;
      min-height: 72px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .nav-link,
    .nav-underline,
    .burger span,
    .drawer {
      transition: none;
      animation: none;
    }
  }
</style>
