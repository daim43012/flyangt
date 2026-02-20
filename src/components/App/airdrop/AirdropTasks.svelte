<script lang="ts">
  import { get } from "svelte/store";
  import { wallet } from "$lib/wallet/wallet.store";
  import { invalidateAll } from "$app/navigation";

  export let data: any;

  const tasks = data?.data?.tasks ?? [];
  const referral = data?.data?.referral ?? null;

  const isDone = (key: string) =>
    tasks.find((t: any) => t.key === key && t.completed);

  const taskMeta = (key: string) =>
    tasks.find((t: any) => t.key === key)?.meta ?? null;

  let busy = false;
  let errorMsg = "";
  let infoMsg = "";

  let walletTaskDoneLocal = false;

  async function completeWalletTask() {
    errorMsg = "";
    infoMsg = "";
    busy = true;

    try {
      await wallet.connect();

      const s = get(wallet);
      if (!s.address || !s.provider) {
        throw new Error(s.lastError || "Wallet not connected");
      }
      if (s.status === "wrong_network") {
        throw new Error("Wrong network. Please switch to Polygon.");
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

      if (verifyJson?.completedTaskKey === "wallet_connected") {
        walletTaskDoneLocal = true;
      }

      if (verifyJson?.selfRewarded) {
        infoMsg = "Wallet verified. Reward added ✅";
      } else {
        infoMsg = "Wallet already verified ✅";
      }

      if (verifyJson?.referralRewarded) {
        infoMsg += " Referrer reward granted ✅";
      }

      await invalidateAll();
    } catch (e: any) {
      errorMsg = String(e?.message ?? e ?? "Error");
    } finally {
      busy = false;
    }
  }
  let igBusy = false;
  let igCanClaim = false;
  let igToken = "";
  let igDoneLocal = false;

  let igSecondsLeft = 0;
  let igInterval: ReturnType<typeof setInterval> | null = null;

  function stopIgTimer() {
    if (igInterval) {
      clearInterval(igInterval);
      igInterval = null;
    }
  }

  function startIgTimer(totalSeconds = 60) {
    stopIgTimer();
    igSecondsLeft = totalSeconds;
    igBusy = true;
    igCanClaim = false;

    igInterval = setInterval(() => {
      igSecondsLeft = Math.max(0, igSecondsLeft - 1);
      if (igSecondsLeft === 0) {
        stopIgTimer();
        igBusy = false;
        igCanClaim = true;
      }
    }, 1000);
  }

  async function startInstagramTask() {
    errorMsg = "";
    infoMsg = "";

    if (!walletDone) {
      errorMsg = "Complete 'Connect Wallet' task first";
      return;
    }

    igDoneLocal = false;
    igToken = "";
    stopIgTimer();

    try {
      const r = await fetch("/api/airdrop/instagram/start", { method: "POST" });
      const d = await r.json().catch(() => ({}));

      if (!r.ok)
        throw new Error(d?.error || d?.message || "Instagram start error");

      if (d?.alreadyClaimed) {
        igDoneLocal = true;
        infoMsg = "Instagram task already completed ✅";
        await invalidateAll();
        return;
      }

      igToken = d.token;

      window.open(d.igUrl, "_blank", "noopener,noreferrer");

      startIgTimer(60);
    } catch (e: any) {
      stopIgTimer();
      igBusy = false;
      igCanClaim = false;
      errorMsg = String(e?.message ?? e ?? "Error");
    }
  }

  async function claimInstagramTask() {
    errorMsg = "";
    infoMsg = "";

    if (!igCanClaim || !igToken) return;

    try {
      const r = await fetch("/api/airdrop/instagram/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: igToken }),
      });

      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d?.error || d?.message || "Claim error");

      if (d?.needWaitMs) {
        const sec = Math.ceil(d.needWaitMs / 1000);
        infoMsg = `Wait ${sec}s...`;
        startIgTimer(sec);
        return;
      }

      if (d?.alreadyClaimed) {
        infoMsg = "Already claimed ✅";
        igDoneLocal = true;
      } else if (d?.claimed) {
        infoMsg = `Reward added ✅ +${d.amount ?? 20} ANG`;
        igDoneLocal = true;
      } else {
        infoMsg = "Done ✅";
        igDoneLocal = true;
      }

      igCanClaim = false;
      stopIgTimer();

      await invalidateAll();
    } catch (e: any) {
      errorMsg = String(e?.message ?? e ?? "Error");
    }
  }

  $: walletDone = isDone("wallet_connected") || walletTaskDoneLocal;
  $: igDone = isDone("social_ig") || igDoneLocal;

  $: inviteMeta = taskMeta("invite_friend");
  $: referralCount = inviteMeta?.referralCount ?? referral?.count ?? 0;

  function buildReferralLink() {
    const code = referral?.code;
    if (!code) return "";
    return `${location.origin}/register?ref=${encodeURIComponent(code)}`;
  }

  async function copyReferralLink() {
    const link = buildReferralLink();
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      infoMsg = "Referral link copied ✅";
      setTimeout(() => (infoMsg = ""), 1200);
    } catch {
      // ignore
    }
  }
  let igCode = "";
  let igCodeBusy = false;
  let igCodeDoneLocal = false;

  $: igCodeDone = isDone("ig_code") || igCodeDoneLocal;

  async function claimIgCode() {
    errorMsg = "";
    infoMsg = "";

    if (!walletDone) {
      errorMsg = "Complete 'Connect Wallet' task first";
      return;
    }
    if (!igCode.trim()) {
      errorMsg = "Enter code";
      return;
    }

    igCodeBusy = true;
    try {
      const r = await fetch("/api/airdrop/igcode/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: igCode }),
      });

      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d?.error || d?.message || "Wrong code");

      if (d?.alreadyClaimed) {
        infoMsg = "Already claimed ✅";
        igCodeDoneLocal = true;
      } else if (d?.claimed) {
        infoMsg = `Reward added ✅ +${d.amount ?? 15} ANG`;
        igCodeDoneLocal = true;
      }

      await invalidateAll();
    } catch (e: any) {
      errorMsg = String(e?.message ?? e ?? "Error");
    } finally {
      igCodeBusy = false;
    }
  }
