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
  <section class="box">
    <header class="head">
      <h2 class="title">REWARD STATION</h2>
    </header>

    <div class="split">
      <section class="panel">
        <header class="head mini">
          <h3 class="title sm">DEPOSIT</h3>
          <p class="sub">Enter USDT amount to lock and start earning.</p>
        </header>

        <div class="form">
          <label class="field">
            <span class="label">Amount</span>
            <div class="inputRow">
              <input
                class="input"
                inputmode="decimal"
                placeholder="0.00"
                bind:value={deposit}
                aria-label="USDT amount"
              />
              <span class="unit">USDT</span>
            </div>
            <div class="under">
              <span>Available:</span>
              <b>{status === "connected" && !isLoading ? usdtStr : "—"}</b>
              <span class="muted">USDT</span>
            </div>
          </label>
          <div class="quick">
            <button class="q" type="button" on:click={() => setPct(25)}
              >25%</button
            >
            <button class="q" type="button" on:click={() => setPct(50)}
              >50%</button
            >
            <button class="q" type="button" on:click={() => setPct(75)}
              >75%</button
            >
            <button class="q" type="button" on:click={setMax}>MAX</button>
          </div>

          <button class="btn" type="button">Deposit &amp; Lock</button>

          <p class="hint">
            Your USDT is locked for <b>{lockDays} days</b>. Rewards are
            distributed {payoutCadence.toLowerCase()} in{" "}
            <b>{rewardToken}</b>.
          </p>
        </div>
      </section>

      <section class="panel">
        <header class="head mini">
          <h3 class="title sm">STATUS</h3>
          <p class="sub">Your station metrics (placeholders for now).</p>
        </header>

        <div class="stats">
          <div class="stat">
            <div class="k">Total locked</div>
            <div class="v">{totalLocked} <span class="muted">USDT</span></div>
          </div>
          <div class="stat">
            <div class="k">Next payout</div>
            <div class="v">{nextPayout}</div>
          </div>
          <div class="stat">
            <div class="k">Est. monthly reward</div>
            <div class="v">
              {estimatedMonthlyReward} <span class="muted">{rewardToken}</span>
            </div>
          </div>
          <div class="stat">
            <div class="k">Locked until</div>
            <div class="v">{lockedUntil}</div>
          </div>
        </div>

        <div class="note">
          <span class="dot" aria-hidden="true"></span>
          <div class="noteText">
            After the lock ends, your principal becomes available for
            withdrawal.
          </div>
          <span class="pill soft">{lockDays}D</span>
        </div>

        <div class="timeline" aria-label="Reward schedule line">
          <div class="tl-head">
            <div class="tl-title">REWARD SCHEDULE</div>
            <div class="tl-sub">
              Line, not boxes. Values will be connected later.
            </div>
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
  .box {
    position: relative;
    border-radius: 26px;
    padding: 26px;
    overflow: hidden;
    background: white;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 22px 60px rgba(15, 23, 42, 0.1),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;

    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .box::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
        1100px 360px at 20% 0%,
        rgba(15, 23, 42, 0.06),
        transparent 58%
      ),
      radial-gradient(
        900px 320px at 85% 25%,
        rgba(15, 23, 42, 0.05),
        transparent 62%
      );
    pointer-events: none;
  }

  .head {
    position: relative;
    display: grid;
    gap: 6px;
    margin-bottom: 14px;
    max-width: 760px;
  }

  .head.mini {
    margin-bottom: 10px;
    max-width: none;
  }

  .title {
    margin: 0;
    font-size: 18px;
    font-weight: 950;
    letter-spacing: -0.03em;
    font-style: italic;
    color: #0f172a;
  }

  .title.sm {
    font-size: 16px;
  }

  .sub {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: rgba(15, 23, 42, 0.65);
  }

  .sub b {
    color: rgba(15, 23, 42, 0.92);
    font-weight: 950;
  }

  .section {
    margin-top: 14px;
  }

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-top: 6px;
  }

  .card {
    position: relative;
    border-radius: 18px;
    padding: 16px;

    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow:
      0 18px 40px rgba(15, 23, 42, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.8) inset;

    display: grid;
    grid-template-columns: 36px 1fr auto;
    align-items: center;
    gap: 12px;

    transition:
      transform 0.12s ease,
      border-color 0.12s ease,
      filter 0.12s ease;
  }

  .card:hover {
    transform: translateY(-1px);
    border-color: rgba(15, 23, 42, 0.12);
    filter: brightness(1.02);
  }

  .icon {
    height: 36px;
    width: 36px;
    display: grid;
    place-items: center;
    border-radius: 12px;

    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);

    font-size: 16px;
  }

  .meta h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .meta p {
    margin: 4px 0 0;
    font-size: 12px;
    color: rgba(15, 23, 42, 0.62);
  }

  .pill {
    height: 26px;
    padding: 0 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 950;
    letter-spacing: -0.02em;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(15, 23, 42, 0.1);
    color: rgba(15, 23, 42, 0.85);
  }

  .pill.soft {
    background: rgba(15, 23, 42, 0.03);
    border-color: rgba(15, 23, 42, 0.08);
  }

  /* === Rewards Station additions (same design language) === */
  .split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-top: 14px;
    position: relative;
  }

  .panel {
    border-radius: 18px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow:
      0 18px 40px rgba(15, 23, 42, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.8) inset;
  }

  .form {
    display: grid;
    gap: 12px;
    margin-top: 6px;
  }

  .field {
    display: grid;
    gap: 6px;
  }

  .label {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: rgba(15, 23, 42, 0.85);
  }

  .inputRow {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 10px;

    border-radius: 14px;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(15, 23, 42, 0.1);
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset;
  }

  .input {
    border: none;
    outline: none;
    background: transparent;
    color: #0f172a;
    font-weight: 950;
    font-size: 16px;
    letter-spacing: -0.02em;
    width: 100%;
  }

  .input::placeholder {
    color: rgba(15, 23, 42, 0.35);
    font-weight: 900;
  }

  .unit {
    height: 26px;
    padding: 0 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 950;
    letter-spacing: -0.02em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.08);
    color: rgba(15, 23, 42, 0.85);
    white-space: nowrap;
  }

  .quick {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .q {
    height: 30px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.1);
    background: rgba(255, 255, 255, 0.9);
    color: rgba(15, 23, 42, 0.85);
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    cursor: pointer;
    transition:
      transform 0.12s ease,
      filter 0.12s ease,
      border-color 0.12s ease;
  }
  .q:hover {
    transform: translateY(-1px);
    filter: brightness(1.02);
    border-color: rgba(15, 23, 42, 0.14);
  }

  .btn {
    height: 42px;
    border-radius: 14px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: #0f172a;
    color: white;
    font-weight: 950;
    letter-spacing: -0.02em;
    cursor: pointer;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.18);
    transition:
      transform 0.12s ease,
      filter 0.12s ease;
  }

  .btn:hover {
    transform: translateY(-1px);
    filter: brightness(1.02);
  }

  .hint {
    margin: 0;
    font-size: 12px;
    line-height: 1.45;
    color: rgba(15, 23, 42, 0.62);
  }

  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 6px;
  }

  .stat {
    border-radius: 14px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset;
    display: grid;
    gap: 4px;
  }

  .k {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: rgba(15, 23, 42, 0.78);
  }

  .v {
    font-size: 14px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .muted {
    color: rgba(15, 23, 42, 0.55);
    font-weight: 950;
    font-size: 12px;
  }

  .note {
    margin-top: 10px;
    border-radius: 16px;
    padding: 12px;
    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.08);
    display: grid;
    grid-template-columns: 10px 1fr auto;
    gap: 10px;
    align-items: center;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.6);
  }

  .noteText {
    font-size: 12px;
    color: rgba(15, 23, 42, 0.65);
    line-height: 1.45;
  }

  /* Timeline (line with points, no boxes) */
  .timeline {
    margin-top: 12px;
    border-top: 1px solid rgba(15, 23, 42, 0.06);
    padding-top: 12px;
  }

  .tl-head {
    display: grid;
    gap: 4px;
    margin-bottom: 10px;
  }

  .tl-title {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .tl-sub {
    font-size: 12px;
    color: rgba(15, 23, 42, 0.6);
  }

  .tl {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    padding: 12px 10px 6px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
  }

  .rail {
    position: absolute;
    left: 18px;
    right: 18px;
    top: 22px;
    height: 2px;
    background: rgba(15, 23, 42, 0.12);
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
    background: #0f172a;
    border: 2px solid white;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.18);
    margin-top: 16px;
  }

  .pin-dark {
    background: rgba(15, 23, 42, 0.55);
  }

  .t {
    display: grid;
    gap: 2px;
  }

  .t1 {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .t2 {
    font-size: 12px;
    color: rgba(15, 23, 42, 0.62);
    line-height: 1.35;
  }

  @media (max-width: 980px) {
    .dash {
      padding: 0 14px 14px;
    }
    .box {
      padding: 16px;
      border-radius: 20px;
    }
    .grid {
      grid-template-columns: 1fr;
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
</style>
