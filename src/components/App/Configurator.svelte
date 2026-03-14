<script lang="ts">
  import ConfiguratorOptions from "../configurator/ConfiguratorOptions.svelte";
  import ConfiguratorSummary from "../configurator/ConfiguratorSummary.svelte";

  type Option = {
    id: string;
    title: string;
    price: number;
    weightKg: number;
  };

  type Category = {
    id: string;
    title: string;
    mode: "single" | "multi";
    options: Option[];
    selectedId?: string;
    selectedIds?: string[];
  };

  const BASE_PRICE = 87000;
  const BASE_WEIGHT_KG = 250;

  let categories: Category[] = [
    {
      id: "engine",
      title: "Engine",
      mode: "single",
      selectedId: "rotax915",
      options: [
        { id: "rotax915", title: "Rotax 915 iS (141 hp)", price: 45000, weightKg: 85 },
        { id: "rotax912", title: "Rotax 912 ULS (100 hp)", price: 28000, weightKg: 65 }
      ]
    },
    {
      id: "avionics",
      title: "Avionics",
      mode: "single",
      selectedId: "garmin",
      options: [
        { id: "garmin", title: "Garmin G3X Touch Dual", price: 22000, weightKg: 12 },
        { id: "dynon", title: "Dynon SkyView HDX", price: 18000, weightKg: 10 }
      ]
    },
    {
      id: "interior",
      title: "Interior",
      mode: "multi",
      selectedIds: ["leather"],
      options: [
        { id: "leather", title: "Premium Leather Interior", price: 5500, weightKg: 15 },
        { id: "sound", title: "Cabin Sound Insulation", price: 2200, weightKg: 6 }
      ]
    },
    {
      id: "safety",
      title: "Safety",
      mode: "multi",
      selectedIds: ["brs"],
      options: [
        { id: "brs", title: "BRS Rescue System", price: 12500, weightKg: 35 },
        { id: "elt", title: "ELT + Emergency Pack", price: 1800, weightKg: 2 }
      ]
    },
    {
      id: "paint",
      title: "Paint",
      mode: "single",
      selectedId: "multi",
      options: [
        { id: "multi", title: "Custom Multi color Paint", price: 8500, weightKg: 8 },
        { id: "mono", title: "Classic Mono paint", price: 4200, weightKg: 6 }
      ]
    }
  ];

  function setSingle(categoryId: string, optionId: string) {
    categories = categories.map((c) =>
      c.id === categoryId ? { ...c, selectedId: optionId } : c
    );
  }

  function toggleMulti(categoryId: string, optionId: string) {
    categories = categories.map((c) => {
      if (c.id !== categoryId) return c;
      const set = new Set(c.selectedIds ?? []);
      if (set.has(optionId)) set.delete(optionId);
      else set.add(optionId);
      return { ...c, selectedIds: [...set] };
    });
  }

  function chosenOptionsFlat(cats: Category[]): Option[] {
    const out: Option[] = [];
    for (const c of cats) {
      if (c.mode === "single") {
        const id = c.selectedId ?? c.options[0]?.id;
        const opt = c.options.find((o) => o.id === id);
        if (opt) out.push(opt);
      } else {
        const ids = c.selectedIds ?? [];
        for (const id of ids) {
          const opt = c.options.find((o) => o.id === id);
          if (opt) out.push(opt);
        }
      }
    }
    return out;
  }

  $: picked = chosenOptionsFlat(categories);
  $: addonsPrice = picked.reduce((s, x) => s + x.price, 0);
  $: addonsWeight = picked.reduce((s, x) => s + x.weightKg, 0);
  $: totalPrice = BASE_PRICE + addonsPrice;
  $: totalWeightKg = BASE_WEIGHT_KG + addonsWeight;
  $: leadDays = 270;

  const numFmt = new Intl.NumberFormat("en-US");
  function fmt(n: number) { return numFmt.format(n); }

  const legalNote =
    "The buyer acts as the legal builder. Under the 51% rule, more than half of the work must be completed by the amateur builder.";

  let orderOpen = false;
  let form = { name: "", email: "", phone: "", message: "" };
  let sending = false;
  let sent = false;
  let sendError = "";

  function openOrder() {
    form = { name: "", email: "", phone: "", message: "" };
    sent = false;
    sendError = "";
    orderOpen = true;
  }

  function closeOrder() {
    orderOpen = false;
  }

  async function submitOrder() {
    if (!form.name.trim() || !form.email.trim()) return;
    sending = true;
    sendError = "";
    try {
      const res = await fetch("/api/configurator/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          message: form.message.trim() || undefined,
          configuration: picked.map((p) => ({ title: p.title, price: p.price })),
          totalPrice,
          totalWeightKg,
          leadDays,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      sent = true;
    } catch {
      sendError = "Something went wrong. Please try again.";
    } finally {
      sending = false;
    }
  }

  function handleBackdropKey(e: KeyboardEvent) {
    if (e.key === "Escape") closeOrder();
  }
</script>

<div class="cfg">
  <div class="hero-card" data-tour-page="cfg-hero">
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="hero-content">
      <div class="hero-kicker">
        <span class="kicker-dot" aria-hidden="true"></span>
        KIT Aircraft
      </div>
      <h1 class="h1">ANG Configurator</h1>
      <p class="sub">Build your ideal aircraft configuration for your mission.</p>
    </div>
  </div>

  <div class="grid">
    <div class="left" data-tour-page="cfg-options">
      <ConfiguratorOptions
        {categories}
        on:single={(e) => setSingle(e.detail.categoryId, e.detail.optionId)}
        on:toggle={(e) => toggleMulti(e.detail.categoryId, e.detail.optionId)}
      />
    </div>

    <aside class="right" data-tour-page="cfg-summary">
      <ConfiguratorSummary
        {totalPrice}
        {totalWeightKg}
        {leadDays}
        {legalNote}
        {picked}
        on:order={openOrder}
      />
    </aside>
  </div>
</div>

<!-- Order modal -->
{#if orderOpen}
  <div
    class="backdrop"
    role="dialog"
    aria-modal="true"
    aria-label="Order KIT"
    tabindex="-1"
    on:keydown={handleBackdropKey}
  >
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal" on:click|stopPropagation on:keydown|stopPropagation>
      <button class="modal-close" type="button" on:click={closeOrder} aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      {#if sent}
        <div class="sent-state">
          <div class="sent-icon">✓</div>
          <div class="sent-title">Request sent!</div>
          <div class="sent-sub">We'll get back to you as soon as possible.</div>
          <button class="btnPrimary mt" type="button" on:click={closeOrder}>Close</button>
        </div>
      {:else}
        <div class="modal-title">Order KIT</div>
        <div class="modal-sub">Fill in your details and we will contact you to discuss the build.</div>

        <div class="modal-summary">
          {#each picked as item (item.title)}
            <div class="ms-row">
              <span class="ms-name">{item.title}</span>
              <span class="ms-price">+${fmt(item.price)}</span>
            </div>
          {/each}
          <div class="ms-total">
            <span>Total</span>
            <span>${fmt(totalPrice)}</span>
          </div>
        </div>

        <form class="form" on:submit|preventDefault={submitOrder}>
          <div class="field">
            <label class="label" for="cfg-name">Full name *</label>
            <input id="cfg-name" class="input" type="text" bind:value={form.name}
              placeholder="John Smith" required autocomplete="name" />
          </div>
          <div class="field">
            <label class="label" for="cfg-email">Email *</label>
            <input id="cfg-email" class="input" type="email" bind:value={form.email}
              placeholder="john@example.com" required autocomplete="email" />
          </div>
          <div class="field">
            <label class="label" for="cfg-phone">Phone</label>
            <input id="cfg-phone" class="input" type="tel" bind:value={form.phone}
              placeholder="+1 234 567 8900" autocomplete="tel" />
          </div>
          <div class="field">
            <label class="label" for="cfg-msg">Message</label>
            <textarea id="cfg-msg" class="input textarea" bind:value={form.message}
              placeholder="Any specific requirements or questions…" rows="3"></textarea>
          </div>

          {#if sendError}
            <div class="error">{sendError}</div>
          {/if}

          <button class="btnPrimary" type="submit"
            disabled={sending || !form.name.trim() || !form.email.trim()}>
            {sending ? "Sending…" : "Send request"}
          </button>
        </form>
      {/if}
    </div>
  </div>
{/if}

<style>
  .cfg {
    display: flex;
    flex-direction: column;
    min-height: 0;
    width: 100%;
  }

  /* --- Hero card --- */
  .hero-card {
    position: relative;
    border-radius: 20px;
    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    overflow: hidden;
    margin-bottom: 18px;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(900px 300px at 80% 50%, rgba(176, 141, 87, 0.09), transparent 60%),
      radial-gradient(600px 250px at 10% 80%, rgba(122, 90, 45, 0.06), transparent 65%);
  }

  .hero-content {
    position: relative;
    z-index: 1;
    padding: 22px 24px;
  }

  .hero-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 12px;
  }

  .kicker-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--accent);
    box-shadow: 0 0 0 4px rgba(176, 141, 87, 0.18);
    flex-shrink: 0;
  }

  .h1 {
    margin: 0;
    font-size: 30px;
    font-weight: 600;
    letter-spacing: -0.02em;
    font-family: var(--font-heading);
    color: var(--text-main);
  }

  .sub {
    margin: 8px 0 0;
    max-width: 72ch;
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);
  }

  .grid {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 18px;
    align-items: start;
    min-width: 0;
  }

  .left {
    min-width: 0;
  }

  .right {
    position: sticky;
    top: 22px;
  }

  @media (max-width: 980px) {
    .grid {
      grid-template-columns: 1fr;
    }
    .right {
      position: static;
    }
  }

  @media (max-width: 640px) {
    .h1 { font-size: 24px; }
  }

  /* ---- Modal ---- */
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .modal {
    position: relative;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 28px;
    padding: 28px 26px 24px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 40px 110px rgba(15, 23, 42, 0.18),
      0 12px 32px rgba(15, 23, 42, 0.10);
    animation: slideUp 0.25s ease;
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  .modal-close {
    position: absolute;
    top: 18px;
    right: 18px;
    width: 32px;
    height: 32px;
    border-radius: 999px;
    border: 1px solid var(--border-soft);
    background: rgba(15, 23, 42, 0.04);
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .modal-close:hover {
    background: rgba(15, 23, 42, 0.08);
    color: var(--text-main);
  }

  .modal-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text-main);
    margin-bottom: 6px;
    padding-right: 36px;
  }

  .modal-sub {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.55;
    margin-bottom: 18px;
  }

  .modal-summary {
    border-radius: 18px;
    border: 1px solid var(--border-soft);
    background: rgba(15, 23, 42, 0.02);
    padding: 12px 14px;
    margin-bottom: 20px;
    display: grid;
    gap: 6px;
  }

  .ms-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .ms-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-main);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ms-price {
    font-size: 12px;
    font-weight: 700;
    color: rgba(120, 86, 36, 0.85);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .ms-total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border-top: 1px solid rgba(15, 23, 42, 0.08);
    margin-top: 4px;
    padding-top: 8px;
    font-size: 14px;
    font-weight: 800;
    color: var(--text-main);
    letter-spacing: -0.01em;
  }

  .form { display: grid; gap: 14px; }
  .field { display: grid; gap: 6px; }

  .label {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 700;
  }

  .input {
    width: 100%;
    border-radius: 16px;
    border: 1px solid var(--border-soft);
    padding: 11px 14px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-main);
    background: var(--bg-white);
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box;
    font-family: var(--font-body);
  }

  .input:focus {
    border-color: rgba(176, 141, 87, 0.50);
    box-shadow: 0 0 0 4px rgba(176, 141, 87, 0.12);
  }

  .input::placeholder { color: rgba(15, 23, 42, 0.30); }

  .textarea {
    resize: vertical;
    min-height: 80px;
  }

  .error {
    font-size: 13px;
    color: rgba(239, 68, 68, 0.90);
    font-weight: 600;
    padding: 10px 14px;
    border-radius: 12px;
    background: rgba(239, 68, 68, 0.06);
    border: 1px solid rgba(239, 68, 68, 0.18);
  }

  .btnPrimary {
    width: 100%;
    height: 48px;
    border-radius: 16px;
    font-weight: 900;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid rgba(176, 141, 87, 0.34);
    background: linear-gradient(135deg, rgba(176, 141, 87, 0.95), rgba(120, 86, 36, 0.92));
    color: #ffffff;
    box-shadow:
      0 18px 46px rgba(176, 141, 87, 0.22),
      0 8px 20px rgba(15, 23, 42, 0.10);
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .btnPrimary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow:
      0 26px 70px rgba(176, 141, 87, 0.26),
      0 10px 26px rgba(15, 23, 42, 0.12);
  }

  .btnPrimary:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .mt { margin-top: 6px; }

  .sent-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 24px 0 8px;
    gap: 10px;
  }

  .sent-icon {
    width: 56px;
    height: 56px;
    border-radius: 999px;
    background: rgba(16, 185, 129, 0.10);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: rgba(16, 185, 129, 0.90);
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }

  .sent-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-main);
    letter-spacing: -0.01em;
  }

  .sent-sub {
    font-size: 14px;
    color: var(--text-muted);
    max-width: 32ch;
    line-height: 1.55;
  }

  @media print {
    .backdrop { display: none; }
  }
</style>
