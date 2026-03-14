<script lang="ts">
  import { onDestroy } from "svelte";
  import { wallet } from "$lib/wallet/wallet.store";
  import { chainKey, isPolygon } from "$lib/wallet/chains";

  import { ADDRESSES } from "$lib/web3/addresses";
  import { presaleState, presaleBuy } from "$lib/web3/presale";
  import { erc20Allowance, erc20Approve, erc20BalanceOf } from "$lib/web3/erc20";
  import { clog } from "$lib/utils/clientLog";
  import { pushAdvisorError } from "$lib/stores/advisor";

  export let data: { week: number; price: number; user?: { walletId?: string | null } };

  type PayMethod = "stripe" | "crypto";
  type CryptoCurrency = "USDT" | "USDC";

  let payMethod: PayMethod = "stripe";
  let cryptoCurrency: CryptoCurrency = "USDT";
  let payAmount = "";

  // onchain presale
  let onchainActive = false;
  let onchainWeek = 0;
  let onchainPriceMicro: bigint = 0n;

  // balances/allowance
  let allowance6: bigint = 0n;
  let balUsdt6: bigint = 0n;
  let balUsdc6: bigint = 0n;

  // quote
  let receiveWei: bigint = 0n;

  // ui state
  let loading = false;
  let statusText: string | null = null;

  // result state (NO server message shown to user)
  let resultState: "success" | "error" | null = null;

  // keep for logs only (never shown)
  let resultMessage: string | null = null;

  onDestroy(() => {
    // no timers anymore
  });

  function showResult(state: "success" | "error", message?: string) {
    resultState = state;

    // Never show message to user
    resultMessage = null;

    // Debug logs only
    if (message) {
      if (state === "error") console.error("[presale:result]", message);
      else console.log("[presale:result]", message);
    }
  }

  function closeResult() {
    resultState = null;
    resultMessage = null;
  }

  function parseTo6(value: string): bigint {
    const s = (value || "0").replace(",", ".").trim();
    if (!s) return 0n;
    const [w, f = ""] = s.split(".");
    const frac = (f + "000000").slice(0, 6);
    const whole = w ? BigInt(w) : 0n;
    return whole * 1_000_000n + BigInt(frac || "0");
  }

  function format6(x: bigint): string {
    const sign = x < 0n ? "-" : "";
    const v = x < 0n ? -x : x;
    const whole = v / 1_000_000n;
    const frac = (v % 1_000_000n)
      .toString()
      .padStart(6, "0")
      .replace(/0+$/, "");
    return sign + whole.toString() + (frac ? "." + frac : "");
  }

  function wei18ToNumber(x: bigint): number {
    return Number(x) / 1e18;
  }

  function localQuoteWeiFromPriceUsd(pay6: bigint, priceUsd: number): bigint {
    if (pay6 === 0n || !Number.isFinite(priceUsd) || priceUsd <= 0) return 0n;
    const priceMicro = BigInt(Math.round(priceUsd * 1e6));
    if (priceMicro === 0n) return 0n;
    return (pay6 * 1_000_000_000_000_000_000n) / priceMicro;
  }

  const fmt = (n: number, digits = 2) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });

  const fmtToken = (n: number) =>
    n.toLocaleString("en-US", { maximumFractionDigits: 4 });

  // network + addresses
  $: net = chainKey($wallet.chainId) ?? "polygon";
  $: C = (ADDRESSES as any)[net] ?? ADDRESSES.polygon;

  // input parsing
  $: pay6 = parseTo6(payAmount);
  $: payUsd = Number((payAmount || "0").replace(",", ".")) || 0;

  // IMPORTANT: one rate for both Stripe and Crypto (onchain if available, else fallback from SSR data)
  $: priceUsd =
    onchainPriceMicro > 0n
      ? Number(onchainPriceMicro) / 1e6
      : Number(data?.price ?? 0);

  // effective state for UI
  $: effectiveWeek = onchainWeek > 0 ? onchainWeek : (data?.week ?? 0);
  $: effectiveActive = $wallet.status === "connected" ? onchainActive : true; // без кошелька не можем проверить onchain, поэтому не блокируем Stripe
  $: hasOnchainRate = onchainPriceMicro > 0n;

  // receive calc
  $: if (payMethod === "crypto") {
    receiveWei = localQuoteWeiFromPriceUsd(pay6, priceUsd);
  } else {
    receiveWei = 0n;
  }

  $: receive =
    payMethod === "crypto"
      ? wei18ToNumber(receiveWei)
      : priceUsd > 0
        ? payUsd / priceUsd
        : 0;

  // balances only meaningful for crypto
  $: balance =
    payMethod === "crypto"
      ? cryptoCurrency === "USDT"
        ? Number(balUsdt6) / 1e6
        : Number(balUsdc6) / 1e6
      : Infinity;

  // DB wallet check (required for Stripe)
  $: hasDbWallet = !!data?.user?.walletId;

  // confirm conditions
  $: canConfirm =
    payMethod === "stripe"
      ? payUsd > 0 && hasDbWallet && !loading
      : pay6 > 0n &&
        onchainActive &&
        $wallet.status === "connected" &&
        !loading;

  const setMax = () => {
    if (payMethod !== "crypto") return;
    payAmount = cryptoCurrency === "USDT" ? format6(balUsdt6) : format6(balUsdc6);
  };

  async function loadPresale() {
    try {
      if ($wallet.provider && isPolygon($wallet.chainId)) {
        const st = await presaleState($wallet.provider, C.presale);
        onchainActive = st.active;
        onchainWeek = st.week;
        onchainPriceMicro = st.priceMicro;
        clog.info("presale", "loadPresale via wallet", { active: st.active, week: st.week, priceMicro: String(st.priceMicro) });
      } else {
        // No wallet or wrong chain — use SSR data from server
        onchainWeek = data?.week ?? 0;
        const p = Number(data?.price ?? 0);
        onchainPriceMicro = BigInt(Math.round(p * 1e6));
        onchainActive = true;
        clog.info("presale", "loadPresale via SSR data", { week: onchainWeek, price: p });
      }
    } catch (e: any) {
      clog.error("presale", "loadPresale error", { err: e?.message });
    }
  }

  async function loadBalances() {
    if (!$wallet.provider || !$wallet.address || !isPolygon($wallet.chainId)) return;
    const [u, c] = await Promise.all([
      erc20BalanceOf($wallet.provider, C.usdt, $wallet.address),
      erc20BalanceOf($wallet.provider, C.usdc, $wallet.address),
    ]);
    balUsdt6 = u;
    balUsdc6 = c;
  }

  async function loadAllowanceOnly() {
    if (!$wallet.provider || !$wallet.address || !isPolygon($wallet.chainId)) return;

    if (payMethod !== "crypto" || !onchainActive) {
      allowance6 = 0n;
      return;
    }

    const token = cryptoCurrency === "USDT" ? C.usdt : C.usdc;
    allowance6 = await erc20Allowance($wallet.provider, token, $wallet.address, C.presale);
  }

  // unified reactive load — dedup by key to avoid repeated calls
  let _loadKey = "";
  $: {
    const _s = $wallet.status;
    const _c = $wallet.chainId;
    const _p = C?.presale;
    const key = `${_s}|${_c}|${_p}`;
    if (key !== _loadKey && _p) {
      _loadKey = key;
      loadPresale();
      if (_s === "connected") loadBalances();
    }
  }

  $: if ($wallet.status === "connected" && payMethod === "crypto") {
    cryptoCurrency;
    C?.presale;
    loadAllowanceOnly();
  }

  async function onBuyOneClick() {
    if (!$wallet.provider || !$wallet.address) return;
    if (!onchainActive || pay6 === 0n) return;

    loading = true;
    statusText = "Preparing transaction...";

    clog.info("presale", "buy: start", { currency: cryptoCurrency, pay6: String(pay6), addr: $wallet.address });

    try {
      const token = cryptoCurrency === "USDT" ? C.usdt : C.usdc;

      const a = await erc20Allowance($wallet.provider, token, $wallet.address, C.presale);

      if (a < pay6) {
        clog.info("presale", "buy: calling approve", { token: cryptoCurrency, allowance: String(a), need: String(pay6) });
        statusText = `Approve ${cryptoCurrency}...`;
        await erc20Approve($wallet.provider, token, C.presale, pay6);
        clog.info("presale", "buy: approve done");
      }

      clog.info("presale", "buy: calling presaleBuy");
      statusText = "Buying...";
      await presaleBuy($wallet.provider, C.presale, token, pay6);

      clog.info("presale", "buy: success");
      payAmount = "";
      showResult("success", "Purchase successful");

      await loadPresale();
      await loadBalances();
      await loadAllowanceOnly();
    } catch (e: any) {
      const msg = e?.shortMessage ?? e?.message ?? "Transaction failed";
      clog.error("presale", "buy: error", { err: msg, code: e?.code });
      showResult("error", msg);
      pushAdvisorError(`Presale crypto purchase failed: ${msg}`);
    } finally {
      loading = false;
      statusText = null;
    }
  }

  const onConfirmStripe = async () => {
    try {
      loading = true;
      statusText = "Creating Stripe checkout...";

      const r = await fetch("/api/presale/stripe/create-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ payAmount }),
      });

      const text = await r.text();

      console.log("[stripe:create-session] status:", r.status, r.statusText);
      console.log("[stripe:create-session] raw body:", text);

      let j: any = null;
      try {
        j = JSON.parse(text);
      } catch {
        // ok if HTML
      }

      if (!r.ok) {
        throw new Error(j?.message ?? text ?? `HTTP ${r.status}`);
      }

      const checkoutUrl = j?.url;
      if (!checkoutUrl) throw new Error("Stripe session url missing");

      window.location.href = checkoutUrl;
    } catch (e: any) {
      console.error("[stripe:onConfirmStripe] error:", e);
      const msg = e?.message ?? "Stripe error";
      showResult("error", msg);
      pushAdvisorError(`Stripe payment failed: ${msg}`);
    } finally {
      loading = false;
      statusText = null;
    }
  };
