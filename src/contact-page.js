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

runWhenGsapReady(() => {
  const section = document.getElementById("contact-form");
  const blocks = section?.querySelectorAll("[data-contact-anim]");
  const gsap = globalThis.gsap;
  const ScrollTrigger = globalThis.ScrollTrigger;
  if (!section || !blocks?.length || !gsap || !ScrollTrigger) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(blocks, { clearProps: "opacity,transform" });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.set(blocks, { opacity: 0, y: 28, force3D: true });

  let played = false;
  const reveal = () => {
    if (played) return;
    played = true;
    gsap.to(blocks, {
      opacity: 1,
      y: 0,
      duration: 0.62,
      ease: "power3.out",
      stagger: 0.12,
      onComplete: () => gsap.set(blocks, { clearProps: "opacity,transform" }),
    });
  };

  ScrollTrigger.create({
    trigger: section,
    start: "top 82%",
    invalidateOnRefresh: true,
    onEnter: reveal,
  });
});
