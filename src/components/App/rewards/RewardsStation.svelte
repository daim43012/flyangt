<script lang="ts">
  import { wallet } from "$lib/wallet/wallet.store";
  import { balancesStore } from "$lib/wallet/store/balances";
  import type { BalanceItem } from "$lib/wallet/store/balances";

  export let lockDays = 180;
  export let apy = 12;
  export let payoutCadence = "Monthly";
  export let rewardToken = "ANGT";

  let deposit = "";

  export let nextPayout = "—";
  export let estimatedMonthlyReward = "—";
  export let lockedUntil = "—";
  export let totalLocked = "—";

  $: w = $wallet;
  $: state = $balancesStore;

  $: address = w?.address ?? "";
  $: status = w?.status ?? "idle";
  $: isLoading = !!state?.loading;

  let lastLoadedAddress = "";

  function hasItem(item: BalanceItem | undefined): item is BalanceItem {
    return !!item;
  }

  function prettyAmount(v: string, maxFrac = 6) {
    const n = Number(v);
    if (!Number.isFinite(n)) return v;
    const abs = Math.abs(n);
    const frac = abs >= 1000 ? 2 : abs >= 1 ? 4 : maxFrac;
    return n.toLocaleString(undefined, { maximumFractionDigits: frac });
  }

  function canLoad() {
    return status === "connected" && !!address;
  }

  $: if (canLoad() && address !== lastLoadedAddress) {
    lastLoadedAddress = address;
    balancesStore.load(address);
  }
  $: if (!address || status !== "connected") {
    lastLoadedAddress = "";
  }

  $: usdtItem = state?.data?.balances?.USDT;
  $: usdtAmount = hasItem(usdtItem) ? Number(usdtItem.amount ?? 0) : 0;
  $: usdtStr = Number.isFinite(usdtAmount)
    ? prettyAmount(String(usdtAmount), 6)
    : "0";

  function setPct(p: number) {
    const v = (usdtAmount * p) / 100;
    deposit = v > 0 ? String(v) : "";
  }

  function setMax() {
    deposit = usdtAmount > 0 ? String(usdtAmount) : "";
  }
</script>

<div class="dash">
  <section class="wrap">

    <div class="brand">
      <span class="logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.6"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </span>
      <div class="title">REWARD STATION</div>
    </div>

    <div class="split">

      <!-- LEFT: DEPOSIT -->
      <section class="panel">

        <div class="row2">
          <div class="label">Pay With</div>
          <div class="balance">
            Available: <b>{status === "connected" && !isLoading ? usdtStr : "—"} USDT</b>
          </div>
        </div>

        <div class="payBox">
          <div class="inputWrap">
            <input
              inputmode="decimal"
              placeholder="0.00"
              bind:value={deposit}
              aria-label="USDT amount"
            />
          </div>
          <button class="maxBtn" type="button" on:click={setMax}>MAX</button>
          <div class="unitChip">USDT</div>
        </div>

        <div class="quick">
          <button class="q" type="button" on:click={() => setPct(25)}>25%</button>
          <button class="q" type="button" on:click={() => setPct(50)}>50%</button>
          <button class="q" type="button" on:click={() => setPct(75)}>75%</button>
        </div>

        <button class="confirm" type="button">Deposit &amp; Lock</button>

        <p class="hint">
          Your USDT is locked for <b>{lockDays} days</b>. Rewards are
          distributed {payoutCadence.toLowerCase()} in <b>{rewardToken}</b>.
        </p>
      </section>

      <!-- RIGHT: STATUS -->
      <section class="panel">

        <div class="receiveBox">
          <div class="leftCol">
            <div class="small">TOTAL LOCKED</div>
            <div class="big">{totalLocked} <span class="sym">USDT</span></div>
            <div class="hint">Est. {estimatedMonthlyReward} {rewardToken}/mo</div>
          </div>
          <div class="rightCol">
            <div class="small" style="text-align:right;">APY</div>
            <div class="rate">{apy}%</div>
            <div class="small" style="text-align:right; margin-top:6px;">Next payout</div>
            <div class="rate">{nextPayout}</div>
          </div>
        </div>

        <div class="note">
          <span class="dot" aria-hidden="true"></span>
          <div class="noteText">
            After the lock ends, your principal becomes available for withdrawal.
          </div>
          <span class="pill soft">{lockDays}D</span>
        </div>

        <div class="timeline" aria-label="Reward schedule line">
          <div class="tl-head">
            <div class="tl-title">REWARD SCHEDULE</div>
          </div>

          <div class="tl">
            <div class="rail" aria-hidden="true"></div>

            <div class="point">
              <div class="pin"></div>
              <div class="t">
                <div class="t1">Deposit</div>
                <div class="t2">USDT locked</div>
              </div>
            </div>

            <div class="point">
              <div class="pin"></div>
              <div class="t">
                <div class="t1">Monthly payout</div>
                <div class="t2">Rewards in {rewardToken}</div>
              </div>
            </div>

            <div class="point">
              <div class="pin"></div>
              <div class="t">
                <div class="t1">Accrual</div>
                <div class="t2">Est. — {rewardToken}/mo</div>
              </div>
            </div>

            <div class="point">
              <div class="pin pin-dark"></div>
              <div class="t">
                <div class="t1">Unlock</div>
                <div class="t2">Principal available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  </section>
