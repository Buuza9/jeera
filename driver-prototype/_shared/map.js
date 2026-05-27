// Leaflet + OpenStreetMap helper for the driver-prototype.
// Pages call `JeeraMap.create('mapElId', { center, zoom, onReady(map, L) })`
// and use the L/L.polyline/L.marker APIs inside the onReady callback.
//
// Free, no API key (OSM tiles + CartoDB Voyager dark tiles). The RN port
// can swap the tile source for whatever the production app uses without
// changing any feature code.

(function () {
  // Approximate centroids of Tripoli landmarks used across the prototype.
  // Keep here so every page references the same coords.
  const TRIPOLI = {
    center:    [32.8872, 13.1813],
    andalus:   [32.8615, 13.1497],
    gargaresh: [32.8467, 13.1158],
    souqJuma:  [32.8964, 13.2126],
    oldCity:   [32.8990, 13.1797],
  };

  // Tile sources — both free, no API key.
  const TILES_LIGHT =
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const TILES_DARK =
    "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png";
  const ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

  // ── One-time Leaflet bootstrap ────────────────────────────────────
  let leafletPromise = null;
  function ensureLeaflet() {
    if (leafletPromise) return leafletPromise;
    if (window.L) return (leafletPromise = Promise.resolve(window.L));

    leafletPromise = new Promise((resolve) => {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(css);

      const style = document.createElement("style");
      style.textContent = `
        .leaflet-container { background: #cfe7ea; font-family: inherit; }
        .leaflet-control-attribution {
          font-size: 9px; padding: 1px 5px;
          background: rgba(255,255,255,.65) !important;
        }
        [data-theme="dark"] .leaflet-container { background: #131a26; }
        [data-theme="dark"] .leaflet-control-attribution {
          background: rgba(17,24,39,.7) !important;
          color: #cbd5e1 !important;
        }
        [data-theme="dark"] .leaflet-control-attribution a { color: #93c5fd !important; }

        /* Brand-styled pins (rendered via L.divIcon) */
        .jm-pin { position: relative; display: inline-flex; }
        .jm-pin-driver {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--brand-500); color: white;
          box-shadow: 0 0 0 4px oklch(from var(--brand-500) l c h / .25), 0 6px 14px oklch(from var(--brand-500) l c h / .45);
          align-items: center; justify-content: center;
        }
        .jm-pin-driver.pulse::before {
          content: ""; position: absolute; inset: -10px;
          border-radius: 50%; border: 2px solid var(--brand-500);
          animation: jm-pulse 1.8s ease-out infinite;
          pointer-events: none;
        }
        @keyframes jm-pulse {
          0%   { transform: scale(.6); opacity: .8; }
          100% { transform: scale(1.7); opacity: 0;  }
        }
        .jm-pin-driver svg { width: 20px; height: 20px; }

        .jm-pin-rider, .jm-pin-dest {
          width: 36px; height: 36px; border-radius: 50%;
          background: white; color: var(--danger);
          box-shadow: 0 0 0 3px var(--danger), 0 6px 14px oklch(from var(--danger) l c h / .45);
          align-items: center; justify-content: center;
        }
        .jm-pin-rider::after, .jm-pin-dest::after {
          content: ""; position: absolute; bottom: -6px; left: 50%;
          width: 10px; height: 10px; background: var(--danger);
          transform: translateX(-50%) rotate(45deg);
          border-bottom-right-radius: 2px;
        }
        .jm-pin-rider svg, .jm-pin-dest svg { width: 18px; height: 18px; }
        .jm-pin-rider .lbl, .jm-pin-dest .lbl {
          position: absolute; top: -22px; left: 50%;
          transform: translateX(-50%);
          padding: 3px 8px;
          background: white; color: var(--danger);
          border-radius: 999px;
          font-size: 10.5px; font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(15,23,42,.18);
        }
        [data-theme="dark"] .jm-pin-rider .lbl,
        [data-theme="dark"] .jm-pin-dest .lbl { background: #1f2937; }

        /* Route polyline animates in (draws on screen) */
        .leaflet-overlay-pane svg path.jm-route {
          stroke-dasharray: 1600;
          stroke-dashoffset: 1600;
          animation: jm-draw 1.4s ease-out .2s forwards;
        }
        @keyframes jm-draw { to { stroke-dashoffset: 0; } }
      `;
      document.head.appendChild(style);

      const s = document.createElement("script");
      s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.onload = () => resolve(window.L);
      document.head.appendChild(s);
    });
    return leafletPromise;
  }

  // ── Pin HTML factory ──────────────────────────────────────────────
  function pinHtml(kind, opts = {}) {
    // GPS-arrow chevron: top-down view that rotates to face direction of
    // travel (standard navigation-app shape). Replaces the side-view bike
    // because that didn't read well at non-cardinal headings.
    const NAV_ARROW = `<svg viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1.5" stroke-linejoin="round">
      <path d="M12 4 L19 19 L12 15.5 L5 19 Z"/></svg>`;
    const PERSON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`;
    const FLAG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12l4 4 10-10"/></svg>`;

    if (kind === "driver") {
      const pulseCls = opts.pulse ? " pulse" : "";
      return `<div class="jm-pin jm-pin-driver${pulseCls}">${NAV_ARROW}</div>`;
    }
    const cls = kind === "dest" ? "jm-pin-dest" : "jm-pin-rider";
    const svg = kind === "dest" ? FLAG : PERSON;
    const lbl = opts.label ? `<span class="lbl">${opts.label}</span>` : "";
    return `<div class="jm-pin ${cls}">${lbl}${svg}</div>`;
  }

  // ── Geometry helpers ──────────────────────────────────────────────
  // Returns the latlng at parameter t ∈ [0,1] along a polyline, treating
  // the polyline as straight Euclidean segments in lat/lng space. Fine for
  // city-scale routes — Tripoli sits at ~33°N so the lat/lng distortion is
  // small. Not for trans-continental routes, which we don't need here.
  function pointAtT(waypoints, t) {
    if (t <= 0) return waypoints[0];
    if (t >= 1) return waypoints[waypoints.length - 1];
    const lens = [];
    let total = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const a = waypoints[i], b = waypoints[i + 1];
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      lens.push(d);
      total += d;
    }
    let target = total * t;
    for (let i = 0; i < lens.length; i++) {
      if (target <= lens[i]) {
        const a = waypoints[i], b = waypoints[i + 1];
        const f = target / lens[i];
        return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
      }
      target -= lens[i];
    }
    return waypoints[waypoints.length - 1];
  }

  // Bearing in degrees (0 = up, 90 = right). Use to rotate the bike pin
  // so it faces direction of travel — same trick navigation apps use.
  function bearing(from, to) {
    const dy = to[0] - from[0];
    const dx = to[1] - from[1];
    return (Math.atan2(dx, dy) * 180) / Math.PI;
  }

  // ── Public API ────────────────────────────────────────────────────
  window.JeeraMap = {
    TRIPOLI,

    create(elId, opts = {}) {
      return ensureLeaflet().then((L) => {
        const center = opts.center || TRIPOLI.center;
        const zoom = opts.zoom || 13;
        const map = L.map(elId, {
          center, zoom,
          zoomControl: false,
          attributionControl: true,
          dragging: opts.interactive === true,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          touchZoom: false,
          keyboard: false,
          tap: false,
          boxZoom: false,
        });

        const theme =
          document.documentElement.getAttribute("data-theme") || "light";
        const tileUrl = theme === "dark" ? TILES_DARK : TILES_LIGHT;
        const tiles = L.tileLayer(tileUrl, {
          maxZoom: 19,
          attribution: ATTRIBUTION,
        }).addTo(map);

        // Re-skin tiles when the user toggles theme. Cheap to swap layers.
        const observer = new MutationObserver(() => {
          const next =
            document.documentElement.getAttribute("data-theme") || "light";
          tiles.setUrl(next === "dark" ? TILES_DARK : TILES_LIGHT);
        });
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["data-theme"],
        });

        if (opts.onReady) opts.onReady(map, L);
        return { map, L };
      });
    },

    pin(L, latlng, kind, opts = {}) {
      const icon = L.divIcon({
        className: "",
        html: pinHtml(kind, opts),
        iconSize: [40, 40],
        iconAnchor: [20, kind === "driver" ? 20 : 36],
      });
      return L.marker(latlng, { icon, interactive: false, keyboard: false });
    },

    route(L, waypoints, opts = {}) {
      return L.polyline(waypoints, {
        color: "oklch(0.54 0.105 150)",
        weight: 5,
        opacity: 0.92,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
        className: "jm-route",
        ...opts,
      });
    },

    pointAtT,
    bearing,

    // Smoothly drive a marker along a polyline over `durationMs`. Rotates
    // the marker icon to face direction of travel and (optionally) pans
    // the map to keep the marker in view. Returns a cancel function.
    animateAlong(marker, waypoints, opts = {}) {
      const dur = opts.durationMs || 10000;
      const map = opts.map || null;
      const start = performance.now();
      let raf;
      let last = waypoints[0];

      function applyHeading(latlng) {
        const el = marker.getElement && marker.getElement();
        const inner = el && el.querySelector('.jm-pin-driver');
        if (!inner) return;
        // Lead with a tiny look-ahead so we don't divide by zero at the
        // very start.
        const lead = pointAtT(waypoints, Math.min(1, (performance.now() - start) / dur + 0.01));
        const deg = bearing([latlng[0], latlng[1]], lead);
        inner.style.transform = `rotate(${deg}deg)`;
      }

      function step(now) {
        const t = Math.min(1, (now - start) / dur);
        const p = pointAtT(waypoints, t);
        marker.setLatLng(p);
        applyHeading(p);
        if (map && opts.follow !== false) {
          // Gentle pan — don't fight Leaflet inertia.
          map.panTo(p, { animate: true, duration: 0.4, noMoveStart: true });
        }
        if (opts.onUpdate) opts.onUpdate(t);
        last = p;
        if (t < 1) {
          raf = requestAnimationFrame(step);
        } else if (opts.onDone) {
          opts.onDone();
        }
      }
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    },
  };
})();
