/* Geera — driving screens.
   dashboard (map + online toggle) →
   ride-request (incoming) →
   to-pickup → in-trip → trip-complete */

/* ── Dashboard ───────────────────────────────────────────────── */
function ScreenDashboard({ go, onNav, online, setOnline, toggleVariant }) {
  // Mock incoming request 3s after going online
  useEffect(() => {
    if (!online) return;
    const id = setTimeout(() => {
      if (window.__geera_online) go("rideRequest");
    }, 3000);
    return () => clearTimeout(id);
  }, [online]);

  return (
    <div className="screen flush has-nav screen-in" style={{ position: "relative", overflow: "hidden" }}>
      {/* Map fills the screen */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <GeeraMap variant="full" showRoute={false}/>
        {/* Driver pin centered */}
        <MapPin x="50%" y="55%" kind="driver" pulse={online}/>
      </div>

      {/* Top overlay */}
      <div style={{
        position: "absolute", top: 64, insetInlineStart: 16, insetInlineEnd: 16,
        zIndex: 10, display: "flex", alignItems: "center", gap: 10,
      }}>
        <button className="fab" onClick={() => onNav("profile")} style={{
          background: "var(--brand-600)", color: "var(--text-onbrand)",
          fontWeight: 700, fontSize: 14, border: 0,
        }}>AM</button>
        <div style={{ flex: 1, textAlign: "center" }}>
          {toggleVariant === "pill" && <GoToggle on={online} onClick={() => setOnline(!online)} variant="pill"/>}
        </div>
        <button className="fab" aria-label="Notifications" style={{ position: "relative" }}>
          <Ic.bell size={20}/>
          <span style={{
            position: "absolute", top: 8, insetInlineEnd: 10,
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--accent-600)", border: "2px solid var(--bg)",
          }}/>
        </button>
      </div>

      {/* Greeting card (top, below status) */}
      {toggleVariant !== "pill" && (
        <div style={{ position: "absolute", top: 120, insetInline: 16, zIndex: 10 }}>
          <div className="card card-elev" style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="eyebrow" style={{ marginBottom: 2 }}>Tripoli · 26°</div>
                <h2 className="h2" style={{ fontSize: 20 }}>{t("dash.greet")}</h2>
              </div>
            </div>
            {toggleVariant === "switch" && <GoToggle on={online} onClick={() => setOnline(!online)} variant="switch"/>}
            {toggleVariant === "bar"    && <GoToggle on={online} onClick={() => setOnline(!online)} variant="bar"/>}
          </div>
        </div>
      )}

      {/* Map controls (start side) */}
      <div style={{
        position: "absolute", top: 130, insetInlineEnd: 16,
        zIndex: 10, display: "flex", flexDirection: "column", gap: 8,
      }}>
        <button className="fab"><Ic.layers/></button>
        <button className="fab"><Ic.navigation/></button>
      </div>

      {/* Bottom dock: today + commission */}
      <div style={{
        position: "absolute", insetInline: 16, bottom: 100,
        zIndex: 10,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)",
        boxShadow: "var(--shadow-md)",
        backdropFilter: "blur(8px)",
        display: "flex",
        overflow: "hidden",
      }}>
        <button onClick={() => onNav("earnings")} style={{
          flex: 1, padding: "14px 16px", border: 0, background: "transparent",
          color: "var(--text)", textAlign: "start", cursor: "pointer",
          fontFamily: "inherit",
        }}>
          <div className="eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>{t("dash.today")}</div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
            <span className="tabular">320</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginInlineStart: 4, fontWeight: 600 }}>{t("unit.currency")}</span>
          </div>
          <div className="micro" style={{ marginTop: 2 }}>15 {t("dash.trips")} · 6{t("unit.hr")}</div>
        </button>
        <div style={{ width: 1, background: "var(--border)" }}/>
        <button onClick={() => go("commission")} style={{
          flex: 1, padding: "14px 16px", border: 0, background: "transparent",
          color: "var(--text)", textAlign: "start", cursor: "pointer",
          fontFamily: "inherit",
        }}>
          <div className="eyebrow" style={{ fontSize: 10, marginBottom: 4, color: "var(--accent-700)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{t("dash.commission")}</span>
            <Ic.arrowRight size={12}/>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--accent-700)" }}>
            <span className="tabular">48</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginInlineStart: 4, fontWeight: 600 }}>{t("unit.currency")}</span>
          </div>
          <div className="micro" style={{ marginTop: 2 }}>{t("dash.due")}</div>
        </button>
      </div>
    </div>
  );
}

