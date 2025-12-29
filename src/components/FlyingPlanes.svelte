<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";

  let count: 1 | 2 = 2;
  let size = 26;
  let zIndex = 9999;
  let opacity = 0.92;
  let src = "/images/plane.png";

  let speedMin = 70;
  let speedMax = 140;

  let loopChance = 0.0018;
  let loopCooldownSec = 6;

  let minSeparation = 220;

  let exhaustRate = 18;
  let exhaustLifeMin = 0.22;
  let exhaustLifeMax = 0.4;
  let exhaustMaxPuffs = 160;

  let boostMultiplier = 1.55;
  let boostTotal = 1.0;

  type Plane = {
    id: number;
    x: number;
    y: number;
    angleRad: number;
    speed: number;

    wanderPhase: number;
    wanderSpeed: number;
    wanderAmp: number;

    looping: boolean;
    loopRemaining: number;
    loopRate: number;
    loopDir: 1 | -1;
    loopCooldown: number;

    boostT: number;
  };

  type Puff = {
    id: number;
    planeId: number;
    x: number;
    y: number;
    t: number;
    life: number;
    s: number;
    a: number;
  };

  let planes: Plane[] = [];
  let puffs: Puff[] = [];
  let raf = 0;
  let puffId = 1;

  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const clamp = (v: number, a: number, b: number) =>
    Math.max(a, Math.min(b, v));
  const radToDeg = (r: number) => (r * 180) / Math.PI;

  function easeOutCubic(x: number) {
    return 1 - Math.pow(1 - x, 3);
  }

  function spawn(id: number): Plane {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const margin = 140;
    const side = Math.floor(rand(0, 4));
    let x = 0,
      y = 0;

    if (side === 0) {
      x = rand(0, w);
      y = -margin;
    }
    if (side === 1) {
      x = w + margin;
      y = rand(0, h);
    }
    if (side === 2) {
      x = rand(0, w);
      y = h + margin;
    }
    if (side === 3) {
      x = -margin;
      y = rand(0, h);
    }

    const tx = rand(w * 0.2, w * 0.8);
    const ty = rand(h * 0.2, h * 0.8);

    return {
      id,
      x,
      y,
      angleRad: Math.atan2(ty - y, tx - x),
      speed: rand(speedMin, speedMax),

      wanderPhase: rand(0, Math.PI * 2),
      wanderSpeed: rand(0.25, 0.7),
      wanderAmp: rand(0.18, 0.42),

      looping: false,
      loopRemaining: 0,
      loopRate: 0,
      loopDir: Math.random() < 0.5 ? 1 : -1,
      loopCooldown: rand(1, 3),

      boostT: 0,
    };
  }

  function respawn(p: Plane) {
    Object.assign(p, spawn(p.id));
  }

  function dist(a: Plane, b: Plane) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function initPlanes(n: number) {
    planes = Array.from({ length: n }, (_, i) => spawn(i));
    if (n === 2) {
      let tries = 0;
      while (dist(planes[0], planes[1]) < minSeparation * 1.2 && tries < 60) {
        planes[1] = spawn(1);
        tries++;
      }
    }
  }

  function startLoop(p: Plane) {
    p.looping = true;
    p.loopRemaining = Math.PI * 2;
    p.loopDir = Math.random() < 0.5 ? 1 : -1;
    p.loopRate = rand(1.15, 1.7) * p.loopDir;
    p.loopCooldown = loopCooldownSec;
  }

  function addPuffBehindPlane(p: Plane) {
    const back = size * 0.58;
    const nx = Math.cos(p.angleRad);
    const ny = Math.sin(p.angleRad);

    const px = p.x - nx * back + rand(-2.2, 2.2);
    const py = p.y - ny * back + rand(-2.2, 2.2);

    puffs.push({
      id: puffId++,
      planeId: p.id,
      x: px,
      y: py,
      t: 0,
      life: rand(exhaustLifeMin, exhaustLifeMax),
      s: rand(size * 0.28, size * 0.55),
      a: rand(0.16, 0.28),
    });

    if (puffs.length > exhaustMaxPuffs) {
      puffs.splice(0, puffs.length - exhaustMaxPuffs);
    }
  }

  function stepPuffs(dt: number) {
    for (const f of puffs) {
      f.t += dt;
      f.y -= 18 * dt;
      f.x += rand(-8, 8) * dt;
    }
    puffs = puffs.filter((f) => f.t < f.life);
  }

  function applySeparation(dt: number) {
    if (planes.length < 2) return;

    const a = planes[0];
    const b = planes[1];

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.hypot(dx, dy) || 1;

    if (d >= minSeparation) return;

    const k = clamp((minSeparation - d) / minSeparation, 0, 1);
    const push = (1.6 + 2.6 * k) * dt;

    const sign =
      dx * Math.sin(a.angleRad) - dy * Math.cos(a.angleRad) > 0 ? 1 : -1;

    a.angleRad += push * sign;
    b.angleRad -= push * sign;

    a.speed = clamp(a.speed + 55 * dt, speedMin, speedMax);
    b.speed = clamp(b.speed + 55 * dt, speedMin, speedMax);
  }

  function boostMul(p: Plane) {
    if (p.boostT <= 0) return 1;

    const x = clamp(p.boostT / boostTotal, 0, 1);
    const u = easeOutCubic(x);
    return 1 + (boostMultiplier - 1) * u;
  }

  function stepPlanes(dt: number) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const margin = 220;

    applySeparation(dt);

    for (const p of planes) {
      if (p.boostT > 0) p.boostT = Math.max(0, p.boostT - dt);

      if (p.loopCooldown > 0) p.loopCooldown = Math.max(0, p.loopCooldown - dt);

      if (!p.looping && p.loopCooldown <= 0 && Math.random() < loopChance) {
        startLoop(p);
      }

      p.wanderPhase += p.wanderSpeed * dt;
      const wanderTurn = Math.sin(p.wanderPhase) * p.wanderAmp;

      let turnRate = wanderTurn;

      if (p.looping) {
        turnRate = p.loopRate;
        p.speed = clamp(p.speed + 55 * dt, speedMin, speedMax);

        p.loopRemaining -= Math.abs(turnRate) * dt;
        if (p.loopRemaining <= 0) {
          p.looping = false;
          p.loopRemaining = 0;
          p.angleRad += rand(-0.35, 0.35);
        }
      } else {
        p.speed = clamp(p.speed + rand(-22, 22) * dt, speedMin, speedMax);
      }

      p.angleRad += turnRate * dt;

      const s = p.speed * boostMul(p);
      p.x += Math.cos(p.angleRad) * s * dt;
      p.y += Math.sin(p.angleRad) * s * dt;

      const expected = exhaustRate * dt;
      const n = Math.floor(expected);
      const frac = expected - n;
      for (let i = 0; i < n; i++) addPuffBehindPlane(p);
      if (Math.random() < frac) addPuffBehindPlane(p);

      if (
        p.x < -margin ||
        p.x > w + margin ||
        p.y < -margin ||
        p.y > h + margin
      ) {
        respawn(p);
      }
    }
  }

  function onImgError() {
    console.error(
      `Plane image not found at ${src}. Put it in /static/images/plane.png so src="/images/plane.png".`
    );
  }

  function pushPlane(p: Plane) {
    p.boostT = boostTotal;
  }

  onMount(() => {
    if (!browser) return;

    const n = Math.max(1, Math.min(2, count)) as 1 | 2;
    initPlanes(n);

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      stepPlanes(dt);
      stepPuffs(dt);

      planes = planes;
      puffs = puffs;

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
  });

  onDestroy(() => {
    if (browser && raf) cancelAnimationFrame(raf);
  });
