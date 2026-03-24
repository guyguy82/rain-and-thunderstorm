const PAGE_CONFIG = {
  artistName: "Alexandr Misko",
  youtubeEmbedUrl: "https://www.youtube.com/embed/-dF-RukgnIo",
  album: {
    title: "Final Boss",
    releaseISO: "2026-04-24T00:00:00Z",
    preSaveSpotifyUrl: "https://open.spotify.com/prerelease/46YtVuRYyQ1yKwYuadppTL?si=3b46fc142bee44a5",
    coverImage: "assets/final-boss-cover.jpg"
  },
  tablature: {
    previewImage: "assets/tablature-preview.jpg",
    buyUrl: "",
    intro:
      "The official double-single tablature package covers both My Favorite Rain and My Favorite Thunderstorm in their Final Boss versions.",
    points: [
      "Covers the layered loop construction of Rain and the full reworked arrangement of Thunderstorm.",
      "Includes note-for-note detail for melodies, percussion, groove shifts, and key special effects.",
      "Built for players who want the latest Final Boss-era versions in one package."
    ]
  },
  previousSingles: [
    {
      id: "umbrella-street",
      title: "Umbrella Street",
      coverImage: "assets/umbrella-street.jpg",
      ctaLabel: "Listen",
      url: "https://tr.ee/9VRrejZKWg"
    },
    {
      id: "intergalactic-march",
      title: "Intergalactic March",
      coverImage: "assets/intergalactic-march.jpg",
      ctaLabel: "Listen",
      url: "https://open.spotify.com/album/7dr3o11DGgSMSsJ9kkjuns"
    }
  ],
  subscribe: {
    googleAppsScriptUrl:
      "https://script.google.com/macros/s/AKfycbwdWBCWWLq-Q6sF-MdWB4bXa_3g4Fiot_f9-gjp0lQJXRhHwUnnXCAmH4AH3SR3RXrkoA/exec",
    source: "rain_and_thunderstorm_landing"
  },
  singles: [
    {
      id: "rain",
      title: "My Favorite Rain",
      coverImage: "assets/My-favorite-rain-fixed.jpg",
      accent: "rain",
      blurb: "A loop-built intro that starts as a drizzle, stacks melody into an orchestral swell, and erupts into a distorted solo before the storm breaks.",
      streamingLinks: {
        spotify: "",
        appleMusic: "",
        tidal: "",
        yandexMusic: "",
        itunes: "",
        deezer: "",
        qobuz: "",
        youtubeMusic: "",
        amazonMusic: ""
      }
    },
    {
      id: "thunderstorm",
      title: "My Favorite Thunderstorm",
      coverImage: "assets/My-favorite-rainstorm.jpg",
      accent: "thunderstorm",
      blurb: "A fully reimagined classic that fuses progressive metal drive, symphonic sweep, and Frankenstein Guitar effects into its final thunder.",
      streamingLinks: {
        spotify: "",
        appleMusic: "",
        tidal: "",
        yandexMusic: "",
        itunes: "",
        deezer: "",
        qobuz: "",
        youtubeMusic: "",
        amazonMusic: ""
      }
    }
  ]
};

const STREAMING_PLATFORMS = [
  { key: "spotify", label: "Spotify" },
  { key: "appleMusic", label: "Apple Music" },
  { key: "tidal", label: "TIDAL" },
  { key: "yandexMusic", label: "Yandex Music" },
  { key: "itunes", label: "iTunes" },
  { key: "deezer", label: "Deezer" },
  { key: "qobuz", label: "Qobuz" },
  { key: "youtubeMusic", label: "YouTube Music" },
  { key: "amazonMusic", label: "Amazon Music" }
];

let activeTrackId = "rain";
let heroSwapTimer = 0;

function hasTrack(trackId) {
  return PAGE_CONFIG.singles.some((track) => track.id === trackId);
}

function resolveAssetUrl(path) {
  return new URL(path, window.location.href).href;
}

function getTrack(trackId) {
  return PAGE_CONFIG.singles.find((track) => track.id === trackId) || PAGE_CONFIG.singles[0];
}

function getTrackIndex(trackId) {
  return PAGE_CONFIG.singles.findIndex((track) => track.id === trackId);
}

