<script lang="ts">
  import { page } from "$app/stores";

  const nav = [
    { href: "/app/dashboard", label: "Dashboard", icon: "grid" },
    { href: "/app/config", label: "ANG-01 Config", icon: "plane" },
    { href: "/app/finance", label: "Finance & Pools", icon: "chart" },
    { href: "/app/rewards", label: "Rewards Station", icon: "bolt" },
    { href: "/app/advisor", label: "Flight Advisor", icon: "compass" },
    { href: "/app/documents", label: "Document Center", icon: "doc" },
  ];

  const isActive = (pathname: any, href: any) =>
    pathname === href || pathname.startsWith(href + "/");

  $: user = $page.data?.user;
  $: email = user?.email ?? null;
  async function logout() {
  try {
    await fetch('/api/logout', {
      method: 'POST'
    });

    window.location.href = '/login';
  } catch (e) {
    console.error('Logout failed', e);
  }
}

</script>

<div class="sidebar-card">
  <div class="brand">
    <div class="brand-mark">FLYANGT</div>
    <div class="brand-sub">Fly Ang Technology</div>
  </div>

  <nav class="nav" aria-label="App navigation">
    {#each nav as item}
      <a
        class="nav-item {isActive($page.url.pathname, item.href)
          ? 'is-active'
          : ''}"
        href={item.href}
      >
        <span class="nav-ic" aria-hidden="true">
          {#if item.icon === "grid"}
            ⊞
          {/if}
          {#if item.icon === "plane"}
            ✈︎
          {/if}
          {#if item.icon === "chart"}
            📊
          {/if}
          {#if item.icon === "bolt"}
            ⚡
          {/if}
          {#if item.icon === "compass"}
            🧭
          {/if}
          {#if item.icon === "doc"}
            📄
          {/if}
        </span>
        <span class="nav-label">{item.label}</span>
      </a>
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
      <button class="mini-btn" type="button" aria-label="Settings">⚙️</button>
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

  .nav {
    padding: 10px 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 12px;
    border-radius: 14px;
    color: #0f172a;
    text-decoration: none;
    border: 1px solid transparent;
    transition:
      background 0.35s ease,
      box-shadow 0.35s ease,
      transform 0.35s ease;
  }

  .nav-item:hover {
    background: rgba(15, 23, 42, 0.04);
  }

  .nav-item.is-active {
    background: #2563eb;
    color: #ffffff;
    box-shadow:
      0 14px 36px rgba(37, 99, 235, 0.28),
      0 6px 14px rgba(15, 23, 42, 0.1);
  }

  .nav-ic {
    width: 32px;
    height: 32px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.05);
    font-size: 15px;
  }

  .nav-item.is-active .nav-ic {
    background: rgba(255, 255, 255, 0.16);
  }

  .nav-label {
    font-size: 13px;
    font-weight: 700;
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
