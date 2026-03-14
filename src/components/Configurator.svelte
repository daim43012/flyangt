<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";
  import ConfiguratorOptions from "./configurator/ConfiguratorOptions.svelte";
  import ConfiguratorSummary from "./configurator/ConfiguratorSummary.svelte";

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

  // ===== COLOR PICKER =====
  const colors = [
    { id: "silver", name: "Moonlight Silver", hex: "#a8a9ad" },
    { id: "blue", name: "Atlantic Blue", hex: "#2c5f8a" },
    { id: "gold", name: "Desert Gold", hex: "#b8943e" },
    { id: "orange", name: "Sunset Orange", hex: "#d4722a" },
  ];

  let selectedColor = colors[0];
  $: modelImg = `/images/models/${selectedColor.id}.webp`;

  onMount(() => {
    if (browser) {
      colors.forEach((c) => {
        const img = new Image();
        img.src = `/images/models/${c.id}.webp`;
      });
    }
  });

  const BASE_PRICE = 87000;
  const BASE_WEIGHT_KG = 250;

  let categories: Category[] = [
    {
      id: "engine",
      title: "Engine",
      mode: "single",
      selectedId: "rotax915",
      options: [
        {
          id: "rotax915",
          title: "Rotax 915 iS (141 hp)",
          price: 45000,
          weightKg: 85,
        },
      ],
    },
    {
      id: "avionics",
      title: "Avionics",
      mode: "single",
      selectedId: "garmin",
      options: [
        {
          id: "garmin",
          title: "Garmin G3X Touch Dual",
          price: 22000,
          weightKg: 12,
        },
        { id: "dynon", title: "Dynon SkyView HDX", price: 18000, weightKg: 10 },
      ],
    },
    {
      id: "interior",
      title: "Interior",
      mode: "multi",
      selectedIds: ["leather"],
      options: [
        {
          id: "leather",
          title: "Premium Leather Interior",
          price: 5500,
          weightKg: 15,
        },
        {
          id: "sound",
          title: "Cabin Sound Insulation",
          price: 2200,
          weightKg: 6,
        },
      ],
    },
    {
      id: "safety",
      title: "Safety",
      mode: "multi",
      selectedIds: ["brs"],
      options: [
        { id: "brs", title: "BRS Rescue System", price: 25000, weightKg: 35 },
        { id: "elt", title: "ELT + Emergency Pack", price: 1800, weightKg: 2 },
      ],
    },
    {
      id: "paint",
      title: "Paint",
      mode: "single",
      selectedId: "multi",
      options: [
        {
          id: "multi",
          title: "Custom Multi color Paint",
          price: 8500,
          weightKg: 8,
        },
        { id: "mono", title: "Classic Mono paint", price: 4200, weightKg: 6 },
      ],
    },
  ];

  // --- state updates ---
  function setSingle(categoryId: string, optionId: string) {
    categories = categories.map((c) =>
      c.id === categoryId ? { ...c, selectedId: optionId } : c,
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

  // --- totals ---
  // Принимает cats явно, чтобы Svelte видел зависимость от categories
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

  // Стабильный форматтер (одинаков и на SSR, и на клиенте)
  const numFmt = new Intl.NumberFormat("en-US");
  function fmt(n: number) {
    return numFmt.format(n);
  }

  const legalNote =
    "The buyer acts as the legal builder. Under the 51% rule, more than half of the work must be completed by the amateur builder.";

  const kitItems = [
    "Fuselage",
    "Baggage compartment hatch",
    "Ergonomic pilot seat with left headrest",
    "Ergonomic pilot seat with right headrest",
    "Cabin glazing (tinted / clear)",
    "Door glazing (tinted / clear)",
    "Upper cowling for Rotax (with/without mounts)",
    "Lower cowling for Rotax (with/without mounts)",
    "Left door",
    "Right door",
    "Left wing",
    "Right wing",
    "Right flap",
    "Left flap",
    "Right aileron",
    "Left aileron",
    "Horizontal stabilizer",
    "Rudder",
    "Right elevator with trim tab",
    "Left elevator",
    "Engine mount for Rotax 915 iS",
    "Installation kit for Rotax 915 iS",
    "Retractable landing gear with oleo-pneumatic dampers",
    'ANG 8" wheel set with tires',
    "Electric retractable boarding step",
    "Dual pedals with linkages and nose-wheel steering",
    "FlyBox electric flap actuator",
    "FlyBox flap position sensor",
    "Aileron and elevator push-rod assemblies with bellcranks",
    "Brake system",
    "Standard / extended instrument panel",
    "Throttle lever",
    "Electric pilot seat adjustment",
    "Lighting kit: nav lights + ANG strobes + landing/taxi lights",
    "Radio antenna",
    "55 L header tank with two pumps and fuel level sensor",
    "Wing tanks 2 × 105 L",
    "ANG variable-pitch propeller",
    "Propeller spinner",
    "Preparation for GRS 6 ballistic parachute installation",
    "Four-point safety harnesses",
    "Interior preparation for upholstery",
    "Preparation for primer and paint",
    "Packaging (transport frame)",
  ];

  const interiorOptions = [
    { name: "Full interior package", price: "€9,580" },
    { name: "Premium leather interior trim", price: "€4,900" },
    { name: "Interior preparation for upholstery", price: "€1,200" },
    {
      name: "Upholstery for 2 seats + 6 cushions (premium leather)",
      price: "€3,480",
    },
    { name: "Leather instrument panel cover (if applicable)", price: "€680" },
    { name: "Raptor interior paint coating", price: "€3,965" },
  ];

  const paymentSteps = [
    {
      step: 1,
      title: "Kit reservation",
      desc: "€20,000 deposit to lock the price and production slot (high demand; lead time 9–12 months).",
    },
    {
      step: 2,
      title: "Payment up to 60%",
      desc: "Within 5 days of reservation, pay up to 60% of the kit price (including the €20,000 deposit).",
    },
    {
      step: 3,
      title: "Factory progress: 30%",
      desc: "Within 5 days of the factory 30% milestone confirmation, pay an additional 20%.",
    },
    {
      step: 4,
      title: "Factory progress: 70%",
      desc: "Within 5 days of the factory 70% milestone confirmation, pay an additional 10%.",
    },
    {
      step: 5,
      title: "Kit ready: 100%",
      desc: "Within 5 days of the final 100% confirmation, pay the last 10% + packaging and shipping.",
    },
  ];

  // --- order modal ---
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
          configuration: picked.map((p) => ({
            title: p.title,
            price: p.price,
          })),
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

<section class="cfg-hero">
  <div class="cfg-hero__inner">
    <div class="cfg-hero__text">
      <div class="cfg-hero__label">Configurator</div>
      <h1 class="cfg-hero__title">Build Your ANG-01</h1>
      <p class="cfg-hero__sub">
        Choose your color, engine, avionics and options. Every ANG-01 is built to your specification.
      </p>
      <div class="cfg-hero__specs">
        <div class="cfg-hero__spec">
          <span class="cfg-hero__spec-val">345</span>
          <span class="cfg-hero__spec-unit">km/h cruise</span>
        </div>
        <div class="cfg-hero__spec">
          <span class="cfg-hero__spec-val">141</span>
          <span class="cfg-hero__spec-unit">HP Rotax 915 iS</span>
        </div>
        <div class="cfg-hero__spec">
          <span class="cfg-hero__spec-val">570</span>
          <span class="cfg-hero__spec-unit">kg useful load</span>
        </div>
      </div>
    </div>
    <div class="cfg-hero__visual">
      <div class="cfg-hero__img-wrap">
        {#key selectedColor.id}
          <img
            in:fade={{ duration: 500 }}
            out:fade={{ duration: 500 }}
            src={modelImg}
            alt="ANG-01 in {selectedColor.name}"
          />
        {/key}
      </div>
      <div class="cfg-hero__color-name">{selectedColor.name}</div>
      <div class="cfg-hero__picker">
        {#each colors as c}
          <button
            class="cfg-swatch"
            class:active={selectedColor.id === c.id}
            style="--swatch: {c.hex}"
            type="button"
            on:click={() => (selectedColor = c)}
            aria-label={c.name}
            title={c.name}
          >
            {#if selectedColor.id === c.id}
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>

<section class="cfg">
  <div class="wrap">
    <header class="head">
      <h2 class="h1">Configure Options</h2>
      <p class="sub">
        Select your preferred avionics, interior, safety and paint options below.
      </p>
    </header>

    <div class="grid">
      <div class="left">
        <ConfiguratorOptions
          {categories}
          on:single={(e) => setSingle(e.detail.categoryId, e.detail.optionId)}
          on:toggle={(e) => toggleMulti(e.detail.categoryId, e.detail.optionId)}
        />
      </div>

      <aside class="right">
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
</section>

<!-- ===================== PURCHASE PROCESS ===================== -->
<section class="pp">
  <div class="wrap">
    <!-- Hero -->
    <div class="pp-section">
      <div class="pp-header">
        <div class="pp-label">Purchase Process</div>
        <h2 class="pp-title">How to buy your ANG</h2>
        <p class="pp-sub">
          ANG is the most advanced aircraft in the world, available as the most
          complete kit on the market: full carbon fiber and ultra-fast assembly
          kit.
        </p>
      </div>

      <div class="pp-highlights">
        <div class="pp-hl">
          <span class="pp-hl-dot"></span>Full carbon fiber
        </div>
        <div class="pp-hl">
          <span class="pp-hl-dot"></span>Ultra-fast assembly kit
        </div>
        <div class="pp-hl">
          <span class="pp-hl-dot"></span>≈ 800 h (meets 51% rule)
        </div>
        <div class="pp-hl">
          <span class="pp-hl-dot"></span>Pre-assembled wings & tail
        </div>
      </div>

      <div class="pp-note-card">
        <p class="pp-note-text">
          You only need to add and install: <strong>engine</strong>,
          <strong>avionics</strong>,
          <strong>ballistic parachute</strong>, and <strong>paint</strong>.
        </p>
      </div>
    </div>

    <!-- Two variants -->
    <div class="pp-section">
      <div class="variants-grid">
        <!-- Variant 1 -->
        <article class="var-card">
          <div class="var-badge">Option 1</div>
          <h3 class="var-title">Kit Only</h3>
          <p class="var-desc">
            Buy the kit and receive our online support (documentation and
            manuals). Ideal if you will build in your own hangar.
          </p>
          <div class="var-specs">
            <div class="var-spec">
              <span class="var-sk">Kit price</span><span class="var-sv"
                >€178,186</span
              >
            </div>
            <div class="var-spec">
              <span class="var-sk">Lead time</span><span class="var-sv"
                >9–12 months</span
              >
            </div>
            <div class="var-spec">
              <span class="var-sk">Builder hours</span><span class="var-sv"
                >≈ 800 h (51%)</span
              >
            </div>
          </div>
          <ul class="var-list">
            <li>
              Critical parts pre-assembled: wings with integrated tanks +
              fuselage prepared for parachute (anchors / safety cables)
            </li>
            <li>
              Cabin interior (option): can be ordered complete — seats, panels,
              harnesses, carpets/sound insulation, and upholstery
            </li>
          </ul>
          <div class="var-pills">
            <span class="var-pill">Carbon construction</span>
            <span class="var-pill">Documentation & checklists</span>
          </div>
          <p class="var-footnote">
            Shipping, packaging, customs, and VAT not included
          </p>
        </article>

        <!-- Variant 2 -->
        <article class="var-card var-card-accent">
          <div class="var-badge">Option 2</div>
          <h3 class="var-title">Kit + Build Assist</h3>
          <p class="var-desc">
            Your kit arrives at our workshop. We can supply engine, avionics,
            and parachute (optional) and help you build at a comfortable pace.
            You fulfill the mandatory 51%.
          </p>
          <div class="var-specs">
            <div class="var-spec">
              <span class="var-sk">Workshop deposit</span><span class="var-sv"
                >≈ €50,000</span
              >
            </div>
            <div class="var-spec">
              <span class="var-sk">Components</span><span class="var-sv"
                >100% to order</span
              >
            </div>
            <div class="var-spec">
              <span class="var-sk">Training</span><span class="var-sv"
                >Until completion + 10 flight hours</span
              >
            </div>
          </div>
          <ul class="var-list">
            <li>
              Engineering support, tools, supervision, and quality control
            </li>
            <li>
              Base kit: wings with tanks + fuselage prepared for parachute
              (anchors / cables)
            </li>
            <li>
              Cabin interior (option): can be ordered complete — seats, panels,
              harnesses, carpets/sound insulation, and upholstery
            </li>
          </ul>
          <div class="var-pills">
            <span class="var-pill">Custom engine & avionics</span>
            <span class="var-pill">Ballistic parachute</span>
            <span class="var-pill">Stage-by-stage QA</span>
          </div>
          <p class="var-footnote">VAT not included in deposit</p>
        </article>
      </div>
    </div>

    <!-- DIY Budget -->
    <div class="pp-section">
      <div class="pp-header">
        <div class="pp-label">Estimated Budget</div>
        <h2 class="pp-title">DIY build estimate</h2>
        <p class="pp-sub">Self-assembly with base engine and avionics:</p>
      </div>

      <div class="budget-card">
        <div class="budget-value">~ €297,000</div>
        <div class="budget-hint">
          Estimated total (depends on configuration; taxes and shipping not
          included)
        </div>
      </div>
    </div>

    <!-- Payment Timeline -->
    <div class="pp-section">
      <div class="pp-header">
        <div class="pp-label">Payment Schedule</div>
        <h2 class="pp-title">Step-by-step payment</h2>
      </div>

      <div class="pay-timeline">
        {#each paymentSteps as ps, i}
          <div
            class="pay-step"
            class:pay-step-last={i === paymentSteps.length - 1}
          >
            <div class="pay-num">{ps.step}</div>
            <div class="pay-connector" aria-hidden="true"></div>
            <div class="pay-body">
              <div class="pay-name">{ps.title}</div>
              <div class="pay-desc">{ps.desc}</div>
            </div>
          </div>
        {/each}
      </div>

      <div class="pay-notes">
        <div class="pay-note">
          <span class="pay-note-icon">ⓘ</span>
          <span>Taxes (VAT, customs, etc.) are not included</span>
        </div>
        <div class="pay-note">
          <span class="pay-note-icon">ⓘ</span>
          <span
            >Engine, avionics, and parachute: 100% to order (to reserve a
            workshop slot). Build Assist deposit ≈ €50,000 (VAT not included).</span
          >
        </div>
      </div>
    </div>

    <!-- Kit Contents -->
    <div class="pp-section">
      <div class="pp-header">
        <div class="pp-label">Kit Contents</div>
        <h2 class="pp-title">What's in the box</h2>
        <p class="pp-sub">
          Complete list of components included in the ANG KIT package.
        </p>
      </div>

      <div class="kit-list">
        {#each kitItems as item, i}
          <div class="kit-item">
            <span class="kit-num">{String(i + 1).padStart(2, "0")}</span>
            <span class="kit-name">{item}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Interior Options -->
    <div class="pp-section">
      <div class="pp-header">
        <div class="pp-label">Ordered Separately</div>
        <h2 class="pp-title">Interior options</h2>
        <p class="pp-sub">
          Available interior packages and upgrades, ordered separately through
          the configurator.
        </p>
      </div>

      <div class="int-table">
        <div class="int-head">
          <span class="int-hk">Option</span>
          <span class="int-hv">Price (EUR)</span>
        </div>
        {#each interiorOptions as opt}
          <div class="int-row">
            <span class="int-name">{opt.name}</span>
            <span class="int-price">{opt.price}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Build Documentation -->
    <div class="pp-section">
      <div class="pp-header">
        <div class="pp-label">Documentation</div>
        <h2 class="pp-title">Build documentation</h2>
        <p class="pp-sub">
          To complete your kit assembly, please download the essential manuals:
        </p>
      </div>

      <div class="bd-grid">
        <a
          class="bd-card"
          href="/docs/ANG-BUild-Manual-5-4-25-2-1.docx"
          target="_blank"
          rel="noopener"
        >
          <div class="bd-icon">📘</div>
          <div class="bd-info">
            <div class="bd-name">ANG Build Manual</div>
            <div class="bd-desc">
              Complete assembly guide with step-by-step instructions, diagrams,
              and quality checkpoints. Updated 05-04-2025.
            </div>
          </div>
          <div class="bd-action">
            <span class="bd-badge">DOCX</span>
            <span class="bd-arrow">↓</span>
          </div>
        </a>
        <a
          class="bd-card"
          href="/docs/Flight-Manual-ANG.pdf"
          target="_blank"
          rel="noopener"
        >
          <div class="bd-icon">✈️</div>
          <div class="bd-info">
            <div class="bd-name">ANG Flight Manual</div>
            <div class="bd-desc">
              Flight operations handbook — procedures, limitations, performance
              data and emergency checklists.
            </div>
          </div>
          <div class="bd-action">
            <span class="bd-badge">PDF</span>
            <span class="bd-arrow">↓</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Order modal -->
{#if orderOpen}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div
    class="backdrop"
    role="dialog"
    aria-modal="true"
    aria-label="Order KIT"
    on:keydown={handleBackdropKey}
  >
    <div class="modal" on:click|stopPropagation>
      <button
        class="modal-close"
        type="button"
        on:click={closeOrder}
        aria-label="Close"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M2 2l14 14M16 2L2 16"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>

      {#if sent}
        <div class="sent-state">
          <div class="sent-icon">✓</div>
          <div class="sent-title">Request sent!</div>
          <div class="sent-sub">We'll get back to you as soon as possible.</div>
          <button class="btnPrimary mt" type="button" on:click={closeOrder}
            >Close</button
          >
        </div>
      {:else}
        <div class="modal-title">Order KIT</div>
        <div class="modal-sub">
          Fill in your details and we will contact you to discuss the build.
        </div>

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
            <input
              id="cfg-name"
              class="input"
              type="text"
              bind:value={form.name}
              placeholder="John Smith"
              required
              autocomplete="name"
            />
          </div>

          <div class="field">
            <label class="label" for="cfg-email">Email *</label>
            <input
              id="cfg-email"
              class="input"
              type="email"
              bind:value={form.email}
              placeholder="john@example.com"
              required
              autocomplete="email"
            />
          </div>

          <div class="field">
            <label class="label" for="cfg-phone">Phone</label>
            <input
              id="cfg-phone"
              class="input"
              type="tel"
              bind:value={form.phone}
              placeholder="+1 234 567 8900"
              autocomplete="tel"
            />
          </div>

          <div class="field">
            <label class="label" for="cfg-msg">Message</label>
            <textarea
              id="cfg-msg"
              class="input textarea"
              bind:value={form.message}
              placeholder="Any specific requirements or questions…"
              rows="3"
            ></textarea>
          </div>

          {#if sendError}
            <div class="error">{sendError}</div>
          {/if}

          <button
            class="btnPrimary"
            type="submit"
            disabled={sending || !form.name.trim() || !form.email.trim()}
          >
            {sending ? "Sending…" : "Send request"}
          </button>
        </form>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* ===== HERO ===== */
  .cfg-hero {
    padding: 110px 16px 0;
  }

  .cfg-hero__inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 48px;
    align-items: center;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    border-radius: 28px;
    overflow: hidden;
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.04);
  }

  .cfg-hero__text {
    padding: 48px 0 48px 48px;
  }

  .cfg-hero__label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 12px;
  }

  .cfg-hero__title {
    margin: 0 0 14px;
    font-size: 42px;
    font-weight: 600;
    letter-spacing: -0.02em;
    font-family: var(--font-heading);
    color: var(--text-main);
    line-height: 1.1;
  }

  .cfg-hero__sub {
    margin: 0 0 28px;
    font-size: 15px;
    line-height: 1.75;
    color: var(--text-muted);
    max-width: 42ch;
  }

  .cfg-hero__specs {
    display: flex;
    gap: 28px;
  }

  .cfg-hero__spec {
    display: flex;
    flex-direction: column;
  }

  .cfg-hero__spec-val {
    font-family: var(--font-heading);
    font-size: 32px;
    font-weight: 400;
    letter-spacing: -0.03em;
    color: var(--text-main);
    line-height: 1;
  }

  .cfg-hero__spec-unit {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .cfg-hero__visual {
    position: relative;
    background: #f0ece4;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cfg-hero__img-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 3/2;
  }

  .cfg-hero__img-wrap img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cfg-hero__color-name {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    padding: 5px 14px;
    border-radius: 999px;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    position: absolute;
    bottom: 64px;
    left: 50%;
    transform: translateX(-50%);
  }

  .cfg-hero__picker {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .cfg-swatch {
    width: 32px;
    height: 32px;
    border-radius: 999px;
    border: 2px solid transparent;
    background: var(--swatch);
    cursor: pointer;
    transition: all 0.25s ease;
    display: grid;
    place-items: center;
    color: #fff;
    padding: 0;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  }

  .cfg-swatch:hover {
    transform: scale(1.15);
  }

  .cfg-swatch.active {
    border-color: var(--accent);
    box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.1),
      0 0 0 3px rgba(176, 141, 87, 0.25);
    transform: scale(1.1);
  }

  /* ===== CFG SECTION ===== */
  .cfg {
    padding: 48px 16px 96px;
  }

  .wrap {
    max-width: 1200px;
    margin: 0 auto;
  }

  .head {
    margin-bottom: 22px;
  }

  .h1 {
    margin: 0;
    font-size: 44px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-main);
  }

  .sub {
    margin: 12px 0 0;
    max-width: 72ch;
    font-size: 16px;
    line-height: 1.75;
    color: var(--text-muted);
  }

  .grid {
    margin-top: 22px;
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 18px;
    align-items: start;
  }

  .right {
    position: sticky;
    top: 18px;
  }

  @media (max-width: 980px) {
    .cfg-hero__inner {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .cfg-hero__text {
      padding: 36px 28px 28px;
      text-align: center;
    }

    .cfg-hero__sub {
      max-width: none;
    }

    .cfg-hero__specs {
      justify-content: center;
    }

    .cfg-hero__picker {
      position: relative;
      bottom: auto;
      left: auto;
      transform: none;
      justify-content: center;
      margin: 12px auto 16px;
      width: fit-content;
    }

    .cfg-hero__color-name {
      position: relative;
      bottom: auto;
      left: auto;
      transform: none;
      text-align: center;
      margin: 8px auto 0;
      display: block;
      width: fit-content;
    }

    .grid {
      grid-template-columns: 1fr;
    }
    .right {
      position: static;
    }
  }

  @media (max-width: 720px) {
    .cfg-hero {
      padding: 80px 16px 0;
    }

    .cfg-hero__title {
      font-size: 30px;
    }

    .cfg-hero__specs {
      gap: 18px;
    }

    .cfg-hero__spec-val {
      font-size: 24px;
    }

    .cfg {
      padding: 32px 16px 80px;
    }
    .h1 {
      font-size: 30px;
    }
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
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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
      0 12px 32px rgba(15, 23, 42, 0.1);
    animation: slideUp 0.25s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
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
    transition:
      background 0.2s ease,
      color 0.2s ease;
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

  /* mini config summary inside modal */
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

  /* form */
  .form {
    display: grid;
    gap: 14px;
  }

  .field {
    display: grid;
    gap: 6px;
  }

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
    transition:
      border-color 0.3s ease,
      box-shadow 0.3s ease;
    box-sizing: border-box;
    font-family: var(--font-body);
  }

  .input:focus {
    border-color: rgba(176, 141, 87, 0.5);
    box-shadow: 0 0 0 4px rgba(176, 141, 87, 0.12);
  }

  .input::placeholder {
    color: rgba(15, 23, 42, 0.3);
  }

  .textarea {
    resize: vertical;
    min-height: 80px;
  }

  .error {
    font-size: 13px;
    color: rgba(239, 68, 68, 0.9);
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
    background: linear-gradient(
      135deg,
      rgba(176, 141, 87, 0.95),
      rgba(120, 86, 36, 0.92)
    );
    color: #ffffff;
    box-shadow:
      0 18px 46px rgba(176, 141, 87, 0.22),
      0 8px 20px rgba(15, 23, 42, 0.1);
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease;
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

  .mt {
    margin-top: 6px;
  }

  /* sent state */
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
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: rgba(16, 185, 129, 0.9);
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

  /* ========================
     PURCHASE PROCESS
  ======================== */
  .pp {
    padding: 0 16px 96px;
  }

  .pp .wrap {
    display: flex;
    flex-direction: column;
    gap: 72px;
  }

  .pp-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .pp-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 760px;
  }

  .pp-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--accent);
  }

  .pp-title {
    margin: 0;
    font-size: 38px;
    font-weight: 600;
    letter-spacing: -0.02em;
    font-family: var(--font-heading);
    color: var(--text-main);
    line-height: 1.1;
  }

  .pp-sub {
    margin: 0;
    font-size: 15px;
    line-height: 1.75;
    color: var(--text-muted);
    max-width: 64ch;
  }

  /* Highlights row */
  .pp-highlights {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }

  .pp-hl {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 999px;
    background: rgba(176, 141, 87, 0.07);
    border: 1px solid rgba(176, 141, 87, 0.2);
    font-size: 13px;
    font-weight: 700;
    color: rgba(120, 86, 36, 0.9);
  }

  .pp-hl-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: var(--accent);
    flex-shrink: 0;
  }

  .pp-note-card {
    border-radius: 20px;
    padding: 20px 24px;
    background: radial-gradient(
        500px 200px at 20% 0%,
        rgba(176, 141, 87, 0.1),
        transparent 60%
      ),
      var(--bg-white);
    border: 1px solid rgba(176, 141, 87, 0.2);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.07),
      0 6px 18px rgba(18, 20, 22, 0.05);
  }

  .pp-note-text {
    margin: 0;
    font-size: 15px;
    line-height: 1.75;
    color: var(--text-muted);
  }

  .pp-note-text strong {
    color: var(--text-main);
    font-weight: 700;
  }

  /* Variants grid */
  .variants-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }

  .var-card {
    border-radius: 28px;
    padding: 28px 26px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease;
  }

  .var-card:hover {
    transform: translateY(-3px);
    box-shadow:
      0 44px 120px rgba(18, 20, 22, 0.1),
      0 12px 30px rgba(18, 20, 22, 0.08);
  }

  .var-card-accent {
    background: radial-gradient(
        800px 400px at 80% -30%,
        rgba(176, 141, 87, 0.13),
        transparent 65%
      ),
      var(--bg-white);
    border-color: rgba(176, 141, 87, 0.22);
  }

  .var-badge {
    display: inline-flex;
    align-items: center;
    padding: 5px 14px;
    border-radius: 999px;
    background: rgba(176, 141, 87, 0.1);
    border: 1px solid rgba(176, 141, 87, 0.22);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(120, 86, 36, 0.9);
    width: fit-content;
  }

  .var-title {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.02em;
    font-family: var(--font-heading);
    background: linear-gradient(
      135deg,
      var(--accent-light),
      var(--accent),
      var(--accent-dark)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .var-desc {
    margin: 0;
    font-size: 14px;
    line-height: 1.75;
    color: var(--text-muted);
  }

  .var-specs {
    display: grid;
    gap: 8px;
    padding: 14px 16px;
    border-radius: 16px;
    background: rgba(176, 141, 87, 0.04);
    border: 1px solid rgba(176, 141, 87, 0.12);
  }

  .var-spec {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
  }

  .var-sk {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .var-sv {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-main);
  }

  .var-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 8px;
  }

  .var-list li {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    padding-left: 18px;
    position: relative;
    line-height: 1.6;
  }

  .var-list li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--accent);
  }

  .var-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .var-pill {
    padding: 5px 12px;
    border-radius: 999px;
    border: 1px solid rgba(176, 141, 87, 0.2);
    background: rgba(176, 141, 87, 0.06);
    color: rgba(120, 86, 36, 0.85);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .var-footnote {
    margin: 0;
    font-size: 12px;
    color: var(--text-muted);
    font-style: italic;
  }

  /* Budget card */
  .budget-card {
    border-radius: 28px;
    padding: 36px 34px;
    text-align: center;
    background: radial-gradient(
        600px 300px at 50% -40%,
        rgba(176, 141, 87, 0.14),
        transparent 60%
      ),
      var(--bg-white);
    border: 1px solid rgba(176, 141, 87, 0.22);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
  }

  .budget-value {
    font-size: 48px;
    font-weight: 800;
    letter-spacing: -0.03em;
    font-family: var(--font-heading);
    background: linear-gradient(
      135deg,
      var(--accent-light),
      var(--accent),
      var(--accent-dark)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .budget-hint {
    margin-top: 10px;
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.6;
  }

  /* Payment timeline */
  .pay-timeline {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
  }

  .pay-step {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  .pay-num {
    width: 36px;
    height: 36px;
    border-radius: 999px;
    background: linear-gradient(
      135deg,
      rgba(176, 141, 87, 0.18),
      rgba(120, 86, 36, 0.12)
    );
    border: 1px solid rgba(176, 141, 87, 0.32);
    color: rgba(120, 86, 36, 0.92);
    font-size: 13px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    flex-shrink: 0;
  }

  .pay-connector {
    position: absolute;
    top: 18px;
    left: 50%;
    right: -50%;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(176, 141, 87, 0.3),
      rgba(176, 141, 87, 0.1)
    );
    z-index: 1;
  }

  .pay-step-last .pay-connector {
    display: none;
  }

  .pay-body {
    margin-top: 14px;
    border-radius: 20px;
    padding: 16px 14px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.07),
      0 6px 18px rgba(18, 20, 22, 0.05);
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    transition: transform 0.35s ease;
  }

  .pay-body:hover {
    transform: translateY(-2px);
  }

  .pay-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-main);
    letter-spacing: -0.01em;
  }

  .pay-desc {
    font-size: 12px;
    line-height: 1.6;
    color: var(--text-muted);
    font-weight: 500;
  }

  .pay-notes {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .pay-note {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px 18px;
    border-radius: 16px;
    background: rgba(176, 141, 87, 0.04);
    border: 1px solid rgba(176, 141, 87, 0.14);
    font-size: 13px;
    line-height: 1.6;
    color: var(--text-muted);
  }

  .pay-note-icon {
    flex-shrink: 0;
    font-size: 16px;
    color: var(--accent);
  }

  /* Kit contents */
  .kit-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0;
    border-radius: 22px;
    overflow: hidden;
    border: 1px solid var(--border-soft);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.07),
      0 6px 18px rgba(18, 20, 22, 0.05);
    background: var(--bg-white);
  }

  .kit-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 18px;
    border-bottom: 1px solid var(--border-soft);
    transition: background 0.25s ease;
  }

  .kit-item:hover {
    background: rgba(176, 141, 87, 0.04);
  }

  .kit-item:nth-child(odd) {
    border-right: 1px solid var(--border-soft);
  }

  .kit-item:nth-last-child(-n + 2) {
    border-bottom: none;
  }

  .kit-num {
    font-size: 11px;
    font-weight: 800;
    color: var(--accent);
    font-family: var(--font-heading);
    min-width: 22px;
  }

  .kit-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-main);
    line-height: 1.4;
  }

  /* Interior table */
  .int-table {
    border-radius: 22px;
    overflow: hidden;
    border: 1px solid var(--border-soft);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.07),
      0 6px 18px rgba(18, 20, 22, 0.05);
    background: var(--bg-white);
  }

  .int-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 22px;
    background: rgba(176, 141, 87, 0.06);
    border-bottom: 1px solid var(--border-soft);
  }

  .int-hk,
  .int-hv {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .int-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 22px;
    border-bottom: 1px solid var(--border-soft);
    transition: background 0.25s ease;
  }

  .int-row:last-child {
    border-bottom: none;
  }

  .int-row:hover {
    background: rgba(176, 141, 87, 0.04);
  }

  .int-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-main);
  }

  .int-price {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-main);
  }

  /* Build docs */
  .bd-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }

  .bd-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 22px 24px;
    border-radius: 22px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 18px 60px rgba(18, 20, 22, 0.07),
      0 6px 18px rgba(18, 20, 22, 0.05);
    text-decoration: none;
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease,
      border-color 0.35s ease;
  }

  .bd-card:hover {
    transform: translateY(-3px);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.09),
      0 10px 24px rgba(18, 20, 22, 0.07);
    border-color: rgba(176, 141, 87, 0.28);
  }

  .bd-icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: rgba(176, 141, 87, 0.08);
    border: 1px solid rgba(176, 141, 87, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }

  .bd-info {
    flex: 1;
    min-width: 0;
  }

  .bd-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-main);
    font-family: var(--font-heading);
    margin-bottom: 4px;
  }

  .bd-desc {
    font-size: 13px;
    line-height: 1.6;
    color: var(--text-muted);
  }

  .bd-action {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .bd-badge {
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(176, 141, 87, 0.1);
    border: 1px solid rgba(176, 141, 87, 0.2);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: rgba(120, 86, 36, 0.9);
  }

  .bd-arrow {
    width: 32px;
    height: 32px;
    border-radius: 999px;
    background: linear-gradient(
      135deg,
      rgba(176, 141, 87, 0.9),
      rgba(120, 86, 36, 0.88)
    );
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.35s ease;
  }

  .bd-card:hover .bd-arrow {
    transform: translateY(2px);
  }

  /* ========================
     PP RESPONSIVE
  ======================== */
  @media (max-width: 980px) {
    .pp .wrap {
      gap: 56px;
    }
    .pp-title {
      font-size: 30px;
    }

    .variants-grid {
      grid-template-columns: 1fr;
    }

    .pay-timeline {
      grid-template-columns: repeat(3, 1fr);
    }

    .pay-connector {
      display: none;
    }

    .kit-list {
      grid-template-columns: 1fr;
    }

    .kit-item:nth-child(odd) {
      border-right: none;
    }

    .bd-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .pp {
      padding: 0 12px 72px;
    }
    .pp .wrap {
      gap: 44px;
    }
    .pp-title {
      font-size: 26px;
    }
    .budget-value {
      font-size: 36px;
    }

    .pay-timeline {
      grid-template-columns: 1fr 1fr;
    }

    .var-card {
      padding: 22px 18px;
    }
    .var-title {
      font-size: 22px;
    }

    .bd-card {
      flex-direction: column;
      align-items: flex-start;
      padding: 18px 16px;
      gap: 12px;
    }

    .bd-action {
      align-self: flex-end;
    }
  }

  /* Print */
  @media print {
    .backdrop {
      display: none;
    }
  }
</style>
