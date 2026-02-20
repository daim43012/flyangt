<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";

  type Purchase = {
    status: string;
    week: number | null;
    price: number;
    payAmount: number;
    tokenAmount: number;
    createdAt?: string;
  };

  let loading = true;
  let err: string | null = null;
  let purchase: Purchase | null = null;

  let tries = 0;
  const maxTries = 30; // ~60 sec with 2s interval
  let timer: ReturnType<typeof setTimeout> | null = null;

  onDestroy(() => {
    if (timer) clearTimeout(timer);
  });

  const fmtUsd = (n: number, d = 2) =>
    Number.isFinite(n)
      ? n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })
      : "0.00";

  const fmtToken = (n: number) =>
    Number.isFinite(n)
      ? n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })
      : "0";

  async function fetchStatus(sessionId: string) {
    const r = await fetch(
      `/api/presale/stripe/status?session_id=${encodeURIComponent(sessionId)}`
    );
    const j = await r.json().catch(() => null);
    if (!r.ok) throw new Error(j?.message ?? `HTTP ${r.status}`);
    return j?.purchase as Purchase;
  }

  async function poll(sessionId: string) {
    tries = 0;
    loading = true;
    err = null;

    const tick = async () => {
      tries += 1;

      try {
        purchase = await fetchStatus(sessionId);

        if (purchase?.status === "paid") {
          loading = false;
          return;
        }

        if (tries >= maxTries) {
          loading = false;
          err = "Finalizing is taking longer than expected. Please refresh or check later.";
          return;
        }

        timer = setTimeout(tick, 2000);
      } catch (e: any) {
        loading = false;
        err = e?.message ?? "Status check failed";
      }
    };

    await tick();
  }

  onMount(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) {
      loading = false;
      err = "Missing session_id";
      return;
    }
    poll(sessionId);
  });

  const back = () => goto("/app/presale");
  const refresh = () => window.location.reload();
</script>

