(() => {
  const orbit = document.querySelector('.hero-episode-orbit');
  const items = orbit?.querySelector('.episode-orbit-items');
  if (!orbit || !items || !window.mandarinitaEpisodesCatalogPromise) return;

  const language = () => document.documentElement.lang === 'en' ? 'en' : 'es';
  const thumbnail = src => src.replace(/([^/]+)\.(?:png|jpe?g|webp)$/i, 'thumb-320-$1.webp');
  const mix = values => {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const render = episodes => {
    const lang = language();
    orbit.setAttribute('aria-label', orbit.dataset[`label${lang === 'en' ? 'En' : 'Es'}`]);
    items.replaceChildren();
    const cards = [];
    mix(episodes).slice(0, 6).forEach((episode, index) => {
      const panel = [...episode.panels].sort((a, b) => a.order - b.order)[0];
      if (!panel) return;
      const anchor = document.createElement('a');
      anchor.className = 'episode-orbit-card';
      const title = episode.title?.[lang] || episode.title?.es || '';
      anchor.href = `episodios.html?episode=${encodeURIComponent(episode.id)}&lang=${lang}`;
      anchor.setAttribute('aria-label', lang === 'en'
        ? `Episode ${episode.episodeNumber}: ${title}`
        : `Episodio ${episode.episodeNumber}: ${title}`);
      anchor.dataset.orbitIndex = index;
      const image = document.createElement('img');
      image.src = thumbnail(panel.sourceSrc || panel.src);
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      image.width = 320;
      image.height = 320;
      image.addEventListener('error', () => {
        if (image.src !== new URL(panel.src, location.href).href) image.src = panel.sourceSrc || panel.src;
      }, { once: true });
      const label = document.createElement('span');
      label.textContent = `EP. ${episode.episodeNumber}`;
      anchor.append(image, label);
      items.append(anchor);
      cards.push({ anchor, phase: -Math.PI / 2 + Math.PI * 2 * index / 6 });
    });

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    let paused = false;
    let angle = 0;
    let previousTime = 0;
    let frame = 0;
    const depth = () => Math.min(110, orbit.getBoundingClientRect().height * 0.26);
    const positionCards = () => {
      const bounds = orbit.getBoundingClientRect();
      const radiusX = bounds.width * 0.43;
      const radiusY = bounds.height * 0.43;
      const zRadius = depth();
      cards.forEach(({ anchor, phase }) => {
        const theta = phase + angle;
        const x = Math.cos(theta) * radiusX;
        const y = Math.sin(theta) * radiusY;
        const z = Math.sin(theta) * zRadius;
        const back = Math.max(0, -z / zRadius);
        anchor.style.left = '50%';
        anchor.style.top = '50%';
        anchor.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,${z}px)`;
        anchor.style.filter = `blur(${(back * 1.15).toFixed(2)}px)`;
        anchor.style.opacity = String((1 - back * 0.2).toFixed(2));
        anchor.style.zIndex = z > 0 ? '2' : '0';
      });
    };
    const tick = time => {
      frame = 0;
      if (!visible || paused || reduceMotion.matches || document.visibilityState !== 'visible') {
        previousTime = 0;
        return;
      }
      if (previousTime) angle = (angle + (time - previousTime) * Math.PI * 2 / 52000) % (Math.PI * 2);
      previousTime = time;
      positionCards();
      frame = requestAnimationFrame(tick);
    };
    const start = () => { if (!frame && visible && !paused && !reduceMotion.matches) frame = requestAnimationFrame(tick); };
    const stop = () => { if (frame) cancelAnimationFrame(frame); frame = 0; previousTime = 0; };
    const setPaused = value => { paused = value; if (paused) stop(); else start(); };
    cards.forEach(({ anchor }) => {
      anchor.addEventListener('pointerenter', () => setPaused(true));
      anchor.addEventListener('pointerleave', () => setPaused(false));
      anchor.addEventListener('focus', () => setPaused(true));
      anchor.addEventListener('blur', () => setPaused(false));
    });
    reduceMotion.addEventListener?.('change', () => { if (reduceMotion.matches) stop(); else start(); });
    document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' ? start() : stop());
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start(); else stop();
      }, { threshold: 0.05 });
      observer.observe(orbit);
    }
    if ('ResizeObserver' in window) new ResizeObserver(positionCards).observe(orbit);
    positionCards();
    start();
  };

  window.mandarinitaEpisodesCatalogPromise.then(catalog => {
    const episodes = catalog.episodes.filter(entry => entry.status === 'published'
      && entry.type === 'comic' && entry.complete === true
      && Number.isInteger(entry.episodeNumber) && entry.panels?.length);
    if (!episodes.length) return;
    render(episodes);
    document.querySelector('.language-toggle')?.addEventListener('click', () => render(episodes));
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        orbit.classList.toggle('is-offscreen', !entry.isIntersecting);
      }, { threshold: 0.05 });
      observer.observe(orbit);
    }
  }).catch(() => orbit.remove());
})();
