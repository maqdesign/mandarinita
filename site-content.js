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
  const language = () => document.documentElement.dataset.lang === 'en' ? 'en' : 'es';
  const safeImage = path => {
    if (typeof path !== 'string' || !(path.startsWith('assets/') || path.startsWith('/api/site-content/image/'))) return null;
    const url = new URL(path, location.href);
    return url.origin === location.origin ? url.href : null;
  };
  let banners = [];
  let current = 0;
  let autoPlay = false;
  let interactionPaused = false;
  let pointerPaused = false;
  let focusPaused = false;
  let timer = 0;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function stopTimer() {
    if (timer) clearTimeout(timer);
    timer = 0;
  }
  function scheduleTimer() {
    stopTimer();
    if (banners.length < 2 || !autoPlay || interactionPaused || document.visibilityState !== 'visible') return;
    timer = setTimeout(() => applyBanner((current + 1) % banners.length), 8000);
  }
  function updateToggle() {
    if (!toggle) return;
    const playIcon = toggle.querySelector('[data-carousel-icon="play"]');
    const pauseIcon = toggle.querySelector('[data-carousel-icon="pause"]');
    const active = autoPlay;
    if (playIcon) playIcon.hidden = active;
    if (pauseIcon) pauseIcon.hidden = !active;
    toggle.setAttribute('aria-label', active
      ? (language() === 'en' ? 'Pause automatic rotation' : 'Pausar rotación automática')
      : (language() === 'en' ? 'Resume automatic rotation' : 'Reanudar rotación automática'));
    if (status) status.setAttribute('aria-live', active ? 'off' : 'polite');
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
  function updateInteractionPause() {
    interactionPaused = pointerPaused || focusPaused;
    if (interactionPaused) stopTimer();
    else scheduleTimer();
  }
  function applyBanner(index) {
    if (!banners.length) return;
    current = (index + banners.length) % banners.length;
    const banner = banners[current];
    const lang = language();
    const fields = banner.fields || {};
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
    updateToggle();
    scheduleTimer();
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
    autoPlay = !reduceMotion.matches;
    updateToggle();
    applyBanner(0);
  }

  previous?.addEventListener('click', () => applyBanner(current - 1));
  next?.addEventListener('click', () => applyBanner(current + 1));
  toggle?.addEventListener('click', () => {
    autoPlay = !autoPlay;
    updateToggle();
    scheduleTimer();
  });
  controls?.addEventListener('pointerenter', () => { pointerPaused = true; updateInteractionPause(); });
  controls?.addEventListener('pointerleave', () => { pointerPaused = false; updateInteractionPause(); });
  controls?.addEventListener('focusin', () => { focusPaused = true; updateInteractionPause(); });
  controls?.addEventListener('focusout', event => {
    if (!controls.contains(event.relatedTarget)) { focusPaused = false; updateInteractionPause(); }
  });
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' ? scheduleTimer() : stopTimer());
  reduceMotion.addEventListener?.('change', () => {
    if (reduceMotion.matches) { autoPlay = false; stopTimer(); }
    else if (banners.length > 1) autoPlay = true;
    updateToggle();
    scheduleTimer();
  });
  document.querySelector('.language-toggle')?.addEventListener('click', () => {
    if (banners.length) applyBanner(current);
  });

  fetch('/api/site-content', { cache: 'no-store' })
    .then(response => response.ok ? response.json() : null)
    .then(result => {
      if (Array.isArray(result?.banners) && result.banners.length) initializeCarousel(result.banners);
    })
    .catch(() => { /* Static homepage content remains as the fallback. */ });
})();
