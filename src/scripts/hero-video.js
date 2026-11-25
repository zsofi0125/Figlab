// @ts-check

/**
 * Devices that should keep the still poster: data saver on, a slow connection, or little memory
 * (where decoding two videos would cost battery and smoothness elsewhere on the page).
 */
function isConstrainedDevice() {
  /** @type {{ saveData?: boolean, effectiveType?: string } | undefined} */
  const connection = Reflect.get(navigator, 'connection');
  /** @type {number | undefined} */
  const memoryGb = Reflect.get(navigator, 'deviceMemory');
  return Boolean(connection?.saveData)
    || ['slow-2g', '2g', '3g'].includes(connection?.effectiveType ?? '')
    || (memoryGb !== undefined && memoryGb <= 2);
}

/** Resolves once the page has fully loaded and the browser is idle, so the video never competes with fonts and images. */
function whenPageIsIdle() {
  return new Promise((resolve) => {
    const whenIdle = () => {
      if ('requestIdleCallback' in window) window.requestIdleCallback(() => resolve(undefined), { timeout: 2000 });
      else window.setTimeout(() => resolve(undefined), 200);
    };
    if (document.readyState === 'complete') whenIdle();
    else window.addEventListener('load', whenIdle, { once: true });
  });
}

/**
 * Background video behind the hero, dark theme only. The file is fetched the first time the dark
 * theme is showing, and only for visitors who haven't asked for reduced motion or reduced data;
 * everyone else keeps the still poster from the CSS. It pauses when the hero is off screen or the
 * visitor switches to the light theme.
 *
 * Why two <video> elements instead of `loop`: a native loop seeks back to the start when the file
 * ends, which stalls for a moment, and recorded files can hold a few frozen frames at either end.
 * Here only the clean middle of the clip (`data-window-*`) is played; before it ends, the second
 * element starts from the beginning and fades in over the first, so the picture never stops.
 */
function initHeroVideo() {
  const holder = document.querySelector('[data-hero-video]');
  if (!(holder instanceof HTMLElement)) return;
  const players = /** @type {HTMLVideoElement[]} */ ([...holder.querySelectorAll('video')]);
  if (players.length !== 2) return;
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  if (prefersReducedMotion() || isConstrainedDevice()) return;

  // WebM is about a third of the size; Safari versions without VP9 get the MP4.
  const format = players[0].canPlayType('video/webm; codecs="vp9"') ? 'Webm' : 'Mp4';
  const sourceUrl = holder.dataset[`src${format}`];
  const [windowStart, windowEnd] = (holder.dataset[`window${format}`] ?? '').split(' ').map(Number);
  const crossfade = Number(holder.dataset.crossfade);
  if (!sourceUrl || !(windowEnd > windowStart) || !(crossfade > 0)) return;

  let isOnScreen = true;
  let isPageVisible = !document.hidden;
  /** @type {Promise<boolean> | null} */
  let loading = null;
  let [active, next] = players;
  let isFading = false;
  let frame = 0;

  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches);
  /** @param {HTMLVideoElement} video */
  const startPlaying = (video) => video.play().catch(() => { /* Autoplay refused: the poster stays. */ });

  /** One download shared by both players; a blob URL also seeks instantly, so the hand-over is never late. */
  const load = () => {
    loading ??= whenPageIsIdle()
      .then(() => fetch(sourceUrl))
      .then((response) => (response.ok ? response.blob() : Promise.reject(new Error(String(response.status)))))
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        return Promise.all(players.map((video) => new Promise((resolve) => {
          video.addEventListener('loadeddata', () => {
            video.currentTime = windowStart;
            resolve(undefined);
          }, { once: true });
          video.src = url;
        })));
      })
      .then(() => true, () => false);
    return loading;
  };

  const tick = () => {
    frame = 0;
    const time = active.currentTime;
    const fadeFrom = windowEnd - crossfade;
    if (!isFading && time >= fadeFrom) {
      isFading = true;
      next.currentTime = windowStart;
      next.style.zIndex = '2';
      active.style.zIndex = '1';
      startPlaying(next);
    }
    if (isFading) {
      // Tie the fade to the outgoing clip's own clock, so it stays smooth even if frames drop.
      next.style.opacity = String(clamp01((time - fadeFrom) / crossfade));
      if (time >= windowEnd || active.ended) {
        next.style.opacity = '1';
        active.pause();
        active.style.opacity = '0';
        active.currentTime = windowStart; // Ready for its next turn.
        [active, next] = [next, active];
        isFading = false;
      }
    }
    if (!active.paused) frame = window.requestAnimationFrame(tick);
  };

  const stop = () => {
    window.cancelAnimationFrame(frame);
    frame = 0;
    players.forEach((video) => video.pause());
  };

  const shouldPlay = () => isDark() && isOnScreen && isPageVisible;

  const update = async () => {
    if (!shouldPlay()) {
      stop();
      return;
    }
    if (!(await load()) || !shouldPlay()) return;
    if (active.style.opacity !== '1') {
      active.currentTime = windowStart; // First start: skip any held frames at the head of the file.
      active.style.opacity = '1';
    }
    await startPlaying(active);
    if (isFading) await startPlaying(next);
    holder.classList.add('is-playing');
    if (!frame) frame = window.requestAnimationFrame(tick);
  };

  systemDark.addEventListener('change', update);
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    update();
  });
  new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  new IntersectionObserver(([entry]) => {
    isOnScreen = entry.isIntersecting;
    update();
  }).observe(holder);
}