function setAnchorHrefOrDisable(element, url) {
  if (!element) return;

  if (url && url.trim()) {
    element.href = url;
    element.classList.remove("disabled");
    element.removeAttribute("aria-disabled");
  } else {
    element.href = "#";
    element.classList.add("disabled");
    element.setAttribute("aria-disabled", "true");
  }
}

function isValidEmbedUrl(url) {
  return /^https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]{6,}/.test(url);
}

function getYouTubeVideoId(url) {
  if (!url || !url.trim()) return "";

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com") && parsed.pathname.startsWith("/embed/")) {
      return parsed.pathname.split("/embed/")[1].split("/")[0];
    }

    if (parsed.hostname.includes("youtube.com") && parsed.searchParams.get("v")) {
      return parsed.searchParams.get("v") || "";
    }

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.replace("/", "");
    }
  } catch (_) {
    return "";
  }

  return "";
}

function mountYouTubePlayer(container, videoId) {
  if (!container || !videoId) return;

  const embedUrl =
    "https://www.youtube-nocookie.com/embed/" +
    videoId +
    "?autoplay=1&rel=0&playsinline=1";

  container.innerHTML =
    '<iframe src="' +
    embedUrl +
    '" title="My Favorite Rain and My Favorite Thunderstorm official video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>';
}

function findPrimaryTrackUrl(track) {
  if (!track || !track.streamingLinks) return "";
  if (track.streamingLinks.spotify && track.streamingLinks.spotify.trim()) {
    return track.streamingLinks.spotify.trim();
  }

  for (const platform of STREAMING_PLATFORMS) {
    const candidate = track.streamingLinks[platform.key];
    if (candidate && candidate.trim()) {
      return candidate.trim();
    }
  }

  return "";
}

function renderVideo() {
  const container = document.getElementById("videoContainer");
  if (!container) return;

  const videoId = getYouTubeVideoId(PAGE_CONFIG.youtubeEmbedUrl);

  if (videoId) {
    const thumbnailUrl = "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg";

    container.innerHTML =
      '<button class="video-launch" id="videoLaunchBtn" type="button" aria-label="Play the double-single video">' +
      '<img class="video-poster" src="' + thumbnailUrl + '" alt="Double-single video preview">' +
      '<span class="video-play-badge" aria-hidden="true"></span>' +
      '<span class="video-launch-copy"><span class="video-launch-label">Play Video</span></span>' +
      "</button>";

    const launchBtn = document.getElementById("videoLaunchBtn");
    if (launchBtn) {
      launchBtn.addEventListener("click", () => mountYouTubePlayer(container, videoId), { once: true });
    }

    return;
  }

  container.innerHTML =
    '<p class="video-fallback">Add the combined YouTube embed URL in <code>PAGE_CONFIG</code> to show the shared video here.</p>';
}

function renderStreamingLinks(grid, track) {
  if (!grid) return;

  grid.innerHTML = "";

  STREAMING_PLATFORMS.forEach((platform) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const url = (track.streamingLinks && track.streamingLinks[platform.key]) || "";

    a.className = "stream-link";
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    if (url.trim()) {
      a.href = url.trim();
      a.innerHTML = '<span>' + platform.label + '</span><span class="status-pill">Open</span>';
    } else {
      a.href = "#";
      a.classList.add("disabled");
      a.setAttribute("aria-disabled", "true");
      a.innerHTML = '<span>' + platform.label + '</span><span class="status-pill">Coming soon</span>';
    }

    li.appendChild(a);
    grid.appendChild(li);
  });
}

function renderTrack(track) {
  const activeHeroImage = document.getElementById("heroActiveImage");
  const heroImage = document.getElementById("heroImage-" + track.id);

  if (activeHeroImage && track.id === activeTrackId) {
    activeHeroImage.src = resolveAssetUrl(track.coverImage);
    activeHeroImage.alt = track.title + " cover art";
  }

  if (heroImage) {
    heroImage.src = resolveAssetUrl(track.coverImage);
    heroImage.alt = track.title + " cover art";
  }
}

