<script lang="ts">
  type LoadingStage = "locating" | "reverse" | "weather";

  type WxView =
    | { status: "idle"; reason?: string }
    | { status: "loading"; stage: LoadingStage }
    | {
        status: "ready";
        place: string;
        tempC: number;
        cloudPct: number;
        windMs: number;
        windDeg: number;
        isDay: boolean;
        wmo: number;
      }
    | { status: "error"; message: string };

  let state: WxView = { status: "idle" };

  function msToKnots(ms: number) {
    return ms * 1.943844;
  }

  function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
  }

  function degToCompass(deg: number) {
    const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return dirs[Math.round((deg % 360) / 22.5) % 16];
  }

  function wmoLabel(code: number) {
    if ([0].includes(code)) return "Clear sky";
    if ([1, 2].includes(code)) return "Mostly clear";
    if ([3].includes(code)) return "Overcast";
    if ([45, 48].includes(code)) return "Fog";
    if ([51, 53, 55].includes(code)) return "Drizzle";
    if ([56, 57].includes(code)) return "Freezing drizzle";
    if ([61, 63, 65].includes(code)) return "Rain";
    if ([66, 67].includes(code)) return "Freezing rain";
    if ([71, 73, 75].includes(code)) return "Snow";
    if ([77].includes(code)) return "Snow grains";
    if ([80, 81, 82].includes(code)) return "Rain showers";
    if ([85, 86].includes(code)) return "Snow showers";
    if ([95].includes(code)) return "Thunderstorm";
    if ([96, 99].includes(code)) return "Thunderstorm hail";
    return "Weather";
  }

  function loadingText(stage: LoadingStage) {
    if (stage === "locating") return "Detecting location...";
    if (stage === "reverse") return "Resolving city...";
    return "Fetching weather...";
  }

  function locate(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 60_000,
      });
    });
  }

  async function getPlace(lat: number, lon: number) {
    const res = await fetch(`/api/reverse?lat=${lat}&lon=${lon}`);
    if (!res.ok) return "Your location";
    const data = await res.json();
    return data?.place || "Your location";
  }

  async function getWeather(lat: number, lon: number) {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${encodeURIComponent(lat)}` +
      `&longitude=${encodeURIComponent(lon)}` +
      "&current=temperature_2m,wind_speed_10m,wind_direction_10m,cloud_cover,is_day,weather_code" +
      "&timezone=auto";

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
    const data = await res.json();
    const c = data?.current;
    if (!c) throw new Error("No data returned");

    return {
      tempC: Number(c.temperature_2m),
      cloudPct: Number(c.cloud_cover),
      windMs: Number(c.wind_speed_10m),
      windDeg: Number(c.wind_direction_10m),
      isDay: Boolean(c.is_day),
      wmo: Number(c.weather_code),
    };
  }

  async function run(forcePrompt = false) {
    try {
      state = { status: "loading", stage: "locating" };

      if (!forcePrompt && "permissions" in navigator) {
        try {
          const p = await navigator.permissions.query({ name: "geolocation" as any });
          if (p.state === "denied") {
            state = { status: "idle", reason: "Location access is blocked. Enable it in browser settings for this site." };
            return;
          }
        } catch {}
      }

      const pos = await locate();
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      state = { status: "loading", stage: "reverse" };
      const placePromise = getPlace(lat, lon);

      state = { status: "loading", stage: "weather" };
      const wxPromise = getWeather(lat, lon);

      const [place, wx] = await Promise.all([placePromise, wxPromise]);
      state = { status: "ready", place, ...wx };
    } catch (e: any) {
      if (typeof e?.code === "number" && e.code === 1) {
        state = { status: "idle", reason: "Location permission denied." };
        return;
      }
      state = { status: "error", message: e?.message ?? "Failed to load weather" };
    }
  }

  run();
</script>

<section class="card">
  <header class="header">
    <div class="kicker">FLIGHT WEATHER</div>

    {#if state.status === "ready"}
      <div class="title-row">
        <div class="title">{state.place}</div>
        <div class="condition">{wmoLabel(state.wmo)}</div>
      </div>
    {:else if state.status === "loading"}
      <div class="title">{loadingText(state.stage)}</div>
    {:else if state.status === "idle"}
      <div class="title">Location needed</div>
    {:else}
      <div class="title">Unavailable</div>
    {/if}
  </header>

  {#if state.status === "loading"}
    <div class="loading-row">
      <div class="spinner" aria-label="Loading"></div>
    </div>

  {:else if state.status === "ready"}
    <div class="temp-row">
      <div class="temp">
        {state.tempC > 0 ? "+" : ""}{state.tempC.toFixed(0)}<span class="deg">°C</span>
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="stat-content">
          <div class="stat-val">{Math.round(msToKnots(state.windMs))} kt</div>
          <div class="stat-label">{Math.round(state.windDeg)}° {degToCompass(state.windDeg)}</div>
        </div>
      </div>

      <div class="stat">
        <svg class="stat-icon" viewBox="0 0 24 24" fill="none">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
        <div class="stat-content">
          <div class="stat-val">{clamp(Math.round(state.cloudPct), 0, 100)}%</div>
          <div class="stat-label">Cloud cover</div>
        </div>
      </div>
    </div>

  {:else if state.status === "idle"}
    <div class="idle-msg">
      {state.reason ?? "Allow location access to see local flight weather."}
    </div>
    <button class="btn" on:click={() => run(true)}>Enable Location</button>

  {:else if state.status === "error"}
    <div class="idle-msg">{state.message}</div>
    <button class="btn btn--ghost" on:click={() => run(true)}>Retry</button>
  {/if}
</section>

<style>
  .card {
    border-radius: 20px;
    border: 1px solid var(--border-soft);
    background: var(--bg-white);
    box-shadow:
      0 30px 90px rgba(18, 20, 22, 0.08),
      0 8px 22px rgba(18, 20, 22, 0.06);
    padding: 16px;
  }

  .header {
    margin-bottom: 14px;
  }

  .kicker {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: var(--text-muted);
  }

  .title-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .title {
    margin-top: 4px;
    font-size: 16px;
    font-weight: 600;
    font-family: var(--font-heading);
    color: var(--text-main);
  }

  .condition {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    padding: 2px 10px;
    border-radius: 999px;
    background: rgba(176, 141, 87, 0.08);
    border: 1px solid rgba(176, 141, 87, 0.12);
  }

  /* Temperature */
  .temp-row {
    margin-bottom: 14px;
  }

  .temp {
    font-family: var(--font-heading);
    font-size: 42px;
    font-weight: 600;
    letter-spacing: -0.04em;
    line-height: 1;
    color: var(--text-main);
  }

  .deg {
    font-size: 22px;
    color: var(--text-muted);
    font-weight: 500;
  }

  /* Stats */
  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .stat {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid var(--border-soft);
    background: rgba(15, 23, 42, 0.02);
  }

  .stat-icon {
    width: 20px;
    height: 20px;
    color: var(--accent);
    flex-shrink: 0;
  }

  .stat-val {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-main);
  }

  .stat-label {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 600;
  }

  /* Idle / Error */
  .idle-msg {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .btn {
    margin-top: 12px;
    width: 100%;
    border: 1px solid rgba(176, 141, 87, 0.3);
    border-radius: 14px;
    padding: 10px 12px;
    background: var(--accent);
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 22px rgba(176, 141, 87, 0.18);
    transition: 0.25s ease;
  }

  .btn:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }

  .btn--ghost {
    background: rgba(176, 141, 87, 0.06);
    color: var(--text-main);
    border-color: var(--border-soft);
    box-shadow: none;
  }

  /* Loading */
  .loading-row {
    display: grid;
    place-items: center;
    padding: 20px 0;
  }

  .spinner {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    border: 3px solid rgba(18, 20, 22, 0.12);
    border-top-color: var(--accent);
    animation: spin 0.9s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 640px) {
    .stats {
      grid-template-columns: 1fr;
    }
  }
</style>
