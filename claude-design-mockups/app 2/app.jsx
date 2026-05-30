/* Geera — app shell, state-based routing, tweaks panel. */

const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette":      "palm",
  "theme":        "light",
  "lang":         "en",
  "toggleStyle":  "switch",
  "mapStyle":     "light",
  "sheetStyle":   "rounded",
  "cardStyle":    "default",
  "logoTone":     "brand"
}/*EDITMODE-END*/;

function PaletteSwatches({ value, onChange }) {
  const PALETTES = [
    { id: "palm",    label: "Palm",    colors: ["oklch(0.46 0.095 150)", "oklch(0.72 0.135 60)", "oklch(0.62 0.135 42)"] },
    { id: "saffron", label: "Saffron", colors: ["oklch(0.54 0.155 60)",  "oklch(0.42 0.10 150)", "oklch(0.58 0.155 38)"] },
    { id: "date",    label: "Date",    colors: ["oklch(0.36 0.09 28)",   "oklch(0.64 0.13 65)",  "oklch(0.62 0.14 45)"] },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      {PALETTES.map(p => {
        const on = value === p.id;
        return (
          <button key={p.id} onClick={() => onChange(p.id)} style={{
            position: "relative",
            padding: 10,
            background: "var(--surface)",
            border: "1.5px solid",
            borderColor: on ? p.colors[0] : "var(--border)",
            borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
            textAlign: "start",
          }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
              {p.colors.map((c, i) => (
                <div key={i} style={{
                  flex: 1, height: 22, borderRadius: 4,
                  background: c, border: "1px solid rgba(0,0,0,.04)",
                }}/>
              ))}
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: on ? "var(--text)" : "var(--text-muted)" }}>{p.label}</div>
            {on && (
              <div style={{
                position: "absolute", top: 6, insetInlineEnd: 6,
                width: 14, height: 14, borderRadius: "50%",
                background: p.colors[0], color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function App() {
  useFitPhone();

  const [tweaks, setTweak] = useTweaks(TWEAKS_DEFAULTS);
  const [screen, setScreen] = useState("splash");
  const [params, setParams] = useState({});
  const [online, setOnline] = useState(false);

  // Apply theme + lang + palette to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme);
    document.documentElement.setAttribute("data-palette", tweaks.palette);
    document.documentElement.setAttribute("data-tweak-card", tweaks.cardStyle);
    document.documentElement.setAttribute("lang", tweaks.lang);
    document.documentElement.setAttribute("dir", tweaks.lang === "ar" ? "rtl" : "ltr");
    window.__geera_lang = tweaks.lang;
    // Force re-render on language change
    setRerender(n => n + 1);
  }, [tweaks.theme, tweaks.palette, tweaks.cardStyle, tweaks.lang]);

  const [, setRerender] = useState(0);

  // Track online state globally for the mock incoming-request timer
  useEffect(() => { window.__geera_online = online; }, [online]);

  const go = (next, p = {}) => { setParams(p); setScreen(next); };
  const back = () => {
    const backMap = {
      auth:               "welcome",
      otp:                "auth",
      authSuccess:        "auth",
      enrollment:         "welcome",
      enrollmentPending:  "welcome",
      dashboard:          "welcome",
      rideRequest:        "dashboard",
      toPickup:           "dashboard",
      inTrip:             "toPickup",
      tripComplete:       "dashboard",
      earnings:           "dashboard",
      history:            "dashboard",
      tripDetail:         "history",
      commission:         "dashboard",
      profile:            "dashboard",
    };
    go(backMap[screen] || "welcome");
  };
  const onNav = (id) => {
    if (id === "dashboard")    go("dashboard");
    if (id === "history")      go("history");
    if (id === "earnings")     go("earnings");
    if (id === "profile")      go("profile");
  };

  // Which screens carry the navbar
  const navScreens = { dashboard:1, history:1, earnings:1, profile:1, commission:1 };
  const navItem =
    screen === "dashboard"   ? "dashboard" :
    screen === "history"     ? "history" :
    screen === "earnings"    ? "earnings" :
    screen === "profile"     ? "profile" :
    screen === "commission"  ? "earnings" : null;

  const screens = {
    splash:             () => <ScreenSplash go={go}/>,
    loading:            () => <ScreenLoading label={params.label} sub={params.sub} dark={params.dark} next={params.next} go={go}/>,
    welcome:            () => <ScreenWelcome go={go}/>,
    auth:               () => <ScreenAuth go={go} back={back}/>,
    otp:                () => <ScreenOTP go={go} back={back} phone={params.phone}/>,
    authSuccess:        () => <ScreenAuthSuccess go={go}/>,
    enrollment:         () => <ScreenEnrollment go={go} back={back}/>,
    enrollmentPending:  () => <ScreenEnrollmentPending go={go}/>,
    dashboard:          () => <ScreenDashboard go={go} onNav={onNav} online={online} setOnline={setOnline} toggleVariant={tweaks.toggleStyle}/>,
    rideRequest:        () => <ScreenRideRequest go={go} back={back} sheetStyle={tweaks.sheetStyle}/>,
    toPickup:           () => <ScreenToPickup go={go} back={back} sheetStyle={tweaks.sheetStyle}/>,
    inTrip:             () => <ScreenInTrip go={go} back={back} sheetStyle={tweaks.sheetStyle}/>,
    tripComplete:       () => <ScreenTripComplete go={go}/>,
    earnings:           () => <ScreenEarnings go={go} back={back} onNav={onNav}/>,
    history:            () => <ScreenHistory back={back} onNav={onNav} go={go}/>,
    tripDetail:         () => <ScreenTripDetail trip={params.trip} back={back}/>,
    commission:         () => <ScreenCommission back={back}/>,
    profile:            () => <ScreenProfile back={back}/>,
  };
  const Screen = screens[screen] || screens.welcome;

  return (
    <div className="stage">
      <PhoneFrame navItem={navItem} onNav={onNav}>
        <Screen/>
      </PhoneFrame>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand">
          <PaletteSwatches value={tweaks.palette} onChange={v => setTweak("palette", v)}/>
        </TweakSection>

        <TweakSection label="Appearance">
          <TweakRadio
            label="Theme"
            value={tweaks.theme}
            onChange={v => setTweak("theme", v)}
            options={[{value:"light", label:"Light"}, {value:"dark", label:"Dark"}]}
          />
          <TweakRadio
            label="Language"
            value={tweaks.lang}
            onChange={v => setTweak("lang", v)}
            options={[{value:"en", label:"EN"}, {value:"ar", label:"AR"}]}
          />
        </TweakSection>

        <TweakSection label="Components">
          <TweakSelect
            label="Online toggle"
            value={tweaks.toggleStyle}
            onChange={v => setTweak("toggleStyle", v)}
            options={[
              {value:"switch", label:"Switch card (default)"},
              {value:"bar",    label:"Full-width bar"},
              {value:"pill",   label:"Floating pill (compact)"},
            ]}
          />
          <TweakSelect
            label="Bottom sheet"
            value={tweaks.sheetStyle}
            onChange={v => setTweak("sheetStyle", v)}
            options={[
              {value:"rounded", label:"Rounded (28px)"},
              {value:"soft",    label:"Soft (36px, pillowy)"},
              {value:"card",    label:"Card (18px, crisp)"},
            ]}
          />
          <TweakSelect
            label="Card style"
            value={tweaks.cardStyle}
            onChange={v => setTweak("cardStyle", v)}
            options={[
              {value:"default", label:"Default (bordered)"},
              {value:"soft",    label:"Soft (filled, no border)"},
              {value:"bold",    label:"Bold (shadow + border)"},
            ]}
          />
        </TweakSection>

        <TweakSection label="Navigation">
          <TweakNav onGo={go} current={screen}/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

/* Quick screen-jump nav for previewing during reviews */
function TweakNav({ onGo, current }) {
  const items = [
    ["splash", "Splash"],
    ["loading", "Loading"],
    ["welcome", "Welcome"],
    ["auth", "Auth"],
    ["otp", "OTP"],
    ["authSuccess", "Auth ✓"],
    ["enrollment", "Enrollment"],
    ["enrollmentPending", "Pending"],
    ["dashboard", "Dashboard"],
    ["rideRequest", "Ride request"],
    ["toPickup", "To pickup"],
    ["inTrip", "In trip"],
    ["tripComplete", "Trip done"],
    ["earnings", "Earnings"],
    ["history", "History"],
    ["tripDetail", "Trip detail"],
    ["commission", "Commission"],
    ["profile", "Profile"],
  ];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6,
      maxHeight: 220, overflowY: "auto", paddingInlineEnd: 4,
    }}>
      {items.map(([id, lbl]) => (
        <button key={id}
          onClick={() => onGo(id)}
          style={{
            padding: "8px 10px", fontSize: 11.5, fontWeight: 600,
            background: current === id ? "var(--brand-600)" : "var(--surface-2)",
            color: current === id ? "var(--text-onbrand)" : "var(--text)",
            border: "1px solid",
            borderColor: current === id ? "var(--brand-600)" : "var(--border)",
            borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
            textAlign: "start",
          }}>
          {lbl}
        </button>
      ))}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
