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

  // ---------- helpers ----------
  function msToKnots(ms: number) {
    return ms * 1.943844;
  }

  function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
  }

  function degToCompass(deg: number) {
    const dirs = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    const i = Math.round((deg % 360) / 22.5) % 16;
    return dirs[i];
  }

  // Open-Meteo: WMO weather codes
  // https://open-meteo.com/en/docs
  function wmoLabel(code: number) {
    if ([0].includes(code)) return "Clear";
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

  function iconFor(code: number, isDay: boolean) {
    const sun = "☀️";
    const moon = "🌙";
    const cloud = "☁️";
    const fog = "🌫️";
    const rain = "🌧️";
    const storm = "⛈️";
    const snow = "❄️";

    if ([0].includes(code)) return isDay ? sun : moon;
    if ([1, 2].includes(code)) return isDay ? "🌤️" : "🌙";
    if ([3].includes(code)) return cloud;
    if ([45, 48].includes(code)) return fog;
    if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return rain;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return snow;
    if ([95, 96, 99].includes(code)) return storm;
    return isDay ? "🌤️" : moon;
  }

  function loadingText(stage: LoadingStage) {
    if (stage === "locating") return "Detecting location…";
    if (stage === "reverse") return "Resolving city…";
    return "Fetching weather…";
  }

  // ---------- data fetch ----------
  function locate(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("Geolocation is not supported in this browser"));
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
    if (!res.ok) return "Near you";
    const data = await res.json();
    return data?.place || "Near you";
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
    if (!c) throw new Error("No 'current' data returned");

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

      // If user previously denied and we are not forcing, show idle with button.
      if (!forcePrompt && "permissions" in navigator) {
        try {
          // @ts-ignore - Permissions types differ across TS libs
          const p = await navigator.permissions.query({ name: "geolocation" });
          if (p.state === "denied") {
            state = {
              status: "idle",
              reason:
                "Location permission is blocked. Click “Enable location” and allow in the browser prompt. If it doesn’t appear, enable location for this site in browser settings.",
            };
            return;
          }
        } catch {
          // ignore permissions API errors
        }
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
      // Geolocation error codes: 1 denied, 2 unavailable, 3 timeout
      if (typeof e?.code === "number" && e.code === 1) {
        state = {
          status: "idle",
          reason:
            "Location permission denied. Click “Enable location” to try again.",
        };
        return;
      }
      state = {
        status: "error",
        message: e?.message ?? "Failed to load weather",
      };
    }
  }

  // auto-run
  run();
</script>

