<script lang="ts">
  import { onMount } from "svelte";
  import { wallet } from "$lib/wallet/wallet.store";
  import WalletProviderPicker from "./WalletProviderPicker.svelte";
  import { get } from "svelte/store";
  import { invalidateAll } from "$app/navigation";
  import { cleanupModal } from "$lib/wallet/walletconnect";
  import { isPolygon } from "$lib/wallet/chains";
  import { clog } from "$lib/utils/clientLog";

  let open = false;
  let copied = false;
  let taskBusy = false;
  let taskError = "";

  $: status = $wallet.status;
  $: addr = $wallet.address;
  $: chainId = $wallet.chainId;
  $: providerName = $wallet.providerName || $wallet.providerId || "Wallet";

  function short(a: string) {
    return `${a.slice(0, 6)}…${a.slice(-4)}`;
  }

  function close() {
    open = false;
  }

  function toggle() {
    open = !open;
  }

  async function copyAddress() {
    if (!addr) return;
    try {
      await navigator.clipboard.writeText(addr);
      copied = true;
      setTimeout(() => (copied = false), 900);
    } catch {}
  }


  async function completeWalletTaskViaServer() {
    taskError = "";
    taskBusy = true;

    try {
      const s = get(wallet);
      if (!s.address || !s.provider) throw new Error("Wallet not connected");
      if (s.status === "wrong_network") throw new Error("Wrong network.");

      clog.info("wallet:task", "start", { addr: s.address, provider: s.providerId ?? "?" });

      const stRes = await fetch("/api/airdrop/wallet/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: s.address }),
      });

      const stJson = await stRes.json();

      if (!stRes.ok) {
        if (stJson?.error === "wallet_mismatch") {
          const r = stJson.registered;
          throw new Error(`Your account is linked to wallet ${r.slice(0, 6)}…${r.slice(-4)}. Please switch to it in your wallet app.`);
        }
        throw new Error(stJson?.error || "Status error");
      }

      if (stJson?.needsSignature === false) {
        clog.info("wallet:task", "no signature needed, done");
        await invalidateAll();
        return;
      }

      clog.info("wallet:task", "requesting nonce");
      const nonceRes = await fetch("/api/airdrop/wallet/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: s.address,
          provider: s.providerName || s.providerId || null,
        }),
      });

      const nonceJson = await nonceRes.json();
      if (!nonceRes.ok) {
        if (nonceJson?.error === "wallet_mismatch") {
          const r = nonceJson.registered;
          throw new Error(`Your account is linked to wallet ${r.slice(0, 6)}…${r.slice(-4)}. Please switch to it in your wallet app.`);
        }
        throw new Error(nonceJson?.error || "Nonce error");
      }

      const { message } = nonceJson;

      clog.info("wallet:task", "calling personal_sign");
      const signature = await s.provider.request({
        method: "personal_sign",
        params: [message, s.address],
      });
      clog.info("wallet:task", "personal_sign done");

      const verifyRes = await fetch("/api/airdrop/wallet/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: s.address,
          message,
          signature,
        }),
      });

      const verifyJson = await verifyRes.json();
      if (!verifyRes.ok) {
        if (verifyJson?.error === "wallet_mismatch") {
          const r = verifyJson.registered;
          throw new Error(`Your account is linked to wallet ${r.slice(0, 6)}…${r.slice(-4)}. Please switch to it in your wallet app.`);
        }
        throw new Error(verifyJson?.error || "Verify error");
      }

      clog.info("wallet:task", "verify ok, invalidating");
      await invalidateAll();
    } catch (e: any) {
      const msg = String(e?.message ?? e ?? "Error");
      clog.error("wallet:task", "error", { err: e?.message, code: e?.code });
      taskError = msg;
    } finally {
      taskBusy = false;
    }
  }

  async function connectClick() {
    taskError = "";
    close();

    clog.info("wallet:connect", "button clicked");
    await wallet.connect();

    const s = get(wallet);
    clog.info("wallet:connect", "after connect", { status: s.status, addr: s.address ?? "null", provider: s.providerId ?? "?" });
    if (s.status === "connected" && s.address) {
      await completeWalletTaskViaServer();
    }

    // Ensure AppKit modal and any injected body styles are fully cleaned up
    // after the entire connect + sign flow completes on mobile.
    cleanupModal();
    // Delayed safety net: modal elements may be re-injected asynchronously
    setTimeout(cleanupModal, 500);
    setTimeout(cleanupModal, 2000);
  }

  function disconnectClick() {
    wallet.disconnect();
    close();
  }

  onMount(() => {
    wallet.init();

    const onDoc = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest?.(".wp-wrap")) open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") open = false;
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  });
</script>

