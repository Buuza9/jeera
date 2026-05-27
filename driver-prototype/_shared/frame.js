// Injects the iPhone chrome (status bar + home indicator) into every `.phone`
// so feature pages don't repeat markup. Status bar shows 9:41, cell/wifi/battery.

(function () {
  const STATUS_BAR = `
    <div class="status-bar">
      <div class="sb-time">9:41</div>
      <div class="sb-right">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor" aria-hidden="true">
          <rect x="0"  y="6" width="3" height="5" rx="1"/>
          <rect x="5"  y="4" width="3" height="7" rx="1"/>
          <rect x="10" y="2" width="3" height="9" rx="1"/>
          <rect x="15" y="0" width="3" height="11" rx="1"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
          <path d="M1 4.5 A11 11 0 0 1 15 4.5"/>
          <path d="M3.5 7 A7 7 0 0 1 12.5 7"/>
          <path d="M6 9.5 A3.5 3.5 0 0 1 10 9.5"/>
          <circle cx="8" cy="10.5" r="0.9" fill="currentColor" stroke="none"/>
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" opacity=".5"/>
          <rect x="23.5" y="3.5" width="2" height="5" rx="1" fill="currentColor" opacity=".5"/>
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor"/>
        </svg>
      </div>
    </div>`;

  const HOME_INDICATOR = `<div class="home-indicator"></div>`;

  // Sliders icon — the handle that collapses / reveals the dev toolbar.
  const TOOLBAR_HANDLE = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <path d="M4 7h8M16 7h4M4 17h4M12 17h8"/>
      <circle cx="14" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>
    </svg>`;

  function mount() {
    document.querySelectorAll(".phone").forEach((phone) => {
      if (phone.dataset.chrome === "ready") return;
      phone.insertAdjacentHTML("afterbegin", STATUS_BAR);
      phone.insertAdjacentHTML("beforeend", HOME_INDICATOR);
      phone.dataset.chrome = "ready";
    });
  }

  // Add a collapse/expand handle to the dev toolbar so it can be tucked away.
  // State persists across pages; default is collapsed (out of the way).
  const TOOLBAR_KEY = "jeera.toolbar";
  function mountToolbar() {
    document.querySelectorAll(".toolbar").forEach((tb) => {
      if (tb.dataset.toggle === "ready") return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "toolbar-toggle";
      btn.setAttribute("aria-label", "Toggle toolbar");
      btn.innerHTML = TOOLBAR_HANDLE;
      tb.insertBefore(btn, tb.firstChild);
      btn.addEventListener("click", () => {
        const collapsed = tb.classList.toggle("collapsed");
        localStorage.setItem(TOOLBAR_KEY, collapsed ? "collapsed" : "open");
      });
      if ((localStorage.getItem(TOOLBAR_KEY) || "collapsed") === "collapsed") {
        tb.classList.add("collapsed");
      }
      tb.dataset.toggle = "ready";
    });
  }

  // Compute the phone scale so the 440 × 956 frame fits any viewport.
  // CSS `scale()` needs a unitless number, so we compute it here and feed
  // the result into a custom property the stylesheet consumes.
  const PHONE_W = 440;
  const PHONE_H = 956;
  const STAGE_PAD = 32; // matches .stage padding (16px on each side)

  function fitPhone() {
    const sx = Math.min(
      1,
      (window.innerHeight - STAGE_PAD) / PHONE_H,
      (window.innerWidth  - STAGE_PAD) / PHONE_W,
    );
    document.documentElement.style.setProperty("--phone-scale", sx);
  }

  document.addEventListener("DOMContentLoaded", () => {
    mount();
    mountToolbar();
    fitPhone();
  });
  window.addEventListener("resize", fitPhone);
  // Run synchronously too so the very first paint already has the right size.
  fitPhone();
})();
