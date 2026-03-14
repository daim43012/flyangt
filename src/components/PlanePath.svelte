<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";
  import { browser } from "$app/environment";

  type Step = {
    id: string;
    title: string;
    subtitle: string;
    details: string[];
  };

  export let steps: Step[] = [
    {
      id: "kit",
      title: "Kit Acquisition",
      subtitle: "Contract, configuration, logistics",
      details: ["Configuration and options", "Docs and delivery plan", "Workspace readiness"],
    },
    {
      id: "hub",
      title: "The Hub Build",
      subtitle: "Hangar build, tooling, jigs",
      details: ["Stations and workflow", "Tooling calibration", "Build schedule baseline"],
    },
    {
      id: "qa",
      title: "QA Gate",
      subtitle: "Engineering oversight and signoffs",
      details: ["Evidence capture", "Non conformance actions", "Release signoff"],
    },
    {
      id: "training",
      title: "Training",
      subtitle: "Type rating, safety, SOP",
      details: ["SOP and emergency", "Readiness assessment", "Operational handover"],
    },
    {
      id: "service",
      title: "Service",
      subtitle: "Service",
      details: ["Maintenance schedule", "Parts and bulletins", "Reliability program"],
    },
  ];

  let railEl: HTMLElement | null = null;
  let panelEl: HTMLElement | null = null;
  let lineCardEl: HTMLElement | null = null;

  let activeIndex = 0;

  let targetK = 0;
  let k = 0;

  let fillH = 0;
  let planeY = 0;

  const PAD = 20;
  const PLANE = 46;

  let raf = 0;
  let roRail: ResizeObserver | null = null;
  let roPanel: ResizeObserver | null = null;
  let io: IntersectionObserver | null = null;

  let cleanupScroll: (() => void) | undefined;

  function clamp01(v: number) {
    return Math.max(0, Math.min(1, v));
  }

  function statusText(i: number) {
    if (i < activeIndex) return "Done";
    if (i === activeIndex) return "Now";
    return "Next";
  }

  function statusClass(i: number) {
    if (i < activeIndex) return "done";
    if (i === activeIndex) return "active";
    return "next";
  }

  function isLit(i: number) {
    return i <= activeIndex;
  }

  function setActive(i: number) {
    activeIndex = Math.max(0, Math.min(steps.length - 1, i));
    targetK = steps.length <= 1 ? 0 : activeIndex / (steps.length - 1);
    measureRail();
  }

  function syncLeftHeightToRight() {
    if (!lineCardEl || !panelEl) return;
    const rightH = panelEl.scrollHeight;
    lineCardEl.style.minHeight = `${Math.ceil(rightH) + 2}px`;
  }

  function measureRail() {
    if (!railEl) return;

    const h = railEl.clientHeight;
    const usable = Math.max(1, h - 2 * PAD);

    const y0 = PAD;
    const y = PAD + usable * clamp01(k);

    fillH = Math.max(0, y - y0);
    planeY = y - PLANE / 2;
  }

  function startPercentLoop() {
    if (!browser) return;
    if (raf) cancelAnimationFrame(raf);

    const tickAnim = () => {
      k = k + (targetK - k) * 0.14;

      if (Math.abs(targetK - k) < 0.0008) k = targetK;

      measureRail();
      raf = requestAnimationFrame(tickAnim);
    };

    raf = requestAnimationFrame(tickAnim);
  }

  function setupIntersectionObserver(): (() => void) | undefined {
    if (!browser || !panelEl) return;

    const cards = Array.from(panelEl.querySelectorAll<HTMLElement>("[data-step]"));
    if (!cards.length) return;

    const pickClosestToCenter = () => {
      const center = window.innerHeight * 0.5;
      let bestIdx = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      for (let i = 0; i < cards.length; i++) {
        const r = cards[i].getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }

      setActive(bestIdx);
    };

    io = new IntersectionObserver(() => pickClosestToCenter(), {
      root: null,
      rootMargin: "-35% 0px -35% 0px",
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
    });

    cards.forEach((c) => io?.observe(c));
    pickClosestToCenter();

    const onScroll = () => pickClosestToCenter();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll as any);
    };
  }

  onMount(() => {
    if (!browser) return;

    (async () => {
      await tick();

      setActive(0);
      k = targetK;
      measureRail();
      startPercentLoop();

      if (railEl) {
        roRail = new ResizeObserver(() => measureRail());
        roRail.observe(railEl);
      }

      if (panelEl) {
        roPanel = new ResizeObserver(() => {
          syncLeftHeightToRight();
          measureRail();
        });
        roPanel.observe(panelEl);
      }

      syncLeftHeightToRight();
      measureRail();

      cleanupScroll = setupIntersectionObserver();

      const onResize = () => {
        syncLeftHeightToRight();
        measureRail();
      };
      window.addEventListener("resize", onResize, { passive: true });

      return () => {
        window.removeEventListener("resize", onResize as any);
        cleanupScroll?.();
      };
    })();
  });

  onDestroy(() => {
    if (raf) cancelAnimationFrame(raf);
    roRail?.disconnect();
    roPanel?.disconnect();
    io?.disconnect();
  });
