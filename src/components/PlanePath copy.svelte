<!-- src/components/PlanePath.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";

  type Step = {
    id: string;
    title: string;
    subtitle: string;
    details: string[];
  };

  /**
   * Сколько “wheel пикселей” нужно, чтобы пройти прогресс 0..1.
   * Меньше = быстрее.
   */
  export let wheelPixelsPerFull = 1400;

  /**
   * Насколько секция должна быть видна по высоте viewport, чтобы можно было захватить скролл.
   * 0.55 = 55% экрана.
   */
  export let lockVisibility = 0.86;

  /**
   * Насколько верх секции должен быть близок к “липкой” позиции, чтобы захват был мягкий.
   */
  export let lockTopBandPx = 140;

  /**
   * Мини HUD (всегда виден самолётик + %), пока секция активна/залочена.
   */
  export let showHud = true;

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
      subtitle: "Maintenance, CAMO, airworthiness",
      details: ["Maintenance schedule", "Parts and bulletins", "Reliability program"],
    },
  ];

  let sectionEl: HTMLElement | null = null;
  let railEl: HTMLElement | null = null;

  // progress: target + smooth
  let targetProgress = 0;
  let progress = 0;

  let activeIndex = 0;

  // pixels
  let planeTopPx = 0;
  let dotTopPx: number[] = [];
  let fillPx = 0;

  // constants from CSS
  const RAIL_PAD = 22;
  const PLANE_H = 52;

  // wheel accumulator (trackpad)
  let wheelAcc = 0;

  // lock state
  let locked = false;
  let canLock = false;
  let inView = false;

  // body lock bookkeeping
  let savedScrollY = 0;
  let savedBodyHeight = "";
  let savedBodyPosition = "";
  let savedBodyTop = "";
  let savedBodyLeft = "";
  let savedBodyRight = "";
  let savedBodyWidth = "";
  let savedBodyPaddingRight = "";
  let savedOverscroll = "";
  let savedHtmlOverscroll = "";

  let raf = 0;

  function clamp01(v: number) {
    return Math.max(0, Math.min(1, v));
  }

  function computeActiveIndex(p: number) {
    const n = steps.length;
    if (n <= 1) return 0;
    const t = p * (n - 1);
    const eps = 1e-6;
    return Math.max(0, Math.min(n - 1, Math.floor(t + eps)));
  }

  function computePxPositions(p: number) {
    if (!railEl) return;

    const h = railEl.clientHeight;
    const usable = Math.max(1, h - 2 * RAIL_PAD);

    fillPx = Math.max(0, Math.min(usable, usable * p));
    planeTopPx = RAIL_PAD + fillPx - PLANE_H / 2;

    const n = steps.length;
    dotTopPx = new Array(n).fill(0).map((_, i) => {
      const t = n <= 1 ? 0 : i / (n - 1);
      return RAIL_PAD + usable * t;
    });
  }

  function isLit(i: number) {
    return i <= activeIndex;
  }

  function statusText(i: number) {
    if (i < activeIndex) return "Completed";
    if (i === activeIndex) return "In progress";
    return "Up next";
  }

  function statusClass(i: number) {
    if (i < activeIndex) return "done";
    if (i === activeIndex) return "active";
    return "next";
  }

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function lockPageScroll() {
    if (!browser || locked) return;

    savedScrollY = window.scrollY || 0;

    const body = document.body;
    const html = document.documentElement;

    // сохраняем старые значения
    savedBodyHeight = body.style.height;
    savedBodyPosition = body.style.position;
    savedBodyTop = body.style.top;
    savedBodyLeft = body.style.left;
    savedBodyRight = body.style.right;
    savedBodyWidth = body.style.width;
    savedBodyPaddingRight = body.style.paddingRight;

    savedOverscroll = body.style.overscrollBehavior;
    savedHtmlOverscroll = html.style.overscrollBehavior;

    // фикс: удерживаем высоту документа, чтобы скроллбар НЕ исчезал
    const docH = Math.max(
      html.scrollHeight,
      body.scrollHeight,
      html.offsetHeight,
      body.offsetHeight,
      html.clientHeight
    );
    body.style.height = `${docH}px`;

    // компенсируем ширину скроллбара, чтобы не “дёргалось” по ширине
    const sbw = getScrollbarWidth();
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;

    // фиксируем body
    body.style.position = "fixed";
    body.style.top = `-${savedScrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    // мягче на iOS/overscroll
    body.style.overscrollBehavior = "none";
    html.style.overscrollBehavior = "none";

    locked = true;
  }

  function unlockPageScroll(direction: "down" | "up") {
    if (!browser || !locked) return;

    const body = document.body;
    const html = document.documentElement;

    // восстановить стили
    body.style.height = savedBodyHeight;
    body.style.position = savedBodyPosition;
    body.style.top = savedBodyTop;
    body.style.left = savedBodyLeft;
    body.style.right = savedBodyRight;
    body.style.width = savedBodyWidth;
    body.style.paddingRight = savedBodyPaddingRight;

    body.style.overscrollBehavior = savedOverscroll;
    html.style.overscrollBehavior = savedHtmlOverscroll;

    locked = false;

    // один scrollTo, без “двойного прыжка”
    const nudge = direction === "down" ? 2 : -2;
    window.scrollTo(0, savedScrollY + nudge);
  }

  function computeCanLock() {
    if (!sectionEl) return;

    const r = sectionEl.getBoundingClientRect();
    const vh = window.innerHeight || 1;

    const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
    const ratio = visible / vh;

    const topOk = Math.abs(r.top) <= lockTopBandPx || r.top <= 0;

    canLock = ratio >= lockVisibility && topOk;
    inView = ratio > 0.18;
  }

  function applyDeltaToProgress(deltaY: number) {
    wheelAcc += deltaY;

    const denom = Math.max(500, wheelPixelsPerFull);
    const step = wheelAcc / denom;

    if (Math.abs(step) < 0.00025) return;

    wheelAcc = 0;
    targetProgress = clamp01(targetProgress + step);
  }

  function shouldCaptureDelta(deltaY: number) {
    if (!canLock) return false;

    const goingDown = deltaY > 0;
    const goingUp = deltaY < 0;

    const atStart = targetProgress <= 0.000001;
    const atEnd = targetProgress >= 0.999999;

    if (!atStart && !atEnd) return true;
    if (atStart && goingDown) return true;
    if (atEnd && goingUp) return true;

    return false;
  }

  function onWheel(e: WheelEvent) {
    if (!browser) return;

    if (!locked) {
      if (shouldCaptureDelta(e.deltaY)) {
        e.preventDefault();
        lockPageScroll();
        applyDeltaToProgress(e.deltaY);
      }
      return;
    }

    e.preventDefault();

    const goingDown = e.deltaY > 0;
    const goingUp = e.deltaY < 0;

    const atStart = targetProgress <= 0.000001;
    const atEnd = targetProgress >= 0.999999;

    if (atEnd && goingDown) {
      unlockPageScroll("down");
      return;
    }

    if (atStart && goingUp) {
      unlockPageScroll("up");
      return;
    }

    applyDeltaToProgress(e.deltaY);
  }

  // touch support
  let touchY = 0;

  function onTouchStart(e: TouchEvent) {
    if (!e.touches?.length) return;
    touchY = e.touches[0].clientY;
  }

  function onTouchMove(e: TouchEvent) {
    if (!e.touches?.length) return;

    const y = e.touches[0].clientY;
    const dy = touchY - y;
    touchY = y;

    const fakeDelta = dy;

    if (!locked) {
      if (shouldCaptureDelta(fakeDelta)) {
        e.preventDefault();
        lockPageScroll();
        applyDeltaToProgress(fakeDelta);
      }
      return;
    }

    e.preventDefault();

    const goingDown = fakeDelta > 0;
    const goingUp = fakeDelta < 0;

    const atStart = targetProgress <= 0.000001;
    const atEnd = targetProgress >= 0.999999;

    if (atEnd && goingDown) {
      unlockPageScroll("down");
      return;
    }

    if (atStart && goingUp) {
      unlockPageScroll("up");
      return;
    }

    applyDeltaToProgress(fakeDelta);
  }

  function startLoop() {
    if (!browser) return;
    if (raf) cancelAnimationFrame(raf);

    const tick = () => {
      progress = progress + (targetProgress - progress) * 0.18;
      if (Math.abs(targetProgress - progress) < 0.0008) progress = targetProgress;

      activeIndex = computeActiveIndex(progress);
      computePxPositions(progress);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
  }

  function onResizeOrScroll() {
    computeCanLock();
    computePxPositions(progress);
  }

  onMount(() => {
    if (!browser) return;

    // глобально (на всякий случай) закрепляем поведение скроллбара через inline:
    // лучше всё же добавить в app.css:
    // html { scrollbar-gutter: stable both-edges; } body { overflow-y: scroll; }
    document.documentElement.style.scrollbarGutter = "stable both-edges";
    document.body.style.overflowY = "scroll";

    targetProgress = 0;
    progress = 0;

    computeCanLock();
    computePxPositions(progress);

    startLoop();

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onResizeOrScroll, { passive: true });
    window.addEventListener("resize", onResizeOrScroll, { passive: true });

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
  });

  onDestroy(() => {
    if (!browser) return;

    window.removeEventListener("wheel", onWheel as any);
    window.removeEventListener("scroll", onResizeOrScroll as any);
    window.removeEventListener("resize", onResizeOrScroll as any);

    window.removeEventListener("touchstart", onTouchStart as any);
    window.removeEventListener("touchmove", onTouchMove as any);

    if (raf) cancelAnimationFrame(raf);

    if (locked) unlockPageScroll("down");
  });
</script>

<section class="build" bind:this={sectionEl}>
  <div class="header">
    <h2 class="title">AIRCRAFT BUILD ROADMAP</h2>
    <p class="subtitle">Scroll down to move through milestones</p>
  </div>

  <div class="grid">
    <aside class="trackWrap">
      <div class="trackCard">
        <div class="trackTop">
          <div class="trackLabel">FLIGHT PATH</div>
          <div class="trackPct">{Math.round(progress * 100)}%</div>
        </div>

        <div class="trackBody">
          <div class="rail" bind:this={railEl}>
            <div class="railBase"></div>
            <div class="railFill" style="height: {fillPx}px"></div>

            {#each steps as s, i}
              <div
                class={"node " + (isLit(i) ? "lit" : "")}
                style="top: {dotTopPx[i] ?? 0}px;"
                aria-hidden="true"
              >
                <div class="nodeDot"></div>
                <div class="nodeRing"></div>
              </div>
            {/each}

            <div class="plane" style="top: {planeTopPx}px;" aria-hidden="true">
              <div class="planeGlow"></div>

              <div class="planeIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="planeSvg" fill="none">
                  <path
                    d="M12 2c.9 0 1.65.67 1.77 1.56l1.07 7.86 5.28 2.37c.69.31.98 1.13.63 1.8-.28.54-.9.83-1.49.68l-5.16-1.33-1.02 6.04c-.12.72-.74 1.26-1.47 1.26s-1.35-.54-1.47-1.26l-1.02-6.04-5.16 1.33c-.59.15-1.21-.14-1.49-.68-.35-.67-.06-1.49.63-1.8l5.28-2.37 1.07-7.86C10.35 2.67 11.1 2 12 2Z"
                    class="planeFill"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="trackHint">
            Active: <span>{activeIndex + 1}</span> / {steps.length}
          </div>
        </div>
      </div>
    </aside>

    <div class="cards">
      {#each steps as s, i}
        <article
          class={"card " +
            (i === activeIndex ? "active" : "") +
            " " +
            (isLit(i) ? "lit" : "")}
        >
          <div class="cardHead">
            <div class="idx">{i + 1}</div>

            <div class="meta">
              <h3>{s.title}</h3>
              <p>{s.subtitle}</p>
            </div>

            <div class={"status " + statusClass(i)}>{statusText(i)}</div>
          </div>

          {#if i === activeIndex}
            <div class="cardBody">
              <ul class="list">
                {#each s.details as d}
                  <li>{d}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </article>
      {/each}
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

  .grid {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 26px;
    align-items: start;
  }

  .trackWrap {
    position: sticky;
    top: 92px;
    align-self: start;
  }

  .trackCard {
    border-radius: 24px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
    overflow: visible;
  }

  .trackTop {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 18px 18px 10px;
  }

  .trackLabel {
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 800;
  }

  .trackPct {
    font-size: 12px;
    font-weight: 900;
    color: #0f172a;
    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);
    padding: 8px 10px;
    border-radius: 999px;
  }

  .trackBody {
    padding: 14px 18px 18px;
  }

  .rail {
    position: relative;
    border-radius: 20px;
    border: 1px solid rgba(15, 23, 42, 0.06);
    background: radial-gradient(
        420px 260px at 20% 20%,
        rgba(56, 189, 248, 0.12),
        transparent 60%
      ),
      radial-gradient(
        380px 240px at 80% 10%,
        rgba(99, 102, 241, 0.1),
        transparent 60%
      ),
      linear-gradient(180deg, rgba(15, 23, 42, 0.02), rgba(15, 23, 42, 0.01));
    padding: 22px 14px;
    min-height: 560px;
    overflow: visible;
  }

  .railBase {
    position: absolute;
    left: 34px;
    top: 22px;
    bottom: 22px;
    width: 7px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.12);
    z-index: 0;
  }

  .railFill {
    position: absolute;
    left: 34px;
    top: 22px;
    width: 7px;
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(56, 189, 248, 1), rgba(99, 102, 241, 0.9));
    box-shadow: 0 0 18px rgba(56, 189, 248, 0.22);
    z-index: 1;
  }

  .node {
    position: absolute;
    left: 37px;
    transform: translate(-50%, -50%);
    width: 18px;
    height: 18px;
    z-index: 2;
  }

  .nodeDot {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.12);
    border: 2px solid rgba(15, 23, 42, 0.1);
  }

  .nodeRing {
    position: absolute;
    inset: -11px;
    border-radius: 999px;
    border: 2px solid rgba(15, 23, 42, 0.06);
  }

  .node.lit .nodeDot {
    background: rgba(56, 189, 248, 0.98);
    border-color: rgba(56, 189, 248, 0.35);
    box-shadow: 0 0 18px rgba(56, 189, 248, 0.28);
  }

  .node.lit .nodeRing {
    border-color: rgba(56, 189, 248, 0.22);
  }

  .plane {
    position: absolute;
    left: 34px;
    transform: translate(-50%, 0);
    width: 52px;
    height: 52px;
    z-index: 3;
    transition: none;
  }

  .planeGlow {
    position: absolute;
    inset: -22px;
    border-radius: 22px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.22), transparent 62%);
    filter: blur(0.2px);
  }

  .planeIcon {
    position: absolute;
    inset: 0;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.3);
    box-shadow:
      0 18px 50px rgba(56, 189, 248, 0.18),
      0 0 0 12px rgba(56, 189, 248, 0.08);
  }

  .planeSvg {
    width: 26px;
    height: 26px;
    transform: rotate(90deg);
    display: block;
  }

  .planeFill {
    fill: rgba(2, 132, 199, 0.95);
    stroke: rgba(255, 255, 255, 0.55);
    stroke-width: 0.6;
  }

  .trackHint {
    margin-top: 12px;
    font-size: 12px;
    color: #64748b;
  }

  .trackHint span {
    font-weight: 900;
    color: #0f172a;
  }

  .cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .card {
    border-radius: 24px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.08),
      0 6px 18px rgba(15, 23, 42, 0.06);
    padding: 18px 18px 16px;
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease,
      border-color 0.35s ease,
      background 0.35s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow:
      0 26px 80px rgba(15, 23, 42, 0.12),
      0 10px 28px rgba(15, 23, 42, 0.08);
  }

  .cardHead {
    display: grid;
    grid-template-columns: 44px 1fr auto;
    gap: 14px;
    align-items: start;
  }

  .idx {
    width: 44px;
    height: 44px;
    border-radius: 16px;
    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 900;
    color: #0f172a;
  }

  .meta h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .meta p {
    margin: 6px 0 0;
    font-size: 13px;
    line-height: 1.55;
    color: #64748b;
  }

  .status {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 10px 12px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.06);
    background: rgba(15, 23, 42, 0.03);
    color: #64748b;
    white-space: nowrap;
    height: fit-content;
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

  .card.lit {
    border-color: rgba(56, 189, 248, 0.14);
    background: linear-gradient(180deg, rgba(56, 189, 248, 0.045), rgba(99, 102, 241, 0.025));
  }

  .card.active {
    border-color: rgba(56, 189, 248, 0.26);
    box-shadow:
      0 26px 80px rgba(15, 23, 42, 0.12),
      0 0 0 12px rgba(56, 189, 248, 0.08);
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

  /* HUD */
  .hud {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-width: 220px;
    padding: 10px 12px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(15, 23, 42, 0.10);
    box-shadow:
      0 18px 60px rgba(15, 23, 42, 0.12),
      0 6px 18px rgba(15, 23, 42, 0.08);
    backdrop-filter: blur(10px);
  }

  .hud.locked {
    box-shadow:
      0 26px 80px rgba(15, 23, 42, 0.16),
      0 0 0 10px rgba(56, 189, 248, 0.10);
    border-color: rgba(56, 189, 248, 0.22);
  }

  .hudLeft {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .hudPlane {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.28);
  }

  .hudSvg {
    width: 18px;
    height: 18px;
    transform: rotate(90deg);
  }

  .hudFill {
    fill: rgba(2, 132, 199, 0.95);
    stroke: rgba(255, 255, 255, 0.55);
    stroke-width: 0.6;
  }

  .hudText {
    min-width: 0;
  }

  .hudTitle {
    font-size: 12px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .hudSub {
    margin-top: 2px;
    font-size: 12px;
    color: #64748b;
  }

  .hudPct {
    font-size: 12px;
    font-weight: 900;
    color: #0f172a;
    background: rgba(15, 23, 42, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.06);
    padding: 8px 10px;
    border-radius: 999px;
    white-space: nowrap;
  }

  /* Mobile / tablet: как десктоп (тонкий трек слева, контент справа) */
  @media (max-width: 1024px) {
    .grid {
      grid-template-columns: 86px 1fr;
      gap: 14px;
    }

    .trackWrap {
      top: 14px;
    }

    .trackTop {
      padding: 12px 10px 8px;
    }

    .trackBody {
      padding: 10px 10px 12px;
    }

    .trackLabel {
      display: none;
    }

    .trackPct {
      font-size: 11px;
      padding: 6px 8px;
    }

    .rail {
      min-height: 420px;
      padding: 18px 10px;
    }

    .railBase,
    .railFill {
      left: 20px;
      width: 5px;
    }

    .node {
      left: 22px;
      width: 14px;
      height: 14px;
    }

    .nodeRing {
      inset: -9px;
    }

    .plane {
      left: 20px;
      width: 44px;
      height: 44px;
    }

    .planeSvg {
      width: 22px;
      height: 22px;
    }

    .card {
      padding: 14px 14px 12px;
    }

    .meta h3 {
      font-size: 16px;
    }

    .meta p {
      font-size: 12px;
    }

    .hud {
      right: 12px;
      bottom: 12px;
      min-width: 200px;
    }
  }

  @media (max-width: 640px) {
    .build {
      padding: 56px 16px 56px;
    }
    .title {
      font-size: 20px;
      letter-spacing: 0.12em;
    }
    .header {
      margin-bottom: 34px;
    }
  }
</style>
