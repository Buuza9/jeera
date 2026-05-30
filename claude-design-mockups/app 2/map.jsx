/* Geera — stylized SVG map.

   Not a real tile map — a hand-laid abstract street grid of Tripoli
   styled to feel like a clean cartographic illustration. Three
   styles: light, dark, satellite-ish (warm sand). All driven by
   the design tokens so palette swaps cascade.

   Exposes <GeeraMap variant="full|trip|pickup|inTrip" /> with
   different overlays. */

function GeeraMap({ variant = "full", style = "light", animate = false, showRoute = true }) {
  // Coordinate space: 440 x 956 phone, but we draw at 440x800 then
  // clip — that lets the map fill the screen behind overlays.
  const W = 440, H = 956;

  // Tile-style background (warm cream w/ subtle blocks)
  return (
    <svg className="geera-map" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <pattern id="map-grid" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
          <rect width="56" height="56" fill="var(--map-block)"/>
          <rect x="0" y="0" width="56" height="2" fill="var(--map-road)" opacity="0.6"/>
          <rect x="0" y="0" width="2" height="56" fill="var(--map-road)" opacity="0.6"/>
        </pattern>
        <linearGradient id="map-dim" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(20,18,12,0)"/>
          <stop offset="100%" stopColor="rgba(20,18,12,.25)"/>
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2"/>
        </filter>
      </defs>

      {/* Base */}
      <rect width={W} height={H} fill="var(--map-bg)"/>
      <rect width={W} height={H} fill="url(#map-grid)" opacity="0.55"/>

      {/* Mediterranean (top) */}
      <path d={`M 0 0 L ${W} 0 L ${W} 130 Q ${W*.7} 170 ${W*.45} 150 Q ${W*.2} 130 0 160 Z`}
            fill="var(--map-water)"/>
      <path d={`M 0 160 Q ${W*.2} 130 ${W*.45} 150 Q ${W*.7} 170 ${W} 130`}
            fill="none" stroke="var(--map-water)" strokeWidth="1" opacity="0.6"/>

      {/* Major arterials (Gargaresh St, Airport Rd, Coastal Rd) */}
      <g stroke="var(--map-road)" strokeLinecap="round" fill="none">
        <path d="M -10 200 Q 120 240 260 280 Q 360 310 470 360" strokeWidth="14"/>
        <path d="M 60 0 L 60 956" strokeWidth="9" opacity="0.85"/>
        <path d="M 250 0 L 250 956" strokeWidth="9" opacity="0.85"/>
        <path d="M 380 0 L 380 956" strokeWidth="9" opacity="0.85"/>
        <path d="M 0 480 L 440 480" strokeWidth="9" opacity="0.85"/>
        <path d="M 0 700 L 440 700" strokeWidth="9" opacity="0.85"/>
      </g>
      <g stroke="var(--map-bg)" strokeLinecap="round" fill="none" opacity="0.5">
        <path d="M -10 200 Q 120 240 260 280 Q 360 310 470 360" strokeWidth="2"/>
      </g>

      {/* Secondary streets */}
      <g stroke="var(--map-road)" strokeWidth="4" strokeLinecap="round" opacity="0.75" fill="none">
        <path d="M 0 320 L 440 320"/>
        <path d="M 0 400 L 440 400"/>
        <path d="M 0 560 L 440 560"/>
        <path d="M 0 620 L 440 620"/>
        <path d="M 0 800 L 440 800"/>
        <path d="M 0 880 L 440 880"/>
        <path d="M 140 160 L 140 956"/>
        <path d="M 320 160 L 320 956"/>
        <path d="M 200 160 L 200 956"/>
      </g>

      {/* A park / green block */}
      <rect x="270" y="500" width="120" height="120" rx="6" fill="var(--map-park)" opacity="0.7"/>
      <rect x="70" y="720" width="100" height="80" rx="6" fill="var(--map-park)" opacity="0.55"/>

      {/* Labels */}
      <g fontFamily="var(--font-mono)" fontSize="9" fill="var(--text-faint)" opacity="0.7" letterSpacing="0.06em">
        <text x="22" y="100">TRIPOLI · MEDITERRANEAN</text>
        <text x="22" y="280" transform="rotate(-12 22 280)">GARGARESH ST</text>
        <text x="280" y="588" textAnchor="middle">PARK</text>
        <text x="22" y="475">SHARIA AL-FATEH</text>
      </g>

      {/* Route polyline (if showRoute) */}
      {showRoute && (
        <g>
          <path
            d="M 95 720 C 130 660, 180 600, 230 540 S 320 420, 360 340"
            stroke="var(--brand-600)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            opacity="0.25"
            strokeDasharray={animate ? "1200" : ""}
            strokeDashoffset={animate ? "0" : ""}
          />
          <path
            d="M 95 720 C 130 660, 180 600, 230 540 S 320 420, 360 340"
            stroke="var(--brand-600)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            style={animate ? { animation: "draw-stroke 1.6s var(--ease-out) both", "--len": "1200" } : null}
            strokeDasharray={animate ? "1200" : ""}
          />
        </g>
      )}

      {/* Subtle dim for overlays */}
      {variant === "request" && <rect width={W} height={H} fill="url(#map-dim)" opacity="0.7"/>}
    </svg>
  );
}

