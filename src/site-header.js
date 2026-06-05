const HEADER_PARTIAL_URL = new URL("../partials/navbar.html", import.meta.url);
const FOOTER_PARTIAL_URL = new URL("../partials/footer.html", import.meta.url);

const DESKTOP_ACTIVE =
  "nav-link relative pb-1 text-primary-yellow transition-colors duration-300 hover:text-primary-yellow after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-100 after:bg-primary-yellow after:transition-transform after:duration-300";
const DESKTOP_IDLE =
  "nav-link relative pb-1 text-white transition-colors duration-300 hover:text-primary-yellow after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary-yellow after:transition-transform after:duration-300 hover:after:scale-x-100";
const MOBILE_ACTIVE =
  "block rounded-lg bg-[#FFF7DB] px-3 py-2 font-semibold text-[#113e7a] ring-1 ring-inset ring-[#F4B400]/40";
const MOBILE_IDLE =
  "block rounded-lg px-3 py-2 font-medium text-slate-700 transition-colors duration-200 hover:bg-[#F4B400]/12";

function applyActiveNav(active) {
  document.querySelectorAll("#desktop-nav-links a[data-nav]").forEach((a) => {
    a.className = a.dataset.nav === active ? DESKTOP_ACTIVE : DESKTOP_IDLE;
  });
  document.querySelectorAll("#mobile-menu a[data-nav]").forEach((a) => {
    a.className = a.dataset.nav === active ? MOBILE_ACTIVE : MOBILE_IDLE;
  });
}

function bindMediaQueryClose(setMobileNavOpen) {
  const mq = window.matchMedia("(min-width: 1024px)");
  const handler = () => {
    if (mq.matches) setMobileNavOpen(false);
  };
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", handler);
  } else if (typeof mq.addListener === "function") {
    mq.addListener(handler);
  }
}

function initHeaderChrome() {
  const siteHeader = document.getElementById("site-header");
  const siteNav = document.getElementById("site-nav");
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (siteHeader) {
    const updateHeaderOnScroll = () => {
      const isScrolled = window.scrollY > 24;
      /* Dark bar (bg-black/70) kicks in a bit later so it doesn’t appear at the first nudge. */
      const isScrolledForBar = window.scrollY > 96;
      siteHeader.classList.toggle("site-header--scrolled", isScrolledForBar);
      siteHeader.classList.toggle("shadow-[0_1px_0_0_rgba(15,23,42,0.06)]", isScrolled);
      siteHeader.classList.toggle("shadow-none", !isScrolled);
      if (siteNav) {
        siteNav.classList.toggle("py-4", !isScrolled);
        siteNav.classList.toggle("sm:py-5", !isScrolled);
        siteNav.classList.toggle("py-3", isScrolled);
        siteNav.classList.toggle("sm:py-4", isScrolled);
      }
    };
    updateHeaderOnScroll();
    window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
  }

  const setMobileNavOpen = (open) => {
    if (!siteHeader || !menuBtn || !mobileMenu) return;
    siteHeader.classList.toggle("mobile-nav-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.setAttribute("aria-hidden", String(!open));
    try {
      if ("inert" in mobileMenu) {
        mobileMenu.inert = !open;
      }
    } catch {
      /* ignore */
    }
    document.body.style.overflow = open ? "hidden" : "";
  };

  if (menuBtn && mobileMenu && siteHeader) {
    const toggleFromEvent = () => {
      const willOpen = !siteHeader.classList.contains("mobile-nav-open");
      setMobileNavOpen(willOpen);
    };
    menuBtn.addEventListener("click", toggleFromEvent, { capture: true });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && siteHeader.classList.contains("mobile-nav-open")) {
        setMobileNavOpen(false);
      }
    });
    bindMediaQueryClose(setMobileNavOpen);
  }
}

function wireNav() {
  const active = document.body.dataset.activeNav || "home";
  applyActiveNav(active);
  initHeaderChrome();
}

async function fetchPartial(candidates) {
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        return await res.text();
      }
    } catch {
      /* try next */
    }
  }
  return null;
}

async function mountHeader() {
  const root = document.getElementById("site-header-root");
  if (!root) return;

  const candidates = [HEADER_PARTIAL_URL.href, new URL("partials/navbar.html", document.baseURI).href];
  const html = await fetchPartial(candidates);
  if (!html) return;

  root.outerHTML = html.trim();
}

async function mountFooter() {
  const root = document.getElementById("site-footer-root");
  if (!root) return;

  const candidates = [FOOTER_PARTIAL_URL.href, new URL("partials/footer.html", document.baseURI).href];
  const html = await fetchPartial(candidates);
  if (!html) return;

  root.outerHTML = html.trim();
}

async function boot() {
  await Promise.all([mountHeader(), mountFooter()]);
  if (document.getElementById("site-header")) {
    wireNav();
  }
}

if (document.readyState === "loading") {
  globalThis.__layoutReady = new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", () => {
      boot().finally(resolve);
    });
  });
} else {
  globalThis.__layoutReady = boot();
}
