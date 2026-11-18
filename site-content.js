(() => {
  const targets = [...document.querySelectorAll('[data-live-content]')];
  if (!targets.length) return;
  const updateHeroAlt = () => {
    const heroImage = document.querySelector('.hero-family-image');
    if (heroImage?.dataset.altEs && heroImage?.dataset.altEn) {
      heroImage.alt = heroImage.dataset[document.documentElement.dataset.lang === 'en' ? 'altEn' : 'altEs'];
    }
  };
  document.querySelector('.language-toggle')?.addEventListener('click', updateHeroAlt);

  fetch('/api/site-content', { cache: 'no-store' })
    .then(response => response.ok ? response.json() : null)
    .then(result => {
      const content = result?.content || {};
      const language = document.documentElement.dataset.lang === 'en' ? 'en' : 'es';
      for (const element of targets) {
        const value = content[element.dataset.liveContent];
        if (!value || typeof value.es !== 'string' || typeof value.en !== 'string') continue;
        element.dataset.es = value.es;
        element.dataset.en = value.en;
        element.textContent = value[language];
      }
      const image = content['hero.image']?.es;
      const heroImage = document.querySelector('.hero-family-image');
      if (heroImage && typeof image === 'string' && (image.startsWith('assets/') || image.startsWith('/api/site-content/image/'))) {
        const imageUrl = new URL(image, location.href);
        if (imageUrl.origin === location.origin) heroImage.src = imageUrl.href;
      }
      const altText = content['hero.image.alt'];
      if (heroImage && typeof altText?.es === 'string' && typeof altText?.en === 'string') {
        heroImage.dataset.altEs = altText.es;
        heroImage.dataset.altEn = altText.en;
        updateHeroAlt();
      }
      const effect = content['hero.effect']?.es === 'still' ? 'still' : 'orbit';
      const orbit = document.querySelector('.hero-episode-orbit');
      if (orbit) {
        orbit.hidden = effect !== 'orbit';
        orbit.dataset.effect = effect;
        window.dispatchEvent(new CustomEvent('mandarinita:hero-effect', { detail: effect }));
      }
    })
    .catch(() => { /* The source HTML remains the fallback if the live copy is unavailable. */ });
})();