</script>

<div class="layer" aria-hidden="true" style="z-index:{zIndex};">
  {#each puffs as f (f.id)}
    <div
      class="puff"
      style="
        left:{f.x}px;
        top:{f.y}px;
        width:{f.s}px;
        height:{f.s}px;
        opacity:{f.a * (1 - f.t / f.life)};
        transform: translate(-50%, -50%) scale({1 + (f.t / f.life) * 1.05});
      "
    />
  {/each}

  {#each planes as p (p.id)}
    <img
      class="plane"
      {src}
      alt=""
      on:error={onImgError}
      draggable="false"
      on:click|stopPropagation={() => pushPlane(p)}
      style="
        left:{p.x}px;
        top:{p.y}px;
        width:{size}px;
        opacity:{opacity};
        transform: translate(-50%, -50%) rotate({radToDeg(p.angleRad) + 90}deg);
      "
    />
  {/each}
</div>

<style>
  .layer {
    position: fixed;
    inset: 0;
    background: transparent;
    overflow: hidden;
    pointer-events: none;
  }

  .plane {
    position: absolute;
    user-select: none;
    -webkit-user-drag: none;
    will-change: transform, left, top;
    filter: drop-shadow(0 3px 10px rgba(0, 0, 0, 0.22));
    cursor: pointer;
    pointer-events: auto;
  }

  .puff {
    position: absolute;
    border-radius: 999px;
    background: radial-gradient(
      closest-side,
      rgba(255, 255, 255, 0.92),
      rgba(255, 255, 255, 0)
    );
    filter: blur(2.6px);
    will-change: transform, left, top, opacity;
    pointer-events: none;
  }
</style>