<section class="card">
  <header class="header">
    <div class="kicker">FLIGHT WEATHER</div>

    {#if state.status === "ready"}
      <div class="title">
        <span class="icon">{iconFor(state.wmo, state.isDay)}</span>
        <span class="place">{state.place}</span>
      </div>
    {:else if state.status === "loading"}
      <div class="title">
        <span class="icon">🧭</span>
        <span class="place">{loadingText(state.stage)}</span>
      </div>
    {:else if state.status === "idle"}
      <div class="title">
        <span class="icon">📍</span>
        <span class="place">Location needed</span>
      </div>
    {:else}
      <div class="title">
        <span class="icon">⚠️</span>
        <span class="place">Weather unavailable</span>
      </div>
    {/if}
  </header>

  {#if state.status === "loading"}
    <div class="row loading-row">
      <div class="spinner" aria-label="Loading" />
      <div class="loading-meta">
        <div class="loading-line"></div>
        <div class="loading-sub"></div>
      </div>
    </div>
  {:else if state.status === "ready"}
    <div class="stats">
      <div class="pill">
        <span class="picon">🌡️</span>
        <span class="pval"
          >{state.tempC > 0 ? "+" : ""}{state.tempC.toFixed(0)}°C</span
        >
        <span class="plabel">Temp</span>
      </div>

      <div class="pill">
        <span class="picon">🧊</span>
        <span class="pval">{wmoLabel(state.wmo)}</span>
        <span class="plabel">Conditions</span>
      </div>

      <div class="pill">
        <span class="picon">💨</span>
        <span class="pval">
          {Math.round(state.windDeg)}° {degToCompass(state.windDeg)}
          · {Math.round(msToKnots(state.windMs))} kt
        </span>
        <span class="plabel">Wind</span>
      </div>

      <div class="pill">
        <span class="picon">☁️</span>
        <span class="pval">{clamp(Math.round(state.cloudPct), 0, 100)}%</span>
        <span class="plabel">Cloud</span>
      </div>
    </div>

    <div class="hint">
      Tip: for true aviation briefing use METAR/TAF, but this free widget is
      great for quick “go/no-go” vibes.
    </div>
  {:else if state.status === "idle"}
    <div class="hint">
      {state.reason ??
        "To show local flight weather, please allow location access."}
    </div>

    <button class="btn" on:click={() => run(true)}>
      <span class="btn-ic">✅</span>
      Enable location
    </button>

    <div class="fine">
      If the permission prompt doesn’t appear, enable location for this site in
      your browser settings and reload.
    </div>
  {:else if state.status === "error"}
    <div class="hint">{state.message}</div>

    <button class="btn btn--ghost" on:click={() => run(true)}>
      <span class="btn-ic">🔄</span>
      Retry
    </button>
  {/if}
</section>

<style>
  .card {
    border-radius: 22px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: #fff;
    box-shadow:
      0 18px 40px rgba(15, 23, 42, 0.08),
      0 6px 14px rgba(15, 23, 42, 0.05);
    padding: 16px;
  }

  .header {
    margin-bottom: 12px;
  }

  .kicker {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.12em;
    color: rgba(15, 23, 42, 0.45);
  }

  .title {
    margin-top: 6px;
    font-size: 16px;
    font-weight: 950;
    color: rgba(15, 23, 42, 0.95);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .icon {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: rgba(15, 23, 42, 0.06);
    font-size: 16px;
  }

  .place {
    display: inline-flex;
    gap: 8px;
    align-items: baseline;
    flex-wrap: wrap;
  }

  .stats {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 10px;
  }

  @media (min-width: 520px) {
    .stats {
      grid-template-columns: 1fr 1fr;
    }
  }

  .pill {
    border-radius: 16px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: rgba(15, 23, 42, 0.02);
    padding: 10px 12px;
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 10px;
    row-gap: 2px;
    align-items: center;
  }

  .picon {
    grid-row: 1 / span 2;
    width: 34px;
    height: 34px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.06);
    font-size: 16px;
  }

  .pval {
    font-size: 13px;
    font-weight: 950;
    color: rgba(15, 23, 42, 0.92);
  }

  .plabel {
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.08em;
    color: rgba(15, 23, 42, 0.55);
    text-transform: uppercase;
  }

  .hint {
    margin-top: 10px;
    font-size: 12px;
    color: rgba(15, 23, 42, 0.58);
  }

  .fine {
    margin-top: 8px;
    font-size: 11px;
    color: rgba(15, 23, 42, 0.45);
  }

  .btn {
    margin-top: 12px;
    width: 100%;
    border: 0;
    border-radius: 14px;
    padding: 10px 12px;
    background: linear-gradient(90deg, #2563eb, #7c3aed);
    color: white;
    font-weight: 900;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 10px 22px rgba(37, 99, 235, 0.18);
  }

  .btn:active {
    transform: translateY(1px);
  }

  .btn--ghost {
    background: rgba(15, 23, 42, 0.06);
    color: rgba(15, 23, 42, 0.9);
    box-shadow: none;
  }

  .btn-ic {
    display: grid;
    place-items: center;
  }

  /* loading row */
  .loading-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 8px;
  }

  .spinner {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    border: 3px solid rgba(15, 23, 42, 0.12);
    border-top-color: rgba(37, 99, 235, 0.9);
    animation: spin 0.9s linear infinite;
  }

  .loading-meta {
    flex: 1;
  }

  .loading-line,
  .loading-sub {
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.08);
    overflow: hidden;
    position: relative;
  }

  .loading-line {
    height: 12px;
    width: min(360px, 100%);
  }

  .loading-sub {
    height: 10px;
    width: min(260px, 100%);
    margin-top: 8px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
