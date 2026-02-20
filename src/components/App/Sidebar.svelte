<script lang="ts">
  import { page } from "$app/stores";

  type NavItem = {
    href: string;
    label: string;
    iconClass: string;
  };

  type NavSection = {
    title: string;
    items: NavItem[];
  };

  const navSections: NavSection[] = [
    {
      title: "Core",
      items: [
        {
          href: "/",
          label: "Home",
          iconClass:
            "fa-solid fa-house w-6 text-center text-lg text-slate-400 group-hover:text-fly-blue",
        },

        {
          href: "/app/dashboard",
          label: "Dashboard",
          iconClass:
            "fa-solid fa-grip w-6 text-center text-lg text-slate-400 group-hover:text-fly-blue",
        },
        {
          href: "/app/config",
          label: "ANG-01 Config",
          iconClass:
            "fa-solid fa-plane w-6 text-center text-lg text-slate-400 group-hover:text-fly-blue",
        },
        {
          href: "/app/documents",
          label: "Document Center",
          iconClass:
            "fa-solid fa-folder-open w-6 text-center text-lg text-slate-400 group-hover:text-fly-blue",
        },
      ],
    },
    {
      title: "Programs",
      items: [
        {
          href: "/app/presale",
          label: "Presale",
          iconClass:
            "fa-solid fa-ticket w-6 text-center text-lg text-slate-400 group-hover:text-fly-blue",
        },
        {
          href: "/app/airdrop",
          label: "Airdrop",
          iconClass:
            "fa-solid fa-parachute-box w-6 text-center text-lg text-slate-400 group-hover:text-fly-blue",
        },
        {
          href: "/app/staking",
          label: "Staking",
          iconClass:
            "fa-solid fa-coins w-6 text-center text-lg text-slate-400 group-hover:text-fly-blue",
        },
        {
          href: "/app/rewards",
          label: "Rewards",
          iconClass:
            "fa-solid fa-gift w-6 text-center text-lg text-slate-400 group-hover:text-fly-blue",
        },
      ],
    },
    {
      title: "Tools",
      items: [
        {
          href: "/app/advisor",
          label: "Flight Advisor",
          iconClass:
            "fa-solid fa-compass w-6 text-center text-lg text-slate-400 group-hover:text-fly-blue",
        },
      ],
    },
  ];

  const isActive = (pathname: string, href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  $: user = $page.data?.user;
  $: email = user?.email ?? null;

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (e) {
      console.error("Logout failed", e);
    }
  }
</script>

