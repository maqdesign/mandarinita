(() => {
  const textTargets = [...document.querySelectorAll('[data-live-content]')];
  const heroImage = document.querySelector('.hero-family-image');
  const orbit = document.querySelector('.hero-episode-orbit');
  const controls = document.querySelector('#hero-carousel-controls');
  const status = document.querySelector('#hero-carousel-status');
  const dots = document.querySelector('#hero-carousel-dots');
  const previous = document.querySelector('#hero-carousel-previous');
  const next = document.querySelector('#hero-carousel-next');
  const toggle = document.querySelector('#hero-carousel-toggle');
  const toggleLabel = document.querySelector('#hero-carousel-toggle-label');
  const progress = document.querySelector('#hero-carousel-progress');
  const progressFill = document.querySelector('#hero-carousel-progress-fill');
  const timing = document.querySelector('#hero-carousel-timing');
  const hero = document.querySelector('.hero');
  const previewMode = new URLSearchParams(location.search).has('admin-banner-preview');
  if (previewMode) document.body.classList.add('hero-only-preview');
  const language = () => document.documentElement.dataset.lang === 'en' ? 'en' : 'es';
  const safeImage = path => {
    if (typeof path !== 'string' || !(path.startsWith('assets/') || path.startsWith('/api/site-content/image/'))) return null;
    const url = new URL(path, location.href);
    return url.origin === location.origin ? url.href : null;
  };
  let banners = [];
  let current = -1;
  let autoPlay = false;
  let progressElapsed = 0;
  let progressStartedAt = 0;
  let progressFrame = 0;
  let lastProgressAnnouncement = -1;
  let transitionSequence = 0;
  let hasDisplayedBanner = false;
  const BANNER_DURATION = 8000;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function stopProgress(preserve = true) {
    if (progressFrame) cancelAnimationFrame(progressFrame);
    progressFrame = 0;
    if (preserve && progressStartedAt) progressElapsed = Math.min(BANNER_DURATION, progressElapsed + performance.now() - progressStartedAt);
    progressStartedAt = 0;
    renderProgress(progressElapsed);
  }
  function renderProgress(elapsed) {
    const fraction = Math.max(0, Math.min(1, elapsed / BANNER_DURATION));
    if (progressFill) progressFill.style.transform = `scaleX(${fraction})`;
    const value = Math.floor(fraction * 100);
    if (progress && value !== lastProgressAnnouncement) {
      progress.setAttribute('aria-valuenow', String(value));
      const seconds = Math.max(0, Math.ceil((BANNER_DURATION - elapsed) / 1000));
      progress.setAttribute('aria-valuetext', language() === 'en' ? `${seconds} seconds remaining` : `Quedan ${seconds} segundos`);
      lastProgressAnnouncement = value;
    }
  }
  function progressTick(now) {
    if (!autoPlay || banners.length < 2 || document.visibilityState !== 'visible') {
      stopProgress(true);
      return;
    }
    const elapsed = Math.min(BANNER_DURATION, progressElapsed + now - progressStartedAt);
    renderProgress(elapsed);
    if (elapsed >= BANNER_DURATION) {
      progressElapsed = 0;
      progressStartedAt = 0;
      progressFrame = 0;
      renderProgress(0);
      void applyBanner(current + 1);
      return;
    }
    progressFrame = requestAnimationFrame(progressTick);
  }
  function resumeProgress() {
    if (!autoPlay || banners.length < 2 || document.visibilityState !== 'visible' || progressFrame || progressStartedAt) return;
    progressStartedAt = performance.now();
    progressFrame = requestAnimationFrame(progressTick);
  }
  function resetProgress() {
    stopProgress(false);
    progressElapsed = 0;
    renderProgress(0);
    resumeProgress();
  }
  function updateToggle() {
    if (!toggle) return;
    const playIcon = toggle.querySelector('[data-carousel-icon="play"]');
    const pauseIcon = toggle.querySelector('[data-carousel-icon="pause"]');
    const active = autoPlay;
    // SVGElement does not reflect the HTMLElement `hidden` property consistently.
    // Toggle the actual attribute so the visible icon always matches the action.
    playIcon?.toggleAttribute('hidden', active);
    pauseIcon?.toggleAttribute('hidden', !active);
    if (toggleLabel) toggleLabel.textContent = active ? (language() === 'en' ? 'Pause' : 'Pausar') : (language() === 'en' ? 'Resume' : 'Reanudar');
    toggle.setAttribute('aria-pressed', String(active));
    toggle.setAttribute('aria-label', active
      ? (language() === 'en' ? 'Pause automatic rotation' : 'Pausar rotación automática')
      : (language() === 'en' ? 'Resume automatic rotation' : 'Reanudar rotación automática'));
    if (status) status.setAttribute('aria-live', active ? 'off' : 'polite');
    if (timing) timing.textContent = active ? (language() === 'en' ? '8 s per banner' : '8 s por banner') : (language() === 'en' ? 'Paused' : 'En pausa');
  }
  function updateControlLabels() {
    if (!controls) return;
    const lang = language();
    controls.setAttribute('aria-label', lang === 'en' ? 'Homepage carousel controls' : 'Controles del carrusel de portada');
    previous?.setAttribute('aria-label', lang === 'en' ? 'Previous banner' : 'Banner anterior');
    next?.setAttribute('aria-label', lang === 'en' ? 'Next banner' : 'Banner siguiente');
    dots?.setAttribute('aria-label', lang === 'en' ? 'Choose banner' : 'Elegir banner');
    if (dots) [...dots.children].forEach((dot, index) => {
      const title = banners[index]?.fields?.['hero.title.first']?.[lang] || '';
      dot.setAttribute('aria-label', lang === 'en' ? `Show banner ${index + 1}: ${title}` : `Mostrar banner ${index + 1}: ${title}`);
    });
  }
  async function preloadImage(url) {
    if (!url) return;
    const image = new Image();
    image.src = url;
    if (!image.decode) return;
    await new Promise(resolve => {
      const timeout = setTimeout(resolve, 1200);
      image.decode().catch(() => {}).then(() => { clearTimeout(timeout); resolve(); });
    });
  }
  async function applyBanner(index, { animate = true } = {}) {
    if (!banners.length) return;
    const nextIndex = (index + banners.length) % banners.length;
    const changing = hasDisplayedBanner && nextIndex !== current;
    const sequence = ++transitionSequence;
    stopProgress(false);
    const banner = banners[nextIndex];
    const lang = language();
    const fields = banner.fields || {};
    const shouldAnimate = changing && animate && !reduceMotion.matches && !previewMode;
    if (shouldAnimate) {
      await preloadImage(safeImage(fields['hero.image']?.es));
      if (sequence !== transitionSequence) return;
      hero?.classList.add('is-banner-transitioning');
      await new Promise(resolve => setTimeout(resolve, 150));
      if (sequence !== transitionSequence) return;
    }
    current = nextIndex;
    for (const target of textTargets) {
      const value = fields[target.dataset.liveContent];
      if (typeof value?.[lang] !== 'string') continue;
      target.textContent = value[lang];
      target.dataset.es = value.es;
      target.dataset.en = value.en;
    }
    const image = safeImage(fields['hero.image']?.es);
    if (heroImage && image) heroImage.src = image;
    const alt = fields['hero.image.alt']?.[lang];
    if (heroImage && typeof alt === 'string') heroImage.alt = alt;
    const cta = document.querySelector('.hero-copy .button-dark');
    if (cta && /^#[A-Za-z0-9_-]+$/.test(banner.ctaHref || '')) cta.href = banner.ctaHref;
    const effect = fields['hero.effect']?.es === 'still' ? 'still' : 'orbit';
    if (orbit) {
      orbit.dataset.effect = effect;
      orbit.hidden = effect !== 'orbit';
      window.dispatchEvent(new CustomEvent('mandarinita:hero-effect', { detail: effect }));
    }
    if (status) {
      status.textContent = lang === 'en'
        ? `Banner ${current + 1} of ${banners.length}`
        : `Banner ${current + 1} de ${banners.length}`;
    }
    updateControlLabels();
    if (dots) [...dots.children].forEach((dot, dotIndex) => {
      dot.setAttribute('aria-current', dotIndex === current ? 'true' : 'false');
    });
    hasDisplayedBanner = true;
    if (shouldAnimate) {
      requestAnimationFrame(() => {
        if (sequence === transitionSequence) hero?.classList.remove('is-banner-transitioning');
      });
    } else {
      hero?.classList.remove('is-banner-transitioning');
    }
    updateToggle();
    resetProgress();
  }
  function buildDots() {
    if (!dots) return;
    dots.replaceChildren();
    banners.forEach((banner, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-carousel-dot';
      dot.setAttribute('aria-current', index === current ? 'true' : 'false');
      const title = banner.fields?.['hero.title.first']?.[language()] || '';
      dot.setAttribute('aria-label', language() === 'en' ? `Show banner ${index + 1}: ${title}` : `Mostrar banner ${index + 1}: ${title}`);
      dot.addEventListener('click', () => applyBanner(index));
      dots.append(dot);
    });
  }
  function initializeCarousel(items) {
    banners = items;
    current = 0;
    if (!controls) { applyBanner(0); return; }
    controls.hidden = banners.length < 2;
    if (banners.length < 2) {
      applyBanner(0);
      return;
    }
    buildDots();
    autoPlay = !previewMode && !reduceMotion.matches;
    updateToggle();
    applyBanner(0);
  }

  previous?.addEventListener('click', () => applyBanner(current - 1));
  next?.addEventListener('click', () => applyBanner(current + 1));
  toggle?.addEventListener('click', () => {
    autoPlay = !autoPlay;
    updateToggle();
    if (autoPlay) resumeProgress();
    else stopProgress(true);
  });
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' ? resumeProgress() : stopProgress(true));
  reduceMotion.addEventListener?.('change', () => {
    if (reduceMotion.matches) { autoPlay = false; stopProgress(true); }
    updateToggle();
  });
  document.querySelector('.language-toggle')?.addEventListener('click', () => {
    if (banners.length) applyBanner(current);
  });
  window.addEventListener('message', event => {
    if (!previewMode || event.origin !== location.origin || event.source !== window.parent) return;
    if (event.data?.type !== 'mandarinita:preview-banner' || !event.data.banner?.fields) return;
    document.body.classList.toggle('hero-preview-horizontal', event.data.layout === 'horizontal');
    initializeCarousel([event.data.banner]);
  });
  if (previewMode) {
    document.addEventListener('click', event => {
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      if (!link) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.parent.postMessage({
        type: 'mandarinita:preview-action',
        label: (link.textContent || '').trim().slice(0, 100),
        href: link.getAttribute('href') || ''
      }, location.origin);
    }, true);
  }

  fetch('/api/site-content', { cache: 'no-store' })
    .then(response => response.ok ? response.json() : null)
    .then(result => {
      if (Array.isArray(result?.banners) && result.banners.length) initializeCarousel(result.banners);
    })
    .catch(() => { /* Static homepage content remains as the fallback. */ });
})();
