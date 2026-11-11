(() => {
  const orbit = document.querySelector('.hero-episode-orbit');
  const backLayer = orbit?.querySelector('.episode-orbit-back');
  const frontLayer = orbit?.querySelector('.episode-orbit-front');
  if (!orbit || !backLayer || !frontLayer || !window.mandarinitaEpisodesCatalogPromise) return;

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
    backLayer.replaceChildren();
    frontLayer.replaceChildren();
    const cards = [];
    mix(episodes).slice(0, 12).forEach((episode, index) => {
      const panel = [...episode.panels].sort((a, b) => a.order - b.order)[0];
      if (!panel) return;
      const anchor = document.createElement('a');
      anchor.className = 'episode-orbit-card';
      anchor.dataset.orbitIndex = index;
      const image = document.createElement('img');
      image.src = thumbnail(panel.sourceSrc || panel.src);
      image.alt = '';
      image.loading = 'eager';
      image.fetchPriority = 'low';
      image.decoding = 'async';
      image.width = 320;
      image.height = 320;
      image.addEventListener('error', () => {
        if (image.src !== new URL(panel.src, location.href).href) image.src = panel.sourceSrc || panel.src;
      }, { once: true });
      const label = document.createElement('span');
      label.textContent = `EP. ${episode.episodeNumber}`;
      anchor.append(image, label);
      backLayer.append(anchor);
      cards.push({ anchor, episode, index });
    });

    const updateLanguage = () => {
      const lang = language();
      orbit.setAttribute('aria-label', orbit.dataset[`label${lang === 'en' ? 'En' : 'Es'}`]);
      cards.forEach(({ anchor, episode }) => {
        const title = episode.title?.[lang] || episode.title?.es || '';
        anchor.href = `episodios.html?episode=${encodeURIComponent(episode.id)}&lang=${lang}`;
        anchor.setAttribute('aria-label', lang === 'en'
          ? `Episode ${episode.episodeNumber}: ${title}`
          : `Episodio ${episode.episodeNumber}: ${title}`);
      });
    };
    updateLanguage();

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    let paused = false;
    let angle = 0;
    let previousTime = 0;
    let frame = 0;
    let hovering = false;
    let focused = false;
    const tilt = -12 * Math.PI / 180;
    const positionCards = () => {
      const bounds = orbit.getBoundingClientRect();
      const radiusX = bounds.width * 0.46;
      const radiusY = bounds.height * 0.34;
      const circumference = Math.PI * (3 * (radiusX + radiusY)
        - Math.sqrt((3 * radiusX + radiusY) * (radiusX + 3 * radiusY)));
      const cardWidth = parseFloat(getComputedStyle(cards[0]?.anchor || orbit).width) || 58;
      const visibleCount = Math.max(6, Math.min(12, Math.floor(circumference / (cardWidth * 1.35))));
      cards.forEach(({ anchor, index }) => {
        const isVisible = index < visibleCount;
        anchor.hidden = !isVisible;
        if (!isVisible) return;
        const phase = -Math.PI / 2 + Math.PI * 2 * index / visibleCount;
        const theta = phase + angle;
        const orbitX = Math.cos(theta) * radiusX;
        const orbitY = Math.sin(theta) * radiusY;
        const x = orbitX * Math.cos(tilt) - orbitY * Math.sin(tilt);
        const y = orbitX * Math.sin(tilt) + orbitY * Math.cos(tilt);
        // The visible upper half is always the far side; the lower half always
        // comes toward the reader and sits above the character artwork.
        const depthProgress = Math.min(1, Math.abs(y) / Math.max(radiusY, 1));
        const isBackHalf = y < 0;
        const back = isBackHalf ? depthProgress : 0;
        const scale = isBackHalf ? 1 - depthProgress * 0.18 : 1 + depthProgress * 0.14;
        const orbitSpread = isBackHalf ? 1 - depthProgress * 0.05 : 1 + depthProgress * 0.04;
        const positionX = x * orbitSpread;
        const positionY = y * orbitSpread;
        const targetLayer = isBackHalf ? backLayer : frontLayer;
        if (anchor.parentElement !== targetLayer) targetLayer.append(anchor);
        // Inside each half, let the lowest card paint last. This keeps card
        // overlaps consistent with the orbit's near/far depth at every frame.
        anchor.style.zIndex = String(Math.max(0, Math.round((y + radiusY) * 100)));
        anchor.style.left = '50%';
        anchor.style.top = '50%';
        anchor.style.transform = `translate(-50%,-50%) translate(${positionX}px,${positionY}px) scale(${scale})`;
        anchor.style.filter = `blur(${(back * 1.15).toFixed(2)}px)`;
        anchor.style.opacity = String((1 - back * 0.16).toFixed(2));
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
    const updatePaused = () => { paused = hovering || focused; if (paused) stop(); else start(); };
    cards.forEach(({ anchor }) => {
      anchor.addEventListener('pointerenter', () => { hovering = true; updatePaused(); });
      anchor.addEventListener('pointerleave', () => { hovering = false; updatePaused(); });
      anchor.addEventListener('focus', () => { focused = true; updatePaused(); });
      anchor.addEventListener('blur', () => { focused = false; updatePaused(); });
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
    return updateLanguage;
  };

  window.mandarinitaEpisodesCatalogPromise.then(catalog => {
    const episodes = catalog.episodes.filter(entry => entry.status === 'published'
      && entry.type === 'comic' && entry.complete === true
      && Number.isInteger(entry.episodeNumber) && entry.panels?.length);
    if (!episodes.length) return;
    const updateLanguage = render(episodes);
    document.querySelector('.language-toggle')?.addEventListener('click', updateLanguage);
  }).catch(() => orbit.remove());
})();
