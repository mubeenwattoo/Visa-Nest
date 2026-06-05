/** Services activity cards: same scroll-scrub pattern as destinations-catalog.js */

function visaNestRefreshScrollLayout() {
  globalThis.ScrollTrigger?.refresh();
  globalThis.dispatchEvent(new CustomEvent("visa-nest-scroll-layout-refresh", { bubbles: true }));
}

function motionOk() {
  return (
    typeof globalThis.gsap !== "undefined" &&
    typeof globalThis.ScrollTrigger !== "undefined" &&
    !globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

let servicesCardAnimContext = null;

function teardownServicesCardScrollAnim() {
  servicesCardAnimContext?.revert();
  servicesCardAnimContext = null;
}

function chunkByCols(list, cols) {
  const arr = Array.from(list);
  const rows = [];
  for (let i = 0; i < arr.length; i += cols) {
    rows.push(arr.slice(i, i + cols));
  }
  return rows;
}

function setupMobileCardScrollScrub(articles, loadBtn) {
  const gsap = globalThis.gsap;
  Array.from(articles).forEach((card) => {
    gsap.set(card, { opacity: 0, y: 88, force3D: true });
    gsap.to(card, {
      opacity: 1,
      y: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 92%",
        end: "top 50%",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });
  });
  if (loadBtn && !loadBtn.hidden) {
    gsap.set(loadBtn, { opacity: 0, y: 72, force3D: true });
    gsap.to(loadBtn, {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: loadBtn,
        start: "top 93%",
        end: "top 58%",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });
  }
}

function setupRowTimelineScroll(articles, cols, grid, loadBtn) {
  const gsap = globalThis.gsap;
  const rows = chunkByCols(articles, cols);
  if (!rows.length) return;

  gsap.set(articles, { opacity: 0, y: 52, scale: 0.97, force3D: true });
  if (loadBtn && !loadBtn.hidden) {
    gsap.set(loadBtn, { opacity: 0, y: 44, scale: 0.98, force3D: true });
  }

  const rowGap = 0.44;
  const rowTweenDuration = 0.48;
  const staggerInRow = 0.08;
  const scrollPerRow = 200;
  const baseEnd = 160;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: grid,
      start: "top 50%",
      end: () => {
        const n = rows.length + (loadBtn && !loadBtn.hidden ? 1 : 0);
        return `+=${baseEnd + n * scrollPerRow}`;
      },
      scrub: 0.72,
      invalidateOnRefresh: true,
    },
  });

  rows.forEach((row, i) => {
    tl.to(
      row,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: rowTweenDuration,
        stagger: staggerInRow,
        ease: "power2.out",
      },
      i * rowGap
    );
  });

  if (loadBtn && !loadBtn.hidden) {
    tl.to(
      loadBtn,
      { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: "power2.out" },
      rows.length * rowGap + 0.12
    );
  }
}

function setupServicesCardGridScrollAnim() {
  teardownServicesCardScrollAnim();
  if (!motionOk()) return;

  const gsap = globalThis.gsap;
  const ScrollTrigger = globalThis.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  const section = document.getElementById("services-activities-catalog");
  const grid = document.getElementById("services-activities-grid");
  const loadBtn = document.getElementById("services-load-more");
  if (!section || !grid) return;

  const articles = grid.querySelectorAll("article:not(.hidden)");
  if (!articles.length) return;

  servicesCardAnimContext = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add("(max-width: 767px)", () => {
      setupMobileCardScrollScrub(articles, loadBtn);
    });

    mm.add("(min-width: 768px) and (max-width: 1279px)", () => {
      setupRowTimelineScroll(articles, 2, grid, loadBtn);
    });

    mm.add("(min-width: 1280px)", () => {
      setupRowTimelineScroll(articles, 3, grid, loadBtn);
    });
  }, section);
}

function scheduleServicesCardScrollAnim() {
  globalThis.requestAnimationFrame(() => {
    setupServicesCardGridScrollAnim();
    visaNestRefreshScrollLayout();
  });
}

function init() {
  const grid = document.getElementById("services-activities-grid");
  const loadBtn = document.getElementById("services-load-more");
  if (!grid || !loadBtn) return;

  if (!globalThis.__visaNestServicesActivitiesResizeListener) {
    globalThis.__visaNestServicesActivitiesResizeListener = true;
    globalThis.addEventListener("resize", () => {
      visaNestRefreshScrollLayout();
    });
  }

  scheduleServicesCardScrollAnim();

  loadBtn.addEventListener("click", () => {
    grid.querySelectorAll(".services-activities-extra").forEach((el) => {
      el.classList.remove("hidden");
      el.classList.add("flex", "flex-col");
    });
    loadBtn.hidden = true;
    loadBtn.setAttribute("aria-expanded", "true");
    scheduleServicesCardScrollAnim();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