</script>

<div class="wrap">
  {#if resultState}
    <div class="resultInner">
      <div class="top">
        <div class="badge">
          <span class="k">PRESALE</span>
          {#if resultState === "success"}
            <span class="pill ok">SUCCESS</span>
          {:else}
            <span class="pill warn">FAILED</span>
          {/if}
        </div>

        {#if resultState === "success"}
          <div class="iconWrap ok">
            <div class="icon">✅</div>
          </div>
          <h1>Success</h1>
          <p class="sub">Your purchase was successful.</p>
        {:else}
          <div class="iconWrap warn">
            <div class="icon">❌</div>
          </div>
          <h1>Transaction failed</h1>
          <p class="sub">Please try again.</p>
        {/if}

        <div class="actions">
          <button class="btn primary" type="button" on:click={closeResult}>
            Back
          </button>
        </div>
      </div>
    </div>
  {:else}
    <div class="brand">
      <span class="logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.75c-5.15 0-9.25 1.9-9.25 4.25S6.85 11.25 12 11.25s9.25-1.9 9.25-4.25S17.15 2.75 12 2.75Z"
            stroke="currentColor"
            stroke-width="1.6"
          />
          <path
            d="M2.75 7v4.25c0 2.35 4.1 4.25 9.25 4.25s9.25-1.9 9.25-4.25V7"
            stroke="currentColor"
            stroke-width="1.6"
          />
          <path
            d="M2.75 11.25v4.25c0 2.35 4.1 4.25 9.25 4.25s9.25-1.9 9.25-4.25v-4.25"
            stroke="currentColor"
            stroke-width="1.6"
          />
        </svg>
      </span>
      <div class="title">PRESALE TERMINAL</div>
    </div>

    <div class="methodRow">
      <div class="label">Purchase Method</div>

      <div class="segmented" role="tablist" aria-label="Purchase method">
        <button
          type="button"
          class="segBtn"
          class:active={payMethod === "stripe"}
          on:click={() => (payMethod = "stripe")}
          aria-selected={payMethod === "stripe"}
          disabled={loading}
          aria-disabled={loading}
        >
          Stripe
        </button>

        <button
          type="button"
          class="segBtn"
          class:active={payMethod === "crypto"}
          on:click={() => (payMethod = "crypto")}
          aria-selected={payMethod === "crypto"}
          disabled={loading}
          aria-disabled={loading}
        >
          Crypto
        </button>
      </div>
    </div>

    <div class="row2">
      <div class="label">Pay With</div>

      {#if payMethod === "stripe"}
        <div class="balance">Card payment</div>
      {:else}
        <div class="balance">
          Balance:
          <b>{fmt(balance, 2)} {cryptoCurrency}</b>
        </div>
      {/if}
    </div>

    <div class="payBox">
      <div class="inputWrap">
        <input
          inputmode="decimal"
          placeholder="0.00"
          aria-label="Amount to pay"
          bind:value={payAmount}
          disabled={loading}
          aria-disabled={loading}
        />
      </div>

      {#if payMethod === "crypto"}
        <button class="maxBtn" type="button" on:click={setMax} disabled={loading}>
          MAX
        </button>

        <div class="selectWrap" role="button" aria-label="Currency selector">
          <select
            class="nativeSelect"
            bind:value={cryptoCurrency}
            aria-label="Crypto currency"
            disabled={loading}
          >
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
          </select>

          <div class="selectText">{cryptoCurrency}</div>

          <span class="chev" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M7 10l5 5 5-5"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
      {/if}
    </div>

    <div class="receiveBox">
      <div class="leftCol">
        <div class="small">YOU RECEIVE</div>
        <div class="big">{fmtToken(receive)} <span class="sym">ANGT</span></div>

        {#if payMethod === "crypto"}
          <div class="hint">You pay in {cryptoCurrency}</div>
        {:else}
          <div class="hint">You pay via Stripe</div>

          {#if !hasOnchainRate}
            <div class="hint" style="opacity:.75; margin-top:6px;">
              Connect wallet to display on chain rate (optional)
            </div>
          {/if}
        {/if}
      </div>

      <div class="rightCol">
        <div class="small" style="text-align:right;">RATE</div>
        <div class="rate">1 ANGT = ${priceUsd.toFixed(4)}</div>

        <div class="small" style="text-align:right; opacity:.85;">
          Week {effectiveWeek}
        </div>

        {#if payMethod === "crypto"}
          <div class="small" style="text-align:right; opacity:.85;">
            Status: {onchainActive ? "ACTIVE" : "NOT ACTIVE"}
          </div>
        {/if}
      </div>
    </div>

    {#if payMethod === "crypto"}
      <button
        class="confirm"
        type="button"
        disabled={!canConfirm}
        class:ready={canConfirm}
        on:click={onBuyOneClick}
      >
        {#if $wallet.status !== "connected"}
          Connect wallet
        {:else if !onchainActive}
          Presale is not active
        {:else}
          {#if loading}
            <span class="btnSpin" aria-hidden="true"></span>
            <span>Processing...</span>
          {:else}
            <span>Buy with {cryptoCurrency}</span>
          {/if}
        {/if}
      </button>
    {:else}
      <button
        class="confirm"
        type="button"
        disabled={!canConfirm}
        class:ready={canConfirm}
        on:click={onConfirmStripe}
      >
        {#if loading}
          <span class="btnSpin" aria-hidden="true"></span>
          <span>Processing...</span>
        {:else if !hasDbWallet}
          <span>Connect wallet first</span>
        {:else}
          <span>Confirm</span>
        {/if}
      </button>
    {/if}
  {/if}
</div>

<style>
.wrap {
  position: relative;
  background: var(--bg-white);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid var(--border-soft);
  box-shadow:
    0 30px 90px rgba(18, 20, 22, 0.08),
    0 8px 22px rgba(18, 20, 22, 0.06);
  align-items: start;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.resultInner {
  position: relative;
  min-height: 320px;
  display: grid;
  place-items: center;
}

.resultInner::before {
  content: none;
}

.brand {
  position: relative;
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
  width: 30px;
  height: 30px;
}

.title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text-main);
}

.methodRow {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.segmented {
  position: relative;
  display: inline-flex;
  padding: 4px;
  border-radius: 14px;
  border: 1px solid var(--border-soft);
  background: var(--bg-white);
  box-shadow:
    0 18px 60px rgba(18, 20, 22, 0.06),
    0 6px 18px rgba(18, 20, 22, 0.04);
  gap: 4px;
}

.segBtn {
  height: 36px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  cursor: pointer;
  transition: 160ms ease;
  user-select: none;
}

.segBtn.active {
  background: rgba(176, 141, 87, 0.10);
  border-color: rgba(176, 141, 87, 0.25);
  color: var(--accent-dark);
  box-shadow: 0 14px 30px rgba(18, 20, 22, 0.06);
  transform: translateY(-1px);
}

.segBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.row2 {
  position: relative;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
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

.payBox {
  position: relative;
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
  margin-bottom: 12px;
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

.inputWrap input:disabled {
  opacity: 0.7;
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
.maxBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.selectWrap {
  position: relative;
  height: 46px;
  min-width: 110px;
  border-radius: 14px;
  border: 1px solid var(--border-soft);
  background: var(--bg-white);
  display: grid;
  align-items: center;
  padding: 0 38px 0 12px;
  user-select: none;
}

.nativeSelect {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  appearance: none;
}
.nativeSelect:disabled {
  cursor: not-allowed;
}

.selectText {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text-main);
  pointer-events: none;
}

.chev {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  pointer-events: none;
}

.receiveBox {
  position: relative;
  padding: 14px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid var(--border-soft);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: end;
  margin-bottom: 14px;
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

.hint {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--text-muted);
}

.confirm {
  position: relative;
  height: 64px;
  width: 100%;
  border-radius: 18px;
  border: 1px solid var(--border-soft);
  background: rgba(15, 23, 42, 0.02);
  color: var(--text-muted);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: not-allowed;
  box-shadow: 0 18px 40px rgba(18, 20, 22, 0.04);
  transition: 160ms ease;
}

.confirm.ready {
  background: rgba(176, 141, 87, 0.10);
  border-color: rgba(176, 141, 87, 0.30);
  color: var(--accent-dark);
  cursor: pointer;
  box-shadow: 0 18px 40px rgba(18, 20, 22, 0.06);
}
.confirm.ready:hover {
  transform: translateY(-1px);
  box-shadow: 0 22px 48px rgba(176, 141, 87, 0.14);
  border-color: rgba(176, 141, 87, 0.45);
}

/* Button spinner */
.btnSpin {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 3px solid rgba(15, 23, 42, 0.14);
  border-top-color: currentColor;
  animation: spin 0.9s linear infinite;
  flex: 0 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== RESULT CARD ===== */

.top {
  position: relative;
  display: grid;
  gap: 10px;
  text-align: center;
  padding: 6px 2px 2px;
  z-index: 1;
}

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.k {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.pill {
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid var(--border-soft);
  color: var(--text-muted);
}

.pill.ok {
  background: rgba(34, 197, 94, 0.08);
  border-color: rgba(34, 197, 94, 0.25);
  color: rgba(22, 101, 52, 0.95);
}

.pill.warn {
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.25);
  color: rgba(146, 64, 14, 0.95);
}

.iconWrap {
  margin: 8px auto 4px;
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: var(--bg-white);
  border: 1px solid var(--border-soft);
  box-shadow:
    0 18px 60px rgba(18, 20, 22, 0.06),
    0 6px 18px rgba(18, 20, 22, 0.04);
  display: grid;
  place-items: center;
}

.iconWrap.ok {
  border-color: rgba(34, 197, 94, 0.25);
}

.iconWrap.warn {
  border-color: rgba(245, 158, 11, 0.25);
}

.icon {
  font-size: 26px;
  line-height: 1;
}

h1 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text-main);
  line-height: 1.15;
}

.sub {
  margin: 0 auto;
  max-width: 46ch;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text-muted);
}

.actions {
  position: relative;
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 16px;
}

.btn {
  height: 42px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid var(--border-soft);
  background: var(--bg-white);
  color: var(--text-main);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  box-shadow:
    0 18px 60px rgba(18, 20, 22, 0.06),
    0 6px 18px rgba(18, 20, 22, 0.04);
  transition: transform 0.12s ease, filter 0.12s ease;
}

.btn:hover { transform: translateY(-1px); }
.btn:active { transform: translateY(0px); }

.btn.primary {
  border-color: rgba(176, 141, 87, 0.30);
}

@media (max-width: 720px) {
  .wrap {
    padding: 16px;
    border-radius: 20px;
  }
  .payBox {
    grid-template-columns: 1fr;
  }
  .selectWrap,
  .maxBtn {
    width: 100%;
    min-width: unset;
  }
  .receiveBox {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .rate {
    text-align: left;
  }
  .methodRow {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .segmented {
    width: 100%;
    justify-content: space-between;
  }
  .segBtn {
    width: 100%;
  }
}
</style>
