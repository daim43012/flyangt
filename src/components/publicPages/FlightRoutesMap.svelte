<!-- src/lib/components/RouteLeafletCard.svelte -->
<script lang="ts">
  import { onMount } from "svelte";

  const ORIGIN = { name: "Larnaca Airport", code: "LCA", lat: 34.8751, lng: 33.6249 };

  const DESTINATIONS = [
    { city: "Athens", country: "Greece", iata: "ATH", lat: 37.9838, lng: 23.7275 },
    { city: "Sofia", country: "Bulgaria", iata: "SOF", lat: 42.6977, lng: 23.3219 },
    { city: "Bucharest", country: "Romania", iata: "OTP", lat: 44.4268, lng: 26.1025 },
    { city: "Istanbul", country: "Turkey", iata: "IST", lat: 41.0082, lng: 28.9784 },
    { city: "Rome", country: "Italy", iata: "FCO", lat: 41.9028, lng: 12.4964 },
    { city: "Vienna", country: "Austria", iata: "VIE", lat: 48.2082, lng: 16.3738 },

    { city: "Paris", country: "France", iata: "CDG", lat: 48.8566, lng: 2.3522 },
    { city: "Nice", country: "France", iata: "NCE", lat: 43.7102, lng: 7.2620 },

    { city: "Barcelona", country: "Spain", iata: "BCN", lat: 41.3851, lng: 2.1734 },
    { city: "Madrid", country: "Spain", iata: "MAD", lat: 40.4168, lng: -3.7038 },

    { city: "London", country: "United Kingdom", iata: "LHR", lat: 51.5072, lng: -0.1276 },

    { city: "Tbilisi", country: "Georgia", iata: "TBS", lat: 41.7151, lng: 44.8271 },

    { city: "Tel Aviv", country: "Israel", iata: "TLV", lat: 32.0853, lng: 34.7818 },
    { city: "Amman", country: "Jordan", iata: "AMM", lat: 31.9539, lng: 35.9106 },
    { city: "Beirut", country: "Lebanon", iata: "BEY", lat: 33.8938, lng: 35.5018 },
    { city: "Cairo", country: "Egypt", iata: "CAI", lat: 30.0444, lng: 31.2357 },
    { city: "Dubai", country: "UAE", iata: "DXB", lat: 25.2048, lng: 55.2708 }
  ];

  const CRUISE_SPEED_KMH = 370;
  const FUEL_BURN_KG_PER_H = 30;
  const OPS_BUFFER_H = 0.25;

  let el: HTMLDivElement | null = null;

  function toRad(d: number) {
    return (d * Math.PI) / 180;
  }

  function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);

    const s =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

    return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
  }

  function bearingDeg(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
    const φ1 = toRad(from.lat);
    const φ2 = toRad(to.lat);
    const Δλ = toRad(to.lng - from.lng);
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const brng = (Math.atan2(y, x) * 180) / Math.PI;
    return (brng + 360) % 360;
  }

  function formatDuration(hours: number) {
    const totalMin = Math.round(hours * 60);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return h === 0 ? `${m} min` : `${h} h ${m} min`;
  }

  function flightTimeH(distanceKm: number) {
    return distanceKm / CRUISE_SPEED_KMH + OPS_BUFFER_H;
  }

  function fuelKg(distanceKm: number) {
    return Math.round(flightTimeH(distanceKm) * FUEL_BURN_KG_PER_H);
  }

  // varied per-route arcs (deterministic)
  function arcPoints(from: { lat: number; lng: number }, to: { lat: number; lng: number }, steps = 80) {
    const lat1 = from.lat, lng1 = from.lng;
    const lat2 = to.lat, lng2 = to.lng;

    const dx = lng2 - lng1;
    const dy = lat2 - lat1;
    const routeLen = Math.sqrt(dx * dx + dy * dy) || 1;

    const br = bearingDeg(from, to);
    const distKm = haversineKm(from, to);

    const distFactor = Math.min(0.38, 0.12 + (distKm / 4500) * 0.18);
    const bearWobble = (Math.sin(toRad(br * 2)) + 1) * 0.035;
    let bulge = distFactor + bearWobble;

    const flip = Math.floor(br / 45) % 2 === 0 ? 1 : -1;

    const mx = (lng1 + lng2) / 2;
    const my = (lat1 + lat2) / 2;

    const px = -dy;
    const py = dx;
    const len = Math.sqrt(px * px + py * py) || 1;

    const bx = (px / len) * routeLen * bulge * flip;
    const by = (py / len) * routeLen * bulge * flip;

    const cx = mx + bx;
    const cy = my + by;

    const pts: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * cx + t * t * lng2;
      const y = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * cy + t * t * lat2;
      pts.push([y, x]);
    }
    return pts;
  }

  function popupHtml(dest: { city: string; country: string; iata: string }, km: number) {
    const t = flightTimeH(km);
    const f = fuelKg(km);

    return `
      <div class="rp">
        <div class="rp__top">
          <div class="rp__route">${ORIGIN.code} <span class="rp__arrow">→</span> ${dest.iata}</div>
          <div class="rp__tag">European Aviation</div>
        </div>
        <div class="rp__title">${ORIGIN.name}</div>
        <div class="rp__subtitle">${dest.city}, ${dest.country}</div>

        <div class="rp__metrics">
          <div class="rp__m">
            <div class="rp__k">Distance</div>
            <div class="rp__v">${Math.round(km)} km</div>
          </div>
          <div class="rp__m">
            <div class="rp__k">Flight time</div>
            <div class="rp__v">${formatDuration(t)}</div>
          </div>
          <div class="rp__m">
            <div class="rp__k">Fuel estimate</div>
            <div class="rp__v">${f.toLocaleString()} kg</div>
          </div>
        </div>

        <div class="rp__foot">Cruise ${CRUISE_SPEED_KMH} km/h • Buffer ${Math.round(OPS_BUFFER_H * 60)} min</div>
      </div>
    `;
  }

  onMount(async () => {
    const L = await import("leaflet");

    // @ts-ignore
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
    });

    if (!el) return;

    const map = L.map(el, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      worldCopyJump: false,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      preferCanvas: true
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 9,
      minZoom: 3,
      noWrap: true
    }).addTo(map);

    // hard bounds so user "hits edges"
    const bounds = L.latLngBounds(L.latLng(18, -18), L.latLng(60, 62));
    map.setMaxBounds(bounds);
    // @ts-ignore
    map.options.maxBoundsViscosity = 1.0;

    map.setView([ORIGIN.lat, ORIGIN.lng], 5);

    map.createPane("routes");
    map.getPane("routes")!.style.zIndex = "400";

    // --- ONE shared popup (no lag, no map auto-pan) ---
    // It will position itself to a suitable side and never pan the map.
    const sharedPopup = L.popup({
      autoPan: false,
      closeButton: false,
      closeOnClick: false,
      className: "route-popup",
      offset: [0, -12],
      // keep it inside the card bounds; Leaflet will nudge popup within view
      keepInView: true
    });

    let hoverCloseTimer: any = null;
    let lastKey = "";

    // choose side based on screen position so it "finds free space"
    function smartOffset(latlng: any) {
      const size = map.getSize();
      const p = map.latLngToContainerPoint(latlng);
      const left = p.x < size.x * 0.33;
      const right = p.x > size.x * 0.66;
      const top = p.y < size.y * 0.33;
      const bottom = p.y > size.y * 0.66;

      let x = 0;
      let y = -12;

      if (right) x = -18;
      if (left) x = 18;
      if (top) y = 18;
      if (bottom) y = -18;

      return L.point(x, y);
    }

    function showPopup(latlng: any, html: string, key: string) {
      if (hoverCloseTimer) clearTimeout(hoverCloseTimer);

      // prevent “thrash” when moving inside same polyline
      if (key === lastKey && map.hasLayer(sharedPopup)) return;
      lastKey = key;

      sharedPopup
        .setLatLng(latlng)
        .setContent(html);

      // @ts-ignore
      sharedPopup.options.offset = smartOffset(latlng);

      if (!map.hasLayer(sharedPopup)) sharedPopup.openOn(map);
      else sharedPopup.update();
    }

    function hidePopupSoon() {
      if (hoverCloseTimer) clearTimeout(hoverCloseTimer);
      hoverCloseTimer = setTimeout(() => {
        lastKey = "";
        try {
          map.closePopup(sharedPopup);
        } catch {}
      }, 60);
    }

    // Origin
    const originDot = L.circleMarker([ORIGIN.lat, ORIGIN.lng], {
      radius: 7.5,
      weight: 0,
      fillOpacity: 0.98,
      fillColor: "#0f172a",
      pane: "routes",
      className: "dot dot-origin"
    }).addTo(map);

    const originLabel = L.marker([ORIGIN.lat, ORIGIN.lng], {
      pane: "routes",
      interactive: false,
      icon: L.divIcon({ className: "city-label city-label--origin", html: `<span>${ORIGIN.code}</span>` })
    }).addTo(map);

    const all: any[] = [originDot, originLabel];

    for (const d of DESTINATIONS) {
      const km = haversineKm(ORIGIN, d);
      const pts = arcPoints(ORIGIN, d);
      const html = popupHtml(d, km);

      const glow = L.polyline(pts, {
        weight: 12,
        opacity: 0.16,
        pane: "routes",
        lineCap: "round",
        lineJoin: "round",
        className: "route route-glow",
        interactive: true
      }).addTo(map);

      const line = L.polyline(pts, {
        weight: 3.2,
        opacity: 0.55,
        pane: "routes",
        lineCap: "round",
        lineJoin: "round",
        className: "route route-line",
        interactive: true
      }).addTo(map);

      const dot = L.circleMarker([d.lat, d.lng], {
        radius: 6.2,
        weight: 0,
        fillOpacity: 0.95,
        fillColor: "#0f172a",
        pane: "routes",
        className: "dot dot-city"
      }).addTo(map);

      const label = L.marker([d.lat, d.lng], {
        pane: "routes",
        interactive: false,
        icon: L.divIcon({ className: "city-label", html: `<span>${d.city}</span>` })
      }).addTo(map);

      const hi = () => {
        line.setStyle({ opacity: 0.92, weight: 4.2 });
        glow.setStyle({ opacity: 0.26 });
        dot.setStyle({ fillOpacity: 1 });
      };
      const lo = () => {
        line.setStyle({ opacity: 0.55, weight: 3.2 });
        glow.setStyle({ opacity: 0.16 });
        dot.setStyle({ fillOpacity: 0.95 });
      };

      // Route hover: update popup without panning the map
      line.on("mouseover", (e: any) => {
        hi();
        showPopup(e.latlng, html, `line:${d.iata}`);
      });
      line.on("mousemove", (e: any) => {
        // keep popup stable: only move a bit if you want “follow cursor”
        // We'll anchor to mid-route by keeping lastKey check; but allow gentle reposition:
        showPopup(e.latlng, html, `line:${d.iata}`);
      });
      line.on("mouseout", () => {
        lo();
        hidePopupSoon();
      });

      glow.on("mouseover", (e: any) => {
        hi();
        showPopup(e.latlng, html, `glow:${d.iata}`);
      });
      glow.on("mousemove", (e: any) => {
        showPopup(e.latlng, html, `glow:${d.iata}`);
      });
      glow.on("mouseout", () => {
        lo();
        hidePopupSoon();
      });

      // City hover: pop anchored at city point (no cursor thrash)
      dot.on("mouseover", () => {
        hi();
        showPopup(L.latLng(d.lat, d.lng), html, `dot:${d.iata}`);
      });
      dot.on("mouseout", () => {
        lo();
        hidePopupSoon();
      });

      all.push(glow, line, dot, label);
    }

    // close popup if user starts dragging/zooming to avoid flicker
    map.on("movestart", () => {
      try {
        map.closePopup(sharedPopup);
      } catch {}
      lastKey = "";
    });

    const fg = L.featureGroup(all);
    map.fitBounds(fg.getBounds().pad(0.18), { animate: false });

    L.control.zoom({ position: "bottomright" }).addTo(map);
  });
