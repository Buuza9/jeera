/* Geera — onboarding screens.
   welcome → auth → otp → auth-success → enrollment → enrollment-pending */

function ScreenWelcome({ go }) {
  return (
    <div className="screen screen-in" style={{ padding: "84px 28px 32px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <GeeraLogo variant="mark" size={96}/>
      </div>
      <h1 className="display" style={{ fontSize: 36, margin: "0 0 12px", whiteSpace: "pre-line" }}>
        {t("wel.title")}
      </h1>
      <p className="body" style={{ maxWidth: 340, margin: "0 auto 36px", fontSize: 15.5 }}>
        {t("wel.sub")}
      </p>

      <div className="stack stack-2" style={{ width: "100%", textAlign: "start" }}>
        <WelcomeRow icon={<Ic.clock/>} title={t("wel.f1")} sub={t("wel.f1.sub")}/>
        <WelcomeRow icon={<Ic.cash/>} title={t("wel.f2")} sub={t("wel.f2.sub")}/>
        <WelcomeRow icon={<Ic.chart/>} title={t("wel.f3")} sub={t("wel.f3.sub")}/>
      </div>

      <div className="spacer"/>
      <div className="stack stack-3" style={{ width: "100%", marginTop: 24 }}>
        <button className="btn btn-primary" onClick={() => go("enrollment")}>{t("wel.cta")}</button>
        <button className="btn btn-ghost" onClick={() => go("auth")}>{t("wel.signin")}</button>
      </div>
      <p className="micro" style={{ marginTop: 18, maxWidth: 280, marginInline: "auto" }}>{t("wel.legal")}</p>
    </div>
  );
}

function WelcomeRow({ icon, title, sub }) {
  return (
    <div className="row">
      <div className="row-ic">{icon}</div>
      <div className="row-text">
        <h4>{title}</h4>
        <p>{sub}</p>
      </div>
    </div>
  );
}

/* ── Auth (phone entry) ───────────────────────────────────────── */
function ScreenAuth({ go, back }) {
  const [phone, setPhone] = useState("");
  const fmt = (raw) => {
    const d = raw.replace(/\D/g, "").slice(0, 9);
    if (d.length <= 1) return d;
    if (d.length <= 4) return `${d.slice(0,1)} ${d.slice(1)}`;
    return `${d.slice(0,1)} ${d.slice(1,4)} ${d.slice(4)}`;
  };
  const valid = phone.replace(/\D/g, "").length >= 9;
  return (
    <div className="screen screen-in">
      <AppBar onBack={back}/>
      <div className="stack stack-4" style={{ flex: 1 }}>
        <div>
          <h1 className="h1" style={{ marginBottom: 8 }}>{t("auth.title")}</h1>
          <p className="body">{t("auth.sub")}</p>
        </div>
        <Field
          label={t("auth.phone")}
          prefix="+218"
          placeholder={t("auth.phone.ph")}
          value={phone}
          dir="ltr"
          onChange={(v) => setPhone(fmt(v))}
        />
        <button className="btn btn-ghost" style={{ width: "auto", padding: "8px 0", justifyContent: "flex-start" }}>
          {t("auth.alt")}
        </button>
      </div>
      <div className="action-bar">
        <button className="btn btn-primary" disabled={!valid} onClick={() => go("otp", { phone: "+218 " + phone })}>
          {t("auth.send")}
        </button>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button className="btn btn-ghost" style={{ width: "auto", display: "inline-block" }}>{t("auth.help")}</button>
        </div>
      </div>
    </div>
  );
}

/* ── OTP ─────────────────────────────────────────────────────── */
function ScreenOTP({ go, back, phone }) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [err, setErr] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resend, setResend] = useState(30);
  const refs = useRef([]);

  useEffect(() => {
    if (resend <= 0) return;
    const id = setTimeout(() => setResend(r => r - 1), 1000);
    return () => clearTimeout(id);
  }, [resend]);

  const onChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...code]; next[i] = v; setCode(next); setErr(false);
    if (v && i < 5) refs.current[i+1]?.focus();
    if (next.every(d => d) && next.join("") === "123456") {
      setVerifying(true);
      setTimeout(() => go("authSuccess", { phone }), 700);
    } else if (next.every(d => d)) {
      setErr(true);
    }
  };

  return (
    <div className="screen screen-in">
      <AppBar onBack={back}/>
      <div className="stack stack-4" style={{ flex: 1 }}>
        <div>
          <h1 className="h1" style={{ marginBottom: 8 }}>{t("otp.title")}</h1>
          <p className="body">{t("otp.sub", { phone: phone || "+218 91 234 5678" })}</p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 10,
          direction: "ltr",
          animation: err ? "otp-shake .35s var(--ease-out)" : "none",
        }}>
          {code.map((d, i) => (
            <input key={i}
              ref={el => refs.current[i] = el}
              value={d}
              onChange={e => onChange(i, e.target.value)}
              onKeyDown={e => { if (e.key === "Backspace" && !d && i > 0) refs.current[i-1]?.focus(); }}
              inputMode="numeric"
              maxLength="1"
              style={{
                width: "100%", aspectRatio: "1",
                padding: 0,
                background: err ? "oklch(from var(--danger) l c h / .08)" : "var(--surface)",
                border: "1.5px solid",
                borderColor: err ? "var(--danger)" : d ? "var(--brand-500)" : "var(--border)",
                borderRadius: "var(--r-md)",
                fontSize: 26, fontWeight: 600, fontFamily: "var(--font-display)",
                textAlign: "center",
                color: "var(--text)",
                outline: "none",
                fontVariantNumeric: "tabular-nums",
                transition: "border-color .15s, background .15s",
              }}/>
          ))}
        </div>
        {err && <div className="small" style={{ color: "var(--danger)" }}>{t("otp.bad")}</div>}
        {verifying && <div className="small" style={{ color: "var(--brand-600)" }}>{t("otp.verifying")}</div>}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button className="btn-ghost btn"
            style={{ width: "auto", padding: "8px 0", color: "var(--text-muted)" }}
            disabled={resend > 0}
            onClick={() => setResend(30)}>
            {resend > 0 ? t("otp.resend", { n: resend }) : t("otp.resend.now")}
          </button>
          <button className="btn-ghost btn" style={{ width: "auto", padding: "8px 0" }} onClick={back}>{t("otp.change")}</button>
        </div>
      </div>
      <style>{`@keyframes otp-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}`}</style>
    </div>
  );
}