<div class="wp-wrap">
  <!-- ✅ CONNECTED -->
  {#if status === "connected" && addr}
    <button
      class="wp-pill"
      type="button"
      on:click={toggle}
      aria-expanded={open}
    >
      <span class="wp-dot" aria-hidden="true"></span>
      <span class="wp-addr">{short(addr)}</span>
      <span class="wp-chev" aria-hidden="true">▾</span>
    </button>

    {#if open}
      <div class="wp-menu" role="menu" aria-label="Wallet menu">
        <div class="wp-row wp-row--top">
          <div class="wp-title">{providerName}</div>
          <div class="wp-sub">
            {isPolygon(chainId) ? "Polygon" : (chainId ?? "Unknown")}
          </div>
        </div>

        <!-- ✅ НИКАКОГО выбора кошелька, пока connected -->

        <button class="wp-item" type="button" on:click={copyAddress}>
          <span class="wp-ico">⧉</span>
          <span>{copied ? "Copied" : "Copy address"}</span>
        </button>

        <a
          class="wp-item"
          href={"https://polygonscan.com/address/" + addr}
          target="_blank"
          rel="noreferrer"
        >
          <span class="wp-ico">↗</span>
          <span>Open in Polygonscan</span>
        </a>

        <div class="wp-sep"></div>

        <button
          class="wp-item wp-item--danger"
          type="button"
          on:click={disconnectClick}
        >
          <span class="wp-ico">⏻</span>
          <span>Disconnect</span>
        </button>
      </div>
    {/if}
  {:else if status === "connecting" || status === "initializing"}
    <button class="wp-pill wp-pill--disabled" type="button" disabled>
      <span class="wp-spinner" aria-hidden="true"></span>
      <span class="wp-addr"
        >{status === "initializing" ? "Connecting…" : "Connecting…"}</span
      >
    </button>

    <!-- ✅ WRONG NETWORK -->
  {:else if status === "wrong_network"}
    <button
      class="wp-pill wp-pill--warn"
      type="button"
      on:click={toggle}
      aria-expanded={open}
    >
      <span class="wp-dot wp-dot--warn" aria-hidden="true"></span>
      <span class="wp-addr">Switch to Polygon</span>
      <span class="wp-chev" aria-hidden="true">▾</span>
    </button>

    {#if open}
      <div class="wp-menu" role="menu" aria-label="Wallet connect menu">
        <div class="wp-row wp-row--top">
          <div class="wp-title">Choose wallet</div>
          <div class="wp-sub">Select provider, then connect</div>
        </div>

        <!-- ✅ выбор показываем когда НЕ connected -->
        <WalletProviderPicker />

        <div class="wp-sep"></div>

        <button class="wp-item" type="button" on:click={connectClick}>
          <span class="wp-ico">→</span>
          <span>Connect</span>
        </button>
      </div>
    {/if}

    <!-- ✅ NO PROVIDER -->
  {:else if status === "no_provider"}
    <button
      class="wp-pill"
      type="button"
      on:click={toggle}
      aria-expanded={open}
    >
      <span class="wp-dot wp-dot--off" aria-hidden="true"></span>
      <span class="wp-addr">Connect wallet</span>
      <span class="wp-chev" aria-hidden="true">▾</span>
    </button>

    {#if open}
      <div class="wp-menu" role="menu" aria-label="Wallet connect menu">
        <div class="wp-row wp-row--top">
          <div class="wp-title">Wallet</div>
          <div class="wp-sub">No provider detected</div>
        </div>

        <a
          class="wp-item"
          href="https://metamask.io/"
          target="_blank"
          rel="noreferrer"
        >
          <span class="wp-ico">↗</span>
          <span>Install MetaMask</span>
        </a>
      </div>
    {/if}
  {:else}
    <button
      class="wp-pill"
      type="button"
      on:click={toggle}
      aria-expanded={open}
    >
      <span class="wp-dot wp-dot--off" aria-hidden="true"></span>
      <span class="wp-addr">Connect wallet</span>
      <span class="wp-chev" aria-hidden="true">▾</span>
    </button>

    {#if open}
      <div class="wp-menu" role="menu" aria-label="Wallet connect menu">
        <div class="wp-row wp-row--top">
          <div class="wp-title">Choose wallet</div>
          <div class="wp-sub">Select provider, then connect</div>
        </div>
        <WalletProviderPicker />

        <div class="wp-sep"></div>

        <button class="wp-item" type="button" on:click={connectClick}>
          <span class="wp-ico">→</span>
          <span>Connect</span>
        </button>
      </div>
    {/if}
  {/if}

  {#if (status === "error" || status === "wrong_network") && $wallet.lastError}
    <div class="wp-hint">{$wallet.lastError}</div>
  {/if}

  {#if taskBusy}
    <div class="wp-hint">Processing…</div>
  {:else if taskError}
    <div class="wp-hint">{taskError}</div>
  {/if}
</div>

<style>
  .wp-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  /* ── Pill trigger ── */
  .wp-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 38px;
    padding: 0 16px;
    border-radius: 999px;

    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    color: var(--text-main);

    box-shadow:
      0 8px 22px rgba(18, 20, 22, 0.06),
      0 2px 6px rgba(18, 20, 22, 0.04);
    cursor: pointer;
    user-select: none;
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease,
      border-color 0.35s ease;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .wp-pill:hover {
    transform: translateY(-2px);
    box-shadow:
      0 14px 36px rgba(18, 20, 22, 0.09),
      0 4px 12px rgba(18, 20, 22, 0.05);
    border-color: rgba(176, 141, 87, 0.35);
  }

  .wp-pill:active {
    transform: translateY(0);
  }

  .wp-pill--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .wp-pill--warn {
    border-color: rgba(245, 158, 11, 0.35);
  }

  /* ── Status dot ── */
  .wp-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #22c55e;
    box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
  }

  .wp-dot--off {
    background: var(--text-muted);
    box-shadow: none;
    opacity: 0.5;
  }

  .wp-dot--warn {
    background: #f59e0b;
    box-shadow: 0 0 6px rgba(245, 158, 11, 0.4);
  }

  .wp-addr {
    font-weight: 600;
    letter-spacing: 0.01em;
    font-size: 13px;
    line-height: 1;
    white-space: nowrap;
  }

  .wp-chev {
    font-size: 11px;
    color: var(--text-muted);
    opacity: 0.6;
  }

  .wp-spinner {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    border: 2px solid rgba(176, 141, 87, 0.2);
    border-top-color: var(--accent);
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ── Dropdown menu ── */
  .wp-menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 280px;
    padding: 10px;
    border-radius: 20px;

    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    color: var(--text-main);

    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.1),
      0 8px 22px rgba(18, 20, 22, 0.07);
    z-index: 999999;
    animation: pop 0.2s ease-out;
  }

  @keyframes pop {
    from {
      transform: translateY(-6px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .wp-row--top {
    padding: 10px 12px 8px;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .wp-title {
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .wp-sub {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    opacity: 0.7;
  }

  .wp-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 14px;

    border: 1px solid transparent;
    background: transparent;
    color: var(--text-main);
    text-decoration: none;
    cursor: pointer;

    font-weight: 600;
    font-size: 13px;
    transition:
      background 0.25s ease,
      border-color 0.25s ease,
      transform 0.25s ease;
  }

  .wp-item:hover {
    background: rgba(176, 141, 87, 0.05);
    border-color: rgba(176, 141, 87, 0.12);
    transform: translateX(2px);
  }

  .wp-item--danger {
    color: #ef4444;
  }

  .wp-item--danger:hover {
    background: rgba(239, 68, 68, 0.05);
    border-color: rgba(239, 68, 68, 0.12);
  }

  .wp-ico {
    width: 20px;
    text-align: center;
    font-size: 14px;
    color: var(--accent);
    opacity: 0.8;
  }

  .wp-item--danger .wp-ico {
    color: #ef4444;
  }

  .wp-sep {
    height: 1px;
    margin: 6px 10px;
    background: var(--border-soft);
  }

  .wp-hint {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    max-width: 360px;
    padding: 10px 14px;
    border-radius: 14px;

    border: 1px solid rgba(239, 68, 68, 0.18);
    background: var(--bg-white);
    box-shadow:
      0 12px 36px rgba(18, 20, 22, 0.08),
      0 4px 12px rgba(18, 20, 22, 0.05);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    z-index: 70;
  }
</style>
