/**
 * "What Our Travelers Say" — scroll reveal + avatar carousel.
 * Used on destinations.html; mirrors index.html behavior.
 */

function initTestimonialsScrollReveal() {
  const reduceMotion = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsap = globalThis.gsap;
  const ScrollTrigger = globalThis.ScrollTrigger;
  if (reduceMotion || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  const section = document.getElementById("testimonials");
  if (!section) return;

  const animEls = section.querySelectorAll("[data-test-anim]");
  if (!animEls.length) return;

  gsap.registerPlugin(ScrollTrigger);

  try {
    gsap.set(animEls, {
      opacity: 0,
      y: 34,
      filter: "blur(8px)",
      force3D: true,
    });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.out" },
      onComplete: () => {
        gsap.set(animEls, { clearProps: "filter" });
      },
    });

    tl.to(animEls, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.72,
      stagger: 0.11,
    });

    ScrollTrigger.create({
      trigger: section,
      start: "top 40%",
      invalidateOnRefresh: true,
      onEnter: () => {
        if (tl.progress() < 0.999) tl.play(0);
      },
      onEnterBack: () => {
        if (tl.progress() < 0.999) tl.play(0);
      },
      onRefresh: () => {
        const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const r = section.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0 && tl.progress() < 0.999) {
          gsap.killTweensOf(animEls);
          gsap.set(animEls, {
            opacity: 1,
            y: 0,
            filter: "none",
            clearProps: "filter",
            overwrite: "auto",
          });
          tl.pause().progress(1, false);
        }
      },
    });

    const syncTestimonialsToScrollPosition = () => {
      if (typeof ScrollTrigger === "undefined") return;
      const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const r = section.getBoundingClientRect();
      const stillBelowViewport = r.top >= vh;
      if (stillBelowViewport) {
        ScrollTrigger.refresh();
        return;
      }
      gsap.killTweensOf(animEls);
      gsap.set(animEls, {
        opacity: 1,
        y: 0,
        filter: "none",
        clearProps: "filter",
        overwrite: "auto",
      });
      tl.pause().progress(1, false);
      ScrollTrigger.refresh();
    };

    const scheduleTestimonialsScrollSync = () => {
      syncTestimonialsToScrollPosition();
      requestAnimationFrame(syncTestimonialsToScrollPosition);
      requestAnimationFrame(() => requestAnimationFrame(syncTestimonialsToScrollPosition));
      [0, 50, 150, 300, 600, 1200].forEach((ms) => setTimeout(syncTestimonialsToScrollPosition, ms));
    };

    window.addEventListener("load", scheduleTestimonialsScrollSync);
    window.addEventListener("pageshow", scheduleTestimonialsScrollSync);
  } catch {
    if (typeof gsap !== "undefined") {
      const sec = document.getElementById("testimonials");
      if (sec) {
        gsap.set(sec.querySelectorAll("[data-test-anim]"), { clearProps: "opacity,transform,filter" });
      }
    }
  }
}

function initTestimonialsCarousel() {
  const section = document.getElementById("testimonials");
  if (!section) return;

  const mainImg = document.getElementById("testimonial-main-image");
  const quoteEl = document.getElementById("testimonial-quote");
  const nameEl = document.getElementById("testimonial-name");
  const roleEl = document.getElementById("testimonial-role");
  const thumbs = section.querySelectorAll(".testimonial-thumb");
  if (!mainImg || !quoteEl || !nameEl || !roleEl || !thumbs.length) return;

  const testimonials = [
    {
      image: "./src/assets/images/indian.jpg",
      name: "Arjun Menon",
      role: "Student",
      quote:
        "Visa Nest made my visa process surprisingly easy. Every step was explained clearly and their travel planning support saved me hours.",
    },
    {
      image: "./src/assets/images/pk-1.jpg",
      name: "Hassan Malik",
      role: "Software Engineer",
      quote:
        "From document review to appointment booking, their team was sharp and responsive. I got my Schengen visa without stress.",
    },
    {
      image: "./src/assets/images/pk-2.jpg",
      name: "Bilal Qureshi",
      role: "Business Owner",
      quote:
        "I needed a fast turnaround for a business trip and Visa Nest handled everything with precision. The updates were timely and clear.",
    },
    {
      image: "./src/assets/images/african-1.png",
      name: "Kwame Osei",
      role: "Marketing Specialist",
      quote:
        "They are professional, patient, and very organized. My travel plan and visa documentation were handled in one smooth process.",
    },
    {
      image: "./src/assets/images/african-2.png",
      name: "Chinedu Okonkwo",
      role: "Project Manager",
      quote:
        "Best support I have used so far. They simplified complex requirements and gave practical guidance at every stage. The updates were timely and clear.",
    },
  ];

  let activeIndex = 0;
  let isAnimating = false;
  let autoRotateTimer = null;

  const setActiveThumb = (nextIndex) => {
    thumbs.forEach((btn, idx) => {
      const active = idx === nextIndex;
      btn.classList.toggle("is-active", active);
      btn.classList.toggle("ring-[#0047ab]", active);
      btn.classList.toggle("ring-2", active);
      btn.classList.toggle("ring-offset-2", active);
      btn.classList.toggle("ring-offset-[#f1f0ee]", active);
      btn.classList.toggle("ring-slate-300", !active);
      btn.classList.toggle("ring-1", !active);
    });
  };

  const swapTo = (nextIndex) => {
    if (nextIndex === activeIndex || isAnimating) return;
    const data = testimonials[nextIndex];
    if (!data) return;
    isAnimating = true;

    const outEls = [mainImg, quoteEl, nameEl, roleEl];
    const inTextEls = [quoteEl, nameEl, roleEl];
    const useGsap = typeof globalThis.gsap !== "undefined";

    const applyNextData = () => {
      mainImg.src = data.image;
      mainImg.alt = `${data.name} portrait`;
      quoteEl.textContent = data.quote;
      nameEl.textContent = data.name;
      roleEl.textContent = data.role;
      activeIndex = nextIndex;
      setActiveThumb(nextIndex);
    };

    if (!useGsap) {
      applyNextData();
      isAnimating = false;
      return;
    }

    const gsap = globalThis.gsap;
    gsap.to(outEls, {
      opacity: 0,
      x: -24,
      duration: 0.26,
      ease: "power2.in",
      onComplete: () => {
        applyNextData();
        gsap.set(mainImg, { x: 24, opacity: 0 });
        gsap.set(inTextEls, { x: 24, opacity: 0 });
        gsap.to(mainImg, { x: 0, opacity: 1, duration: 0.34, ease: "power3.out" });
        gsap.to(inTextEls, {
          x: 0,
          opacity: 1,
          duration: 0.34,
          ease: "power3.out",
          stagger: 0.04,
          onComplete: () => {
            isAnimating = false;
          },
        });
      },
    });
  };

  const nextTestimonial = () => {
    const nextIndex = (activeIndex + 1) % testimonials.length;
    swapTo(nextIndex);
  };

  const stopAutoRotate = () => {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
  };

  const startAutoRotate = () => {
    stopAutoRotate();
    autoRotateTimer = setInterval(() => {
      if (!isAnimating) nextTestimonial();
    }, 3000);
  };

  thumbs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index || "0");
      swapTo(idx);
      startAutoRotate();
    });
  });

  startAutoRotate();
}

window.addEventListener("DOMContentLoaded", () => {
  initTestimonialsScrollReveal();
  initTestimonialsCarousel();
});