/* ── Auth success ────────────────────────────────────────────── */
function ScreenAuthSuccess({ go }) {
  useEffect(() => {
    const id = setTimeout(() => go("dashboard"), 2400);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="screen screen-in" style={{ alignItems: "center", textAlign: "center", paddingTop: 140 }}>
      <CheckRing size={120}/>
      <h1 className="h1" style={{ marginTop: 28 }}>{t("auth.ok.title")}</h1>
      <p className="body" style={{ marginTop: 8 }}>{t("auth.ok.sub")}</p>
      <div className="spacer"/>
      <button className="btn btn-primary" onClick={() => go("dashboard")}>{t("auth.ok.cta")}</button>
    </div>
  );
}

/* ── Enrollment (KYC form) ───────────────────────────────────── */
function ScreenEnrollment({ go, back }) {
  const [data, setData] = useState({ name: "", phone: "", id: "", lic: "", plate: "" });
  const [docs, setDocs] = useState({ id: false, lic: false });
  const valid = Object.values(data).every(v => v.length > 1) && docs.id && docs.lic;

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  return (
    <div className="screen screen-in">
      <AppBar onBack={back} title={t("enr.title")}/>
      <p className="body" style={{ marginBottom: 22 }}>{t("enr.sub")}</p>

      <div className="stack stack-3" style={{ flex: 1 }}>
        <Field label={t("enr.fullname")} placeholder={t("enr.fullname.ph")} value={data.name} onChange={(v) => set("name", v)}/>
        <Field label={t("enr.phone")} prefix="+218" placeholder="9X XXX XXXX" value={data.phone} onChange={(v) => set("phone", v)} dir="ltr"/>
        <Field label={t("enr.id")} placeholder="1198XXXXXXX" value={data.id} onChange={(v) => set("id", v)} dir="ltr"/>
        <Field label={t("enr.license")} placeholder="LIB-XXXXXXX" value={data.lic} onChange={(v) => set("lic", v)} dir="ltr"/>
        <Field label={t("enr.plate")} placeholder="123 TR 5" value={data.plate} onChange={(v) => set("plate", v)} dir="ltr"/>

        <div className="divider">{t("prof.docs")}</div>

        <UploadTile title={t("enr.id.photo")} sub={t("enr.id.photo.sub")} done={docs.id} onClick={() => setDocs(d => ({ ...d, id: !d.id }))}/>
        <UploadTile title={t("enr.lic.photo")} sub={t("enr.lic.photo.sub")} done={docs.lic} onClick={() => setDocs(d => ({ ...d, lic: !d.lic }))}/>
      </div>

      <div className="action-bar">
        <button className="btn btn-primary" disabled={!valid} onClick={() => go("enrollmentPending")}>
          {t("enr.submit")}
        </button>
      </div>
    </div>
  );
}

/* ── Enrollment pending ──────────────────────────────────────── */
function ScreenEnrollmentPending({ go }) {
  const items = [
    { k: t("enr.fullname"), v: "Ahmed Al-Tarhouni" },
    { k: t("enr.id"), v: "1198********" },
    { k: t("enr.license"), v: "LIB-2843109" },
    { k: t("enr.plate"), v: "247 TR 5" },
    { k: t("prof.docs"), v: "2 of 2" },
  ];
  return (
    <div className="screen screen-in" style={{ paddingTop: 88 }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          width: 88, height: 88, borderRadius: 28,
          background: "var(--brand-50)",
          color: "var(--brand-700)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginBottom: 18,
        }}>
          <Ic.clock size={42}/>
        </div>
        <h1 className="h1">{t("enr.pend.title")}</h1>
        <p className="body" style={{ marginTop: 8, maxWidth: 320, marginInline: "auto" }}>{t("enr.pend.sub")}</p>
        <span className="badge badge-warn" style={{ marginTop: 14 }}>
          <Ic.clock size={12}/> {t("enr.pend.eta")}
        </span>
      </div>

      <div className="card" style={{ padding: 4 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 14px",
            borderBottom: i < items.length - 1 ? "1px solid var(--hairline)" : "none",
          }}>
            <span className="small" style={{ color: "var(--text-muted)" }}>{it.k}</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{it.v}</span>
          </div>
        ))}
      </div>

      <div className="spacer"/>
      <button className="btn btn-secondary" onClick={() => go("welcome")}>{t("enr.pend.home")}</button>
    </div>
  );
}

window.ScreenWelcome = ScreenWelcome;
window.ScreenAuth = ScreenAuth;
window.ScreenOTP = ScreenOTP;
window.ScreenAuthSuccess = ScreenAuthSuccess;
window.ScreenEnrollment = ScreenEnrollment;
window.ScreenEnrollmentPending = ScreenEnrollmentPending;