<div class="page">
  <section class="card">
    <div class="top">
      <div class="badge">
        <span class="k">PRESALE</span>
        {#if loading}
          <span class="pill pending">FINALIZING</span>
        {:else if err}
          <span class="pill warn">CHECK</span>
        {:else if purchase?.status === "paid"}
          <span class="pill ok">SUCCESS</span>
        {:else}
          <span class="pill pending">PENDING</span>
        {/if}
      </div>

      {#if loading}
        <div class="iconWrap">
          <div class="spinner" aria-hidden="true"></div>
        </div>
        <h1>Payment received</h1>
        <p class="sub">
          Finalizing your presale allocation. This usually takes a few seconds.
        </p>

      {:else if err}
        <div class="iconWrap warn">
          <div class="icon">⚠️</div>
        </div>
        <h1>Almost done</h1>
        <p class="sub">{err}</p>

      {:else if purchase?.status === "paid"}
        <div class="iconWrap ok">
          <div class="icon">✅</div>
        </div>
        <h1>Success</h1>
        <p class="sub">
          You purchased <b>{fmtToken(purchase.tokenAmount)} ANGT</b>
        </p>

        <div class="grid">
          <div class="item">
            <div class="label">Week</div>
            <div class="value">{purchase.week ?? "-"}</div>
          </div>

          <div class="item">
            <div class="label">Price</div>
            <div class="value">${fmtUsd(purchase.price, 4)}</div>
          </div>

          <div class="item">
            <div class="label">Paid</div>
            <div class="value">${fmtUsd(purchase.payAmount, 2)}</div>
          </div>

          <div class="item">
            <div class="label">Status</div>
            <div class="value strong">PAID</div>
          </div>
        </div>

      {:else}
        <div class="iconWrap">
          <div class="icon">⏳</div>
        </div>
        <h1>Pending</h1>
        <p class="sub">
          Your payment is being processed. If it takes too long, refresh.
        </p>
      {/if}
    </div>

    <div class="actions">
      <button class="btn primary" on:click={back}>Back to Presale</button>
      {#if !loading && (err || purchase?.status !== "paid")}
        <button class="btn ghost" on:click={refresh}>Refresh</button>
      {/if}
    </div>

    <div class="foot">
      <span class="muted">
        If you paid but still see pending, webhook may be finishing.
      </span>
    </div>
  </section>
</div>

<style>
  .page {
    min-height: 80vh;
    display: grid;
    place-items: center;

  }

  .card {
    position: relative;
    width: min(560px, 92vw);
    border-radius: 26px;
    padding: 22px;
    overflow: hidden;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 22px 60px rgba(15, 23, 42, 0.10),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .card::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(1000px 360px at 18% 0%, rgba(37, 99, 235, 0.14), transparent 58%),
      radial-gradient(900px 320px at 85% 35%, rgba(99, 102, 241, 0.12), transparent 62%);
    pointer-events: none;
  }

  .top {
    position: relative;
    display: grid;
    gap: 10px;
    text-align: center;
    padding: 6px 2px 2px;
  }

  .badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .k {
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: rgba(15, 23, 42, 0.7);
  }

  .pill {
    height: 26px;
    padding: 0 12px;
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

  .pill.ok {
    border-color: rgba(34, 197, 94, 0.35);
    color: rgba(22, 101, 52, 0.95);
    box-shadow: 0 10px 24px rgba(34, 197, 94, 0.12);
  }

  .pill.pending {
    border-color: rgba(59, 130, 246, 0.28);
    color: rgba(30, 64, 175, 0.92);
    box-shadow: 0 10px 24px rgba(59, 130, 246, 0.10);
  }

  .pill.warn {
    border-color: rgba(245, 158, 11, 0.35);
    color: rgba(146, 64, 14, 0.95);
    box-shadow: 0 10px 24px rgba(245, 158, 11, 0.12);
  }

  .iconWrap {
    margin: 8px auto 4px;
    width: 54px;
    height: 54px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow:
      0 16px 36px rgba(15, 23, 42, 0.06),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;
    display: grid;
    place-items: center;
  }

  .iconWrap.ok {
    border-color: rgba(34, 197, 94, 0.25);
  }

  .iconWrap.warn {
    border-color: rgba(245, 158, 11, 0.30);
  }

  .icon {
    font-size: 26px;
    line-height: 1;
  }

  .spinner {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: 3px solid rgba(15, 23, 42, 0.14);
    border-top-color: rgba(37, 99, 235, 0.9);
    animation: spin 0.9s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 950;
    letter-spacing: -0.03em;
    color: #0f172a;
    line-height: 1.15;
  }

  .sub {
    margin: 0 auto;
    max-width: 46ch;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: rgba(15, 23, 42, 0.65);
  }

  .grid {
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    text-align: left;
  }

  .item {
    border-radius: 16px;
    padding: 12px 12px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow:
      0 16px 36px rgba(15, 23, 42, 0.06),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;
    display: grid;
    gap: 4px;
  }

  .label {
    font-size: 11px;
    font-weight: 950;
    letter-spacing: 0.06em;
    color: rgba(15, 23, 42, 0.55);
  }

  .value {
    font-size: 16px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: #0f172a;
    line-height: 1.05;
  }

  .value.strong {
    color: rgba(22, 101, 52, 0.95);
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
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(255, 255, 255, 0.9);
    color: rgba(15, 23, 42, 0.9);
    font-size: 13px;
    font-weight: 950;
    letter-spacing: -0.02em;
    cursor: pointer;
    box-shadow:
      0 16px 36px rgba(15, 23, 42, 0.06),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;
    transition: transform 0.12s ease, filter 0.12s ease;
  }

  .btn:hover { transform: translateY(-1px); }
  .btn:active { transform: translateY(0px); }

  .btn.primary {
    border-color: rgba(59, 130, 246, 0.26);
  }

  .btn.ghost {
    background: rgba(255, 255, 255, 0.65);
  }

  .foot {
    position: relative;
    margin-top: 12px;
    text-align: center;
  }

  .muted {
    font-size: 12px;
    font-weight: 800;
    color: rgba(15, 23, 42, 0.55);
  }

  @media (max-width: 520px) {
    .card { padding: 16px; border-radius: 20px; }
    .grid { grid-template-columns: 1fr; }
  }
</style>