/* Map pin component (driver / pickup / dest) */
function MapPin({ x, y, kind = "driver", label, pulse = false }) {
  const stl = { position: "absolute", insetInlineStart: x, top: y, transform: "translate(-50%, -50%)", zIndex: 5 };
  if (kind === "driver") {
    return (
      <div style={stl}>
        <div style={{ position: "relative" }}>
          <div className={pulse ? "pin-pulse" : ""} style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "var(--brand-600)",
            border: "3px solid var(--bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 16px rgba(20,18,12,.28)",
            color: "var(--text-onbrand)",
            position: "relative",
          }}>
            {/* Stylized "dart" — kite shape with a folded crease,
                feels like a paper plane viewed top-down. The lighter
                left half gives subtle 3D depth without iconography slop. */}
            <svg width="22" height="22" viewBox="0 0 32 32" style={{ transform: "rotate(-12deg)" }}>
              {/* Right (darker) half */}
              <path d="M16 3 L27 27 L16 22 Z"
                    fill="currentColor"
                    opacity="0.95"/>
              {/* Left (lighter) half — the paper fold */}
              <path d="M16 3 L5 27 L16 22 Z"
                    fill="currentColor"
                    opacity="0.55"/>
              {/* Centre crease highlight */}
              <path d="M16 3 L16 22"
                    stroke="var(--bg)" strokeWidth="0.6"
                    opacity="0.45"/>
            </svg>
            {/* Subtle accent tail dot — saffron, reads as a route trail */}
            {pulse && (
              <div style={{
                position: "absolute", bottom: -2, insetInlineStart: "50%",
                transform: "translateX(-50%)",
                width: 4, height: 4, borderRadius: "50%",
                background: "var(--accent-500)",
                boxShadow: "0 0 0 2px var(--bg)",
              }}/>
            )}
          </div>
        </div>
      </div>
    );
  }
  if (kind === "pickup") {
    return (
      <div style={stl}>
        <div style={{
          padding: "6px 10px", borderRadius: 999,
          background: "var(--brand-600)", color: "var(--text-onbrand)",
          fontSize: 11, fontWeight: 700, letterSpacing: ".02em",
          boxShadow: "var(--shadow-sm)",
          whiteSpace: "nowrap",
        }}>
          {label || "Pickup"}
        </div>
        <div style={{
          width: 14, height: 14, borderRadius: "50%",
          background: "var(--brand-600)",
          border: "3px solid var(--bg)",
          margin: "4px auto 0",
          boxShadow: "0 4px 10px rgba(20,18,12,.25)",
        }}/>
      </div>
    );
  }
  if (kind === "dest") {
    return (
      <div style={stl}>
        <div style={{
          padding: "6px 10px", borderRadius: 999,
          background: "var(--text)", color: "var(--bg)",
          fontSize: 11, fontWeight: 700, letterSpacing: ".02em",
          boxShadow: "var(--shadow-sm)",
          whiteSpace: "nowrap",
        }}>
          {label || "Drop-off"}
        </div>
        <div style={{
          width: 14, height: 14, borderRadius: "50%",
          background: "var(--terra-500)",
          border: "3px solid var(--bg)",
          margin: "4px auto 0",
          boxShadow: "0 4px 10px rgba(20,18,12,.25)",
        }}/>
      </div>
    );
  }
  return null;
}

window.GeeraMap = GeeraMap;
window.MapPin = MapPin;
