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

/** @type {{ id: string; categories: string[]; img: string; alt: string; price?: string; priceDisplay?: string; title: string; location: string; duration?: string }[]} */
const DESTINATIONS = [
  {
    id: "pkg-france",
    categories: ["adventure", "accommodations", "sports"],
    img: IMG("schengen.jpg"),
    alt: "Paris and French city architecture, France",
    priceDisplay: "£285",
    title: "France Explorer Package",
    location: "Paris, France",
    duration: "3 nights · 2 days",
  },
  {
    id: "pkg-switzerland",
    categories: ["hiking", "adventure", "mountain-biking", "accommodations"],
    img: IMG("switzerland.png"),
    alt: "Swiss Alps peaks and mountain scenery",
    priceDisplay: "£372",
    title: "Switzerland Alpine Package",
    location: "Zurich, Lucerne & Interlaken, Switzerland",
    duration: "4 nights · 3 days",
  },
  {
    id: "pkg-greece",
    categories: ["adventure", "accommodations"],
    img: IMG("greece.png"),
    alt: "Coastal Greek islands and blue Mediterranean sea",
    priceDisplay: "£232",
    title: "Greece Island Escape",
    location: "Santorini & Athens, Greece",
    duration: "3 nights · 2 days",
  },
  {
    id: "pkg-spain",
    categories: ["adventure", "accommodations", "sports"],
    img: IMG("spain.jpg"),
    alt: "Barcelona waterfront and Mediterranean coast, Spain",
    priceDisplay: "£325",
    title: "Spain Discovery Package",
    location: "Barcelona & Madrid, Spain",
    duration: "5 nights · 4 days",
  },
  {
    id: "pkg-usa",
    categories: ["adventure", "accommodations"],
    img: IMG("usa.jpg"),
    alt: "New York City skyline and urban landmarks, USA",
    priceDisplay: "£1,400",
    title: "USA Dream Vacation",
    location: "New York, USA",
    duration: "7 nights · 6 days",
  },
  {
    id: "pkg-canada",
    categories: ["adventure", "accommodations", "hiking", "wildlife-safaris"],
    img: IMG("canada.jpg"),
    alt: "Toronto skyline and Niagara Falls region, Canada",
    priceDisplay: "£1,300",
    title: "Canada Adventure Package",
    location: "Toronto & Niagara Falls, Canada",
    duration: "7 nights · 6 days",
  },
];

const TAB_BASE =
  "cursor-pointer rounded-full border px-4 py-2.5 text-[13px] font-medium transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0047ab]/40 focus-visible:ring-offset-2 sm:px-5 sm:text-sm";
const TAB_IDLE =
  " border-slate-200 bg-white text-slate-800 hover:border-[#0047ab] hover:bg-[#0047ab] hover:text-white";
const TAB_ACTIVE =
  " border-[#0047ab] bg-[#0047ab] text-white hover:border-[#003a91] hover:bg-[#003a91] hover:text-white";

function filterByCategory(cat) {
  if (cat === "all") return DESTINATIONS;
  return DESTINATIONS.filter((d) => d.categories.includes(cat));
}

function durationLabel(d) {
  return d.duration || "7 days 6 nights";
}

function cardHtml(d) {
  const dur = durationLabel(d);
  /* Markup aligned with index.html #destinations “Popular Travel Packages For You” cards */
  return `<article class="group bg-[var(--color-primary-blue)] rounded-2xl" data-destination-id="${d.id}">
    <div class="relative overflow-hidden rounded-tl-2xl rounded-tr-2xl">
      <img
        src="${d.img}"
        alt="${escapeAttr(d.alt)}"
        class="h-[280px] w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-90 group-hover:contrast-125"
        loading="lazy"
        decoding="async"
      />
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-900/5 to-transparent opacity-0 transition duration-500 ease-out group-hover:opacity-100"></div>
      <div class="pointer-events-none absolute left-5 right-5 top-5 translate-y-[-10px] opacity-0 transition duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
        <div class="flex items-center justify-between rounded-full bg-primary-yellow px-4 py-3 text-slate-800 shadow-lg">
          <span class="inline-flex items-center text-[15px] font-medium text-[#01004b]">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>
            </svg>
            ${escapeHtml(dur)}
          </span>
          <span class="inline-flex items-center text-[16px] font-semibold text-[#01004b]">Explore Now</span>
        </div>
      </div>
    </div>
    <div class="px-4 pt-4 pb-6 text-white">
      <p class="mt-4 text-[17px] font-medium leading-none tracking-tight text-white sm:text-[18px]">${
        d.priceDisplay
          ? escapeHtml(d.priceDisplay)
          : `$${escapeHtml(d.price || "")} <span class="text-[13px] font-normal sm:text-[14px]">/pp</span>`
      }</p>
      <h3 class="mt-3 mb-2 text-primary-yellow text-[18px] font-medium tracking-tight sm:text-[20px]">${escapeHtml(d.title)}</h3>
      <p class="mt-1 inline-flex items-center text-[17px] sm:text-[18px]">
        <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 10c0 6.5-9 12-9 12s-9-5.5-9-12a9 9 0 1 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
        </svg>
        ${escapeHtml(d.location)}
      </p>
    </div>
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
