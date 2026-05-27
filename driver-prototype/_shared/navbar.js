// Bottom tab bar, injected into every `.phone` (like frame.js).
// The active tab is read from `<body data-nav="home|trips|earnings|profile">`.
// Pages that include this script also get a `.has-navbar` class on <html> so
// `.screen` reserves bottom room (see app.css).

(function () {
  const TABS = [
    {
      id: "home", href: "../dashboard/index.html",
      label: { en: "Home", ar: "الرئيسية" },
      icon: '<path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2v-9z"/>',
    },
    {
      id: "trips", href: "../trip-history/index.html",
      label: { en: "Trips", ar: "الرحلات" },
      icon: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 8v4l3 2"/>',
    },
    {
      id: "earnings", href: "../earnings/index.html",
      label: { en: "Earnings", ar: "الأرباح" },
      icon: '<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/><path d="M16 12h3"/><path d="M3 9h18"/>',
    },
    {
      id: "profile", href: "../profile/index.html",
      label: { en: "Profile", ar: "حسابي" },
      icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
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
                 stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${t.icon}</svg>
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
