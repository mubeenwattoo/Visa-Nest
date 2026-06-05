/**
 * Blog listing: staggered reveal for [data-blog-card] when #blog-posts enters view.
 * Runs after GSAP is on window (same pattern as newsletter-footer.js) so ScrollTrigger
 * stays in sync after layout/fonts and other triggers refresh.
 */

function runWhenGsapReady(fn) {
  let tries = 0;
  const max = 240;
  const tick = () => {
    if (typeof globalThis.gsap !== "undefined" && typeof globalThis.ScrollTrigger !== "undefined") {
      fn();
      return;
    }
    tries += 1;
    if (tries < max) {
      requestAnimationFrame(tick);
    } else {
      fn();
    }
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(tick), { once: true });
  } else {
    requestAnimationFrame(tick);
  }
}

function initBlogPostsScroll() {
  const section = document.getElementById("blog-posts");
  const cards = section?.querySelectorAll("[data-blog-card]");
  if (!section || !cards?.length) return;

  const gsap = globalThis.gsap;
  const ScrollTrigger = globalThis.ScrollTrigger;
  const reduceMotion = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !gsap || !ScrollTrigger) {
    if (gsap) {
      gsap.set(cards, { clearProps: "opacity,transform" });
    }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.set(cards, { opacity: 0, y: 40, force3D: true });

  let hasPlayed = false;

  const playReveal = () => {
    if (hasPlayed) return;
    hasPlayed = true;
    gsap.killTweensOf(cards);
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(cards, { clearProps: "opacity,transform" });
      },
    });
  };

  const startFrac = 0.72;

  ScrollTrigger.create({
    trigger: section,
    start: "top 72%",
    invalidateOnRefresh: true,
    onEnter: playReveal,
  });

  const syncIfInView = () => {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const triggerY = vh * startFrac;
    const intersects = rect.bottom > 0 && rect.top < vh;
    const pastStart = rect.top <= triggerY;
    if (intersects && pastStart) {
      playReveal();
    }
  };

  const runSync = () => {
    ScrollTrigger.refresh();
    // Only auto-play after refresh if user is already scrolled (restore/back nav).
    if (window.scrollY > 60) syncIfInView();
  };

  requestAnimationFrame(() => ScrollTrigger.refresh());
  window.addEventListener("load", runSync, { passive: true });
  window.addEventListener("pageshow", runSync, { passive: true });
}

runWhenGsapReady(() => {
  initBlogPostsScroll();
});
