/**
 * Home / About page: #about.about-on-primary — blue bg scaleY scrub, text color scrub,
 * staggered content, stat counters (same behavior as former index.html inline block).
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

function initAboutOnPrimary() {
  const gsap = globalThis.gsap;
  const ScrollTrigger = globalThis.ScrollTrigger;
  const reduceMotion = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  const section = document.getElementById("about");
  if (!section) return;

  if (reduceMotion) {
    const bgRevealRm = section.querySelector("[data-about-bg-reveal]");
    if (bgRevealRm) {
      bgRevealRm.style.transform = "scaleY(1)";
    }
    return;
  }

  const bgReveal = section.querySelector("[data-about-bg-reveal]");
  const aboutLead = section.querySelector("[data-about-lead]");
  const disclaimers = section.querySelectorAll(".about-disclaimer");
  const statLabels = section.querySelectorAll(".about-stat-label");
  const leftItems = section.querySelectorAll(".about-anim-left");
  const readMoreCta = section.querySelector(".about-anim-cta");
  const disclaimerAnim = section.querySelector(".about-anim-disclaimer");
  const imgs = section.querySelectorAll(".about-anim-img");
  const statEls = section.querySelectorAll(".about-stat-value");

  if (!leftItems.length && !imgs.length && !statEls.length) return;

  gsap.registerPlugin(ScrollTrigger);

  const formatStat = (value, format, suffix) => {
    if (format === "k") {
      const k = Math.max(0, Math.round(value / 1000));
      return `${k}K${suffix || ""}`;
    }
    const n = Math.max(0, Math.round(value));
    return `${n}${suffix || ""}`;
  };

  const resetStatsToZero = () => {
    statEls.forEach((el) => {
      const format = el.dataset.format || "";
      const suffix = el.dataset.suffix || "";
      el.textContent = formatStat(0, format, suffix);
    });
  };

  try {
    if (bgReveal) {
      gsap.set(bgReveal, { scaleY: 0, transformOrigin: "top center", force3D: true });
    }
    gsap.set(leftItems, { opacity: 0, y: 48, filter: "blur(10px)", force3D: true });
    if (readMoreCta) {
      gsap.set(readMoreCta, { opacity: 0, y: 18, force3D: true });
    }
    if (disclaimerAnim) {
      gsap.set(disclaimerAnim, { opacity: 0, y: 36, filter: "blur(8px)", force3D: true });
    }
    if (aboutLead) {
      gsap.set(aboutLead, { opacity: 0, y: 28, filter: "blur(4px)", force3D: true });
    }
    gsap.set(imgs, { opacity: 0, y: 42, scale: 0.94, filter: "blur(12px)", force3D: true });
    gsap.set(statEls, { opacity: 0, y: 24, filter: "blur(8px)", force3D: true });
    resetStatsToZero();

    const aboutScroll = {
      trigger: section,
      start: "top 82%",
      end: "bottom 58%",
      scrub: 1.45,
      invalidateOnRefresh: true,
    };

    const visualTl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: aboutScroll,
      onComplete: () => {
        const revealTargets = [...leftItems, ...imgs, ...statEls];
        if (readMoreCta) revealTargets.push(readMoreCta);
        if (disclaimerAnim) revealTargets.push(disclaimerAnim);
        if (aboutLead) revealTargets.push(aboutLead);
        gsap.set(revealTargets, { clearProps: "filter" });
        if (bgReveal) {
          gsap.set(bgReveal, { clearProps: "willChange" });
        }
      },
    });

    const colorEase = "sine.inOut";
    const colorDur = 0.66;
    const bgDur = 0.7;

    if (bgReveal) {
      visualTl.fromTo(
        bgReveal,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: bgDur,
          ease: colorEase,
        },
        0
      );
    }

    if (aboutLead) {
      visualTl.fromTo(
        aboutLead,
        { color: "#334155" },
        { color: "#ffffff", duration: colorDur, ease: colorEase },
        0
      );
    }
    disclaimers.forEach((el) => {
      visualTl.fromTo(
        el,
        { color: "#475569" },
        { color: "#e2e8f0", duration: colorDur, ease: colorEase },
        0
      );
    });
    statLabels.forEach((el) => {
      visualTl.fromTo(
        el,
        { color: "#64748b" },
        { color: "#cbd5e1", duration: colorDur, ease: colorEase },
        0
      );
    });
    statEls.forEach((el) => {
      visualTl.fromTo(
        el,
        { color: "#0047ab" },
        { color: "#f4b400", duration: colorDur, ease: colorEase },
        0
      );
    });

    visualTl.to(
      leftItems,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.72,
        stagger: 0.11,
      },
      0.12
    );
    if (aboutLead) {
      visualTl.to(
        aboutLead,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.38,
          ease: "power2.out",
        },
        0.2
      );
    }
    if (disclaimerAnim) {
      visualTl.to(
        disclaimerAnim,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power3.out",
        },
        0.32
      );
    }
    if (readMoreCta) {
      visualTl.to(
        readMoreCta,
        {
          opacity: 1,
          y: 0,
          duration: 0.28,
          ease: "power2.out",
        },
        0.34
      );
    }
    visualTl.to(
      imgs,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.82,
        stagger: 0.12,
        ease: "power4.out",
      },
      0.2
    );
    visualTl.to(
      statEls,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.62,
        stagger: 0.12,
        ease: "power3.out",
      },
      0.28
    );

    const activeCounterTweens = [];
    const stopCounterTweens = () => {
      activeCounterTweens.forEach((t) => t.kill());
      activeCounterTweens.length = 0;
    };

    const playCountUp = () => {
      stopCounterTweens();
      resetStatsToZero();
      statEls.forEach((el, idx) => {
        const target = Number(el.dataset.count || "0") || 0;
        const format = el.dataset.format || "";
        const suffix = el.dataset.suffix || "";
        const step = format === "k" ? 1000 : 1;
        const counter = { v: 0 };
        const tween = gsap.to(counter, {
          v: target,
          duration: 2.2 + idx * 0.25,
          ease: "power1.out",
          snap: { v: step },
          onUpdate: () => {
            el.dataset.current = String(counter.v);
            el.textContent = formatStat(counter.v, format, suffix);
          },
        });
        activeCounterTweens.push(tween);
      });
    };

    const playCountDown = () => {
      stopCounterTweens();
      statEls.forEach((el, idx) => {
        const format = el.dataset.format || "";
        const suffix = el.dataset.suffix || "";
        const step = format === "k" ? 1000 : 1;
        const startVal = Number(el.dataset.current || "0") || 0;
        const counter = { v: startVal };
        const tween = gsap.to(counter, {
          v: 0,
          duration: 1.0 + idx * 0.12,
          ease: "power1.in",
          snap: { v: step },
          onUpdate: () => {
            el.dataset.current = String(counter.v);
            el.textContent = formatStat(counter.v, format, suffix);
          },
          onComplete: () => {
            el.dataset.current = "0";
          },
        });
        activeCounterTweens.push(tween);
      });
    };

    ScrollTrigger.create({
      trigger: section,
      start: "top 82%",
      invalidateOnRefresh: true,
      onEnter: () => playCountUp(),
      onEnterBack: () => playCountUp(),
      onLeaveBack: () => playCountDown(),
    });
  } catch {
    if (typeof globalThis.gsap !== "undefined") {
      const failTargets = [...leftItems, ...imgs, ...statEls];
      if (readMoreCta) failTargets.push(readMoreCta);
      if (disclaimerAnim) failTargets.push(disclaimerAnim);
      if (aboutLead) failTargets.push(aboutLead);
      gsap.set(failTargets, { clearProps: "opacity,transform,filter" });
      const bgRevealEl = section.querySelector("[data-about-bg-reveal]");
      if (bgRevealEl) {
        gsap.set(bgRevealEl, { scaleY: 1, clearProps: "willChange" });
      }
      const leadEl = section.querySelector("[data-about-lead]");
      const colorRestore = [
        leadEl,
        ...section.querySelectorAll(".about-disclaimer"),
        ...section.querySelectorAll(".about-stat-label"),
        ...section.querySelectorAll(".about-stat-value"),
      ].filter(Boolean);
      gsap.set(colorRestore, { clearProps: "color" });
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
  initAboutOnPrimary();
  const layoutReady = globalThis.__layoutReady;
  if (layoutReady && typeof layoutReady.then === "function") {
    layoutReady.finally(() => {
      if (typeof globalThis.ScrollTrigger !== "undefined") {
        globalThis.ScrollTrigger.refresh();
      }
    });
  }
});
