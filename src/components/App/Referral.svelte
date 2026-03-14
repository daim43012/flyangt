<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { generateQR } from "$lib/utils/generateQR";

  export let data: any;

  $: referralCode = data?.referralCode ?? "";
  $: referralLink = data?.referralLink ?? "";
  $: referrals = data?.referrals ?? [];
  $: stats = data?.stats ?? { totalReferred: 0, activeReferrals: 0, totalEarned: 0 };

  let copied = false;
  let qrDataUrl = "";

  async function copyLink() {
    if (!browser) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {}
  }

  function downloadQR() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `flyangt-referral-${referralCode}.png`;
    a.click();
  }

  function maskEmail(email: string): string {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (!domain) return email;
    const visible = local.slice(0, 2);
    return `${visible}***@${domain}`;
  }

  function formatDate(iso: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  onMount(async () => {
    if (referralLink) {
      qrDataUrl = await generateQR(referralLink);
    }
  });
</script>

<section class="referral">

  <!-- Top row: Hero + QR -->
  <div class="top-row">

    <!-- Hero card -->
    <div class="card hero-card">
      <div class="k">REFERRAL PROGRAM</div>
      <h2 class="heading">Invite Friends,<br/>Earn Rewards</h2>
      <p class="desc">Share your unique referral link. When your friend registers and connects a wallet.</p>

      <div class="code-row">
        <div class="ref-code">{referralCode}</div>
      </div>

      <div class="link-row">
        <div class="link-box">{referralLink}</div>
        <button class="btn-primary copy-btn" on:click={copyLink}>
          {#if copied}
            <i class="fa-solid fa-check"></i> Copied
          {:else}
            <i class="fa-solid fa-copy"></i> Copy Link
          {/if}
        </button>
      </div>
    </div>

    <!-- QR card -->
    <div class="card qr-card">
      <div class="qr-frame">
        {#if qrDataUrl}
          <img src={qrDataUrl} alt="Referral QR Code" class="qr-img" />
        {:else}
          <div class="qr-placeholder">
            <i class="fa-solid fa-qrcode"></i>
          </div>
        {/if}
      </div>
      <div class="qr-body">
        <div class="k">QR CODE</div>
        <div class="qr-label">Scan to join</div>
        <button class="btn-secondary dl-btn" on:click={downloadQR} disabled={!qrDataUrl}>
          <i class="fa-solid fa-download"></i> Download QR
        </button>
      </div>
    </div>
  </div>

  <!-- Stats row -->
  <div class="stats-row">
    <div class="card stat-card">
      <div class="k">TOTAL REFERRED</div>
      <div class="v">{stats.totalReferred}</div>
    </div>
    <div class="card stat-card">
      <div class="k">WALLETS CONNECTED</div>
      <div class="v">{stats.activeReferrals}</div>
    </div>
  </div>

  <!-- Referrals list -->
  <div class="card list-card">
    <div class="list-header">
      <h3 class="list-title">Your Referrals</h3>
      <div class="pill">{stats.totalReferred} total</div>
    </div>

    {#if referrals.length === 0}
      <div class="empty">
        <div class="empty-icon"><i class="fa-solid fa-user-plus"></i></div>
        <div class="empty-text">No referrals yet</div>
        <div class="empty-sub">Share your link and start earning!</div>
      </div>
    {:else}
      <div class="ref-list">
        {#each referrals as ref (ref.id)}
          <div class="ref-item">
            <div class="ref-avatar">
              {(ref.name ?? ref.email ?? "?").charAt(0).toUpperCase()}
            </div>
            <div class="ref-info">
              <div class="ref-name">{ref.name || maskEmail(ref.email)}</div>
              <div class="ref-date">{formatDate(ref.createdAt)}</div>
            </div>
            <div class="ref-status" class:active={ref.walletConnected}>
              {#if ref.walletConnected}
                <i class="fa-solid fa-circle-check"></i> Active
              {:else}
                <i class="fa-regular fa-clock"></i> Pending
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .referral {
    display: grid;
    gap: 20px;
  }

  /* ── Shared card ── */
  .card {
    border-radius: 26px;
    padding: 22px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
  }

  .card:hover {
    border-color: rgba(176, 141, 87, 0.25);
  }

  .k {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 12px;
  }

  /* ── Top row ── */
  .top-row {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 20px;
    align-items: stretch;
  }

  /* ── Hero card ── */
  .heading {
    font-family: var(--font-heading);
    font-size: 32px;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.2;
    color: var(--text-main);
    margin: 0 0 10px;
  }

  .desc {
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);
    margin: 0 0 20px;
    max-width: 480px;
  }

  .desc strong {
    color: var(--accent);
    font-weight: 700;
  }

  .code-row {
    margin-bottom: 16px;
  }

  .ref-code {
    display: inline-flex;
    align-items: center;
    height: 38px;
    padding: 0 18px;
    border-radius: 999px;

    font-family: var(--font-heading);
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0.15em;

    background: linear-gradient(
      135deg,
      rgba(176, 141, 87, 0.08),
      rgba(176, 141, 87, 0.16)
    );
    border: 1px solid rgba(176, 141, 87, 0.25);
    color: var(--accent-dark);
  }

  .link-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .link-box {
    flex: 1;
    height: 42px;
    padding: 0 16px;
    border-radius: 999px;

    display: flex;
    align-items: center;

    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);

    background: rgba(15, 23, 42, 0.02);
    border: 1px solid var(--border-soft);

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .copy-btn {
    flex-shrink: 0;
    height: 42px;
    padding: 0 20px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .copy-btn:hover {
    transform: translateY(-2px);
  }

  /* ── QR card ── */
  .qr-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .qr-frame {
    width: 100%;
    max-width: 200px;
    aspect-ratio: 1;
    border-radius: 20px;
    padding: 14px;

    display: grid;
    place-items: center;

    background: var(--bg-white);
    border: 2px solid transparent;
    background-image:
      linear-gradient(var(--bg-white), var(--bg-white)),
      linear-gradient(135deg, var(--accent-light), var(--accent), var(--accent-dark));
    background-origin: border-box;
    background-clip: padding-box, border-box;

    box-shadow:
      0 12px 36px rgba(176, 141, 87, 0.12),
      0 4px 12px rgba(18, 20, 22, 0.06);
  }

  .qr-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .qr-placeholder {
    font-size: 48px;
    color: rgba(176, 141, 87, 0.25);
  }

  .qr-body {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .qr-label {
    margin-top: 4px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .dl-btn {
    margin-top: 14px;
    height: 36px;
    padding: 0 18px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .dl-btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .dl-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ── Stats row ── */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .stat-card {
    text-align: center;
    padding: 22px 16px;
  }

  .stat-card .k {
    margin-bottom: 10px;
  }

  .v {
    font-family: var(--font-heading);
    font-size: 40px;
    font-weight: 600;
    letter-spacing: -0.04em;
    line-height: 1;

    display: inline-flex;
    align-items: baseline;
    gap: 6px;

    background: linear-gradient(
      135deg,
      var(--accent-light),
      var(--accent),
      var(--accent-dark)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .t {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    -webkit-text-fill-color: var(--text-muted);
  }

  /* ── Referrals list ── */
  .list-card {
    padding: 22px;
  }

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .list-title {
    font-family: var(--font-heading);
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text-main);
    margin: 0;
  }

  .pill {
    height: 26px;
    padding: 0 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    background: rgba(15, 23, 42, 0.02);
    border: 1px solid var(--border-soft);
    color: var(--text-muted);
  }

  /* ── Empty state ── */
  .empty {
    padding: 40px 20px;
    text-align: center;
  }

  .empty-icon {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    margin: 0 auto 16px;
    font-size: 22px;
    color: rgba(176, 141, 87, 0.45);
    background: rgba(176, 141, 87, 0.06);
    border: 1px solid rgba(176, 141, 87, 0.12);
  }

  .empty-text {
    font-family: var(--font-heading);
    font-size: 18px;
    font-weight: 600;
    color: var(--text-main);
    margin-bottom: 6px;
  }

  .empty-sub {
    font-size: 13px;
    color: var(--text-muted);
  }

  /* ── Referral list items ── */
  .ref-list {
    display: grid;
    gap: 6px;
  }

  .ref-item {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    gap: 14px;
    align-items: center;

    padding: 12px 14px;
    border-radius: 16px;

    background: rgba(15, 23, 42, 0.01);
    border: 1px solid transparent;

    transition: background 0.25s ease, border-color 0.25s ease;
  }

  .ref-item:hover {
    background: rgba(15, 23, 42, 0.025);
    border-color: var(--border-soft);
  }

  .ref-avatar {
    width: 40px;
    height: 40px;
    border-radius: 14px;

    display: grid;
    place-items: center;

    font-family: var(--font-heading);
    font-size: 16px;
    font-weight: 600;
    color: var(--accent-dark);

    background: linear-gradient(
      135deg,
      rgba(176, 141, 87, 0.08),
      rgba(176, 141, 87, 0.16)
    );
    border: 1px solid rgba(176, 141, 87, 0.18);
  }

  .ref-info {
    min-width: 0;
  }

  .ref-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-main);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ref-date {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .ref-status {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
  }

  .ref-status.active {
    color: rgba(34, 197, 94, 0.85);
  }

  /* ── Responsive ── */
  @media (max-width: 980px) {
    .top-row {
      grid-template-columns: 1fr;
    }

    .qr-card {
      max-width: none;
      flex-direction: row;
      gap: 20px;
      text-align: left;
    }

    .qr-frame {
      max-width: 160px;
      flex-shrink: 0;
    }

    .stats-row {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    .card {
      padding: 18px;
      border-radius: 22px;
    }

    .heading {
      font-size: 26px;
    }

    .v {
      font-size: 32px;
    }
  }

  @media (max-width: 640px) {
    .referral {
      gap: 14px;
    }

    .card {
      padding: 16px;
      border-radius: 20px;
    }

    .heading {
      font-size: 22px;
    }

    .link-row {
      flex-direction: column;
    }

    .link-box {
      width: 100%;
      font-size: 12px;
    }

    .copy-btn {
      width: 100%;
      justify-content: center;
    }

    .v {
      font-size: 28px;
    }

    .ref-item {
      grid-template-columns: 36px 1fr auto;
      gap: 10px;
      padding: 10px 12px;
    }

    .ref-avatar {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      font-size: 14px;
    }

    .qr-card {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .qr-frame {
      max-width: 180px;
    }
  }
</style>