/* ── Ride request ────────────────────────────────────────────── */
function ScreenRideRequest({ go, back, sheetStyle = "rounded" }) {
  const [remaining, setRemaining] = useState(15);
  useEffect(() => {
    if (remaining <= 0) { back(); return; }
    const id = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  return (
    <div className="screen flush screen-in" style={{ position: "relative", overflow: "hidden" }}>
      {/* Map backdrop */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <GeeraMap variant="request" animate={true}/>
        <MapPin x="22%" y="78%" kind="driver" pulse/>
        <MapPin x="32%" y="62%" kind="pickup" label={t("req.pickup")}/>
        <MapPin x="82%" y="38%" kind="dest" label={t("req.dest")}/>
      </div>

      {/* Notice pill */}
      <div style={{
        position: "absolute", top: 70, insetInline: 18, zIndex: 30,
        display: "flex", alignItems: "center", gap: 10,
        padding: "11px 14px",
        background: "var(--surface)",
        borderRadius: "var(--r-md)",
        boxShadow: "var(--shadow-md)",
        backdropFilter: "blur(8px)",
        animation: "notice-in .35s var(--ease-spring) both",
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          background: "var(--brand-500)",
          animation: "pulse-ring 1.6s var(--ease-out) infinite",
        }}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700 }}>{t("req.incoming")}</div>
          <div className="micro" style={{ marginTop: 1 }}>{t("req.sub")}</div>
        </div>
        <span className="badge badge-brand"><Ic.star size={10} filled/> 4.8</span>
      </div>

      <BottomSheet style={sheetStyle}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <h2 className="h2" style={{ fontSize: 22 }}>{t("req.incoming")}</h2>
            <p className="small" style={{ marginTop: 4 }}>{t("req.sub")}</p>
          </div>
          <CountdownRing remaining={remaining}/>
        </div>

        {/* Route card */}
        <div className="card" style={{ padding: 18, marginBottom: 14, position: "relative" }}>
          {/* Track line */}
          <div style={{
            position: "absolute", insetInlineStart: 27, top: 30, bottom: 30,
            width: 2, background: "var(--border)",
          }}/>

          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingBlock: 4 }}>
            <div style={{
              width: 14, height: 14, borderRadius: "50%",
              background: "var(--brand-600)", marginTop: 4, flexShrink: 0,
              boxShadow: "0 0 0 4px var(--brand-50)",
            }}/>
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ fontSize: 10 }}>{t("req.pickup")}</div>
              <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 2 }}>{t("req.pickup.addr")}</div>
            </div>
            <div className="micro" style={{ fontWeight: 600 }}>1.5 {t("unit.km")}</div>
          </div>

          <div style={{ height: 16 }}/>

          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingBlock: 4 }}>
            <div style={{
              width: 14, height: 14, borderRadius: 3,
              background: "var(--terra-500)", marginTop: 4, flexShrink: 0,
              boxShadow: "0 0 0 4px oklch(from var(--terra-500) l c h / .15)",
            }}/>
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ fontSize: 10 }}>{t("req.dest")}</div>
              <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 2 }}>{t("req.dest.addr")}</div>
            </div>
            <div className="micro" style={{ fontWeight: 600 }}>8.5 {t("unit.km")}</div>
          </div>
        </div>

        {/* Metrics row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          <Metric v="1.5" u={t("unit.km")} l={t("req.toRider")}/>
          <Metric v="8.5" u={t("unit.km")} l={t("req.trip")}/>
          <Metric v="25"  u={t("unit.currency")} l={t("req.fare")} highlight/>
        </div>

        {/* Actions */}
        <div className="btn-row">
          <button className="btn btn-danger" onClick={back}>{t("req.reject")}</button>
          <button className="btn btn-primary" style={{ flex: 1.4 }} onClick={() => go("toPickup")}>
            {t("req.accept")}
          </button>
        </div>
      </BottomSheet>
      <style>{`@keyframes notice-in{from{transform:translateY(-10px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}

function Metric({ v, u, l, highlight }) {
  return (
    <div style={{
      padding: "10px 12px",
      background: highlight ? "var(--brand-50)" : "var(--surface)",
      border: "1px solid",
      borderColor: highlight ? "oklch(from var(--brand-500) l c h / .35)" : "var(--border)",
      borderRadius: "var(--r-md)",
      textAlign: "center",
    }}>
      <div style={{
        fontSize: 18, fontWeight: 700, letterSpacing: "-0.018em",
        color: highlight ? "var(--brand-700)" : "var(--text)",
        fontVariantNumeric: "tabular-nums",
      }}>
        {v}<span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginInlineStart: 3 }}>{u}</span>
      </div>
      <div className="micro" style={{ marginTop: 2 }}>{l}</div>
    </div>
  );
}

/* ── To pickup ───────────────────────────────────────────────── */
function ScreenToPickup({ go, back, sheetStyle = "rounded" }) {
  const [dist, setDist] = useState(800);
  useEffect(() => {
    if (dist <= 0) return;
    const id = setInterval(() => setDist(d => Math.max(0, d - 70)), 800);
    return () => clearInterval(id);
  }, []);
  const enabled = dist <= 150;

  return (
    <div className="screen flush screen-in" style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <GeeraMap variant="trip" animate/>
        <MapPin x="22%" y={`${78 - (800 - dist) / 30}%`} kind="driver" pulse/>
        <MapPin x="32%" y="62%" kind="pickup" label={t("req.pickup")}/>
      </div>

      {/* Top metrics strip */}
      <div style={{
        position: "absolute", top: 70, insetInline: 18, zIndex: 30,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
      }}>
        <MetricCard label={t("req.toRider")} value={`${dist}`} unit="m"/>
        <MetricCard label="ETA" value={`${Math.max(1, Math.ceil(dist/180))}`} unit={t("unit.min")}/>
      </div>

      <BottomSheet style={sheetStyle}>
        <div style={{
          padding: "10px 14px", marginBottom: 14,
          background: "var(--brand-50)",
          color: "var(--brand-700)",
          borderRadius: "var(--r-md)",
          fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--brand-600)",
            animation: "pulse-ring 1.6s infinite",
          }}/>
          {t("trip.pickup.head")}
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "var(--accent-500)", color: "var(--text-onbrand)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)",
          }}>KA</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15.5, fontWeight: 600 }}>{t("trip.pickup.rider")}</div>
            <div className="small" style={{ marginTop: 2 }}>{t("req.pickup.addr")}</div>
          </div>
          <button className="fab" style={{ background: "var(--brand-50)", border: 0, color: "var(--brand-700)" }}>
            <Ic.phone/>
          </button>
        </div>

        <div className="btn-row">
          <button className="btn btn-secondary" onClick={back}><Ic.phone size={16}/> {t("trip.call")}</button>
          <button className="btn btn-primary" style={{ flex: 1.3 }} disabled={!enabled} onClick={() => go("inTrip")}>
            <Ic.check size={18}/> {t("trip.arrived")}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}

function MetricCard({ label, value, unit }) {
  return (
    <div style={{
      padding: "10px 14px",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-md)",
      boxShadow: "var(--shadow-sm)",
      backdropFilter: "blur(8px)",
    }}>
      <div className="eyebrow" style={{ fontSize: 10 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>
        {value}<span style={{ fontSize: 11, color: "var(--text-muted)", marginInlineStart: 3, fontWeight: 600 }}>{unit}</span>
      </div>
    </div>
  );
}

/* ── In-trip ─────────────────────────────────────────────────── */
function ScreenInTrip({ go, back, sheetStyle = "rounded" }) {
  const [dist, setDist] = useState(5.2);
  useEffect(() => {
    if (dist <= 0) return;
    const id = setInterval(() => setDist(d => Math.max(0, +(d - 0.4).toFixed(1))), 800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="screen flush screen-in" style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <GeeraMap variant="trip" animate/>
        <MapPin x={`${32 + (5.2 - dist) * 9}%`} y={`${62 - (5.2 - dist) * 4}%`} kind="driver" pulse/>
        <MapPin x="82%" y="38%" kind="dest" label={t("req.dest")}/>
      </div>

      {/* Top metrics strip */}
      <div style={{
        position: "absolute", top: 70, insetInline: 18, zIndex: 30,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
      }}>
        <MetricCard label="Remaining" value={`${dist.toFixed(1)}`} unit={t("unit.km")}/>
        <MetricCard label="ETA" value={`${Math.max(1, Math.ceil(dist*2.4))}`} unit={t("unit.min")}/>
      </div>

      <BottomSheet style={sheetStyle}>
        <div style={{
          padding: "10px 14px", marginBottom: 14,
          background: "var(--brand-600)",
          color: "var(--text-onbrand)",
          borderRadius: "var(--r-md)",
          fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "white",
            animation: "pulse-ring 1.6s infinite",
          }}/>
          {t("trip.intrip.head")}
        </div>

        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div className="eyebrow" style={{ fontSize: 10 }}>{t("req.dest")}</div>
              <div style={{ fontSize: 15.5, fontWeight: 600, marginTop: 2 }}>{t("req.dest.addr")}</div>
            </div>
            <div style={{ textAlign: "end" }}>
              <div className="eyebrow" style={{ fontSize: 10 }}>{t("req.fare")}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--brand-700)", fontVariantNumeric: "tabular-nums" }}>
                25<span style={{ fontSize: 12, color: "var(--text-muted)", marginInlineStart: 3, fontWeight: 600 }}>{t("unit.currency")}</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0 0", borderTop: "1px solid var(--hairline)" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "var(--accent-500)", color: "var(--text-onbrand)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)",
            }}>KA</div>
            <div className="small">{t("trip.pickup.rider")}</div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => go("tripComplete")}>{t("trip.end")}</button>
      </BottomSheet>
    </div>
  );
}

/* ── Trip complete ───────────────────────────────────────────── */
function ScreenTripComplete({ go }) {
  return (
    <div className="screen screen-in" style={{ paddingTop: 80, alignItems: "center", textAlign: "center" }}>
      <CheckRing size={104}/>
      <h1 className="h1" style={{ marginTop: 22 }}>{t("trip.done.title")}</h1>
      <p className="body" style={{ marginTop: 6 }}>{t("trip.done.sub")}</p>

      <div className="card" style={{
        width: "100%", marginTop: 28, padding: 22, textAlign: "center",
        background: "var(--brand-50)",
        border: "1px solid oklch(from var(--brand-500) l c h / .35)",
      }}>
        <div className="eyebrow" style={{ marginBottom: 6, color: "var(--brand-700)" }}>{t("trip.due")}</div>
        <div style={{
          fontSize: 48, fontWeight: 600, letterSpacing: "-0.04em",
          color: "var(--brand-700)", fontFamily: "var(--font-display)",
          fontVariantNumeric: "tabular-nums",
        }}>
          25<span style={{ fontSize: 18, marginInlineStart: 6, color: "var(--text-muted)" }}>{t("unit.currency")}</span>
        </div>
        <span className="badge badge-brand" style={{ marginTop: 8 }}><Ic.cash size={12}/> {t("trip.cash")}</span>
      </div>

      <div style={{
        width: "100%", marginTop: 14,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
      }}>
        <MetricCard label={t("trip.distance")} value="8.5" unit={t("unit.km")}/>
        <MetricCard label={t("trip.duration")} value="18" unit={t("unit.min")}/>
      </div>

      <div className="row" style={{ width: "100%", marginTop: 12, background: "var(--surface-2)", border: "1px dashed var(--border)" }}>
        <div className="row-ic" style={{ background: "oklch(from var(--accent-600) l c h / .15)", color: "var(--accent-700)" }}>
          <Ic.warn size={18}/>
        </div>
        <div className="row-text">
          <h4>{t("trip.commission")}</h4>
          <p>3.75 {t("unit.currency")} added to outstanding</p>
        </div>
      </div>

      <div className="spacer"/>
      <div className="stack stack-3" style={{ width: "100%", marginTop: 20 }}>
        <button className="btn btn-primary" onClick={() => go("dashboard")}>{t("trip.cash.received")}</button>
        <button className="btn btn-ghost" onClick={() => go("tripDetail", { trip: { from: "Hai al-Andalus", to: "Gargaresh", time: "18:32", km: 8.5, lyd: 25, rider: "Khalid Al-Asmari" } })}>
          View trip receipt
        </button>
      </div>
    </div>
  );
}

window.ScreenDashboard = ScreenDashboard;
window.ScreenRideRequest = ScreenRideRequest;
window.ScreenToPickup = ScreenToPickup;
window.ScreenInTrip = ScreenInTrip;
window.ScreenTripComplete = ScreenTripComplete;
