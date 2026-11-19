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
  const heroArt = document.querySelector('.hero-art-family');
  const previewMode = new URLSearchParams(location.search).has('admin-banner-preview');
  const editLabels = {
    'hero.eyebrow': { es: 'frase de entrada', en: 'intro line' },
    'hero.title.first': { es: 'primera línea del título', en: 'first title line' },
    'hero.title.second': { es: 'segunda línea del título', en: 'second title line' },
    'hero.description': { es: 'descripción', en: 'description' },
    'hero.cta': { es: 'texto del botón', en: 'button text' },
    'hero.episode': { es: 'episodio destacado', en: 'featured episode' }
  };
  if (previewMode) {
    document.body.classList.add('hero-only-preview');
    document.querySelectorAll('#main > :not(.hero)').forEach(section => { section.hidden = true; });
  }
  const language = () => document.documentElement.dataset.lang === 'en' ? 'en' : 'es';
  if (previewMode) {
    for (const target of textTargets) {
      const key = target.dataset.liveContent;
      if (!editLabels[key]) continue;
      if (key === 'hero.cta') {
        target.title = language() === 'en' ? 'Click to edit this button text' : 'Haz clic para editar el texto del botón';
        continue;
      }
      target.tabIndex = 0;
      target.setAttribute('role', 'button');
      target.setAttribute('aria-label', language() === 'en' ? `Edit ${editLabels[key].en}` : `Editar ${editLabels[key].es}`);
      target.title = language() === 'en' ? 'Click to edit this text' : 'Haz clic para editar este texto';
    }
    if (heroImage) {
      heroImage.tabIndex = 0;
      heroImage.setAttribute('role', 'button');
      heroImage.setAttribute('aria-label', language() === 'en' ? 'Choose a different banner image' : 'Elegir otra imagen para el banner');
      heroImage.title = language() === 'en' ? 'Click to change this image' : 'Haz clic para cambiar esta imagen';
    }
    document.addEventListener('keydown', event => {
      if ((event.key !== 'Enter' && event.key !== ' ') || !(event.target instanceof Element)) return;
      const target = event.target.closest('[data-live-content], .hero-family-image');
      if (!target) return;
      event.preventDefault();
      target.click();
    });
  }
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
  let scheduledBanners = [];
  let scheduledBannerSignature = '';
  let scheduledBannerTimer = 0;
  let hasAppliedSchedule = false;
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
    if (!autoPlay || (banners.length < 2 && !previewMode) || document.visibilityState !== 'visible') {
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
    if (!autoPlay || (banners.length < 2 && !previewMode) || document.visibilityState !== 'visible' || progressFrame || progressStartedAt) return;
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
    const featuredEpisode = fields['hero.mediaType']?.es === 'episode';
    const isNewEpisode = featuredEpisode && fields['hero.isNew']?.es === 'true';
    if (heroImage) {
      heroImage.dataset.tilt = fields['hero.mediaStyle']?.es || 'straight';
      heroImage.dataset.shadow = fields['hero.mediaShadow']?.es || 'soft';
    }
    if (heroArt) {
      heroArt.dataset.featured = featuredEpisode ? 'episode' : 'image';
      heroArt.dataset.isNew = String(isNewEpisode);
      heroArt.dataset.newLabel = lang === 'en' ? 'NEW EPISODE' : 'NUEVO EPISODIO';
    }
    const cta = document.querySelector('.hero-copy .button-dark');
    if (cta && (/^#[A-Za-z0-9_-]+$/.test(banner.ctaHref || '') || /^\/\?episode=[a-z0-9-]{1,100}$/i.test(banner.ctaHref || ''))) cta.href = banner.ctaHref;
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
  function initializeCarousel(items, initialIndex = 0, { animate = false } = {}) {
    banners = items;
    document.body.classList.remove('hero-schedule-empty');
    document.body.classList.toggle('hero-preview-single', previewMode && banners.length < 2);
    current = Math.max(0, Math.min(initialIndex, banners.length - 1));
    if (!controls) { applyBanner(current); return; }
    const showControls = banners.length >= 2 || previewMode;
    controls.hidden = !showControls;
    if (!showControls) {
      autoPlay = false;
      applyBanner(current);
      return;
    }
    if (banners.length >= 2) buildDots();
    else dots?.replaceChildren();
    autoPlay = !reduceMotion.matches;
    updateToggle();
    applyBanner(current, { animate });
  }

  function scheduleIsActive(banner, now) {
    const start = Date.parse(banner.fields?.['hero.startAt']?.es || '');
    const end = Date.parse(banner.fields?.['hero.endAt']?.es || '');
    return (!Number.isFinite(start) || start <= now) && (!Number.isFinite(end) || end > now);
  }
  function applyScheduledBanners() {
    if (previewMode || !scheduledBanners.length) return;
    const now = Date.now();
    const active = scheduledBanners.filter(banner => scheduleIsActive(banner, now));
    const signature = active.map(banner => banner.id).join('|');
    if (signature !== scheduledBannerSignature) {
      const currentId = banners[current]?.id;
      const currentIndex = active.findIndex(banner => banner.id === currentId);
      scheduledBannerSignature = signature;
      if (!active.length) {
        document.body.classList.add('hero-schedule-empty');
        stopProgress(false);
        if (controls) controls.hidden = true;
      } else {
        initializeCarousel(active, currentIndex >= 0 ? currentIndex : 0, { animate: hasAppliedSchedule });
      }
      hasAppliedSchedule = true;
    }
    window.clearTimeout(scheduledBannerTimer);
    const boundaries = scheduledBanners.flatMap(banner => [
      Date.parse(banner.fields?.['hero.startAt']?.es || ''),
      Date.parse(banner.fields?.['hero.endAt']?.es || '')
    ]).filter(time => Number.isFinite(time) && time > now);
    if (boundaries.length) {
      scheduledBannerTimer = window.setTimeout(applyScheduledBanners, Math.max(50, Math.min(...boundaries) - now + 80));
    }
  }

  previous?.addEventListener('click', () => applyBanner(current - 1));
  next?.addEventListener('click', () => applyBanner(current + 1));
  toggle?.addEventListener('click', () => {
    autoPlay = !autoPlay;
    updateToggle();
    if (autoPlay) resumeProgress();
    else stopProgress(true);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      applyScheduledBanners();
      resumeProgress();
    } else stopProgress(true);
  });
  reduceMotion.addEventListener?.('change', () => {
    if (reduceMotion.matches) { autoPlay = false; stopProgress(true); }
    updateToggle();
  });
  document.querySelector('.language-toggle')?.addEventListener('click', () => {
    if (banners.length) applyBanner(current);
  });
  window.addEventListener('message', event => {
    if (!previewMode || event.origin !== location.origin || event.source !== window.parent) return;
    if (event.data?.type !== 'mandarinita:preview-banner') return;
    const items = Array.isArray(event.data.banners) ? event.data.banners.filter(item => item?.fields) : (event.data.banner?.fields ? [event.data.banner] : []);
    if (!items.length) return;
    document.body.classList.toggle('hero-preview-horizontal', event.data.layout === 'horizontal');
    document.body.classList.toggle('hero-preview-vertical', event.data.layout === 'vertical');
    initializeCarousel(items, Number.isInteger(event.data.selectedIndex) ? event.data.selectedIndex : 0);
  });
  if (previewMode) {
    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      const linkTarget = target?.closest('a');
      const editableText = target?.closest('[data-live-content]') || (event.detail === 0 ? linkTarget?.querySelector('[data-live-content]') : null);
      const editableImage = target?.closest('.hero-family-image');
      const editable = editableText || editableImage;
      if (editable) {
        const imageEditField = banners[current]?.fields?.['hero.mediaType']?.es === 'episode' ? 'hero.episode' : 'hero.image';
        const field = editableText?.dataset.liveContent || imageEditField;
        if (editLabels[field] || field === 'hero.image') {
          event.preventDefault();
          event.stopImmediatePropagation();
          window.parent.postMessage({
            type: 'mandarinita:preview-edit',
            field,
            language: language(),
            bannerId: typeof banners[current]?.id === 'string' ? banners[current].id : ''
          }, location.origin);
          return;
        }
      }
      const link = target?.closest('a') || null;
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
      if (Array.isArray(result?.banners) && result.banners.length) {
        scheduledBanners = result.banners.filter(banner => banner?.fields);
        applyScheduledBanners();
      }
    })
    .catch(() => { /* Static homepage content remains as the fallback. */ });
})();
