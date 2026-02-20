<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { wallet } from "$lib/wallet/wallet.store";
  import {
    FTMC,
    WPOL,
    getErc20MetaAndBalance,
    swapWpolToFtmcUniswapV3,
    FTMC_POOL_FEE
  } from "$lib/wallet/quickswapV2";

  const dispatch = createEventDispatcher<{ close: void; swapped: { hash: string } }>();

  let amount = "";
  let loading = false;
  let err: string | null = null;

  let wpolBalance = "-";
  let wpolSymbol = "WPOL";

  $: status = $wallet.status;
  $: addr = $wallet.address;
  $: eip1193 = $wallet.provider;

  function close() {
    if (!loading) dispatch("close");
  }

  function fmtAddr(a: string) {
    return `${a.slice(0, 6)}…${a.slice(-4)}`;
  }

  async function loadBalance() {
    if (!eip1193 || !addr) return;

    err = null;
    try {
      const b = await getErc20MetaAndBalance({ eip1193, token: WPOL, owner: addr });
      wpolBalance = b.amount;
      wpolSymbol = b.symbol || "WPOL";
    } catch (e) {
      err = e instanceof Error ? e.message : "Failed to load balance";
    }
  }

  async function doSwap() {
    if (!eip1193 || !addr) {
      err = "Wallet not connected";
      return;
    }
    if (status !== "connected") {
      err = "Connect wallet on Polygon";
      return;
    }

    const a = Number(amount);
    if (!Number.isFinite(a) || a <= 0) {
      err = "Enter amount";
      return;
    }

    loading = true;
    err = null;

    try {
      const { tx } = await swapWpolToFtmcUniswapV3({
        eip1193,
        owner: addr,
        amountInHuman: amount,
        fee: FTMC_POOL_FEE
      });

      const receipt = await tx.wait();
      await loadBalance();

      dispatch("swapped", { hash: receipt.hash });
      close();
    } catch (e) {
      err = e instanceof Error ? e.message : "Swap failed";
    } finally {
      loading = false;
    }
  }

  onMount(loadBalance);
</script>

<div class="ov" on:click|self={close}>
  <div class="md" role="dialog" aria-modal="true" aria-label="Buy FTMC">
    <div class="hd">
      <div class="ttl">Buy FTMC</div>
      <button class="x" on:click={close} aria-label="Close">✕</button>
    </div>

    <div class="sub">
      Swap <b>{wpolSymbol}</b> → <b>FTMC</b> via Uniswap V3 (fee {FTMC_POOL_FEE / 10000}%)
    </div>

    <div class="box">
      <div class="row">
        <div class="lbl">Wallet</div>
        <div class="val">{addr ? fmtAddr(addr) : "-"}</div>
      </div>

      <div class="row">
        <div class="lbl">{wpolSymbol} balance</div>
        <div class="val">{wpolBalance}</div>
      </div>
    </div>

    <div class="form">
      <label class="field">
        <span class="flbl">Amount ({wpolSymbol})</span>
        <div class="inpwrap">
          <input
            class="inp"
            inputmode="decimal"
            placeholder="0.0"
            bind:value={amount}
            disabled={loading}
          />
          <button
            class="max"
            type="button"
            on:click={() => (amount = wpolBalance === "-" ? "" : wpolBalance)}
            disabled={loading || wpolBalance === "-"}
          >
            MAX
          </button>
        </div>
        <div class="hint">
          If it reverts: try smaller amount (liquidity may be low).
        </div>
      </label>
    </div>

    {#if err}
      <div class="err">{err}</div>
    {/if}

    <button class="btn" type="button" on:click={doSwap} disabled={loading || !addr}>
      {#if loading}
        Swapping…
      {:else}
        Swap {wpolSymbol} → FTMC
      {/if}
    </button>

    <div class="foot">
      <div class="mini">
        FTMC: <span class="mono">{FTMC}</span>
      </div>
      <div class="mini">
        WPOL: <span class="mono">{WPOL}</span>
      </div>
      <div class="mini">
        <a class="lnk" href={"https://polygonscan.com/address/" + FTMC} target="_blank" rel="noreferrer">
          View FTMC ↗
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  .ov{
    position: fixed;
    inset: 0;
    background: rgba(15,23,42,.45);
    display: grid;
    place-items: center;
    z-index: 999999;
    padding: 16px;
  }
  .md{
    width: min(520px, 100%);
    border-radius: 18px;
    background: #fff;
    border: 1px solid rgba(15,23,42,.08);
    box-shadow: 0 24px 60px rgba(15,23,42,.22);
    padding: 14px;
  }
  .hd{
    display:flex; align-items:center; justify-content:space-between;
    gap: 10px;
  }
  .ttl{ font-weight: 950; font-size: 16px; }
  .x{
    border: 1px solid rgba(15,23,42,.10);
    background: rgba(15,23,42,.03);
    border-radius: 10px;
    height: 32px; width: 32px;
    cursor: pointer;
  }
  .sub{
    margin-top: 6px;
    font-size: 12px;
    font-weight: 800;
    color: rgba(15,23,42,.55);
  }
  .box{
    margin-top: 12px;
    border-radius: 14px;
    border: 1px solid rgba(15,23,42,.06);
    background: rgba(15,23,42,.02);
    padding: 10px;
  }
  .row{ display:flex; justify-content:space-between; gap: 10px; padding: 6px 2px; }
  .lbl{ font-size: 12px; font-weight: 800; color: rgba(15,23,42,.55); }
  .val{ font-size: 12px; font-weight: 900; color: rgba(15,23,42,.92); }

  .form{ margin-top: 12px; display:grid; gap: 10px; }
  .field{ display:grid; gap: 6px; }
  .flbl{ font-size: 11px; font-weight: 900; letter-spacing:.10em; text-transform: uppercase; color: rgba(15,23,42,.45); }

  .inpwrap{ display:flex; gap: 8px; }
  .inp{
    width: 100%;
    height: 40px;
    border-radius: 12px;
    border: 1px solid rgba(15,23,42,.12);
    padding: 0 12px;
    font-weight: 800;
    outline: none;
  }
  .max{
    height: 40px;
    padding: 0 10px;
    border-radius: 12px;
    border: 1px solid rgba(15,23,42,.12);
    background: rgba(15,23,42,.03);
    font-weight: 900;
    cursor: pointer;
  }

  .hint{ font-size: 12px; color: rgba(15,23,42,.55); font-weight: 700; }

  .err{
    margin-top: 10px;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid rgba(239,68,68,.22);
    background: rgba(239,68,68,.06);
    color: rgba(127,29,29,.95);
    font-weight: 800;
    font-size: 12px;
  }

  .btn{
    margin-top: 12px;
    width: 100%;
    height: 44px;
    border-radius: 14px;
    border: 1px solid rgba(15,23,42,.10);
    background: rgba(37,99,235,.92);
    color: white;
    font-weight: 950;
    cursor: pointer;
  }
  .btn:disabled{ opacity: .6; cursor: not-allowed; }

  .foot{
    margin-top: 10px;
    display:flex;
    justify-content:space-between;
    gap: 10px;
    flex-wrap: wrap;
  }
  .mini{ font-size: 11px; font-weight: 800; color: rgba(15,23,42,.55); }
  .mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
  .lnk{ color: rgba(37,99,235,.95); text-decoration: none; font-weight: 900; }
  .lnk:hover{ text-decoration: underline; }
</style>
