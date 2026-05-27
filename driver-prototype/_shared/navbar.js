// Bottom tab bar, injected into every `.phone` (like frame.js).
// The active tab is read from `<body data-nav="home|trips|earnings|profile">`.
// Pages that include this script also get a `.has-navbar` class on <html> so
// `.screen` reserves bottom room (see app.css).

(function () {
  const TABS = [
    {
      id: "home", href: "../dashboard/index.html",
      label: { en: "Home", ar: "الرئيسية" },
      icon: '<path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    },
    {
      id: "trips", href: "../trip-history/index.html",
      label: { en: "Trips", ar: "الرحلات" },
      icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    },
    {
      id: "earnings", href: "../earnings/index.html",
      label: { en: "Earnings", ar: "الأرباح" },
      icon: '<path d="M4 19V10"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M21 19H3"/>',
    },
    {
      id: "profile", href: "../profile/index.html",
      label: { en: "Profile", ar: "حسابي" },
      icon: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    },
  ];

  // Register tab labels so they swap with the language toggle.
  if (window.I18N) {
    const reg = {};
    TABS.forEach((t) => (reg["nav." + t.id] = t.label));
    I18N.register(reg);
  }

  function mount() {
    const active = document.body.getAttribute("data-nav");
    document.querySelectorAll(".phone").forEach((phone) => {
      if (phone.dataset.navbar === "ready") return;
      const nav = document.createElement("nav");
      nav.className = "navbar";
      nav.innerHTML = TABS.map((t) => `
        <a class="nav-item${t.id === active ? " on" : ""}" href="${t.href}">
          <span class="nav-ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t.icon}</svg>
          </span>
          <span class="nav-lbl" data-i18n="nav.${t.id}">${t.label.en}</span>
        </a>`).join("");
      phone.appendChild(nav);
      phone.dataset.navbar = "ready";
    });
    document.documentElement.classList.add("has-navbar");
    if (window.I18N) I18N.apply();
  }

  document.addEventListener("DOMContentLoaded", mount);
})();
