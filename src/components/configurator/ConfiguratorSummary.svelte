<script lang="ts">
  import { createEventDispatcher } from "svelte";

  type PickedOption = { title: string; price: number; weightKg: number };

  export let totalPrice = 145000;
  export let totalWeightKg = 420;
  export let leadDays = 270;
  export let legalNote = "";
  export let picked: PickedOption[] = [];

  const dispatch = createEventDispatcher<{ order: void }>();

  const numFmt = new Intl.NumberFormat("en-US");
  function fmt(n: number) { return numFmt.format(n); }

  function orderKit() {
    dispatch("order");
  }

  let pdfBusy = false;

  async function exportPdf() {
    pdfBusy = true;
    try {
      const { generateConfigPdf } = await import("$lib/utils/generateConfigPdf");
      await generateConfigPdf({ picked, totalPrice, totalWeightKg, leadDays });
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      pdfBusy = false;
    }
  }
</script>

<div class="sum">
  <div class="sum-title">Your configuration</div>

  {#if picked.length > 0}
    <div class="breakdown">
      <div class="breakdown-label">Included options</div>
      <ul class="breakdown-list">
        {#each picked as item (item.title)}
          <li class="breakdown-item">
            <span class="bi-name">{item.title}</span>
            <span class="bi-price">+${fmt(item.price)}</span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <div class="rows">
    <div class="row">
      <div class="k">Total price</div>
      <div class="v">$ {fmt(totalPrice)}</div>
    </div>

    <div class="row">
      <div class="k">Estimated weight</div>
      <div class="v">{fmt(totalWeightKg)} kg</div>
    </div>

    <div class="row">
      <div class="k">Lead time</div>
      <div class="v">{leadDays} days</div>
    </div>
  </div>

  <div class="note">
    <div class="note-k">Legal note</div>
    <div class="note-v">{legalNote}</div>
  </div>

  <div class="divider"></div>

  <div class="fine">
    * Price excludes taxes and delivery. Weight is an estimate.
  </div>

  <div class="actions">
    <button class="btnPrimary" type="button" on:click={orderKit}>Order KIT</button>
    <button class="btnGhost" type="button" on:click={exportPdf} disabled={pdfBusy}>
      {pdfBusy ? "Generating..." : "Save PDF"}
    </button>
  </div>
</div>

<style>
  .sum {
    border-radius: 28px;
    padding: 18px 18px 16px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 30px 90px rgba(15, 23, 42, 0.08),
      0 8px 22px rgba(15, 23, 42, 0.06);
  }

  .sum-title {
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text-main);
    margin-bottom: 14px;
  }

  /* breakdown */
  .breakdown {
    margin-bottom: 14px;
    padding: 12px 14px;
    border-radius: 18px;
    background: rgba(15, 23, 42, 0.02);
    border: 1px solid var(--border-soft);
  }

  .breakdown-label {
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 700;
    margin-bottom: 10px;
  }

  .breakdown-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 6px;
  }

  .breakdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .bi-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-main);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bi-price {
    font-size: 12px;
    font-weight: 700;
    color: rgba(120, 86, 36, 0.85);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .rows {
    display: grid;
    gap: 10px;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 12px;
    border-radius: 16px;
    background: rgba(15, 23, 42, 0.02);
    border: 1px solid var(--border-soft);
  }

  .k {
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
  }

  .v {
    font-size: 18px;
    font-weight: 800;
    color: var(--text-main);
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  .note {
    margin-top: 14px;
    padding: 12px 12px;
    border-radius: 18px;
    background: rgba(176, 141, 87, 0.10);
    border: 1px solid rgba(176, 141, 87, 0.24);
  }

  .note-k {
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(120, 86, 36, 0.92);
    font-weight: 700;
  }

  .note-v {
    margin-top: 8px;
    font-size: 12px;
    line-height: 1.55;
    color: rgba(15, 23, 42, 0.70);
    font-weight: 600;
  }

  .divider {
    margin: 14px 0 12px;
    height: 1px;
    background: rgba(15, 23, 42, 0.08);
  }

  .fine {
    font-size: 11px;
    color: rgba(15, 23, 42, 0.55);
    line-height: 1.45;
  }

  .actions {
    margin-top: 14px;
    display: grid;
    gap: 10px;
  }

  .btnPrimary,
  .btnGhost {
    height: 46px;
    border-radius: 16px;
    font-weight: 900;
    font-size: 13px;
    cursor: pointer;
    transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
  }

  .btnPrimary {
    border: 1px solid rgba(176, 141, 87, 0.34);
    background: linear-gradient(135deg, rgba(176, 141, 87, 0.95), rgba(120, 86, 36, 0.92));
    color: #ffffff;
    box-shadow:
      0 18px 46px rgba(176, 141, 87, 0.22),
      0 8px 20px rgba(15, 23, 42, 0.10);
  }

  .btnPrimary:hover {
    transform: translateY(-2px);
    box-shadow:
      0 26px 70px rgba(176, 141, 87, 0.26),
      0 10px 26px rgba(15, 23, 42, 0.12);
  }

  .btnGhost {
    border: 1px solid rgba(15, 23, 42, 0.10);
    background: rgba(15, 23, 42, 0.03);
    color: var(--text-main);
  }

  .btnGhost:hover {
    transform: translateY(-2px);
    border-color: rgba(176, 141, 87, 0.26);
  }

  /* ---- Print styles ---- */
  @media print {
    .actions {
      display: none;
    }
    .sum {
      box-shadow: none;
      border: 1px solid #ddd;
    }
  }
</style>
