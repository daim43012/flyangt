<script lang="ts">
  import { createEventDispatcher } from "svelte";

  type Option = { id: string; title: string; price: number; weightKg: number };
  type Category = {
    id: string;
    title: string;
    mode: "single" | "multi";
    options: Option[];
    selectedId?: string;
    selectedIds?: string[];
  };

  export let categories: Category[] = [];

  const dispatch = createEventDispatcher<{
    single: { categoryId: string; optionId: string };
    toggle: { categoryId: string; optionId: string };
  }>();

  function isSelected(c: Category, o: Option) {
    if (c.mode === "single") return (c.selectedId ?? c.options[0]?.id) === o.id;
    return (c.selectedIds ?? []).includes(o.id);
  }
</script>

<div class="panel">
  {#each categories as c (c.id)}
    <section class="block">
      <div class="block-head">
        <div class="block-title">{c.title}</div>
        <div class="block-mode">{c.mode === "single" ? "Choose one" : "Add options"}</div>
      </div>

      <div class="choices">
        {#each c.options as o (o.id)}
          <button
            type="button"
            class="choice"
            class:selected={isSelected(c, o)}
            on:click={() => {
              if (c.mode === "single") dispatch("single", { categoryId: c.id, optionId: o.id });
              else dispatch("toggle", { categoryId: c.id, optionId: o.id });
            }}
          >
            <div class="choice-left">
              <div class="choice-top">
                <div class="choice-name">{o.title}</div>

                {#if c.mode === "single"}
                  {#if isSelected(c, o)}
                    <span class="pill">Selected</span>
                  {/if}
                {:else}
                  {#if isSelected(c, o)}
                    <span class="pill">Added</span>
                  {/if}
                {/if}
              </div>

              <div class="choice-sub">+${o.price.toLocaleString()}</div>
            </div>

            <div class="choice-right">+{o.weightKg} kg</div>

            <span class="mark" aria-hidden="true">
              {#if c.mode === "single"}
                <span class="radio"></span>
              {:else}
                <span class="check"></span>
              {/if}
            </span>
          </button>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  .panel {
    display: grid;
    gap: 24px;
  }

  .block {
    display: grid;
    gap: 12px;
  }

  .block-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }

  .block-title {
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 700;
  }

  .block-mode {
    font-size: 11px;
    color: rgba(15, 23, 42, 0.52);
    font-weight: 600;
  }

  .choices {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .choice {
    position: relative;
    border-radius: 18px;
    padding: 16px 16px;
    text-align: left;
    cursor: pointer;

    background: var(--bg-white);
    border: 1px solid var(--border-soft);

    box-shadow:
      0 20px 70px rgba(15, 23, 42, 0.08),
      0 8px 22px rgba(15, 23, 42, 0.05);

    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;

    transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  }

  .choice:hover {
    transform: translateY(-3px);
    border-color: rgba(176, 141, 87, 0.22);
    box-shadow:
      0 28px 90px rgba(15, 23, 42, 0.10),
      0 12px 28px rgba(15, 23, 42, 0.07);
  }

  .choice.selected {
    border-color: rgba(176, 141, 87, 0.45);
    box-shadow:
      0 30px 90px rgba(15, 23, 42, 0.10),
      0 10px 26px rgba(15, 23, 42, 0.06),
      0 0 0 4px rgba(176, 141, 87, 0.10);
  }

  .choice-left {
    min-width: 0;
  }

  .choice-top {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .choice-name {
    font-size: 14px;
    font-weight: 900;
    color: var(--text-main);
    letter-spacing: -0.01em;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pill {
    font-size: 10px;
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid rgba(176, 141, 87, 0.22);
    background: rgba(176, 141, 87, 0.10);
    color: rgba(120, 86, 36, 0.92);
    white-space: nowrap;
    font-weight: 700;
    letter-spacing: 0.10em;
    text-transform: uppercase;
  }

  .choice-sub {
    margin-top: 8px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(120, 86, 36, 0.80);
  }

  .choice-right {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-muted);
    white-space: nowrap;
    padding-top: 2px;
  }

  .mark {
    position: absolute;
    right: 14px;
    bottom: 14px;
    width: 16px;
    height: 16px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(15, 23, 42, 0.02);
  }

  .choice.selected .mark {
    border-color: rgba(176, 141, 87, 0.55);
    box-shadow: 0 0 0 4px rgba(176, 141, 87, 0.12);
  }

  .radio,
  .check {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 999px;
  }

  .choice.selected .radio {
    background: radial-gradient(circle at 50% 50%, #b08d57 0 45%, transparent 46%);
  }
  .choice.selected .check {
    background: radial-gradient(circle at 50% 50%, #b08d57 0 45%, transparent 46%);
  }

  @media (max-width: 860px) {
    .choices {
      grid-template-columns: 1fr;
    }
  }
</style>