/* Geera — shared UI primitives.

   PhoneFrame wraps every screen in the iPhone 17 Pro Max shell.
   StatusBar + HomeIndicator are auto-injected; navbar is opt-in
   per screen. AppBar handles back + title + trailing actions. */

const { useState, useEffect, useRef, useLayoutEffect, useMemo } = React;

/* ── Status bar (9:41 + signal/wifi/battery) ─────────────────── */
function StatusBar() {
  return (
    <div className="status-bar">
      <span className="sb-time">9:41</span>
      <span className="sb-right">
        {/* signal */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="5" y="6" width="3" height="6" rx="0.5"/><rect x="10" y="3" width="3" height="9" rx="0.5"/><rect x="15" y="0" width="3" height="12" rx="0.5"/></svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 11.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zM3.5 7.1l1.4 1.4a4.4 4.4 0 0 1 6.2 0l1.4-1.4a6.4 6.4 0 0 0-9 0zM.6 4.2l1.4 1.5a8.4 8.4 0 0 1 12 0l1.4-1.5a10.4 10.4 0 0 0-14.8 0z"/></svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" opacity="0.5"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor"/><rect x="23.5" y="4" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.5"/></svg>
      </span>
    </div>
  );
}

/* ── Phone frame ─────────────────────────────────────────────── */
function PhoneFrame({ children, navItem, onNav, fluid = false }) {
  return (
    <div className="phone">
      <StatusBar/>
      {children}
      {navItem && <Navbar active={navItem} onNav={onNav}/>}
      <div className="home-indicator"/>
    </div>
  );
}

/* Auto-fit phone scale (preserves 440x956 coordinates) */
function useFitPhone() {
  useLayoutEffect(() => {
    function fit() {
      const W = window.innerWidth, H = window.innerHeight;
      const pad = 32;
      const sx = (W - pad) / 440;
      const sy = (H - pad) / 956;
      const s = Math.min(1, Math.min(sx, sy));
      document.documentElement.style.setProperty("--phone-scale", String(s));
    }
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
}

/* ── Bottom navbar ───────────────────────────────────────────── */
function Navbar({ active, onNav }) {
  const items = [
    { id: "dashboard",    lbl: t("nav.home"),    icon: Ic.home },
    { id: "history",      lbl: t("nav.trips"),   icon: Ic.history },
    { id: "earnings",     lbl: t("nav.earn"),    icon: Ic.wallet },
    { id: "profile",      lbl: t("nav.profile"), icon: Ic.user },
  ];
  return (
    <nav className="navbar">
      {items.map(it => {
        const Icon = it.icon;
        return (
          <button key={it.id} className={"nav-item" + (active === it.id ? " on" : "")} onClick={() => onNav(it.id)}>
            <Icon size={22}/>
            <span className="lbl">{it.lbl}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ── AppBar (top header) ─────────────────────────────────────── */
function AppBar({ title, onBack, trailing, subtitle }) {
  return (
    <div className="appbar">
      {onBack && (
        <button className="ab-btn" onClick={onBack} aria-label="Back">
          <Ic.arrowLeft size={20}/>
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="ab-title">{title}</div>
        {subtitle && <div className="micro" style={{ marginTop: 2 }}>{subtitle}</div>}
      </div>
      {trailing}
    </div>
  );
}

/* ── Segmented control ───────────────────────────────────────── */
function Segmented({ options, value, onChange }) {
  return (
    <div className="segment">
      {options.map(o => (
        <button key={o.value}
                className={value === o.value ? "on" : ""}
                onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ── Field group ─────────────────────────────────────────────── */
function Field({ label, hint, prefix, type = "text", value, onChange, placeholder, dir }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {prefix
        ? (
          <div className="field-prefix">
            <span className="pfx">{prefix}</span>
            <input type={type} value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} dir={dir}/>
          </div>
        )
        : <input type={type} value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} dir={dir}/>}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

/* ── Upload tile (placeholder for KYC photos) ────────────────── */
function UploadTile({ title, sub, done = false, onClick }) {
  return (
    <button onClick={onClick} className="card" style={{
      width: "100%", display: "flex", gap: 12, alignItems: "center",
      cursor: "pointer", textAlign: "start",
      borderStyle: done ? "solid" : "dashed",
      borderColor: done ? "var(--brand-500)" : "var(--border)",
      background: done ? "var(--brand-50)" : "var(--surface)",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: done ? "var(--brand-600)" : "var(--surface-2)",
        color: done ? "var(--text-onbrand)" : "var(--text-muted)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {done ? <Ic.check size={20}/> : <Ic.upload size={20}/>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: done ? "var(--brand-700)" : "var(--text)" }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>
      </div>
    </button>
  );
}

/* ── Switch (used by Tweaks too) ─────────────────────────────── */
function Switch({ on, onChange }) {
  return (
    <button
      role="switch" aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 50, height: 30, borderRadius: 999, border: 0, padding: 0,
        background: on ? "var(--brand-600)" : "var(--surface-3)",
        position: "relative", cursor: "pointer",
        transition: "background .2s",
      }}>
      <span style={{
        position: "absolute", top: 3, left: on ? 23 : 3,
        width: 24, height: 24, borderRadius: "50%",
        background: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,.2)",
        transition: "left .2s var(--ease-out)",
      }}/>
    </button>
  );
}

/* ── Pulse driver dot wrapper for online toggle (variant) ────── */
function GoToggle({ on, onClick, variant = "pill" }) {
  // variant: pill (default), bar, switch
  if (variant === "switch") {
    return (
      <div onClick={onClick} style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 16px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)",
        cursor: "pointer",
        boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{
          width: 12, height: 12, borderRadius: "50%",
          background: on ? "var(--brand-500)" : "var(--text-faint)",
          boxShadow: on ? "0 0 0 4px oklch(from var(--brand-500) l c h / .25)" : "",
          animation: on ? "pulse-ring 2s var(--ease-out) infinite" : "",
        }}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            {on ? t("dash.online.on") : t("dash.online")}
          </div>
          <div className="small" style={{ fontSize: 12, marginTop: 1 }}>
            {on ? t("dash.online.lstn") : t("dash.online.tap")}
          </div>
        </div>
        <Switch on={on} onChange={onClick}/>
      </div>
    );
  }
  if (variant === "bar") {
    return (
      <button onClick={onClick} style={{
        width: "100%", padding: "16px 18px",
        background: on ? "var(--brand-600)" : "var(--surface)",
        color: on ? "var(--text-onbrand)" : "var(--text)",
        border: on ? "0" : "1px solid var(--border)",
        borderRadius: "var(--r-lg)",
        fontSize: 16, fontWeight: 700, fontFamily: "inherit",
        cursor: "pointer",
        boxShadow: on ? "0 12px 28px oklch(from var(--brand-600) l c h / .35)" : "var(--shadow-sm)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        transition: "all .25s var(--ease-out)",
      }}>
        <span style={{
          width: 10, height: 10, borderRadius: "50%",
          background: on ? "white" : "var(--text-faint)",
          animation: on ? "pulse-ring 2s var(--ease-out) infinite" : "",
        }}/>
        {on ? t("dash.online.on") : t("dash.online")}
      </button>
    );
  }
  // Default: pill (floating)
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      padding: "11px 18px",
      background: on ? "var(--brand-600)" : "var(--surface)",
      color: on ? "var(--text-onbrand)" : "var(--text)",
      border: on ? "0" : "1px solid var(--border)",
      borderRadius: 999,
      fontSize: 14, fontWeight: 700, fontFamily: "inherit",
      cursor: "pointer",
      boxShadow: on ? "0 10px 24px oklch(from var(--brand-600) l c h / .35)" : "var(--shadow-sm)",
      letterSpacing: "-0.01em",
      transition: "all .25s var(--ease-out)",
    }}>
      <span style={{
        width: 9, height: 9, borderRadius: "50%",
        background: on ? "white" : "var(--text-faint)",
        animation: on ? "pulse-ring 2s var(--ease-out) infinite" : "",
      }}/>
      {on ? t("dash.online.on") : t("dash.online")}
    </button>
  );
}

/* ── Animated check ring (used in success states) ───────────── */
function CheckRing({ size = 96 }) {
  const r = size * 0.42;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <circle cx={size/2} cy={size/2} r={r}
              fill="none" stroke="var(--brand-100)" strokeWidth={size*0.06}/>
      <circle cx={size/2} cy={size/2} r={r}
              fill="none" stroke="var(--brand-600)" strokeWidth={size*0.06}
              strokeLinecap="round"
              transform={`rotate(-90 ${size/2} ${size/2})`}
              strokeDasharray={c}
              style={{ animation: `draw-stroke 0.9s var(--ease-out) both`, "--len": c }}/>
      <path d={`M ${size*0.32} ${size*0.52} L ${size*0.45} ${size*0.65} L ${size*0.70} ${size*0.38}`}
            fill="none" stroke="var(--brand-600)" strokeWidth={size*0.07}
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="80"
            style={{ animation: "draw-stroke .35s .7s var(--ease-out) both", "--len": "80" }}/>
    </svg>
  );
}

/* ── Countdown ring (auto-decline) ───────────────────────────── */
function CountdownRing({ remaining, total = 15, size = 56 }) {
  const r = size * 0.42;
  const c = 2 * Math.PI * r;
  const pct = remaining / total;
  const low = remaining <= 7 && remaining > 3;
  const crit = remaining <= 3;
  const stroke = crit ? "var(--danger)" : low ? "var(--accent-600)" : "var(--brand-600)";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={size * 0.075}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={stroke} strokeWidth={size*0.075}
                strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
                strokeDasharray={c}
                strokeDashoffset={c * (1 - pct)}
                style={{ transition: "stroke-dashoffset .9s linear, stroke .25s" }}/>
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: size*0.32, fontWeight: 700, color: "var(--text)",
        fontVariantNumeric: "tabular-nums",
      }}>{remaining}</div>
    </div>
  );
}

/* ── Bottom sheet ────────────────────────────────────────────── */
function BottomSheet({ children, dim = false, style = "rounded" }) {
  const rounded = style === "rounded" ? 28 : style === "soft" ? 36 : style === "card" ? 18 : 28;
  return (
    <>
      {dim && <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        background: "linear-gradient(180deg, rgba(20,18,12,0) 0%, rgba(20,18,12,.4) 100%)",
      }}/>}
      <div style={{
        position: "absolute", insetInlineStart: 0, insetInlineEnd: 0, bottom: 0,
        background: "var(--bg)",
        borderRadius: `${rounded}px ${rounded}px 0 0`,
        padding: "8px 22px 30px",
        boxShadow: "0 -16px 40px rgba(20,18,12,.18)",
        zIndex: 20,
        animation: "sheet-up .42s var(--ease-spring) both",
      }}>
        <div style={{
          width: 44, height: 5, borderRadius: 999,
          background: "var(--surface-3)",
          margin: "4px auto 10px",
        }}/>
        {children}
      </div>
    </>
  );
}

function RouteSpinner({ size = 28 }) {
  return (
    <span className="route-spinner" style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r="13"/>
      </svg>
    </span>
  );
}

window.RouteSpinner = RouteSpinner;
window.PhoneFrame = PhoneFrame;
window.useFitPhone = useFitPhone;
window.Navbar = Navbar;
window.AppBar = AppBar;
window.Segmented = Segmented;
window.Field = Field;
window.UploadTile = UploadTile;
window.Switch = Switch;
window.GoToggle = GoToggle;
window.CheckRing = CheckRing;
window.CountdownRing = CountdownRing;
window.BottomSheet = BottomSheet;