function finishHeroSwap(activeImage, transitionImage, card, nextSrc, nextAlt) {
  if (activeImage) {
    activeImage.src = nextSrc || activeImage.src;
    activeImage.alt = nextAlt || activeImage.alt;
    activeImage.style.removeProperty("animation");
  }

  if (transitionImage) {
    transitionImage.src = "";
    transitionImage.alt = "";
    transitionImage.style.removeProperty("animation");
  }

  if (card) {
    card.classList.remove("is-swapping");
    card.removeAttribute("data-swipe");
  }
}

function animateHeroSwap(track, previousTrackId) {
  const card = document.querySelector(".hero-active-card");
  const activeImage = document.getElementById("heroActiveImage");
  const transitionImage = document.getElementById("heroTransitionImage");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!card || !activeImage || !transitionImage) return;

  const nextSrc = resolveAssetUrl(track.coverImage);
  const nextAlt = track.title + " cover art";

  if (activeImage.src === nextSrc && !card.classList.contains("is-swapping")) {
    activeImage.alt = nextAlt;
    return;
  }

  if (prefersReducedMotion) {
    finishHeroSwap(activeImage, transitionImage, card, nextSrc, nextAlt);
    return;
  }

  if (card.classList.contains("is-swapping")) {
    finishHeroSwap(activeImage, transitionImage, card, transitionImage.src || activeImage.src, transitionImage.alt || activeImage.alt);
  }

  const previousIndex = getTrackIndex(previousTrackId);
  const nextIndex = getTrackIndex(track.id);
  const swipeDirection = previousIndex <= nextIndex ? "forward" : "backward";

  transitionImage.src = nextSrc;
  transitionImage.alt = nextAlt;

  card.classList.remove("is-swapping");
  void card.offsetWidth;
  card.dataset.swipe = swipeDirection;
  card.classList.add("is-swapping");

  window.clearTimeout(heroSwapTimer);
  heroSwapTimer = window.setTimeout(() => {
    finishHeroSwap(activeImage, transitionImage, card, nextSrc, nextAlt);
  }, 430);
}

function renderActiveRelease(track) {
  const blurb = document.getElementById("activeTrackBlurb");
  const primaryCta = document.getElementById("activeTrackCta");
  const grid = document.getElementById("activeStreamGrid");

  if (blurb) {
    blurb.textContent = track.blurb || "";
  }

  if (primaryCta) {
    primaryCta.textContent = "Stream " + track.title;
    setAnchorHrefOrDisable(primaryCta, findPrimaryTrackUrl(track));
  }

  renderStreamingLinks(grid, track);
}

function renderTablatureSection() {
  const intro = document.getElementById("tabIntro");
  const points = document.getElementById("tabPoints");
  const previewImage = document.getElementById("tabPreviewImage");
  const buyBtn = document.getElementById("buyTabBtn");
  const config = PAGE_CONFIG.tablature || {};

  if (intro) {
    intro.textContent = config.intro || "";
  }

  if (points) {
    points.innerHTML = "";
    (config.points || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      points.appendChild(li);
    });
  }

  if (previewImage) {
    previewImage.src = resolveAssetUrl(config.previewImage || "assets/tablature-preview.jpg");
    previewImage.alt = PAGE_CONFIG.artistName + " double-single tablature preview";
    previewImage.addEventListener(
      "error",
      () => {
        const frame = previewImage.parentElement;
        if (frame) frame.style.display = "none";
      },
      { once: true }
    );
  }

  setAnchorHrefOrDisable(buyBtn, config.buyUrl || "");
}

function renderPreviousSingles() {
  const grid = document.getElementById("previousSinglesGrid");
  if (!grid) return;

  grid.innerHTML = "";

  (PAGE_CONFIG.previousSingles || []).forEach((single) => {
    const article = document.createElement("article");
    article.className = "catalog-card";
    article.dataset.previousSingle = single.id;

    const coverWrap = document.createElement("div");
    coverWrap.className = "catalog-cover-wrap";

    const img = document.createElement("img");
    img.className = "catalog-cover";
    img.src = resolveAssetUrl(single.coverImage);
    img.alt = single.title + " cover art";
    coverWrap.appendChild(img);

    const copy = document.createElement("div");
    copy.className = "catalog-copy";

    const title = document.createElement("h3");
    title.className = "catalog-title";
    title.textContent = single.title;

    const button = document.createElement("a");
    button.className = "btn btn-secondary catalog-cta";
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.textContent = single.ctaLabel || ("Listen to " + single.title);
    setAnchorHrefOrDisable(button, single.url || "");

    copy.appendChild(title);

    article.appendChild(coverWrap);
    article.appendChild(copy);
    article.appendChild(button);
    grid.appendChild(article);
  });
}

