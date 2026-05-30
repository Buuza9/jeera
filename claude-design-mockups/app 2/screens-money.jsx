/* Geera — money & profile screens.
   earnings · history · commission · profile */

/* ── Earnings ────────────────────────────────────────────────── */
function ScreenEarnings({ go, onNav, back }) {
  const [period, setPeriod] = useState("today");
  const data = {
    today:  { net: 320, prev: 14, trips: 15, cash: 376, hours: 6.2, comm: 56,
              bars: [12, 24, 18, 32, 40, 36, 52, 48, 28, 22, 18, 14],
              barLabels: ["6","","8","","10","","12","","14","","16","18"],
              breakdown: [
                { from: "Hai al-Andalus", to: "Gargaresh", time: "18:32", km: 8.5, lyd: 25 },
                { from: "Old City", to: "MJI Airport", time: "16:14", km: 14.2, lyd: 42 },
                { from: "Dahra", to: "Janzour", time: "13:45", km: 11.0, lyd: 32 },
                { from: "Souq al-Juma", to: "Hai al-Andalus", time: "11:22", km: 5.8, lyd: 18 },
              ]},
    week:   { net: 1840, prev: 8, trips: 78, cash: 2165, hours: 38, comm: 325,
              bars: [220, 285, 310, 270, 295, 330, 130],
              barLabels: ["Sat","Sun","Mon","Tue","Wed","Thu","Fri"],
              breakdown: [
                { from: "Saturday", to: "", time: "9 trips · 38 km", km: null, lyd: 220 },
                { from: "Sunday", to: "", time: "12 trips · 52 km", km: null, lyd: 285 },
                { from: "Monday", to: "", time: "14 trips · 61 km", km: null, lyd: 310 },
                { from: "Tuesday", to: "", time: "11 trips · 45 km", km: null, lyd: 270 },
              ]},
    month:  { net: 7240, prev: 12, trips: 312, cash: 8520, hours: 156, comm: 1280,
              bars: [1620, 1840, 1980, 1800],
              barLabels: ["W1","W2","W3","W4"],
              breakdown: [
                { from: "Week 1", to: "", time: "72 trips · 308 km", km: null, lyd: 1620 },
                { from: "Week 2", to: "", time: "78 trips · 342 km", km: null, lyd: 1840 },
                { from: "Week 3", to: "", time: "84 trips · 364 km", km: null, lyd: 1980 },
              ]},
  };
  const d = data[period];
  const maxBar = Math.max(...d.bars);

  return (
    <div className="screen has-nav screen-in">
      <AppBar onBack={back} title={t("earn.title")}/>

      <div className="stack stack-4" style={{ flex: 1 }}>
        <Segmented
          value={period}
          onChange={setPeriod}
          options={[
            { value: "today", label: t("earn.today") },
            { value: "week",  label: t("earn.week") },
            { value: "month", label: t("earn.month") },
          ]}
        />

        {/* Hero */}
        <div style={{
          padding: 22,
          borderRadius: "var(--r-lg)",
          background: "linear-gradient(140deg, var(--brand-600), var(--brand-700) 80%)",
          color: "var(--text-onbrand)",
          boxShadow: "var(--shadow-md)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", insetInlineEnd: -30, top: -30,
            width: 160, height: 160, borderRadius: "50%",
            background: "oklch(from var(--accent-500) l c h / .18)",
            filter: "blur(20px)",
          }}/>
          <div className="eyebrow" style={{ color: "oklch(from var(--brand-50) l c h / .8)", letterSpacing: "0.14em" }}>{t("earn.net")}</div>
          <div style={{
            fontSize: 52, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.05,
            marginTop: 6, fontFamily: "var(--font-display)", fontVariantNumeric: "tabular-nums",
          }}>
            {d.net.toLocaleString()}
            <span style={{ fontSize: 18, marginInlineStart: 8, opacity: .7 }}>{t("unit.currency")}</span>
          </div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            marginTop: 12, padding: "5px 12px",
            background: "oklch(from white l c h / .15)",
            borderRadius: 999, fontSize: 12, fontWeight: 700,
          }}>↑ {t("earn.delta.up", { n: d.prev })}</span>
        </div>

        {/* Bar chart */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{
            display: "flex", alignItems: "flex-end", gap: 4,
            height: 110, marginBottom: 8,
          }}>
            {d.bars.map((v, i) => (
              <div key={i} style={{
                flex: 1,
                height: `${(v / maxBar) * 100}%`,
                background: i === (period === "today" ? 6 : period === "week" ? 5 : 2)
                          ? "var(--brand-600)"
                          : "var(--brand-100)",
                borderRadius: "4px 4px 1px 1px",
                transition: "height .4s var(--ease-out)",
                animation: `barIn .5s ${i * 0.04}s var(--ease-out) both`,
                transformOrigin: "bottom",
              }}/>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4, fontSize: 10, color: "var(--text-faint)", textAlign: "center" }}>
            {d.barLabels.map((l, i) => (
              <div key={i} style={{ flex: 1 }}>{l}</div>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <StatCell label={t("dash.trips")} value={d.trips}/>
          <StatCell label={t("earn.cash")}  value={d.cash} unit={t("unit.currency")}/>
          <StatCell label={t("earn.online")} value={d.hours} unit={t("unit.hr")}/>
          <StatCell label={t("earn.comm")}  value={d.comm} unit={t("unit.currency")} warn/>
        </div>

        {/* Breakdown */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <h3 className="h3">{t("earn.breakdown")}</h3>
            <button onClick={() => onNav?.("history")} className="btn-ghost btn btn-sm" style={{ width: "auto" }}>
              {t("hist.title")} <Ic.arrowRight size={14}/>
            </button>
          </div>
          <div className="card" style={{ padding: 4 }}>
            {d.breakdown.map((b, i) => (
              <div key={i}
                onClick={() => period === "today" && go("tripDetail", { trip: { from: b.from, to: b.to, time: b.time, km: b.km, lyd: b.lyd, rider: "Khalid A." } })}
                style={{
                  padding: "12px 14px",
                  borderBottom: i < d.breakdown.length - 1 ? "1px solid var(--hairline)" : "none",
                  display: "flex", alignItems: "center", gap: 12,
                  cursor: period === "today" ? "pointer" : "default",
                }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                    {b.to ? <>{b.from} <span style={{ color: "var(--text-faint)" }}>→</span> {b.to}</> : b.from}
                  </div>
                  <div className="micro" style={{ marginTop: 2 }}>{b.time}{b.km ? ` · ${b.km} ${t("unit.km")}` : ""}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {b.lyd}<span style={{ fontSize: 10, color: "var(--text-muted)", marginInlineStart: 3, fontWeight: 600 }}>{t("unit.currency")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes barIn{from{transform:scaleY(0)}to{transform:scaleY(1)}}`}</style>
    </div>
  );
}

function StatCell({ label, value, unit, warn }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="eyebrow" style={{ fontSize: 10, color: warn ? "var(--accent-700)" : undefined }}>{label}</div>
      <div style={{
        fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em",
        marginTop: 4, color: warn ? "var(--accent-700)" : "var(--text)",
        fontVariantNumeric: "tabular-nums",
      }}>
        {value}{unit && <span style={{ fontSize: 11, color: "var(--text-muted)", marginInlineStart: 4, fontWeight: 600 }}>{unit}</span>}
      </div>
    </div>
  );
}

/* ── Trip history ───────────────────────────────────────────── */
function ScreenHistory({ back, onNav, go }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const trips = [
    { day: "today", time: "18:32", from: "Hai al-Andalus", to: "Gargaresh", rider: "Khalid A.", km: 8.5, lyd: 25 },
    { day: "today", time: "16:14", from: "Old City", to: "MJI Airport", rider: "Mariam S.", km: 14.2, lyd: 42 },
    { day: "today", time: "13:45", from: "Dahra", to: "Janzour", rider: "Omar B.", km: 11.0, lyd: 32 },
    { day: "today", time: "11:22", from: "Souq al-Juma", to: "Hai al-Andalus", rider: "Yousef R.", km: 5.8, lyd: 18 },
    { day: "today", time: "10:08", from: "Sidi Husayn", to: "Tajura", rider: "Faisal M.", km: 12.5, lyd: 36, cancelled: true, reason: "Rider no-show after 5 min wait" },
    { day: "yesterday", time: "20:11", from: "Gargaresh", to: "Old City", rider: "Layla N.", km: 9.2, lyd: 28 },
    { day: "yesterday", time: "17:30", from: "MJI Airport", to: "Hai al-Andalus", rider: "Ibrahim T.", km: 17.5, lyd: 48 },
    { day: "yesterday", time: "14:55", from: "Janzour", to: "Dahra", rider: "Salim K.", km: 10.8, lyd: 30 },
  ];
  const filtered = trips.filter(tr => {
    if (filter !== "all" && tr.day !== filter) return false;
    if (q && !`${tr.from} ${tr.to} ${tr.rider}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const days = [...new Set(filtered.map(tr => tr.day))];

  return (
    <div className="screen has-nav screen-in">
      <AppBar onBack={back} title={t("hist.title")}/>

      <div className="stack stack-4" style={{ flex: 1 }}>
        {/* Stats strip */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <StatCell label={t("dash.trips")} value="15"/>
          <StatCell label={t("earn.cash")} value="376" unit={t("unit.currency")}/>
          <StatCell label={t("earn.online")} value="6.2" unit={t("unit.hr")}/>
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", insetInlineStart: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}>
            <Ic.search/>
          </div>
          <input
            placeholder={t("hist.search.ph")}
            value={q}
            onChange={e => setQ(e.target.value)}
            style={{
              width: "100%", padding: "12px 14px 12px 42px",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-md)",
              fontSize: 14, fontFamily: "inherit", color: "var(--text)",
              outline: "none",
            }}
          />
        </div>

        {/* Filter chips */}
        <Segmented value={filter} onChange={setFilter} options={[
          { value: "all", label: t("hist.all") },
          { value: "today", label: t("hist.today") },
          { value: "yesterday", label: t("hist.yesterday") },
        ]}/>

        {/* Empty */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-faint)" }}>
            <Ic.search size={32}/>
            <div style={{ marginTop: 12, fontSize: 14 }}>{t("hist.empty")}</div>
          </div>
        )}

        {/* Trips by day */}
        {days.map(day => {
          const dayTrips = filtered.filter(tr => tr.day === day);
          const total = dayTrips.reduce((s, tr) => s + (tr.cancelled ? 0 : tr.lyd), 0);
          return (
            <div key={day}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8, padding: "0 4px" }}>
                <span className="eyebrow">{day === "today" ? t("hist.today") : t("hist.yesterday")} · {dayTrips.length}</span>
                <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {total}<span style={{ fontSize: 10, color: "var(--text-muted)", marginInlineStart: 3, fontWeight: 600 }}>{t("unit.currency")}</span>
                </span>
              </div>
              <div className="stack stack-2">
                {dayTrips.map((tr, i) => <TripCard key={i} tr={tr} onClick={() => !tr.cancelled && go("tripDetail", { trip: tr })}/>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TripCard({ tr, onClick }) {
  return (
    <div onClick={onClick} className="card" style={{
      display: "flex", alignItems: "stretch", gap: 12, padding: 14,
      opacity: tr.cancelled ? .7 : 1, cursor: tr.cancelled ? "default" : "pointer",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, paddingTop: 4 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--brand-600)" }}/>
        <div style={{ width: 2, flex: 1, background: "var(--border)" }}/>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--terra-500)" }}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35 }}>{tr.from}</div>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, marginTop: 12 }}>{tr.to}</div>
        <div className="micro" style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <span>{tr.time}</span><span>·</span><span>{tr.km} {t("unit.km")}</span><span>·</span><span>{tr.rider}</span>
        </div>
      </div>
      <div style={{ textAlign: "end", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{
          fontSize: 16, fontWeight: 700, fontVariantNumeric: "tabular-nums",
          textDecoration: tr.cancelled ? "line-through" : "none",
          color: tr.cancelled ? "var(--text-faint)" : "var(--text)",
        }}>
          {tr.lyd}<span style={{ fontSize: 10, color: "var(--text-muted)", marginInlineStart: 3, fontWeight: 600 }}>{t("unit.currency")}</span>
        </div>
        {tr.cancelled
          ? <span className="badge badge-danger" style={{ fontSize: 10 }}>{t("hist.cancelled")}</span>
          : <Ic.arrowRight size={16}/>}
      </div>
    </div>
  );
}

/* ── Commission ─────────────────────────────────────────────── */
function ScreenCommission({ back }) {
  const balance = 48;
  const cap = 200;
  const pct = (balance / cap) * 100;
  return (
    <div className="screen has-nav screen-in">
      <AppBar onBack={back} title={t("com.title")}/>

      <div className="stack stack-4" style={{ flex: 1 }}>
        {/* Balance hero */}
        <div style={{
          padding: 22,
          borderRadius: "var(--r-lg)",
          background: "linear-gradient(140deg, var(--accent-500), oklch(from var(--accent-700) calc(l - 0.05) c h) 90%)",
          color: "var(--text-onbrand)",
          boxShadow: "0 12px 30px oklch(from var(--accent-600) l c h / .3)",
          position: "relative", overflow: "hidden",
        }}>
          <div className="eyebrow" style={{ color: "oklch(1 0 0 / .8)" }}>{t("com.outstanding")}</div>
          <div style={{
            fontSize: 56, fontWeight: 600, letterSpacing: "-0.04em",
            fontFamily: "var(--font-display)", fontVariantNumeric: "tabular-nums",
            marginTop: 4, lineHeight: 1.05,
          }}>{balance}<span style={{ fontSize: 18, opacity: .75, marginInlineStart: 6 }}>{t("unit.currency")}</span></div>
          <div style={{ marginTop: 14 }}>
            <div style={{ height: 6, background: "oklch(1 0 0 / .25)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "white", borderRadius: 999 }}/>
            </div>
            <div style={{ fontSize: 11.5, marginTop: 6, opacity: .85, fontWeight: 600 }}>
              {t("com.cap", { c: balance, m: cap })}
            </div>
          </div>
        </div>

        {/* Settlement info */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 4px 12px" }}>
            <div>
              <div className="eyebrow">{t("com.next")}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>Sunday · in 4 days</div>
            </div>
            <span className="badge badge-warn">{t("com.rate")}</span>
          </div>
          <div className="small" style={{ borderTop: "1px solid var(--hairline)", paddingTop: 12, color: "var(--text-muted)" }}>
            {t("com.policy")} <span className="todo-chip" style={{ marginInlineStart: 4 }}>TODO §5</span>
          </div>
        </div>

        {/* Accruals */}
        <div>
          <h3 className="h3" style={{ marginBottom: 10 }}>{t("com.recent")}</h3>
          <div className="card" style={{ padding: 4 }}>
            {[
              { trip: "Hai al-Andalus → Gargaresh", fare: 25, com: 3.75, time: "Today 18:32" },
              { trip: "Old City → MJI Airport", fare: 42, com: 6.30, time: "Today 16:14" },
              { trip: "Dahra → Janzour", fare: 32, com: 4.80, time: "Today 13:45" },
              { trip: "Souq al-Juma → Hai al-Andalus", fare: 18, com: 2.70, time: "Today 11:22" },
            ].map((it, i, arr) => (
              <div key={i} style={{
                padding: "12px 14px",
                borderBottom: i < arr.length - 1 ? "1px solid var(--hairline)" : "none",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "oklch(from var(--accent-600) l c h / .12)",
                  color: "var(--accent-700)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}><Ic.plus size={14}/></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{it.trip}</div>
                  <div className="micro" style={{ marginTop: 2 }}>{it.time} · {it.fare} {t("unit.currency")} fare</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-700)", fontVariantNumeric: "tabular-nums" }}>
                  +{it.com.toFixed(2)}<span style={{ fontSize: 10, marginInlineStart: 3, fontWeight: 600 }}>{t("unit.currency")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="action-bar">
        <div className="btn-row">
          <button className="btn btn-secondary">{t("com.history")}</button>
          <button className="btn btn-primary" style={{ flex: 1.3 }}>{t("com.settle")}</button>
        </div>
      </div>
    </div>
  );
}

/* ── Profile ────────────────────────────────────────────────── */
function ScreenProfile({ back }) {
  return (
    <div className="screen has-nav screen-in">
      <AppBar onBack={back} title={t("prof.title")} trailing={
        <button className="ab-btn"><Ic.settings size={18}/></button>
      }/>

      <div className="stack stack-4" style={{ flex: 1 }}>
        {/* Driver header */}
        <div className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "var(--brand-600)", color: "var(--text-onbrand)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)",
            boxShadow: "0 6px 14px oklch(from var(--brand-600) l c h / .35)",
          }}>AM</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="h2" style={{ fontSize: 19 }}>Ahmed Al-Tarhouni</h2>
            <div className="small" style={{ marginTop: 2 }}>{t("prof.driver")} · +218 91 ••• 5678</div>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <span className="badge badge-brand"><Ic.star size={10} filled/> 4.92</span>
              <span className="badge badge-mute">312 {t("dash.trips")}</span>
            </div>
          </div>
        </div>

        {/* Vehicle */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 10, marginInlineStart: 4 }}>{t("prof.vehicle")}</div>
          <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "var(--surface-2)", color: "var(--text-muted)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><Ic.car size={26}/></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Toyota Corolla 2018</div>
              <div className="small" style={{ marginTop: 2 }}>White · Plate 247 TR 5</div>
            </div>
            <Ic.arrowRight size={16}/>
          </div>
        </div>

        {/* Documents */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 10, marginInlineStart: 4 }}>{t("prof.docs")}</div>
          <div className="stack stack-2">
            <DocRow label={t("prof.id")} status="ok"/>
            <DocRow label={t("prof.lic")} status="expiring"/>
          </div>
        </div>

        {/* Settings list */}
        <div className="card" style={{ padding: 4 }}>
          <ProfileRow icon={<Ic.shield/>} label="Privacy & security"/>
          <ProfileRow icon={<Ic.bell/>} label="Notifications"/>
          <ProfileRow icon={<Ic.fingerprint/>} label="PIN & biometric"/>
          <ProfileRow icon={<Ic.layers/>} label="Language & theme"/>
          <ProfileRow icon={<Ic.shield size={18}/>} label={t("prof.support")}/>
        </div>

        <button className="btn btn-secondary" style={{ color: "var(--danger)", marginTop: 8 }}>
          {t("prof.logout")}
        </button>
      </div>
    </div>
  );
}

function DocRow({ label, status }) {
  const ok = status === "ok";
  return (
    <div className="row">
      <div className="row-ic" style={ok ? {} : { background: "oklch(from var(--accent-600) l c h / .15)", color: "var(--accent-700)" }}>
        {ok ? <Ic.check size={18}/> : <Ic.warn size={18}/>}
      </div>
      <div className="row-text">
        <h4>{label}</h4>
        <p>{ok ? t("prof.verified") : t("prof.expiring")}</p>
      </div>
      <span className={`badge ${ok ? "badge-brand" : "badge-warn"}`}>
        {ok ? t("prof.verified") : "Renew"}
      </span>
    </div>
  );
}

function ProfileRow({ icon, label }) {
  return (
    <button style={{
      display: "flex", alignItems: "center", gap: 14,
      width: "100%", padding: "12px 14px", border: 0, background: "transparent",
      color: "var(--text)", textAlign: "start", cursor: "pointer",
      fontFamily: "inherit", borderBottom: "1px solid var(--hairline)",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: "var(--surface-2)", color: "var(--text-muted)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, fontSize: 14.5, fontWeight: 500 }}>{label}</div>
      <Ic.arrowRight size={16}/>
    </button>
  );
}

/* ── Trip Detail ────────────────────────────────────────────── */
function ScreenTripDetail({ back, trip }) {
  // Default fallback if no trip param passed
  const tr = trip || {
    from: "Hai al-Andalus", to: "Gargaresh",
    time: "18:32", km: 8.5, lyd: 25,
    rider: "Khalid Al-Asmari",
  };
  const fare = tr.lyd || 25;
  const km = tr.km || 8.5;
  const commission = +(fare * 0.15).toFixed(2);
  const net = +(fare - commission).toFixed(2);
  // Compute mock timestamps off `time` (HH:MM)
  const [h, m] = (tr.time || "18:32").split(":").map(Number);
  const stamps = {
    accept: `${String(h).padStart(2,"0")}:${String(Math.max(0, m-22)).padStart(2,"0")}`,
    arrive: `${String(h).padStart(2,"0")}:${String(Math.max(0, m-18)).padStart(2,"0")}`,
    start:  `${String(h).padStart(2,"0")}:${String(Math.max(0, m-15)).padStart(2,"0")}`,
    end:    tr.time || "18:32",
  };

  return (
    <div className="screen flush screen-in" style={{ position: "relative", overflow: "hidden" }}>
      {/* Top half: map with route */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 360, zIndex: 0 }}>
        <GeeraMap variant="full" animate={false}/>
        <MapPin x="22%" y="60%" kind="pickup" label={t("req.pickup")}/>
        <MapPin x="78%" y="30%" kind="dest" label={t("req.dest")}/>
      </div>

      {/* Floating back + status */}
      <div style={{
        position: "absolute", top: 70, insetInline: 16, zIndex: 30,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={back} className="fab" style={{ backdropFilter: "blur(8px)" }}>
          <Ic.arrowLeft size={20}/>
        </button>
        <span className="badge badge-brand" style={{ background: "var(--surface)", color: "var(--brand-700)", boxShadow: "var(--shadow-sm)", padding: "6px 12px" }}>
          <Ic.check size={12}/> {t("hist.detail.head")}
        </span>
        <div style={{ width: 44 }}/>
      </div>

      {/* Sheet starting around y=320 */}
      <div style={{
        position: "absolute", top: 320, left: 0, right: 0, bottom: 0,
        background: "var(--bg)",
        borderRadius: "28px 28px 0 0",
        padding: "8px 22px 30px",
        boxShadow: "0 -16px 40px rgba(20,18,12,.18)",
        overflowY: "auto",
        zIndex: 20,
        scrollbarWidth: "none",
      }}>
        <div style={{
          width: 44, height: 5, borderRadius: 999,
          background: "var(--surface-3)",
          margin: "4px auto 14px",
        }}/>

        {/* Date/time + fare summary */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div className="eyebrow" style={{ fontSize: 10.5 }}>Today · {stamps.end}</div>
            <h2 className="h2" style={{ fontSize: 20, marginTop: 4 }}>{tr.from} → {tr.to}</h2>
          </div>
          <div style={{ textAlign: "end" }}>
            <div className="eyebrow" style={{ fontSize: 10.5 }}>{t("hist.net")}</div>
            <div style={{
              fontSize: 28, fontWeight: 700, fontFamily: "var(--font-display)",
              letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums",
              color: "var(--brand-700)",
            }}>
              {net.toFixed(2).replace(/\.00$/, "")}<span style={{ fontSize: 12, color: "var(--text-muted)", marginInlineStart: 3, fontWeight: 600 }}>{t("unit.currency")}</span>
            </div>
          </div>
        </div>

        {/* Route card */}
        <div className="card" style={{ position: "relative", marginBottom: 14 }}>
          <div style={{
            position: "absolute", insetInlineStart: 23, top: 26, bottom: 26,
            width: 2, background: "var(--border)",
          }}/>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "2px 0 14px" }}>
            <div style={{
              width: 12, height: 12, borderRadius: "50%",
              background: "var(--brand-600)",
              boxShadow: "0 0 0 4px var(--brand-50)",
              marginTop: 3, flexShrink: 0,
            }}/>
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ fontSize: 10 }}>{t("req.pickup")}</div>
              <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 2 }}>{tr.from}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 0 2px", borderTop: "1px solid var(--hairline)" }}>
            <div style={{
              width: 12, height: 12, borderRadius: 3,
              background: "var(--terra-500)",
              boxShadow: "0 0 0 4px oklch(from var(--terra-500) l c h / .15)",
              marginTop: 3, flexShrink: 0,
            }}/>
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ fontSize: 10 }}>{t("req.dest")}</div>
              <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 2 }}>{tr.to}</div>
            </div>
          </div>
        </div>

        {/* Distance + Duration */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          <StatCell label={t("trip.distance")} value={km} unit={t("unit.km")}/>
          <StatCell label={t("trip.duration")} value={Math.round(km * 2.4)} unit={t("unit.min")}/>
        </div>

        {/* Fare breakdown */}
        <h3 className="h3" style={{ fontSize: 15, marginBottom: 10 }}>{t("hist.fare.trip")}</h3>
        <div className="card" style={{ padding: 4, marginBottom: 14 }}>
          <FareRow label={t("hist.fare.trip")} value={`${fare}`} unit={t("unit.currency")}/>
          <FareRow label={t("trip.commission")} value={`−${commission.toFixed(2)}`} unit={t("unit.currency")} warn/>
          <FareRow label={t("hist.net")} value={`${net.toFixed(2).replace(/\.00$/, "")}`} unit={t("unit.currency")} bold/>
        </div>

        {/* Rider */}
        <h3 className="h3" style={{ fontSize: 15, marginBottom: 10 }}>Rider</h3>
        <div className="card" style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "var(--accent-500)", color: "var(--text-onbrand)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)",
          }}>{(tr.rider || "K A").split(" ").map(w => w[0]).join("").slice(0,2)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>{tr.rider || "Khalid Al-Asmari"}</div>
            <div className="micro" style={{ marginTop: 2, display: "flex", alignItems: "center", gap: 4, color: "var(--accent-700)" }}>
              <Ic.star size={11} filled/> 4.8 · Paid in cash
            </div>
          </div>
          <button className="fab" style={{ background: "var(--brand-50)", border: 0, color: "var(--brand-700)" }}>
            <Ic.phone/>
          </button>
        </div>

        {/* Timeline */}
        <h3 className="h3" style={{ fontSize: 15, marginBottom: 10 }}>{t("hist.timeline")}</h3>
        <div className="card" style={{ marginBottom: 14, padding: 18, position: "relative" }}>
          <div style={{
            position: "absolute", insetInlineStart: 27, top: 30, bottom: 30,
            width: 2, background: "var(--border)",
          }}/>
          <TimelineRow time={stamps.accept} label={t("hist.tl.accept")} done/>
          <TimelineRow time={stamps.arrive} label={t("hist.tl.arrive")} done/>
          <TimelineRow time={stamps.start}  label={t("hist.tl.start")}  done/>
          <TimelineRow time={stamps.end}    label={t("hist.tl.end")}    done last/>
        </div>

        {/* Support link */}
        <button className="btn btn-secondary" style={{ marginBottom: 10 }}>
          <Ic.shield size={16}/> Get help with this trip
        </button>
      </div>
    </div>
  );
}

function FareRow({ label, value, unit, warn, bold }) {
  return (
    <div style={{
      padding: "12px 14px",
      borderTop: "1px solid var(--hairline)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }} className="first-no-border">
      <span style={{
        fontSize: 13.5,
        fontWeight: bold ? 700 : 500,
        color: warn ? "var(--accent-700)" : bold ? "var(--text)" : "var(--text-muted)",
      }}>{label}</span>
      <span style={{
        fontSize: bold ? 16 : 14, fontWeight: 700,
        color: warn ? "var(--accent-700)" : bold ? "var(--brand-700)" : "var(--text)",
        fontVariantNumeric: "tabular-nums",
      }}>
        {value}<span style={{ fontSize: 10, color: "var(--text-muted)", marginInlineStart: 3, fontWeight: 600 }}>{unit}</span>
      </span>
    </div>
  );
}

function TimelineRow({ time, label, done, last }) {
  return (
    <div style={{ display: "flex", gap: 14, padding: "8px 0" }}>
      <div style={{
        width: 12, height: 12, borderRadius: "50%",
        background: done ? "var(--brand-600)" : "var(--surface-2)",
        border: done ? "0" : "2px solid var(--border)",
        boxShadow: done ? "0 0 0 3px var(--brand-50)" : "none",
        marginTop: 4, flexShrink: 0,
      }}/>
      <div style={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13.5, fontWeight: 500 }}>{label}</span>
        <span className="small tabular" style={{ color: "var(--text-muted)" }}>{time}</span>
      </div>
    </div>
  );
}

window.ScreenEarnings = ScreenEarnings;
window.ScreenHistory = ScreenHistory;
window.ScreenCommission = ScreenCommission;
window.ScreenProfile = ScreenProfile;
window.ScreenTripDetail = ScreenTripDetail;
