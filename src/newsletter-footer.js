/**
 * Newsletter + footer: GSAP ScrollTrigger reveal.
 * Uses onEnter + in-view sync so content still appears after refresh / scroll restoration.
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

/**
 * Parse "top 88%" → 0.88 (viewport height fraction from top). Fallback for other strings.
 */
function parseStartFraction(start) {
  const m = String(start).match(/top\s+(\d+(?:\.\d+)?)%/i);
  if (m) return Number(m[1]) / 100;
  return 0.88;
}

function createScrollReveal({
  getRoot,
  selector,
  start = "top 88%",
  initialY = 34,
  blurPx = 8,
  duration = 0.72,
  stagger = 0.12,
}) {
  const reduceMotion = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsap = globalThis.gsap;
  const ScrollTrigger = globalThis.ScrollTrigger;
  const section = typeof getRoot === "function" ? getRoot() : getRoot;

  const showPlain = (animEls) => {
    animEls.forEach((el) => {
      el.style.removeProperty("opacity");
      el.style.removeProperty("transform");
      el.style.removeProperty("filter");
    });
  };

  if (!section) return;

  const animEls = section.querySelectorAll(selector);
  if (!animEls.length) return;

  if (reduceMotion || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    showPlain(animEls);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.set(animEls, {
    opacity: 0,
    y: initialY,
    filter: `blur(${blurPx}px)`,
    force3D: true,
  });

  let hasPlayed = false;

  const startFrac = parseStartFraction(start);

  const playReveal = () => {
    if (hasPlayed) return;
    hasPlayed = true;
    gsap.killTweensOf(animEls);
    gsap.to(animEls, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration,
      stagger,
      ease: "power3.out",
      onComplete: () => {
        gsap.set(animEls, { clearProps: "filter" });
      },
    });
  };

  /** If the trigger line is already passed (e.g. after refresh with scroll restored), show immediately. */
  const syncIfAlreadyInView = () => {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const triggerY = vh * startFrac;
    const intersectsViewport = rect.bottom > 0 && rect.top < vh;
    const pastStart = rect.top <= triggerY;
    if (intersectsViewport && pastStart) {
      playReveal();
    }
  };

  ScrollTrigger.create({
    trigger: section,
    start,
    end: "bottom top",
    invalidateOnRefresh: true,
    onEnter: playReveal,
  });

  const runSync = () => {
    ScrollTrigger.refresh();
    syncIfAlreadyInView();
  };

  requestAnimationFrame(runSync);
  setTimeout(runSync, 50);
  setTimeout(runSync, 200);
  setTimeout(runSync, 500);

  window.addEventListener("load", runSync, { passive: true });
  window.addEventListener("pageshow", runSync, { passive: true });
}

/**
 * Newsletter: blue bg top-to-bottom reveal + email field colors (scrub).
 * Shared across pages; was previously inline on index.html only.
 */
function initNewsletterBgReveal() {
  const nlSection = document.getElementById("newsletter");
  if (!nlSection) return;

  const nlBg = nlSection.querySelector("[data-newsletter-bg-reveal]");
  const nlHead = document.getElementById("newsletter-heading");
  const nlDesc = document.getElementById("newsletter-description");
  const nlEmail = document.getElementById("newsletter-email");

  const reduceMotion = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    if (nlBg) {
      nlBg.style.transform = "scaleY(1)";
    }
    return;
  }

  const gsap = globalThis.gsap;
  const ScrollTrigger = globalThis.ScrollTrigger;
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    if (nlBg) {
      nlBg.style.transform = "scaleY(1)";
    }
    if (nlHead) {
      nlHead.style.color = "#ffffff";
    }
    if (nlDesc) {
      nlDesc.style.color = "#e2e8f0";
    }
    if (nlEmail) {
      nlEmail.style.setProperty("--nl-input-border", "#ffffff");
      nlEmail.style.color = "#ffffff";
      nlEmail.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
    }
    return;
  }

  if (!nlBg || !nlHead || !nlDesc) return;

  gsap.registerPlugin(ScrollTrigger);

  const colorEase = "sine.inOut";
  const colorDur = 0.66;
  const bgDur = 0.7;

  try {
    gsap.set(nlBg, { scaleY: 0, transformOrigin: "top center", force3D: true });

    const nlScroll = {
      trigger: nlSection,
      start: "top 86%",
      end: () => {
        const h = nlSection.offsetHeight || 0;
        const px = Math.max(180, Math.round(h * 0.45));
        return `+=${px}`;
      },
      scrub: 0.45,
      invalidateOnRefresh: true,
    };

    const nlTl = gsap.timeline({
      scrollTrigger: nlScroll,
      onComplete: () => {
        gsap.set(nlBg, { clearProps: "willChange" });
      },
    });

    nlTl.fromTo(
      nlBg,
      { scaleY: 0 },
      { scaleY: 1, duration: bgDur, ease: colorEase },
      0
    );
    if (nlEmail) {
      nlTl.fromTo(
        nlEmail,
        {
          "--nl-input-border": "#cbd5e1",
          color: "#0f172a",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        },
        {
          "--nl-input-border": "#ffffff",
          color: "#ffffff",
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          duration: colorDur,
          ease: colorEase,
        },
        0
      );
    }
  } catch {
    if (typeof globalThis.gsap !== "undefined") {
      gsap.set(nlBg, { scaleY: 1, clearProps: "willChange" });
      gsap.set([nlHead, nlDesc], { clearProps: "color" });
      if (nlEmail) {
        gsap.set(nlEmail, { clearProps: "--nl-input-border,color,backgroundColor" });
      }
    }
  }

  window.addEventListener(
    "load",
    () => {
      if (typeof globalThis.ScrollTrigger !== "undefined") {
        globalThis.ScrollTrigger.refresh();
      }
    },
    { passive: true }
  );
}

runWhenGsapReady(() => {
  const initReveals = () => {
    initNewsletterBgReveal();
    createScrollReveal({
      getRoot: () => document.getElementById("newsletter"),
      selector: "[data-newsletter-anim]",
      start: "top 88%",
      initialY: 36,
      blurPx: 10,
      duration: 0.75,
      stagger: 0.11,
    });

    createScrollReveal({
      getRoot: () => document.querySelector("footer"),
      selector: "[data-footer-anim]",
      start: "top 88%",
      initialY: 34,
      blurPx: 8,
      duration: 0.72,
      stagger: 0.12,
    });
  };

  const layoutReady = globalThis.__layoutReady;
  if (layoutReady && typeof layoutReady.then === "function") {
    layoutReady.finally(initReveals);
  } else {
    initReveals();
  }
});