</script>

<div class="map-card">
  <div class="map-frame" bind:this={el} aria-label="Larnaca routes map"></div>
  <div class="map-hud">
    <div class="map-hud__title">Routes from Larnaca</div>
    <div class="map-hud__sub">Hover a city or path to view range, time, fuel</div>
  </div>
</div>

<style>
  .map-card {
    position: relative;
    width: min(1200px, 92vw);
    margin: 28px auto 0;
    height: clamp(340px, 42vw, 520px);
    border-radius: 24px;
    overflow: hidden;
    background:
      radial-gradient(900px 460px at 50% -140px, rgba(59, 130, 246, 0.12), transparent 62%),
      radial-gradient(700px 420px at 16% -120px, rgba(15, 23, 42, 0.06), transparent 60%),
      radial-gradient(700px 420px at 84% -120px, rgba(15, 23, 42, 0.06), transparent 60%),
      #ffffff;
    box-shadow:
      0 26px 80px rgba(15, 23, 42, 0.10),
      0 10px 26px rgba(15, 23, 42, 0.06);
  }
  .map-frame { width: 100%; height: 100%; }

  .map-hud {
    position: absolute;
    left: 14px;
    top: 12px;
    padding: 10px 12px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.74);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 16px 44px rgba(15, 23, 42, 0.10);
    user-select: none;
    pointer-events: none;
  }
  .map-hud__title {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: #0f172a;
    line-height: 1.1;
  }
  .map-hud__sub {
    margin-top: 4px;
    font-size: 11px;
    color: rgba(15, 23, 42, 0.58);
  }

  :global(.route-line) { stroke: rgba(15, 23, 42, 0.78); }
  :global(.route-glow) { stroke: rgba(59, 130, 246, 0.72); filter: blur(0.6px); }

  :global(.dot) { filter: drop-shadow(0 10px 18px rgba(15, 23, 42, 0.16)); }
  :global(.dot-city) { cursor: pointer; }
  :global(.dot-origin) { filter: drop-shadow(0 16px 26px rgba(59, 130, 246, 0.22)); }

  :global(.city-label) { pointer-events: none; }
  :global(.city-label span) {
    display: inline-block;
    transform: translateY(-18px);
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 14px 44px rgba(15, 23, 42, 0.10);
    border: 1px solid rgba(15, 23, 42, 0.06);
    color: rgba(15, 23, 42, 0.78);
    font-size: 11px;
    font-weight: 650;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }
  :global(.city-label--origin span) {
    transform: translateY(-20px);
    background: rgba(15, 23, 42, 0.06);
    color: rgba(15, 23, 42, 0.9);
    border: 1px solid rgba(15, 23, 42, 0.08);
  }

  /* shared popup */
  :global(.route-popup .leaflet-popup-content-wrapper) {
    border-radius: 18px;
    border: 1px solid rgba(15, 23, 42, 0.06);
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 28px 90px rgba(15, 23, 42, 0.16);
  }
  :global(.route-popup .leaflet-popup-tip) {
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(15, 23, 42, 0.06);
    box-shadow: none;
  }
  :global(.route-popup .leaflet-popup-content) {
    margin: 12px 12px;
    min-width: 260px;
  }

  :global(.rp) {
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }
  :global(.rp__top) { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  :global(.rp__route) {
    font-size: 12px; font-weight: 900; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(15, 23, 42, 0.85);
  }
  :global(.rp__arrow) { color: rgba(59, 130, 246, 0.95); font-weight: 900; }
  :global(.rp__tag) {
    font-size: 10px; padding: 6px 10px; border-radius: 999px;
    background: rgba(59, 130, 246, 0.10);
    border: 1px solid rgba(59, 130, 246, 0.18);
    color: rgba(30, 64, 175, 0.92);
    white-space: nowrap;
  }
  :global(.rp__title) { margin-top: 10px; font-size: 14px; font-weight: 850; color: #0f172a; letter-spacing: -0.02em; }
  :global(.rp__subtitle) { margin-top: 2px; font-size: 12px; color: rgba(15, 23, 42, 0.60); }
  :global(.rp__metrics) {
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  :global(.rp__m) {
    padding: 10px 10px; border-radius: 14px;
    background: rgba(15, 23, 42, 0.03);
    border: 1px solid rgba(15, 23, 42, 0.06);
  }
  :global(.rp__k) { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(15, 23, 42, 0.56); }
  :global(.rp__v) { margin-top: 6px; font-size: 12px; font-weight: 850; color: rgba(15, 23, 42, 0.88); }
  :global(.rp__foot) { margin-top: 10px; font-size: 10px; color: rgba(15, 23, 42, 0.50); }

  :global(.leaflet-control-zoom) {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    margin: 0 14px 14px 0 !important;
  }
  :global(.leaflet-control-zoom a) {
    border: none !important;
    border-radius: 14px !important;
    width: 40px !important;
    height: 40px !important;
    line-height: 40px !important;
    background: rgba(255, 255, 255, 0.78) !important;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 16px 44px rgba(15, 23, 42, 0.12);
    color: #0f172a !important;
  }
  :global(.leaflet-control-zoom a:hover) { background: rgba(255, 255, 255, 0.92) !important; }
</style>
