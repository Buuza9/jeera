/* Geera — logo + identity components.

   Three logo variants:
   - "mark"     → the route-J monogram (default, on brand square)
   - "wordmark" → custom "geera" lettering
   - "lockup"   → mark + wordmark side by side
   - "ar"       → Arabic wordmark "جيرا"

   All variants accept size + tone props. */

function GeeraLogo({ variant = "lockup", size = 64, tone = "brand", arabic = false }) {
  // Map color tokens to actual usage
  const bgFill   = tone === "brand"   ? "var(--brand-600)"
                 : tone === "dark"    ? "var(--text)"
                 : tone === "light"   ? "var(--bg)"
                 : tone === "outline" ? "transparent"
                 : "var(--brand-600)";
  const fgFill   = tone === "brand"   ? "var(--text-onbrand)"
                 : tone === "dark"    ? "var(--bg)"
                 : tone === "light"   ? "var(--brand-600)"
                 : tone === "outline" ? "var(--brand-600)"
                 : "var(--text-onbrand)";
  const dotFill  = tone === "brand"   ? "var(--accent-500)"
                 : tone === "outline" ? "var(--accent-600)"
                 : "var(--accent-500)";
  const stroke   = tone === "outline" ? "var(--brand-600)" : "none";

  // The mark — viewBox 80x80. A geometric J where the bottom hook
  // curves like a road, and the top of the J is a saffron "origin"
  // dot — a pin on a route.
  const Mark = ({ s = size }) => (
    <svg width={s} height={s} viewBox="0 0 80 80" aria-label="Djera">
      <rect x="0" y="0" width="80" height="80" rx="22"
            fill={bgFill}
            stroke={stroke} strokeWidth={tone === "outline" ? "2" : "0"}/>
      {tone === "brand" && (
        <rect x="1.5" y="1.5" width="77" height="77" rx="20.5"
              fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="1"/>
      )}
      {/* Dart — folded-paper kite, the brand's primary shape.
          The same form is used for the driver pin on the map. */}
      <g transform="rotate(-12 40 40)">
        <path d="M40 18 L58 60 L40 51 Z" fill={fgFill} opacity="0.98"/>
        <path d="M40 18 L22 60 L40 51 Z" fill={fgFill} opacity="0.55"/>
        <path d="M40 18 L40 51" stroke={bgFill} strokeWidth="0.7" opacity={tone === "brand" ? 0.45 : 0.25}/>
      </g>
      {/* Saffron origin dot — pickup pin reference */}
      <circle cx="64" cy="16" r="5" fill={dotFill}/>
      {tone === "brand" && (
        <circle cx="64" cy="16" r="5" fill="none"
                stroke="rgba(255,255,255,.18)" strokeWidth="1"/>
      )}
    </svg>
  );

  // Wordmark — "geera" lowercase, custom-letterspaced.
  // Display font; letter forms slightly modified via tracking/kerning.
  const Wordmark = ({ s = size }) => (
    <span style={{
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      fontSize: s * 0.62,
      letterSpacing: "-0.04em",
      color: tone === "brand" ? "var(--text)" :
             tone === "dark"  ? "var(--text)" :
             tone === "light" ? "var(--bg)"   : "var(--text)",
      lineHeight: 1,
      display: "inline-flex",
      alignItems: "center",
      gap: 0,
    }}>
      {/* "g" with custom dot accent above */}
      <span style={{ position: "relative", display: "inline-block" }}>djera</span>
    </span>
  );

  const ArabicMark = ({ s = size }) => (
    <span style={{
      fontFamily: "var(--font-ar)",
      fontWeight: 700,
      fontSize: s * 0.72,
      letterSpacing: "0",
      color: "var(--text)",
      lineHeight: 1,
      direction: "rtl",
    }}>جيرا</span>
  );

  if (arabic || variant === "ar") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.18 }}>
        <Mark/>
        <ArabicMark/>
      </span>
    );
  }
  if (variant === "mark") return <Mark/>;
  if (variant === "wordmark") return <Wordmark s={size * 1.6}/>;

  // lockup
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.22 }}>
      <Mark/>
      <Wordmark/>
    </span>
  );
}

window.GeeraLogo = GeeraLogo;
