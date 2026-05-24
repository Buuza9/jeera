// Tiny i18n: lang toggle + dir switch + theme toggle, persisted in localStorage.
// Feature pages register their copy via `window.I18N.register({ key: { en, ar }})`
// and `data-i18n="key"` attributes get swapped on toggle.

(function () {
  const LANG_KEY  = "jeera.lang";
  const THEME_KEY = "jeera.theme";

  const dict = {};

  function apply() {
    const lang  = localStorage.getItem(LANG_KEY)  || "en";
    const theme = localStorage.getItem(THEME_KEY) || "light";

    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("data-theme", theme);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const entry = dict[key];
      if (entry && entry[lang]) el.textContent = entry[lang];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const entry = dict[key];
      if (entry && entry[lang]) el.setAttribute("placeholder", entry[lang]);
    });

    document.querySelectorAll("[data-toolbar-lang]").forEach((b) => {
      b.classList.toggle("active", b.dataset.toolbarLang === lang);
    });
    document.querySelectorAll("[data-toolbar-theme]").forEach((b) => {
      b.classList.toggle("active", b.dataset.toolbarTheme === theme);
    });
  }

  window.I18N = {
    register(entries) { Object.assign(dict, entries); apply(); },
    setLang(l)  { localStorage.setItem(LANG_KEY, l);  apply(); },
    setTheme(t) { localStorage.setItem(THEME_KEY, t); apply(); },
    apply,
    t(key) {
      const lang = localStorage.getItem(LANG_KEY) || "en";
      return (dict[key] && dict[key][lang]) || key;
    },
  };

  document.addEventListener("DOMContentLoaded", apply);
})();
