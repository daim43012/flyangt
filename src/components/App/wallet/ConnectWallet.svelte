<script lang="ts">
  import { onMount } from "svelte";
  import { wallet } from "$lib/wallet/wallet.store";
  import WalletProviderPicker from "./WalletProviderPicker.svelte";
  import { get } from "svelte/store";
  import { invalidateAll } from "$app/navigation";

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

  function isPolygon(cid: string | null) {
    return (cid ?? "").toLowerCase() === "0x89";
  }

  async function completeWalletTaskViaServer() {
    taskError = "";
    taskBusy = true;

    try {
      const s = get(wallet);
      if (!s.address || !s.provider) throw new Error("Wallet not connected");
      if (s.status === "wrong_network") throw new Error("Wrong network.");

      const stRes = await fetch("/api/airdrop/wallet/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: s.address }),
      });

      const stJson = await stRes.json();

      if (!stRes.ok) {
        if (stJson?.error === "wallet_mismatch") {
          throw new Error(`Wallet mismatch. Registered: ${stJson.registered}`);
        }
        throw new Error(stJson?.error || "Status error");
      }

      if (stJson?.needsSignature === false) {
        await invalidateAll();
        return;
      }

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
          throw new Error(
            `Wallet mismatch. Registered: ${nonceJson.registered}`,
          );
        }
        throw new Error(nonceJson?.error || "Nonce error");
      }

      const { message } = nonceJson;

      const signature = await s.provider.request({
        method: "personal_sign",
        params: [message, s.address],
      });

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
          throw new Error(
            `Wallet mismatch. Registered: ${verifyJson.registered}`,
          );
        }
        throw new Error(verifyJson?.error || "Verify error");
      }

      await invalidateAll();
    } catch (e: any) {
      taskError = String(e?.message ?? e ?? "Error");
    } finally {
      taskBusy = false;
    }
  }

  async function connectClick() {
    taskError = "";
    close();

    await wallet.connect();

    const s = get(wallet);
    if (s.status === "connected" && s.address) {
      await completeWalletTaskViaServer();
    }
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

    <!-- ✅ IDLE / ERROR -->
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

        <!-- ✅ выбор показываем когда НЕ connected -->
        <WalletProviderPicker />

        <div class="wp-sep"></div>

        <button class="wp-item" type="button" on:click={connectClick}>
          <span class="wp-ico">→</span>
          <span>Connect</span>
        </button>
      </div>
    {/if}
  {/if}

  {#if status === "error" && $wallet.lastError}
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

  /* pill = максимально простой */
  .wp-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 12px;
    border-radius: 999px;

    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(255, 255, 255, 0.75);
    color: #0f172a;

    box-shadow: none;
    cursor: pointer;
    user-select: none;
    transition:
      background 0.12s ease,
      border-color 0.12s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .wp-pill:hover {
    background: rgba(255, 255, 255, 0.92);
    border-color: rgba(15, 23, 42, 0.18);
  }

  .wp-pill:active {
    background: rgba(255, 255, 255, 0.86);
  }

  .wp-pill--disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .wp-pill--warn {
    border-color: rgba(245, 158, 11, 0.35);
  }

  /* точка без свечения */
  .wp-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #22c55e;
    box-shadow: none;
  }

  .wp-dot--off {
    background: rgba(15, 23, 42, 0.35);
  }

  .wp-dot--warn {
    background: #f59e0b;
  }

  .wp-addr {
    font-weight: 700;
    letter-spacing: 0.01em;
    font-size: 13px;
    line-height: 1;
    white-space: nowrap;
  }

  .wp-chev {
    font-size: 12px;
    opacity: 0.55;
  }

  .wp-spinner {
    width: 14px;
    height: 14px;
    border-radius: 999px;
    border: 2px solid rgba(15, 23, 42, 0.18);
    border-top-color: rgba(15, 23, 42, 0.55);
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Dropdown menu = проще */
  .wp-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 260px;
    padding: 8px;
    border-radius: 14px;

    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(255, 255, 255, 0.96);
    color: #0f172a;

    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.1);
    z-index: 999999;
    animation: pop 0.12s ease-out;
  }

  @keyframes pop {
    from {
      transform: translateY(-4px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .wp-row--top {
    padding: 8px 10px 6px;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .wp-title {
    font-weight: 800;
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.8;
  }

  .wp-sub {
    font-size: 12px;
    font-weight: 700;
    opacity: 0.65;
  }

  .wp-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 10px;
    border-radius: 12px;

    border: 1px solid transparent;
    background: transparent;
    color: inherit;
    text-decoration: none;
    cursor: pointer;

    font-weight: 650;
    font-size: 13px;
    transition:
      background 0.12s ease,
      border-color 0.12s ease;
  }

  .wp-item:hover {
    background: rgba(15, 23, 42, 0.04);
    border-color: rgba(15, 23, 42, 0.06);
  }

  .wp-item--danger {
    color: #ef4444;
  }

  .wp-ico {
    width: 18px;
    text-align: center;
    opacity: 0.7;
  }

  .wp-sep {
    height: 1px;
    margin: 6px 8px;
    background: rgba(15, 23, 42, 0.08);
  }

  .wp-hint {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    max-width: 360px;
    padding: 10px 12px;
    border-radius: 12px;

    border: 1px solid rgba(239, 68, 68, 0.2);
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.1);
    font-size: 12px;
    opacity: 0.95;
    z-index: 70;
  }
</style>
