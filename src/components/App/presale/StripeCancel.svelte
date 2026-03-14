<script lang="ts">
  import { goto } from "$app/navigation";
  const back = () => goto("/app/presale");
</script>

<div class="page">
  <section class="card">
    <div class="top">
      <div class="badge">
        <span class="k">PRESALE</span>
        <span class="pill warn">CANCELED</span>
      </div>

      <div class="iconWrap warn">
        <div class="icon">❌</div>
      </div>

      <h1>Payment canceled</h1>
      <p class="sub">
        No worries. You can try again anytime.
      </p>
    </div>

    <div class="actions">
      <button class="btn primary" on:click={back}>Back to Presale</button>
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
  width: min(520px, 92vw);
  border-radius: 26px;
  padding: 22px;
  background: var(--bg-white);
  border: 1px solid var(--border-soft);
  box-shadow:
    0 30px 90px rgba(18, 20, 22, 0.08),
    0 8px 22px rgba(18, 20, 22, 0.06);
}

.card::before {
  content: none;
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
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid var(--border-soft);
  color: var(--text-muted);
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

.iconWrap.warn { border-color: rgba(245, 158, 11, 0.25); }

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
  border-color: rgba(37, 99, 235, 0.25);
}

@media (max-width: 520px) {
  .card { padding: 16px; border-radius: 20px; }
}
</style>
