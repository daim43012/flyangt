<script lang="ts">
  import { onMount } from "svelte";
  import { wallet } from "$lib/wallet/wallet.store";
  import WalletProviderPicker from "./WalletProviderPicker.svelte";

  let open = false;
  let copied = false;

  $: status = $wallet.status;
  $: addr = $wallet.address;
  $: chainId = $wallet.chainId;

  function short(a: string) {
    return `${a.slice(0, 6)}…${a.slice(-4)}`;
  }

  function close() {
    open = false;
  }

  function toggle() {
    if (status === "connected") open = !open;
  }

  async function copyAddress() {
    if (!addr) return;
    try {
      await navigator.clipboard.writeText(addr);
      copied = true;
      setTimeout(() => (copied = false), 900);
    } catch {}
  }

  function connectClick() {
    wallet.connect();
  }

  function disconnectClick() {
    wallet.disconnect();
    close();
  }

  function isPolygon(cid: string | null) {
    return (cid ?? "").toLowerCase() === "0x89";
  }

  onMount(() => {
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
  {#if status === "connected" && addr}
    <button class="wp-pill" type="button" on:click={toggle} aria-expanded={open}>
      <span class="wp-dot" aria-hidden="true"></span>
      <span class="wp-addr">{short(addr)}</span>
      <span class="wp-chev" aria-hidden="true">▾</span>
    </button>

   {#if open}
  <div class="wp-menu" role="menu" aria-label="Wallet menu">
    <div class="wp-row wp-row--top">
      <div class="wp-title">Wallet</div>
      <div class="wp-sub">
        {isPolygon(chainId) ? "Polygon" : chainId ?? "Unknown"}
      </div>
    </div>

    <WalletProviderPicker />

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

        <button class="wp-item wp-item--danger" type="button" on:click={disconnectClick}>
          <span class="wp-ico">⏻</span>
          <span>Disconnect</span>
        </button>
      </div>
    {/if}

  {:else if status === "connecting"}
    <button class="wp-pill wp-pill--disabled" type="button" disabled>
      <span class="wp-spinner" aria-hidden="true"></span>
      <span class="wp-addr">Connecting…</span>
    </button>

  {:else if status === "wrong_network"}
    <button class="wp-pill wp-pill--warn" type="button" on:click={connectClick}>
      <span class="wp-dot wp-dot--warn" aria-hidden="true"></span>
      <span class="wp-addr">Switch to Polygon</span>
      <span class="wp-chev" aria-hidden="true">→</span>
    </button>

  {:else if status === "no_provider"}
    <a class="wp-pill" href="https://metamask.io/" target="_blank" rel="noreferrer">
      <span class="wp-dot wp-dot--off" aria-hidden="true"></span>
      <span class="wp-addr">Install wallet</span>
      <span class="wp-chev" aria-hidden="true">↗</span>
    </a>

  {:else}
    <button class="wp-pill" type="button" on:click={connectClick}>
      <span class="wp-dot wp-dot--off" aria-hidden="true"></span>
      <span class="wp-addr">Connect wallet</span>
      <span class="wp-chev" aria-hidden="true">→</span>
    </button>
  {/if}

  {#if status === "error" && $wallet.lastError}
    <div class="wp-hint">{$wallet.lastError}</div>
  {/if}
</div>

<style>
  /* ВАЖНО: этот компонент выглядит как на фото 2 (white pill),
     и будет ок и на светлом фоне, и в хедере поверх прозрачности. */

  .wp-wrap{
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .wp-pill{
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 36px;
    padding: 0 14px;
    border-radius: 999px;

    border: 1px solid rgba(17, 24, 39, 0.08);
    background: rgba(255,255,255,0.92);
    color: #0f172a;

    box-shadow:
      0 8px 18px rgba(15, 23, 42, 0.10),
      0 1px 0 rgba(255,255,255,0.75) inset;

    cursor: pointer;
    user-select: none;
    transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .wp-pill:hover{
    transform: translateY(-1px);
    background: rgba(255,255,255,0.98);
    box-shadow:
      0 10px 22px rgba(15, 23, 42, 0.14),
      0 1px 0 rgba(255,255,255,0.8) inset;
  }

  .wp-pill:active{
    transform: translateY(0px);
  }

  .wp-pill--disabled{
    cursor: not-allowed;
    opacity: .75;
    transform: none !important;
  }

  .wp-pill--warn{
    border-color: rgba(245, 158, 11, 0.22);
  }

  .wp-dot{
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #22c55e; /* green */
    box-shadow:
      0 0 0 3px rgba(34, 197, 94, 0.18),
      0 2px 8px rgba(34, 197, 94, 0.28);
  }

  .wp-dot--off{
    background: rgba(15, 23, 42, 0.28);
    box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.10);
  }

  .wp-dot--warn{
    background: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.18), 0 2px 8px rgba(245, 158, 11, 0.22);
  }

  .wp-addr{
    font-weight: 700;
    letter-spacing: 0.01em;
    font-size: 13px;
    line-height: 1;
    white-space: nowrap;
  }

  .wp-chev{
    font-size: 12px;
    opacity: .65;
    transform: translateY(-1px);
  }

  .wp-spinner{
    width: 14px;
    height: 14px;
    border-radius: 999px;
    border: 2px solid rgba(15, 23, 42, 0.18);
    border-top-color: rgba(15, 23, 42, 0.70);
    animation: spin .8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Dropdown menu */
  .wp-menu{
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 260px;
    padding: 8px;
    border-radius: 14px;

    border: 1px solid rgba(17, 24, 39, 0.10);
    background: rgba(255,255,255,0.98);
    color: #0f172a;

    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.16);
    z-index: 60;

    animation: pop .14s ease-out;
  }

  @keyframes pop {
    from { transform: translateY(-6px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .wp-row--top{
    padding: 8px 10px 6px;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .wp-title{
    font-weight: 800;
    font-size: 12px;
    letter-spacing: .12em;
    text-transform: uppercase;
    opacity: .85;
  }

  .wp-sub{
    font-size: 12px;
    font-weight: 700;
    opacity: .70;
  }

  .wp-item{
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
    transition: background .12s ease, border-color .12s ease;
  }

  .wp-item:hover{
    background: rgba(15, 23, 42, 0.05);
    border-color: rgba(15, 23, 42, 0.07);
  }

  .wp-item--danger{
    color: #ef4444;
  }

  .wp-ico{
    width: 18px;
    text-align: center;
    opacity: .75;
  }

  .wp-sep{
    height: 1px;
    margin: 6px 8px;
    background: rgba(15, 23, 42, 0.08);
  }

  .wp-hint{
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    max-width: 360px;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid rgba(239, 68, 68, 0.20);
    background: rgba(255,255,255,0.98);
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.14);
    font-size: 12px;
    opacity: .9;
    z-index: 70;
  }
</style>
