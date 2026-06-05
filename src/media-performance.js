function applyImageHints() {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    if (!img.hasAttribute("decoding")) {
      img.setAttribute("decoding", "async");
    }

    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }

    if (img.getAttribute("loading") === "lazy" && !img.hasAttribute("fetchpriority")) {
      img.setAttribute("fetchpriority", "low");
    }
  });
}

function applyVideoHints() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = Boolean(connection && connection.saveData);
  const effectiveType = connection && connection.effectiveType ? connection.effectiveType : "";
  const onSlowNetwork = /(^|-)2g$/.test(effectiveType);

  document.querySelectorAll("video").forEach((video) => {
    if (!video.hasAttribute("playsinline")) {
      video.setAttribute("playsinline", "");
    }

    video.setAttribute("preload", "metadata");

    if (reduceMotion || saveData || onSlowNetwork) {
      video.removeAttribute("autoplay");
      try {
        video.pause();
      } catch {
        /* ignore playback pause errors */
      }
      return;
    }

    if (video.autoplay) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          /* autoplay can be blocked by the browser */
        });
      }
    }
  });
}

function initMediaPerformance() {
  applyImageHints();
  applyVideoHints();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMediaPerformance, { once: true });
} else {
  initMediaPerformance();
}
