<script lang="ts">
  import { page } from "$app/stores";
  import { openAdvisor } from "$lib/stores/advisor";

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
        // {
        //   href: "/app/staking",
        //   label: "Staking",
        //   iconClass:
        //     "fa-solid fa-coins w-6 text-center text-lg text-slate-400 group-hover:text-fly-blue",
        // },
        {
          href: "/app/rewards",
          label: "Rewards",
          iconClass:
            "fa-solid fa-gift w-6 text-center text-lg text-slate-400 group-hover:text-fly-blue",
        },
        {
          href: "/app/referral",
          label: "Referral",
          iconClass:
            "fa-solid fa-user-group w-6 text-center text-lg text-slate-400 group-hover:text-fly-blue",
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

    <div class="nav-section">
      <div class="nav-section-title">Tools</div>
      <div class="nav-section-items">
        <button class="nav-item group" type="button" on:click={openAdvisor}>
          <span class="nav-ic" aria-hidden="true">
            <i class="fa-solid fa-compass w-6 text-center text-lg text-slate-400 group-hover:text-fly-blue"></i>
          </span>
          <span class="nav-label">Flight Advisor</span>
        </button>
      </div>
    </div>
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
  .sidebar-card {
    height: 100%;
    border-radius: 20px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Brand */
  .brand {
    padding: 18px 16px 12px;
    border-bottom: 1px solid var(--border-soft);
  }

  .brand-mark {
    font-size: 18px;
    font-weight: 600;
    font-family: var(--font-heading);
    text-transform: uppercase;
    letter-spacing: -0.03em;
    color: var(--text-main);
    line-height: 1;
  }

  .brand-sub {
    margin-top: 6px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--text-muted);
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
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .nav-section-items {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 14px;
    color: var(--text-main);
    text-decoration: none;
    border: 1px solid transparent;
    transition:
      background 0.16s ease,
      border-color 0.16s ease,
      transform 0.16s ease;
  }

  .nav-item:hover {
    background: rgba(176, 141, 87, 0.05);
    border-color: rgba(176, 141, 87, 0.14);
  }

  .nav-item.is-active {
    background: rgba(176, 141, 87, 0.08);
    border-color: rgba(176, 141, 87, 0.22);
    box-shadow: 0 10px 30px rgba(176, 141, 87, 0.08);
  }

  /* Icon container */
  .nav-ic {
    width: 32px;
    height: 32px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    transition:
      background 0.16s ease,
      border-color 0.16s ease;
    flex: 0 0 auto;
  }

  .nav-ic :global(i) {
    color: var(--text-muted);
    font-size: 15px;
    font-weight: 600;
    transition: color 0.16s ease, transform 0.16s ease;
  }

  .nav-item:hover .nav-ic :global(i) {
    color: var(--accent);
    transform: translateY(-1px);
  }

  .nav-item.is-active .nav-ic {
    background: rgba(176, 141, 87, 0.08);
    border-color: rgba(176, 141, 87, 0.22);
  }

  .nav-item.is-active .nav-ic :global(i) {
    color: var(--accent-dark);
  }

  .nav-label {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text-main);
  }

  /* Footer */
  .sidebar-footer {
    padding: 12px;
    border-top: 1px solid var(--border-soft);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .user,
  .login-cta {
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
    background: rgba(176, 141, 87, 0.08);
    border: 1px solid rgba(176, 141, 87, 0.22);
    display: grid;
    place-items: center;
    font-weight: 600;
    font-size: 14px;
    color: var(--accent-dark);
    flex: 0 0 auto;
  }

  .avatar.muted {
    background: var(--bg-white);
    border-color: var(--border-soft);
    color: var(--text-muted);
  }

  .user-meta {
    min-width: 0;
  }

  .user-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-main);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-role {
    margin-top: 2px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .footer-actions {
    display: flex;
    gap: 8px;
    flex: 0 0 auto;
  }

  .mini-btn {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.06),
      0 6px 18px rgba(18, 20, 22, 0.04);
    cursor: pointer;
    transition: transform 0.16s ease, border-color 0.16s ease;
    display: grid;
    place-items: center;
    font-size: 15px;
  }

  .mini-btn:hover {
    transform: translateY(-2px);
    border-color: rgba(176, 141, 87, 0.22);
  }
</style>