function initSubscribeForm() {
  const form = document.getElementById("subscribeForm");
  const email = document.getElementById("emailInput");
  const note = document.getElementById("formNote");
  const websiteField = document.getElementById("websiteField");

  if (!form || !email || !note || !websiteField) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    note.className = "form-note";

    if ((websiteField.value || "").trim()) {
      note.textContent = "Thanks. You are subscribed.";
      note.classList.add("success");
      form.reset();
      return;
    }

    const value = (email.value || "").trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      note.textContent = "Please enter a valid email address.";
      note.classList.add("error");
      return;
    }

    const endpoint =
      PAGE_CONFIG.subscribe && PAGE_CONFIG.subscribe.googleAppsScriptUrl
        ? PAGE_CONFIG.subscribe.googleAppsScriptUrl.trim()
        : "";

    if (!endpoint) {
      note.textContent = "Thanks. You are subscribed.";
      note.classList.add("success");
      form.reset();
      return;
    }

    const payload = new URLSearchParams();
    payload.set("email", value);
    payload.set("source", (PAGE_CONFIG.subscribe && PAGE_CONFIG.subscribe.source) || "rain_and_thunderstorm_landing");
    payload.set("page", window.location.href);
    payload.set("timestamp", new Date().toISOString());
    payload.set("userAgent", navigator.userAgent);
    payload.set("website", "");

    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: payload.toString()
      });

      note.textContent = "Thanks. You are subscribed.";
      note.classList.add("success");
      form.reset();
    } catch (_) {
      note.textContent = "Could not submit right now. Please try again.";
      note.classList.add("error");
    }
  });
}

function syncHeroAndCards(previousTrackId = activeTrackId) {
  document.body.dataset.activeTrack = activeTrackId;
  const activeTrack = getTrack(activeTrackId);

  document.querySelectorAll("[data-track-control]").forEach((control) => {
    const trackId = control.getAttribute("data-track-control");
    const isActive = trackId === activeTrackId;

    control.classList.toggle("is-active", isActive);
    control.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  animateHeroSwap(activeTrack, previousTrackId);

  renderActiveRelease(activeTrack);
}

function setActiveTrack(trackId) {
  if (!hasTrack(trackId)) return;
  if (trackId === activeTrackId) return;
  const previousTrackId = activeTrackId;
  activeTrackId = trackId;
  syncHeroAndCards(previousTrackId);
}

function initHero() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  document.querySelectorAll("[data-track-control]").forEach((node) => {
    const trackId = node.getAttribute("data-track-control");

    if (!trackId) return;

    node.addEventListener("click", () => setActiveTrack(trackId));
    node.addEventListener("focus", () => setActiveTrack(trackId));
    node.addEventListener("mouseenter", () => setActiveTrack(trackId));
  });

  const heroThumbs = Array.from(document.querySelectorAll(".hero-thumb[data-track-control]"));
  heroThumbs.forEach((control) => {
    control.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      let nextIndex = heroThumbs.findIndex((item) => item === control);

      if (event.key === "ArrowRight") {
        nextIndex = (nextIndex + 1) % heroThumbs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (nextIndex - 1 + heroThumbs.length) % heroThumbs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = heroThumbs.length - 1;
      }

      const next = heroThumbs[nextIndex];
      const nextTrackId = next.getAttribute("data-track-control");
      if (!nextTrackId) return;

      setActiveTrack(nextTrackId);
      next.focus();
    });
  });
}

