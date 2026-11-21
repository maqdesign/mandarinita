(() => {
  const STORAGE_KEY = 'mandarinita-local-favorites-v1';
  const NOTICE_KEY = 'mandarinita-local-favorites-notice-v1';
  const dialog = document.querySelector('#favorites-local-dialog');
  const icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></svg>';

  function read() {
    try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
    catch { return new Set(); }
  }

  function write(ids) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids])); }
    catch { return false; }
    window.dispatchEvent(new CustomEvent('mandarinita-favorites-change', { detail: [...ids] }));
    return true;
  }
  function noticeWasShown() { try { return localStorage.getItem(NOTICE_KEY) === 'shown'; } catch { return true; } }
  function markNoticeShown() { try { localStorage.setItem(NOTICE_KEY, 'shown'); } catch {} }

  function label(button, saved) {
    const english = document.documentElement.dataset.lang === 'en';
    const text = saved ? (english ? 'Remove from favorites' : 'Quitar de favoritos')
      : (english ? 'Save as favorite' : 'Guardar como favorito');
    button.setAttribute('aria-label', text);
    button.title = text;
    button.setAttribute('aria-pressed', String(saved));
    button.classList.toggle('is-favorite', saved);
    button.innerHTML = icon;
  }

  function makeButton(id, extraClass = '') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `episode-favorite ${extraClass}`.trim();
    button.dataset.episodeId = id;
    label(button, read().has(id));
    return button;
  }

  window.createMandarinitaFavoriteButton = makeButton;
  window.isMandarinitaFavorite = id => read().has(id);
  window.syncMandarinitaFavoriteButton = button => {
    if (button?.dataset.episodeId) label(button, read().has(button.dataset.episodeId));
  };
  window.getMandarinitaFavorites = () => [...read()];

  document.addEventListener('click', event => {
    const button = event.target.closest('.episode-favorite');
    if (!button?.dataset.episodeId) return;
    event.preventDefault();
    event.stopPropagation();
    const ids = read();
    const wasSaved = ids.has(button.dataset.episodeId);
    if (wasSaved) ids.delete(button.dataset.episodeId);
    else ids.add(button.dataset.episodeId);
    if (!write(ids)) return;
    document.querySelectorAll('.episode-favorite').forEach(node => {
      if (node.dataset.episodeId === button.dataset.episodeId) label(node, !wasSaved);
    });
    if (!wasSaved && dialog && !noticeWasShown()) {
      dialog.showModal();
      markNoticeShown();
    }
  });

  dialog?.querySelector('button')?.addEventListener('click', () => dialog.close());
  window.addEventListener('mandarinita-language-change', () => {
    document.querySelectorAll('.episode-favorite').forEach(button => label(button, read().has(button.dataset.episodeId)));
  });
})();
