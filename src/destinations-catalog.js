const PAGE_SIZE = 9;

/** After catalog layout changes; newsletter/footer listeners re-check viewport. */
function visaNestRefreshScrollLayout() {
  globalThis.ScrollTrigger?.refresh();
  globalThis.dispatchEvent(new CustomEvent("visa-nest-scroll-layout-refresh", { bubbles: true }));
}

/** Local images under ./assets/images/ (project root; copies of Unsplash + shared PNGs) */
const IMG = (filename) => `./assets/images/${filename}`;

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "hiking", label: "Hiking" },
  { id: "adventure", label: "Adventure" },
  { id: "accommodations", label: "Accommodations" },
  { id: "mountain-biking", label: "Mountain Biking" },
  { id: "wildlife-safaris", label: "Wildlife Safaris" },
  { id: "sports", label: "Sports" },
];

/** @type {{ id: string; categories: string[]; img: string; alt: string; price: string; title: string; location: string; duration?: string }[]} */
const DESTINATIONS = [
  {
    id: "1",
    categories: ["adventure", "accommodations"],
    img: IMG("destination-01-bali.jpg"),
    alt: "Tropical turquoise lagoon and beach, Bali",
    price: "699.00",
    title: "Tropical Paradise",
    location: "Bali, Indonesia",
  },
  {
    id: "2",
    categories: ["hiking", "adventure"],
    img: IMG("destination-02-tongariro.jpg"),
    alt: "Mountain ridge trail above clouds, alpine hiking",
    price: "699.00",
    title: "Tongariro National Park",
    location: "New Zealand",
  },
  {
    id: "3",
    categories: ["accommodations", "adventure"],
    img: IMG("boat.png"),
    alt: "Boats on Sydney harbour",
    price: "425.00",
    title: "Sydney Opera House",
    location: "Sydney, Australia",
  },
  {
    id: "4",
    categories: ["wildlife-safaris", "adventure"],
    img: IMG("destination-04-great-barrier-reef.jpg"),
    alt: "Aerial view of turquoise ocean and reef coastline",
    price: "699.00",
    title: "Great Barrier Reef",
    location: "Queensland, Australia",
  },
  {
    id: "5",
    categories: ["hiking"],
    img: IMG("destination-05-alpine-highlands.jpg"),
    alt: "Hiker on a rocky alpine summit at sunrise",
    price: "849.00",
    title: "Alpine Highlands Trail",
    location: "Switzerland",
  },
  {
    id: "6",
    categories: ["wildlife-safaris", "adventure"],
    img: IMG("destination-06-desert-safari.jpg"),
    alt: "Rolling sand dunes in golden desert light",
    price: "1,199.00",
    title: "Desert Dune Safari",
    location: "UAE",
  },
  {
    id: "7",
    categories: ["accommodations", "hiking"],
    img: IMG("flowers.png"),
    alt: "Lush garden and natural scenery, peaceful retreat",
    price: "789.00",
    title: "Kyoto Forest Retreat",
    location: "Japan",
  },
  {
    id: "8",
    categories: ["mountain-biking", "adventure"],
    img: IMG("destination-08-patagonia.jpg"),
    alt: "Mountain lake and peaks, Patagonia-style landscape",
    price: "929.00",
    title: "Patagonia Ridge Ride",
    location: "Argentina",
  },
  {
    id: "9",
    categories: ["sports", "adventure"],
    img: IMG("man-at-beach.png"),
    alt: "Coastal beach and ocean for surf and water sports",
    price: "599.00",
    title: "Coastal Surf Week",
    location: "Portugal",
  },
  {
    id: "10",
    categories: ["wildlife-safaris"],
    img: IMG("destination-10-rainforest.jpg"),
    alt: "Sunlight through lush green rainforest canopy",
    price: "1,049.00",
    title: "Rainforest Eco Lodge",
    location: "Costa Rica",
  },
  {
    id: "11",
    categories: ["mountain-biking", "hiking"],
    img: IMG("destination-11-alps-mtb.jpg"),
    alt: "Cyclist on a scenic outdoor trail with mountains",
    price: "879.00",
    title: "Alps Singletrack Escape",
    location: "France",
  },
  {
    id: "12",
    categories: ["accommodations", "sports"],
    img: IMG("destination-12-maldives.jpg"),
    alt: "Cliffside pools and blue sea, luxury coastal stay",
    price: "1,499.00",
    title: "Lagoon Villa Stay",
    location: "Maldives",
  },
];

