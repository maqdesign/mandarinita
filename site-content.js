(() => {
  const targets = [...document.querySelectorAll('[data-live-content]')];
  if (!targets.length) return;

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
    })
    .catch(() => { /* The source HTML remains the fallback if the live copy is unavailable. */ });
})();
