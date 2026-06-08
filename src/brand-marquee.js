/**
 * Brand trust strip: ScrollTrigger intro for heading/sub + infinite GSAP marquee.
 * Expects global gsap + ScrollTrigger (script tags before this module).
 */

function initBrandTrustIntro() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || typeof globalThis.gsap === "undefined" || typeof globalThis.ScrollTrigger === "undefined") {
    return;
  }
  const heading = document.querySelector(".brand-trust-intro-heading");
  const sub = document.querySelector(".brand-trust-intro-sub");
  const section = document.querySelector(".brand-trust-section");
  if (!heading || !sub || !section) return;

  const gsap = globalThis.gsap;
  const ScrollTrigger = globalThis.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  try {
    gsap.set(heading, {
      opacity: 0,
      y: 140,
      scale: 0.82,
      transformOrigin: "50% 100%",
      filter: "blur(14px)",
      force3D: true,
    });
    gsap.set(sub, {
      opacity: 0,
      y: 96,
      filter: "blur(10px)",
      force3D: true,
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top 72%",
      once: true,
      invalidateOnRefresh: true,
      onEnter: () => {
        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          onComplete: () => {
            gsap.set([heading, sub], { clearProps: "filter" });
          },
        });
        tl.to(heading, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.35,
          ease: "power4.out",
        }).to(
          sub,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.15,
            ease: "power3.out",
          },
          "-=0.72"
        );
      },
    });
  } catch {
    if (typeof globalThis.gsap !== "undefined") {
      const h = document.querySelector(".brand-trust-intro-heading");
      const su = document.querySelector(".brand-trust-intro-sub");
      if (h && su) globalThis.gsap.set([h, su], { clearProps: "opacity,transform,filter" });
    }
  }

  window.addEventListener("load", () => {
    if (typeof globalThis.ScrollTrigger !== "undefined") {
      globalThis.ScrollTrigger.refresh();
    }
  });
}

function initBrandMarquee() {
  const gsap = globalThis.gsap;
  const track = document.querySelector("[data-brand-marquee]");
  const section = document.querySelector(".brand-trust-section");
  const viewport = document.querySelector(".brand-marquee-viewport");
  if (!track || !section) return;

  document.querySelectorAll(".brand-marquee-item > img").forEach((img) => {
    const shell = document.createElement("span");
    shell.className = "brand-logo-shell";
    img.replaceWith(shell);
    shell.appendChild(img);
  });

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced || typeof gsap === "undefined") {
    section.classList.add("brand-marquee--static");
    return;
  }

  let tween = null;
  let resizeTimer = null;

  const build = () => {
    const sets = track.querySelectorAll(".brand-marquee-set");
    if (sets.length < 2) return;
    const loopDistance = sets[1].offsetLeft - sets[0].offsetLeft;
    if (loopDistance <= 0) return;

    tween?.kill();
    gsap.set(track, { x: 0 });
    const destCardStrip = section.classList.contains("brand-trust-section--dest-cards");
    tween = gsap.to(track, {
      x: -loopDistance,
      duration: destCardStrip ? 32 : 20,
      ease: "none",
      repeat: -1,
    });

    if (viewport) {
      viewport.onmouseenter = () => tween && tween.timeScale(0.4);
      viewport.onmouseleave = () => tween && tween.timeScale(1);
    }
  };

  build();

  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 100);
  });
  ro.observe(track);

  document.addEventListener("visibilitychange", () => {
    if (!tween) return;
    if (document.hidden) tween.pause();
    else tween.resume();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initBrandTrustIntro();
});

window.addEventListener("load", () => {
  initBrandMarquee();
});