</script>

<section class="airdrop-tasks">
  <header class="tasks-head">
    <h2 class="title">EARNING TASKS</h2>
    <span class="pill head-pill">Total Pool: 1000k ANG</span>
  </header>

  <div class="tasks">
    <article class="task" class:task-done={walletDone}>
      <div class="icon">🔗</div>

      <div class="meta">
        <h3>Connect Wallet</h3>
        <p>Connect your wallet and sign a message to verify ownership.</p>

        <div class="tags">
          <span class="pill">+100 ANG</span>
          <span class="pill">OFFCHAIN</span>
        </div>
      </div>

      <div class="side">
        {#if walletDone}
          <span class="status done">Done</span>
          <button class="btn" disabled>Completed</button>
        {:else}
          <span class="status todo">Todo</span>
          <button
            class="btn"
            type="button"
            on:click={completeWalletTask}
            disabled={busy}
          >
            {busy ? "Connecting..." : "Connect Wallet →"}
          </button>
        {/if}

        <!-- {#if infoMsg}
          <div class="pill" style="margin-top: 8px;">{infoMsg}</div>
        {/if}

        {#if errorMsg}
          <div class="pill" style="margin-top: 8px;">{errorMsg}</div>
        {/if} -->
      </div>
    </article>

    <article class="task" class:task-done={isDone("profile_completed")}>
      <div class="icon">🪪</div>

      <div class="meta">
        <h3>Complete Profile</h3>
        <p>Fill in your basic profile information.</p>

        <div class="tags">
          <span class="pill">+200 ANG</span>
          <span class="pill">OFFCHAIN</span>
        </div>
      </div>

      <div class="side">
        {#if isDone("profile_completed")}
          <span class="status done">Done</span>
          <button class="btn" disabled>Completed</button>
        {:else}
          <span class="status todo">Todo</span>
          <a class="btn" href="/app/settings">Complete Profile →</a>
        {/if}
      </div>
    </article>

    <article class="task" class:task-done={igDone}>
      <div class="icon">📸</div>

      <div class="meta">
        <h3>Instagram</h3>
        <p>Open our Instagram, subscribe, then claim reward.</p>

        <div class="tags">
          <span class="pill">+20 ANG</span>
          <span class="pill">OFFCHAIN</span>
        </div>
      </div>

      <div class="side">
        {#if igDone}
          <span class="status done">Done</span>
          <button class="btn" disabled>Completed</button>
        {:else}
          <span class="status todo">Todo</span>

          {#if !walletDone}
            <button class="btn" disabled>Connect Wallet first</button>
          {:else if igBusy}
            <button class="btn btn-ig" disabled>
              <span class="spin"></span>
              Waiting {igSecondsLeft}s
            </button>
          {:else if igCanClaim}
            <button
              class="btn btn-ig"
              type="button"
              on:click={claimInstagramTask}
            >
              Claim reward →
            </button>
          {:else}
            <button
              class="btn btn-ig"
              type="button"
              on:click={startInstagramTask}
            >
              Open Instagram →
            </button>
          {/if}
        {/if}
      </div>
    </article>
    <article class="task" class:task-done={igCodeDone}>
      <div class="icon">🔐</div>

      <div class="meta">
        <h3>Instagram Code</h3>
        <p>Find the code in our Instagram post comments and enter it here.</p>

        <div class="tags">
          <span class="pill">+15 ANG</span>
          <span class="pill">OFFCHAIN</span>
        </div>
      </div>

      <div class="side">
        {#if igCodeDone}
          <span class="status done">Done</span>
          <button class="btn" disabled>Completed</button>
        {:else}
          <span class="status todo">Todo</span>

          {#if !walletDone}
            <button class="btn" disabled>Connect Wallet first</button>
          {:else}
            <input
              class="code"
              placeholder="Enter code"
              bind:value={igCode}
              maxlength="32"
            />
            <button class="btn" on:click={claimIgCode} disabled={igCodeBusy}>
              {igCodeBusy ? "Checking..." : "Submit code →"}
            </button>
          {/if}
        {/if}
      </div>
    </article>

    <article class="task" class:task-done={isDone("invite_friend")}>
      <div class="icon">🧑‍🤝‍🧑</div>

      <div class="meta">
        <h3>Invite a Friend</h3>
        <p>
          Share your referral link. The task completes when at least one invited
          user connects a wallet.
        </p>

        <div class="tags">
          <span class="pill">+100 ANG</span>
          <span class="pill">OFFCHAIN</span>
        </div>
      </div>

      <div class="side">
        {#if isDone("invite_friend")}
          <span class="status done">Done</span>
          <button class="btn" disabled>Completed</button>
          <!-- <div class="pill" style="margin-top: 8px;">
            Referrals: {referralCount}
          </div> -->
        {:else}
          <span class="status todo">Todo</span>

          {#if referral?.code}
            <button class="btn" type="button" on:click={copyReferralLink}>
              Copy referral link →
            </button>
            <div class="pill" style="margin-top: 8px;">
              Referrals: {referralCount}
            </div>
          {:else}
            <button class="btn" disabled>Referral code not ready</button>
          {/if}
        {/if}
      </div>
    </article>
  </div>
</section>

<style>
  .airdrop-tasks {
    margin-top: 24px;
    display: grid;
    gap: 16px;
  }

  .task-done {
    border-color: rgba(34, 197, 94, 0.35);
    background: linear-gradient(180deg, rgba(34, 197, 94, 0.06), #ffffff 60%);
  }

  .task-done .status {
    background: rgba(34, 197, 94, 0.12);
    border-color: rgba(34, 197, 94, 0.45);
    color: #166534;
  }

  .task-done .status::before {
    background: #22c55e;
  }

  .task-done .btn[disabled] {
    background: linear-gradient(180deg, #22c55e, #16a34a);
    border-color: rgba(22, 163, 74, 0.9);
    color: #ffffff;
    box-shadow: 0 14px 30px rgba(34, 197, 94, 0.35);
    cursor: default;
  }
  .btn.btn-ig {
    background: linear-gradient(45deg, #f58529, #dd2a7b, #8134af, #515bd4);
    border: 0;
    color: #fff;
  }

  .btn-ig:disabled {
    opacity: 0.75;
  }

  .spin {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: rgba(255, 255, 255, 0.95);
    animation: spin 0.8s linear infinite;
    margin-right: 8px;
    vertical-align: -2px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .code {
    height: 40px;
    width: 160px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    padding: 0 14px;
    font-weight: 900;
    font-size: 12px;
    letter-spacing: 0.02em;
    outline: none;
  }
  .code:focus {
    border-color: rgba(15, 23, 42, 0.35);
  }

  .task-done .tags .pill:first-child {
    background: rgba(34, 197, 94, 0.12);
    border-color: rgba(34, 197, 94, 0.45);
    color: #166534;
  }

  .task-done .icon {
    background: rgba(34, 197, 94, 0.12);
    border-color: rgba(34, 197, 94, 0.35);
  }

  .task-done:hover {
    filter: brightness(1.03);
  }

  .tasks-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .title {
    margin: 0;
    font-size: 22px;
    font-weight: 950;
    letter-spacing: -0.03em;
    font-style: italic;
    color: #0f172a;
  }

  .head-pill {
    height: 28px;
  }

  .tasks {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .task {
    border-radius: 20px;
    padding: 20px;
    min-height: 150px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow:
      0 18px 40px rgba(15, 23, 42, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.85) inset;
    display: grid;
    grid-template-columns: 48px 1fr auto;
    gap: 16px;
    align-items: start;
    transition:
      transform 0.12s ease,
      filter 0.12s ease;
  }

  .task:hover {
    transform: translateY(-1px);
    filter: brightness(1.02);
  }

  .icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);
    font-size: 18px;
  }

  .meta {
    display: grid;
    gap: 8px;
    min-width: 0;
  }

  .meta h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 950;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .meta p {
    margin: 0;
    font-size: 13px;
    line-height: 1.45;
    color: rgba(15, 23, 42, 0.65);
  }

  .tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
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
    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.08);
    color: rgba(15, 23, 42, 0.85);
    white-space: nowrap;
  }

  .side {
    display: grid;
    justify-items: end;
    gap: 12px;
    min-width: 160px;
  }

  .status {
    height: 26px;
    padding: 0 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 950;
    display: inline-flex;
    align-items: center;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(255, 255, 255, 0.92);
    color: rgba(15, 23, 42, 0.75);
  }

  .status::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 999px;
    margin-right: 8px;
    background: rgba(15, 23, 42, 0.55);
  }

  .btn {
    height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: #0f172a;
    color: #fff;
    font-size: 12px;
    font-weight: 950;
    letter-spacing: -0.02em;
    cursor: pointer;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.18);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition:
      transform 0.12s ease,
      filter 0.12s ease;
  }

  .btn:hover {
    transform: translateY(-1px);
    filter: brightness(1.03);
  }

  @media (max-width: 980px) {
    .tasks {
      grid-template-columns: 1fr;
    }

    .task {
      grid-template-columns: 48px 1fr;
      min-height: 0;
      padding: 18px;
    }

    .side {
      grid-column: 1 / -1;
      justify-items: start;
    }

    .btn {
      width: 100%;
    }

    .title {
      font-size: 18px;
    }
  }
</style>