</div>

<style>
  .dash {
    width: 100%;
  }

  .wrap {
    position: relative;
    background: var(--bg-white);
    border-radius: 20px;
    padding: 20px;
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
  }

  /* BRAND HEADER */
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .logo {
    width: 30px;
    height: 30px;
    display: inline-grid;
    place-items: center;
    color: var(--accent);
  }

  .logo svg {
    width: 22px;
    height: 22px;
  }

  .title {
    margin: 0;
    font-family: var(--font-heading);
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-main);
  }

  /* SPLIT */
  .split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* LABEL + BALANCE ROW */
  .row2 {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }

  .label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .balance {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-muted);
  }

  .balance b {
    color: var(--text-main);
    font-weight: 600;
  }

  /* PAY BOX */
  .payBox {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 10px;
    align-items: center;
    padding: 12px;
    border-radius: 16px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.06),
      0 6px 18px rgba(18, 20, 22, 0.04);
  }

  .inputWrap {
    display: flex;
    align-items: center;
    height: 46px;
    border-radius: 14px;
    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    padding: 0 12px;
  }

  .inputWrap input {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    font-family: var(--font-heading);
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.03em;
    color: var(--text-main);
  }

  .inputWrap input::placeholder {
    color: var(--text-muted);
    opacity: 0.45;
  }

  .maxBtn {
    height: 46px;
    padding: 0 12px;
    border-radius: 14px;
    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    cursor: pointer;
    transition: 160ms ease;
  }

  .maxBtn:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 30px rgba(18, 20, 22, 0.08);
  }

  .unitChip {
    height: 46px;
    padding: 0 14px;
    border-radius: 14px;
    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    font-size: 14px;
    font-weight: 600;
    color: var(--text-main);
    display: grid;
    align-items: center;
    white-space: nowrap;
  }

  /* QUICK BUTTONS */
  .quick {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .q {
    height: 30px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.12s ease, color 0.12s ease, transform 0.12s ease;
  }

  .q:hover {
    transform: translateY(-1px);
    border-color: rgba(176, 141, 87, 0.3);
    color: var(--accent-dark);
  }

  /* CONFIRM BUTTON */
  .confirm {
    position: relative;
    height: 64px;
    width: 100%;
    border-radius: 18px;
    border: 1px solid rgba(176, 141, 87, 0.30);
    background: rgba(176, 141, 87, 0.10);
    color: var(--accent-dark);
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.01em;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 18px 40px rgba(18, 20, 22, 0.04);
    transition: 160ms ease;
  }

  .confirm:hover {
    transform: translateY(-1px);
    box-shadow: 0 22px 48px rgba(176, 141, 87, 0.14);
    border-color: rgba(176, 141, 87, 0.45);
  }

  /* HINT */
  .hint {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.45;
    color: var(--text-muted);
  }

  /* RECEIVE BOX (stats) */
  .receiveBox {
    padding: 14px;
    border-radius: 16px;
    background: rgba(15, 23, 42, 0.02);
    border: 1px solid var(--border-soft);
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    align-items: end;
  }

  .leftCol {
    display: grid;
    gap: 0;
  }

  .rightCol {
    display: grid;
    gap: 0;
  }

  .small {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .big {
    margin-top: 6px;
    font-family: var(--font-heading);
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.03em;
    color: var(--text-main);
    line-height: 1.05;
  }

  .sym {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--accent);
  }

  .rate {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text-muted);
    text-align: right;
    margin-top: 6px;
    white-space: nowrap;
  }

  /* NOTE */
  .note {
    border-radius: 16px;
    padding: 12px;
    background: rgba(176, 141, 87, 0.04);
    border: 1px solid rgba(176, 141, 87, 0.18);
    display: grid;
    grid-template-columns: 10px 1fr auto;
    gap: 10px;
    align-items: center;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: var(--accent);
  }

  .noteText {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    line-height: 1.45;
  }

  .pill {
    height: 26px;
    padding: 0 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(176, 141, 87, 0.08);
    border: 1px solid rgba(176, 141, 87, 0.22);
    color: var(--accent-dark);
  }

  .pill.soft {
    background: rgba(176, 141, 87, 0.05);
    border-color: rgba(176, 141, 87, 0.15);
  }

  /* TIMELINE */
  .timeline {
    border-top: 1px solid var(--border-soft);
    padding-top: 12px;
  }

  .tl-head {
    margin-bottom: 10px;
  }

  .tl-title {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-main);
  }

  .tl {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    padding: 12px 10px 6px;
    border-radius: 16px;
    background: rgba(176, 141, 87, 0.03);
    border: 1px solid var(--border-soft);
    box-shadow: 0 12px 26px rgba(18, 20, 22, 0.05);
  }

  .rail {
    position: absolute;
    left: 18px;
    right: 18px;
    top: 22px;
    height: 2px;
    background: rgba(176, 141, 87, 0.25);
    border-radius: 999px;
  }

  .point {
    position: relative;
    display: grid;
    grid-template-rows: 18px auto;
    gap: 10px;
    padding: 0 6px;
  }

  .pin {
    width: 12px;
    height: 12px;
    border-radius: 999px;
    background: var(--accent);
    border: 2px solid var(--bg-white);
    box-shadow: 0 4px 12px rgba(176, 141, 87, 0.3);
    margin-top: 16px;
  }

  .pin-dark {
    background: var(--accent-dark);
  }

  .t {
    display: grid;
    gap: 2px;
  }

  .t1 {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text-main);
  }

  .t2 {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    line-height: 1.35;
  }

  /* RESPONSIVE */
  @media (max-width: 980px) {
    .wrap {
      padding: 16px;
      border-radius: 20px;
    }

    .split {
      grid-template-columns: 1fr;
    }

    .tl {
      grid-template-columns: 1fr;
      padding: 12px;
    }

    .rail {
      left: 18px;
      right: auto;
      top: 18px;
      bottom: 18px;
      width: 2px;
      height: auto;
    }

    .point {
      grid-template-rows: auto;
      grid-template-columns: 18px 1fr;
      align-items: start;
      padding: 8px 6px;
    }

    .pin {
      margin-top: 0;
      margin-left: 6px;
    }
  }

  @media (max-width: 720px) {
    .payBox {
      grid-template-columns: 1fr;
    }

    .maxBtn,
    .unitChip {
      width: 100%;
    }

    .receiveBox {
      grid-template-columns: 1fr;
    }

    .rate {
      text-align: left;
    }
  }
</style>
