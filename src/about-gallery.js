/** About showcase: desktop row — one expanded; center default; hover keeps last expanded (no reset). Mobile: static vertical stack. */

const DEFAULT_INDEX = 2;
const DESKTOP_GALLERY = globalThis.matchMedia("(min-width: 768px)");

let galleryAbort = null;

function refreshScroll() {
  globalThis.requestAnimationFrame(() => {
    globalThis.ScrollTrigger?.refresh();
  });
}

function initAboutGallery() {
  galleryAbort?.abort();
  galleryAbort = new AbortController();
  const { signal } = galleryAbort;

  const track = document.getElementById("about-gallery-track");
  if (!track) return;

  const cards = Array.from(track.querySelectorAll("[data-about-card]"));
  if (!cards.length) return;

  function setExpanded(index) {
    const i = Math.max(0, Math.min(index, cards.length - 1));
    cards.forEach((card, j) => {
      const on = j === i;
      card.classList.toggle("about-gallery-card--expanded", on);
      card.setAttribute("aria-expanded", on ? "true" : "false");
    });
    refreshScroll();
  }

  if (!DESKTOP_GALLERY.matches) {
    cards.forEach((card) => {
      card.classList.remove("about-gallery-card--expanded");
      card.removeAttribute("aria-expanded");
      card.removeAttribute("tabindex");
      card.removeAttribute("role");
    });
    return;
  }

  cards.forEach((card) => {
    if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
    if (!card.hasAttribute("role")) card.setAttribute("role", "button");
  });

  setExpanded(DEFAULT_INDEX);

  const fineHover = globalThis.matchMedia("(hover: hover) and (pointer: fine)");

  if (fineHover.matches) {
    cards.forEach((card, i) => {
      card.addEventListener("mouseenter", () => setExpanded(i), { signal });
    });
  } else {
    cards.forEach((card, i) => {
      card.addEventListener("click", () => setExpanded(i), { signal });
    });
  }

  cards.forEach((card) => {
    card.addEventListener(
      "keydown",
      (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        const idx = cards.indexOf(card);
        if (idx >= 0) setExpanded(idx);
      },
      { signal }
    );
  });
}

function bootAboutGallery() {
  initAboutGallery();
  DESKTOP_GALLERY.addEventListener("change", initAboutGallery);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootAboutGallery, { once: true });
} else {
  bootAboutGallery();
}