const TAB_BASE =
  "cursor-pointer rounded-full border px-4 py-2.5 text-[13px] font-medium transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b70fe]/40 focus-visible:ring-offset-2 sm:px-5 sm:text-sm";
const TAB_IDLE =
  " border-slate-200 bg-white text-slate-800 hover:border-[#3b70fe] hover:bg-[#3b70fe] hover:text-white";
const TAB_ACTIVE =
  " border-[#3b70fe] bg-[#3b70fe] text-white hover:border-[#2f62e6] hover:bg-[#2f62e6] hover:text-white";

function filterByCategory(cat) {
  if (cat === "all") return DESTINATIONS;
  return DESTINATIONS.filter((d) => d.categories.includes(cat));
}

function durationLabel(d) {
  return d.duration || "7 days 6 nights";
}

function cardHtml(d) {
  const dur = durationLabel(d);
  return `<article class="group" data-destination-id="${d.id}">
    <div class="relative overflow-hidden rounded-2xl">
      <img
        src="${d.img}"
        alt="${escapeAttr(d.alt)}"
        class="h-[280px] w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-90 group-hover:contrast-125"
        loading="lazy"
        decoding="async"
      />
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-900/5 to-transparent opacity-0 transition duration-500 ease-out group-hover:opacity-100"></div>
      <div class="pointer-events-none absolute left-5 right-5 top-5 translate-y-[-10px] opacity-0 transition duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <div class="flex items-center justify-between rounded-full bg-white px-4 py-3 text-slate-800 shadow-lg">
          <span class="inline-flex items-center text-[15px] font-medium text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>
            </svg>
            ${escapeHtml(dur)}
          </span>
          <span class="inline-flex items-center text-[16px] font-semibold">Explore Now <span class="ml-2">&rarr;</span></span>
        </div>
      </div>
    </div>
    <p class="mt-4 text-[17px] font-medium leading-none tracking-tight text-slate-900 sm:text-[18px]">$${escapeHtml(d.price)} <span class="text-[13px] font-normal text-slate-500 sm:text-[14px]">/pp</span></p>
    <h3 class="mt-2 text-[18px] font-medium tracking-tight text-slate-900 sm:text-[20px]">${escapeHtml(d.title)}</h3>
    <p class="mt-1 inline-flex items-center text-[17px] text-slate-500 sm:text-[18px]">
      <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 10c0 6.5-9 12-9 12s-9-5.5-9-12a9 9 0 1 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
      </svg>
      ${escapeHtml(d.location)}
    </p>
  </article>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, "&#39;");
}

function motionOk() {
  return (
    typeof globalThis.gsap !== "undefined" &&
    typeof globalThis.ScrollTrigger !== "undefined" &&
    !globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Card grid + load-more: scrubbed scroll (reverses when scrolling up). Rebuilt whenever the grid updates. */
let cardAnimContext = null;

function teardownCardScrollAnim() {
  cardAnimContext?.revert();
  cardAnimContext = null;
}

/** Split flat list into rows of `cols` for grid-aligned scroll bands. */
function chunkByCols(list, cols) {
  const arr = Array.from(list);
  const rows = [];
  for (let i = 0; i < arr.length; i += cols) {
    rows.push(arr.slice(i, i + cols));
  }
  return rows;
}

/** Mobile: each card scrubs in from below as it enters view (one-by-one with scroll). */
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

/** Tablet/desktop: first row reveals when grid hits top 50%; further scroll reveals next rows. */
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

function setupCardGridScrollAnim() {
  teardownCardScrollAnim();
  if (!motionOk()) return;

  const gsap = globalThis.gsap;
  const ScrollTrigger = globalThis.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  const section = document.getElementById("destinations-catalog");
  const grid = document.getElementById("destinations-catalog-grid");
  const loadBtn = document.getElementById("destinations-load-more");
  if (!section || !grid) return;

  const articles = grid.querySelectorAll("article");
  const emptyP = grid.querySelector(":scope > p");

  cardAnimContext = gsap.context(() => {
    if (!articles.length) {
      if (emptyP) {
        gsap.fromTo(
          emptyP,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "+=130",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          }
        );
      }
      return;
    }

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

function scheduleCardScrollAnim() {
  globalThis.requestAnimationFrame(() => {
    setupCardGridScrollAnim();
    visaNestRefreshScrollLayout();
  });
}

let tabsScrollAnimDone = false;

function setupTabsScrollAnimOnce(tabsRoot) {
  if (!motionOk() || tabsScrollAnimDone) return;

  const gsap = globalThis.gsap;
  const ScrollTrigger = globalThis.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  const section = document.getElementById("destinations-catalog");
  const tabs = tabsRoot.querySelectorAll("button");
  if (!section || !tabs.length) return;

  gsap.set(tabs, { opacity: 0, y: 22, scale: 0.97, force3D: true });

  gsap.to(tabs, {
    opacity: 1,
    y: 0,
    scale: 1,
    stagger: 0.065,
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top 84%",
      end: "top 56%",
      scrub: 0.75,
      invalidateOnRefresh: true,
    },
  });

  tabsScrollAnimDone = true;
}

function init() {
  const tabsRoot = document.getElementById("destination-category-tabs");
  const grid = document.getElementById("destinations-catalog-grid");
  const loadBtn = document.getElementById("destinations-load-more");

  if (!tabsRoot || !grid || !loadBtn) return;

  let activeCat = "all";
  let visible = PAGE_SIZE;
  const tabButtons = [];

  CATEGORIES.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
    btn.setAttribute("id", `destination-tab-${c.id}`);
    btn.setAttribute("aria-controls", "destinations-catalog-grid");
    btn.dataset.category = c.id;
    btn.textContent = c.label;
    btn.className = `${TAB_BASE}${i === 0 ? TAB_ACTIVE : TAB_IDLE}`;
    tabsRoot.appendChild(btn);
    tabButtons.push(btn);
  });

  tabsRoot.setAttribute("role", "tablist");
  tabsRoot.setAttribute("aria-label", "Destination categories");

  setupTabsScrollAnimOnce(tabsRoot);

  if (!globalThis.__visaNestDestCatalogResizeListener) {
    globalThis.__visaNestDestCatalogResizeListener = true;
    globalThis.addEventListener("resize", () => {
      visaNestRefreshScrollLayout();
    });
  }

  function setActiveTab(cat) {
    tabButtons.forEach((btn) => {
      const on = btn.dataset.category === cat;
      btn.setAttribute("aria-selected", on ? "true" : "false");
      btn.className = `${TAB_BASE}${on ? TAB_ACTIVE : TAB_IDLE}`;
    });
  }

  function render() {
    const filtered = filterByCategory(activeCat);
    const slice = filtered.slice(0, visible);

    grid.setAttribute("aria-labelledby", `destination-tab-${activeCat}`);

    if (filtered.length === 0) {
      grid.innerHTML =
        '<p class="col-span-full py-12 text-center text-[15px] text-slate-500">No destinations in this category yet.</p>';
      loadBtn.hidden = true;
      scheduleCardScrollAnim();
      return;
    }

    grid.innerHTML = slice.map(cardHtml).join("");
    loadBtn.hidden = visible >= filtered.length;
    scheduleCardScrollAnim();
  }

  tabsRoot.addEventListener("click", (e) => {
    const t = e.target.closest("button[data-category]");
    if (!t || !(t instanceof HTMLButtonElement)) return;
    activeCat = t.dataset.category || "all";
    visible = PAGE_SIZE;
    setActiveTab(activeCat);
    render();
  });

  loadBtn.addEventListener("click", () => {
    visible += PAGE_SIZE;
    render();
  });

  setActiveTab(activeCat);
  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