function updateCountdown() {
  const daysEl = document.getElementById("daysValue");
  const hoursEl = document.getElementById("hoursValue");
  const minutesEl = document.getElementById("minutesValue");
  const secondsEl = document.getElementById("secondsValue");
  const stateEl = document.getElementById("countdownState");
  const chipSummaryEl = document.getElementById("chipSummary");
  const chipDaysEl = document.getElementById("chipDays");
  const chipHoursEl = document.getElementById("chipHours");
  const chipMinutesEl = document.getElementById("chipMinutes");
  const chipSecondsEl = document.getElementById("chipSeconds");
  const chipStateEl = document.getElementById("chipState");
  const target = new Date(PAGE_CONFIG.album.releaseISO).getTime();
  const now = Date.now();
  const diff = target - now;

  if (Number.isNaN(target)) {
    if (stateEl) stateEl.textContent = "Countdown unavailable. Add a valid ISO date in PAGE_CONFIG.";
    if (chipSummaryEl) chipSummaryEl.textContent = "--d --h --m";
    if (chipStateEl) chipStateEl.textContent = "Countdown unavailable.";
    return;
  }

  if (diff <= 0) {
    if (daysEl) daysEl.textContent = "0";
    if (hoursEl) hoursEl.textContent = "00";
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";
    if (stateEl) stateEl.textContent = PAGE_CONFIG.album.title + " is out now.";
    if (chipSummaryEl) chipSummaryEl.textContent = "OUT NOW";
    if (chipDaysEl) chipDaysEl.textContent = "0";
    if (chipHoursEl) chipHoursEl.textContent = "00";
    if (chipMinutesEl) chipMinutesEl.textContent = "00";
    if (chipSecondsEl) chipSecondsEl.textContent = "00";
    if (chipStateEl) chipStateEl.textContent = PAGE_CONFIG.album.title + " is out now.";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (daysEl) daysEl.textContent = String(days);
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  if (stateEl) stateEl.textContent = "";
  if (chipSummaryEl) chipSummaryEl.textContent = days + "d " + String(hours).padStart(2, "0") + "h " + String(minutes).padStart(2, "0") + "m";
  if (chipDaysEl) chipDaysEl.textContent = String(days);
  if (chipHoursEl) chipHoursEl.textContent = String(hours).padStart(2, "0");
  if (chipMinutesEl) chipMinutesEl.textContent = String(minutes).padStart(2, "0");
  if (chipSecondsEl) chipSecondsEl.textContent = String(seconds).padStart(2, "0");
  if (chipStateEl) chipStateEl.textContent = "April 24, 2026 release";
}

function initCountdownChip() {
  const chip = document.querySelector(".countdown-chip");
  const toggleBtn = document.getElementById("chipToggleBtn");
  const panel = document.getElementById("chipPanel");
  if (!chip || !toggleBtn || !panel) return;

  toggleBtn.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    chip.classList.toggle("open", open);
    toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    toggleBtn.textContent = open ? "Minimize" : "Expand";
  });
}

function initStaticContent() {
  const heroArtist = document.getElementById("heroArtist");
  const albumCover = document.getElementById("albumCover");
  const albumPreSaveBtn = document.getElementById("albumPreSaveBtn");
  const chipPreSaveBtn = document.getElementById("chipPreSaveBtn");
  const yearValue = document.getElementById("yearValue");

  if (heroArtist) {
    heroArtist.textContent = PAGE_CONFIG.artistName;
  }

  if (albumCover) {
    albumCover.src = resolveAssetUrl(PAGE_CONFIG.album.coverImage);
    albumCover.alt = PAGE_CONFIG.album.title + " album cover";
    albumCover.addEventListener("error", () => {
      albumCover.parentElement.style.display = "none";
    }, { once: true });
  }

  setAnchorHrefOrDisable(albumPreSaveBtn, PAGE_CONFIG.album.preSaveSpotifyUrl);
  setAnchorHrefOrDisable(chipPreSaveBtn, PAGE_CONFIG.album.preSaveSpotifyUrl);

  if (yearValue) {
    yearValue.textContent = String(new Date().getFullYear());
  }

  renderTablatureSection();
  renderPreviousSingles();
}

function init() {
  initStaticContent();
  renderVideo();
  PAGE_CONFIG.singles.forEach(renderTrack);
  syncHeroAndCards();
  initHero();
  initSubscribeForm();
  initCountdownChip();
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

init();
