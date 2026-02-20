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
      details: [
        "Configuration and options",
        "Docs and delivery plan",
        "Workspace readiness",
      ],
    },
    {
      id: "hub",
      title: "The Hub Build",
      subtitle: "Hangar build, tooling, jigs",
      details: [
        "Stations and workflow",
        "Tooling calibration",
        "Build schedule baseline",
      ],
    },
    {
      id: "qa",
      title: "QA Gate",
      subtitle: "Engineering oversight and signoffs",
      details: [
        "Evidence capture",
        "Non conformance actions",
        "Release signoff",
      ],
    },
    {
      id: "training",
      title: "Training",
      subtitle: "Type rating, safety, SOP",
      details: [
        "SOP and emergency",
        "Readiness assessment",
        "Operational handover",
      ],
    },
    {
      id: "service",
      title: "Service",
      subtitle: "Service",
      details: [
        "Maintenance schedule",
        "Parts and bulletins",
        "Reliability program",
      ],
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

    const cards = Array.from(
      panelEl.querySelectorAll<HTMLElement>("[data-step]"),
    );
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
    <h2 class="title">AIRCRAFT BUILD ROADMAP</h2>
    <p class="subtitle">Scroll the page: the plane follows the flight line</p>
  </div>

  <div class="layout">
    <aside class="left">
      <div class="lineCard" bind:this={lineCardEl}>
        <div class="lineTop">
          <div class="lineLabel">FLIGHT LINE</div>
          <div class="linePct">{Math.round(k * 100)}%</div>
        </div>

        <div class="rail" bind:this={railEl}>
          <div class="railGlass" aria-hidden="true"></div>

          <div class="spine" aria-hidden="true"></div>
          <div
            class="spineFill"
            style="height:{fillH}px"
            aria-hidden="true"
          ></div>

          {#each steps as s, i}
            <!-- svelte-ignore element_invalid_self_closing_tag -->
            <div
              class={"marker " +
                (isLit(i) ? "lit" : "") +
                " " +
                (i === activeIndex ? "current" : "")}
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
            class={"card " +
              (i === activeIndex ? "active" : "") +
              " " +
              (isLit(i) ? "lit" : "")}
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
    padding: 72px 16px 72px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    text-align: center;
    margin-bottom: 56px;
  }

  .title {
    font-size: 36px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    margin: 0;
    color: #0f172a;
  }

  .subtitle {
    margin-top: 8px;
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #64748b;
  }

  .layout {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 26px;
    align-items: start;
  }

  .left {
    position: relative;
    align-self: start;
  }

  .lineCard {
    position: sticky;
    top: 92px;

    display: flex;
    flex-direction: column;

    border-radius: 20px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow:
      0 12px 36px rgba(15, 23, 42, 0.06),
      0 4px 12px rgba(15, 23, 42, 0.04);
    backdrop-filter: blur(8px);
    overflow: hidden;
  }

  .lineTop {
    flex: 0 0 auto;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 14px 14px 8px;
  }

  .lineLabel {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 800;
  }

  .linePct {
    font-size: 11px;
    font-weight: 900;
    color: #0f172a;
    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);
    padding: 6px 8px;
    border-radius: 999px;
  }

  .rail {
    position: relative;
    border-radius: 18px;
    border: 1px solid rgba(15, 23, 42, 0.06);
    background: radial-gradient(
        320px 200px at 20% 20%,
        rgba(56, 189, 248, 0.12),
        transparent 60%
      ),
      linear-gradient(180deg, rgba(15, 23, 42, 0.02), rgba(15, 23, 42, 0.01));

    padding: 20px 8px;
    flex: 1;
    min-height: 0;
    overflow: visible;
  }

  .railGlass {
    position: absolute;
    inset: 0;
    border-radius: 18px;
    pointer-events: none;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.7),
      inset 0 0 0 1px rgba(255, 255, 255, 0.2);
    opacity: 0.8;
  }

  .spine {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 20px;
    bottom: 20px;
    width: 6px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.12);
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
      rgba(56, 189, 248, 1),
      rgba(99, 102, 241, 0.9)
    );
    box-shadow: 0 0 14px rgba(56, 189, 248, 0.2);
    z-index: 1;
  }

  .marker {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.15);
    border: 2px solid rgba(15, 23, 42, 0.1);
    z-index: 2;
    transition: transform 0.25s ease;
  }

  .marker.lit {
    background: rgba(56, 189, 248, 0.95);
    border-color: rgba(56, 189, 248, 0.35);
    box-shadow: 0 0 14px rgba(56, 189, 248, 0.25);
  }

  .marker.current {
    transform: translate(-50%, -50%) scale(1.22);
  }

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
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(56, 189, 248, 0.28);
    box-shadow:
      0 12px 30px rgba(56, 189, 248, 0.18),
      0 0 0 10px rgba(56, 189, 248, 0.06);
    backdrop-filter: blur(6px);
  }

  .planeGlow {
    position: absolute;
    inset: -14px;
    border-radius: 18px;
    background: radial-gradient(
      circle,
      rgba(56, 189, 248, 0.22),
      transparent 60%
    );
  }

  .planeSvg {
    width: 22px;
    height: 22px;
    transform: rotate(180deg);
  }

  .planeFill {
    fill: rgba(2, 132, 199, 0.95);
  }

  .lineHint {
    flex: 0 0 auto;
    padding: 10px 14px 14px;
    font-size: 11px;
    color: #64748b;
  }

  .lineHint span {
    font-weight: 900;
    color: #0f172a;
  }

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
    border-radius: 20px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 14px 40px rgba(15, 23, 42, 0.06),
      0 4px 14px rgba(15, 23, 42, 0.04);
    padding: 16px;
  }

  .card.lit {
    border-color: rgba(56, 189, 248, 0.14);
    background: linear-gradient(
      180deg,
      rgba(56, 189, 248, 0.045),
      rgba(99, 102, 241, 0.02)
    );
  }

  .card.active {
    border-color: rgba(56, 189, 248, 0.26);
    box-shadow:
      0 20px 60px rgba(15, 23, 42, 0.1),
      0 0 0 8px rgba(56, 189, 248, 0.08);
  }

  .cardHead {
    display: grid;
    grid-template-columns: 40px 1fr auto;
    gap: 12px;
    align-items: start;
  }

  .idx {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);
    display: grid;
    place-items: center;
    font-size: 13px;
    font-weight: 900;
    color: #0f172a;
  }

  .meta h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .meta p {
    margin: 6px 0 0;
    font-size: 12px;
    line-height: 1.5;
    color: #64748b;
  }

  .status {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 6px 8px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.06);
    background: rgba(15, 23, 42, 0.03);
    color: #64748b;
    white-space: nowrap;
  }

  .status.done {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.18);
    color: rgba(5, 150, 105, 0.95);
  }

  .status.active {
    background: rgba(56, 189, 248, 0.12);
    border-color: rgba(56, 189, 248, 0.22);
    color: rgba(2, 132, 199, 0.95);
  }

  .status.next {
    background: rgba(15, 23, 42, 0.03);
    border-color: rgba(15, 23, 42, 0.06);
    color: #64748b;
  }

  .cardBody {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(15, 23, 42, 0.06);
  }

  .list {
    margin: 0;
    padding-left: 18px;
    color: #64748b;
    font-size: 13px;
    line-height: 1.55;
  }

  .list li {
    margin: 6px 0;
  }

  @media (max-width: 1024px) {
    .layout {
      grid-template-columns: 110px 1fr;
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
      padding: 56px 16px;
    }
    .title {
      font-size: 20px;
      letter-spacing: 0.12em;
    }
    .header {
      margin-bottom: 34px;
    }
    .layout {
      grid-template-columns: 80px 1fr;
    }
  }
</style>