</script>

<section class="build">
  <div class="header">
    <h2 class="title">Aircraft build roadmap</h2>
    <p class="subtitle">Scroll the page: the plane follows the flight line</p>
  </div>

  <div class="layout">
    <aside class="left">
      <div class="lineCard" bind:this={lineCardEl}>
        <div class="lineTop">
          <div class="lineLabel">Flight line</div>
          <div class="linePct">{Math.round(k * 100)}%</div>
        </div>

        <div class="rail" bind:this={railEl}>
          <div class="railGlass" aria-hidden="true"></div>

          <div class="spine" aria-hidden="true"></div>
          <div class="spineFill" style="height:{fillH}px" aria-hidden="true"></div>

          {#each steps as s, i}
            <!-- svelte-ignore element_invalid_self_closing_tag -->
            <div
              class={"marker " + (isLit(i) ? "lit" : "") + " " + (i === activeIndex ? "current" : "")}
              style="top:{PAD +
                (railEl
                  ? Math.max(1, railEl.clientHeight - 2 * PAD) *
                    (steps.length <= 1 ? 0 : i / (steps.length - 1))
                  : 0)}px"
              aria-hidden="true"
            />
          {/each}

          <div class="plane" style="top:{planeY}px" aria-hidden="true">
            <div class="planeSticker">
              <div class="planeGlow"></div>
              <svg viewBox="0 0 24 24" class="planeSvg" fill="none">
                <path
                  d="M12 2c.9 0 1.65.67 1.77 1.56l1.07 7.86 5.28 2.37c.69.31.98 1.13.63 1.8-.28.54-.9.83-1.49.68l-5.16-1.33-1.02 6.04c-.12.72-.74 1.26-1.47 1.26s-1.35-.54-1.47-1.26l-1.02-6.04-5.16 1.33c-.59.15-1.21-.14-1.49-.68-.35-.67-.06-1.49.63-1.8l5.28-2.37 1.07-7.86C10.35 2.67 11.1 2 12 2Z"
                  class="planeFill"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="lineHint">
          Active: <span>{activeIndex + 1}</span> / {steps.length}
        </div>
      </div>
    </aside>

    <div class="right" bind:this={panelEl}>
      <div class="stack">
        {#each steps as s, i}
          <article
            class={"card " + (i === activeIndex ? "active" : "") + " " + (isLit(i) ? "lit" : "")}
            data-step={s.id}
          >
            <div class="cardHead">
              <div class="idx">{i + 1}</div>
              <div class="meta">
                <h4>{s.title}</h4>
                <p>{s.subtitle}</p>
              </div>
              <div class={"status " + statusClass(i)}>{statusText(i)}</div>
            </div>

            <div class="cardBody">
              <ul class="list">
                {#each s.details as d}
                  <li>{d}</li>
                {/each}
              </ul>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .build {
    padding: 120px 16px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    text-align: center;
    margin-bottom: 70px;
  }

  .title {
    font-size: 44px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .subtitle {
    margin-top: 16px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .layout {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 30px;
    align-items: start;
  }

  .left {
    position: relative;
    align-self: start;
  }

  /* LEFT CARD */
  .lineCard {
    position: sticky;
    top: 92px;

    display: flex;
    flex-direction: column;

    border-radius: 26px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid var(--border-soft);
    box-shadow: var(--shadow-soft);
    backdrop-filter: blur(10px);
    overflow: hidden;
  }

  .lineTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 18px 12px;
  }

  .lineLabel {
    font-size: 11px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
  }

  .linePct {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;

    color: #1B140B;
    background: radial-gradient(120% 160% at 20% 10%, rgba(255,255,255,0.90), rgba(255,255,255,0.55));
    border: 1px solid rgba(176,141,87,0.28);
    padding: 8px 10px;
    border-radius: 999px;
  }

  /* RAIL */
  .rail {
    position: relative;
    border-radius: 22px;
    border: 1px solid var(--border-soft);

    background:
      radial-gradient(360px 240px at 22% 20%, rgba(230,210,168,0.35), transparent 62%),
      linear-gradient(180deg, rgba(18,20,22,0.02), rgba(18,20,22,0.01));

    padding: 20px 10px;
    flex: 1;
    min-height: 0;
    overflow: visible;
    margin: 0 16px 10px;
  }

  .railGlass {
    position: absolute;
    inset: 0;
    border-radius: 22px;
    pointer-events: none;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.75),
      inset 0 0 0 1px rgba(255, 255, 255, 0.22);
    opacity: 0.9;
  }

  .spine {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 20px;
    bottom: 20px;
    width: 6px;
    border-radius: 999px;
    background: rgba(18, 20, 22, 0.12);
    z-index: 0;
  }

  .spineFill {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 20px;
    width: 6px;
    border-radius: 999px;

    background: linear-gradient(
      180deg,
      rgba(230,210,168,1),
      rgba(176,141,87,1),
      rgba(122,90,45,0.98)
    );

    box-shadow: 0 0 18px rgba(176,141,87,0.22);
    z-index: 1;
  }

  .marker {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: rgba(18, 20, 22, 0.14);
    border: 2px solid rgba(18, 20, 22, 0.10);
    z-index: 2;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }

  .marker.lit {
    background: rgba(176,141,87,0.96);
    border-color: rgba(176,141,87,0.38);
    box-shadow: 0 0 16px rgba(176,141,87,0.26);
  }

  .marker.current {
    transform: translate(-50%, -50%) scale(1.18);
    box-shadow: 0 0 0 8px rgba(176,141,87,0.10), 0 0 18px rgba(176,141,87,0.22);
  }

  /* PLANE */
  .plane {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 46px;
    height: 46px;
    z-index: 3;
    pointer-events: none;
  }

  .planeSticker {
    position: absolute;
    inset: 0;
    border-radius: 16px;
    display: grid;
    place-items: center;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(176,141,87,0.35);

    box-shadow:
      0 18px 46px rgba(18,20,22,0.12),
      0 0 0 10px rgba(176,141,87,0.08);

    backdrop-filter: blur(8px);
  }

  .planeGlow {
    position: absolute;
    inset: -14px;
    border-radius: 20px;
    background: radial-gradient(circle, rgba(176,141,87,0.20), transparent 62%);
  }

  .planeSvg {
    width: 22px;
    height: 22px;
    transform: rotate(180deg);
  }

  .planeFill {
    fill: rgba(122, 90, 45, 0.95);
  }

  .lineHint {
    padding: 12px 18px 18px;
    font-size: 12px;
    color: var(--text-muted);
  }

  .lineHint span {
    font-weight: 700;
    color: var(--text-main);
  }

  /* RIGHT COLUMN */
  .right {
    display: grid;
    gap: 16px;
  }

  .stack {
    display: grid;
    gap: 14px;
    padding-top: 6px;
  }

  .card {
    border-radius: 26px;
    background: var(--bg-white);
    border: 1px solid var(--border-soft);
    box-shadow:
      0 26px 80px rgba(18,20,22,0.08),
      0 8px 22px rgba(18,20,22,0.06);
    padding: 18px;
    transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow:
      0 34px 110px rgba(18,20,22,0.12),
      0 10px 30px rgba(18,20,22,0.08);
    border-color: rgba(176,141,87,0.28);
  }

  .card.lit {
    border-color: rgba(176,141,87,0.18);
    background:
      radial-gradient(520px 260px at 18% 0%, rgba(230,210,168,0.35), transparent 62%),
      var(--bg-white);
  }

  .card.active {
    border-color: rgba(176,141,87,0.32);
    box-shadow:
      0 40px 130px rgba(18,20,22,0.14),
      0 0 0 10px rgba(176,141,87,0.08);
  }

  .cardHead {
    display: grid;
    grid-template-columns: 44px 1fr auto;
    gap: 12px;
    align-items: start;
  }

  .idx {
    width: 44px;
    height: 44px;
    border-radius: 14px;

    background:
      radial-gradient(120% 140% at 20% 10%, rgba(255,255,255,0.80), rgba(255,255,255,0.45)),
      linear-gradient(135deg, rgba(230,210,168,0.55), rgba(176,141,87,0.22));

    border: 1px solid rgba(176,141,87,0.22);
    display: grid;
    place-items: center;

    font-size: 13px;
    font-weight: 700;
    color: #1B140B;
  }

  .meta h4 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .meta p {
    margin: 8px 0 0;
    font-size: 13px;
    line-height: 1.55;
    color: var(--text-muted);
  }

  .status {
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    padding: 8px 10px;
    border-radius: 999px;
    border: 1px solid var(--border-soft);
    background: rgba(18, 20, 22, 0.03);
    color: var(--text-muted);
    white-space: nowrap;
  }

  .status.done {
    background: rgba(16, 185, 129, 0.10);
    border-color: rgba(16, 185, 129, 0.18);
    color: rgba(5, 150, 105, 0.95);
  }

  .status.active {
    background: rgba(176,141,87,0.12);
    border-color: rgba(176,141,87,0.28);
    color: rgba(122,90,45,0.95);
  }

  .status.next {
    background: rgba(18, 20, 22, 0.03);
    border-color: var(--border-soft);
    color: var(--text-muted);
  }

  .cardBody {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--border-soft);
  }

  .list {
    margin: 0;
    padding-left: 18px;
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.65;
  }

  .list li {
    margin: 8px 0;
  }

  @media (max-width: 1024px) {
    .layout {
      grid-template-columns: 120px 1fr;
      gap: 14px;
    }
    .lineCard {
      top: 14px;
    }
    .spine,
    .spineFill {
      width: 4px;
    }
    .plane {
      width: 40px;
      height: 40px;
    }
    .planeSvg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 640px) {
    .build {
      padding: 80px 16px;
    }
    .title {
      font-size: 30px;
    }
    .header {
      margin-bottom: 40px;
    }
    .layout {
      grid-template-columns: 90px 1fr;
    }
  }
</style>