<div class="sidebar-card">
  <div class="brand">
    <div class="brand-mark">FLYANGT</div>
    <div class="brand-sub">Fly Ang Technology</div>
  </div>

  <nav class="nav" aria-label="App navigation">
    {#each navSections as section}
      <div class="nav-section">
        <div class="nav-section-title">{section.title}</div>

        <div class="nav-section-items">
          {#each section.items as item}
            <a
              class="nav-item group {isActive($page.url.pathname, item.href)
                ? 'is-active'
                : ''}"
              href={item.href}
            >
              <span class="nav-ic" aria-hidden="true">
                <i class={item.iconClass}></i>
              </span>
              <span class="nav-label">{item.label}</span>
            </a>
          {/each}
        </div>
      </div>
    {/each}
  </nav>

  <div class="sidebar-footer">
    {#if email}
      <a class="user" href="/app/dashboard" aria-label="User profile">
        <div class="avatar">
          {email.slice(0, 1).toUpperCase()}
        </div>

        <div class="user-meta">
          <div class="user-name">{email}</div>
          <div class="user-role">USER</div>
        </div>
      </a>
    {:else}
      <a class="login-cta" href="/login">
        <div class="avatar muted">?</div>
        <div class="user-meta">
          <div class="user-name">Not signed in</div>
          <div class="user-role">Login</div>
        </div>
      </a>
    {/if}

    <div class="footer-actions">
      <a href="/app/settings" aria-label="Settings">
        <button class="mini-btn" type="button">⚙️</button>
      </a>
      <button
        class="mini-btn"
        type="button"
        aria-label="Logout"
        title="Logout"
        on:click={logout}
      >
        ⎋
      </button>
    </div>
  </div>
</div>

<style>
  /* ================================
   FlyANG Sidebar: full styles
   (soft premium glass + mild active)
================================ */

  .sidebar-card {
    height: 100%;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.1),
      0 6px 18px rgba(15, 23, 42, 0.08);
    backdrop-filter: blur(14px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Brand */
  .brand {
    padding: 18px 16px 12px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  }

  .brand-mark {
    font-size: 18px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.03em;
    color: #0f172a;
    line-height: 1;
  }

  .brand-sub {
    margin-top: 6px;
    font-size: 10px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #64748b;
  }

  /* Nav */
  .nav {
    padding: 10px 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    overflow: auto;
  }

  .nav-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .nav-section-title {
    padding: 6px 10px 2px;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #94a3b8;
  }

  .nav-section-items {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 12px;
    border-radius: 14px;
    font-style: italic;
    letter-spacing: -0.03em;
    color: #0f172a;
    text-decoration: none;
    border: 1px solid transparent;
    transition:
      background 0.28s ease,
      box-shadow 0.28s ease,
      transform 0.28s ease,
      border-color 0.28s ease;
  }

  .nav-item:hover {
    background: rgba(15, 23, 42, 0.035);
    border-color: rgba(15, 23, 42, 0.06);
  }

  .nav-item.is-active {
    background: radial-gradient(
        1200px 420px at 25% 20%,
        rgba(37, 99, 235, 0.2),
        transparent 60%
      ),
      radial-gradient(
        1100px 420px at 80% 20%,
        rgba(124, 58, 237, 0.18),
        transparent 62%
      ),
      linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(99, 102, 241, 0.06));
    color: #0f172a;
    box-shadow:
      inset 0 0 0 1px rgba(15, 23, 42, 0.08),
      0 10px 30px rgba(15, 23, 42, 0.1);
    border-color: rgba(15, 23, 42, 0.06);
  }

  /* Icon container */
  .nav-ic {
    width: 32px;
    height: 32px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.05);
    border: 1px solid rgba(15, 23, 42, 0.06);
    transition:
      background 0.28s ease,
      border-color 0.28s ease,
      box-shadow 0.28s ease;
  }

  .nav-ic :global(i) {
    color: #6e7e96; /* slate-600 */
    font-size: 16px;
    font-weight: 600;
    transition:
      color 0.25s ease,
      transform 0.25s ease;
  }

  .nav-item:hover .nav-ic :global(i) {
    color: #2563eb;
    transform: translateY(-1px);
  }

  .nav-item.is-active .nav-ic {
    background: rgba(255, 255, 255, 0.75);
    border-color: rgba(15, 23, 42, 0.08);
    box-shadow:
      0 8px 20px rgba(15, 23, 42, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.55);
  }

  .nav-item.is-active .nav-ic :global(i) {
    color: #1e40af;
    transform: none;
  }

  .nav-label {
    font-size: 14px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #000000;
  }

  .sidebar-footer {
    padding: 12px 12px;
    border-top: 1px solid rgba(15, 23, 42, 0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .user {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    text-decoration: none;
  }

  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    background: rgba(15, 23, 42, 0.08);
    display: grid;
    place-items: center;
    font-weight: 900;
    color: #0f172a;
  }

  .user-meta {
    min-width: 0;
  }

  .user-name {
    font-size: 12px;
    font-weight: 800;
    color: #0f172a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-role {
    margin-top: 2px;
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #64748b;
  }

  .footer-actions {
    display: flex;
    gap: 8px;
  }

  .mini-btn {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(15, 23, 42, 0.1);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .mini-btn:hover {
    transform: translateY(-2px);
  }
</style>
