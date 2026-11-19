(() => {
  const user = document.querySelector('#admin-user');
  const privateContent = document.querySelector('#admin-private-content');
  const logout = document.querySelector('#admin-logout');
  const sidebarToggle = document.querySelector('#admin-sidebar-toggle');
  const adminAlert = document.querySelector('#admin-alert');
  const adminAlertMessage = document.querySelector('#admin-alert-message');
  const adminAlertDismiss = document.querySelector('#admin-alert-dismiss');
  const inboxList = document.querySelector('#admin-inquiries-list');
  const inboxStatus = document.querySelector('#inquiry-load-status');
  const inboxCount = document.querySelector('#inquiry-count');
  const refreshInbox = document.querySelector('#refresh-inquiries');
  const refreshAnalytics = document.querySelector('#refresh-analytics');
  const analyticsStatus = document.querySelector('#analytics-status');
  const analyticsVisits = document.querySelector('#analytics-visits');
  const analyticsRequests = document.querySelector('#analytics-requests');
  const analyticsDays = document.querySelector('#analytics-days');
  const siteContentForm = document.querySelector('#site-content-form');
  const siteContentStatus = document.querySelector('#site-content-status');
  const siteContentFootnote = document.querySelector('.site-content-footnote');
  const siteContentSaveState = document.querySelector('#site-content-save-state');
  const heroImageFile = document.querySelector('#hero-image-file');
  const heroImagePreview = document.querySelector('#hero-image-preview');
  const heroImageStatus = document.querySelector('#hero-image-status');
  const heroMediaType = document.querySelector('#hero-media-type');
  const heroEpisodeId = document.querySelector('#hero-episode-id');
  const heroEpisodeSearch = document.querySelector('#hero-episode-search');
  const heroEpisodeOptions = document.querySelector('#hero-episode-options');
  const heroEpisodeSelection = document.querySelector('#hero-episode-selection');
  const heroEpisodeWrap = document.querySelector('#hero-episode-select-wrap');
  const heroEffectLabel = document.querySelector('#hero-effect-label');
  const heroMediaStyleLabel = document.querySelector('#hero-media-style-label');
  const heroMediaShadowLabel = document.querySelector('#hero-media-shadow-label');
  const heroEpisodeCustomDialog = document.querySelector('#hero-episode-custom-dialog');
  const heroStartAt = document.querySelector('#hero-start-at');
  const heroEndAt = document.querySelector('#hero-end-at');
  const bannerPreview = document.querySelector('#hero-banner-preview');
  const previewStage = document.querySelector('.hero-preview-stage');
  const previewLayoutButtons = [...document.querySelectorAll('[data-preview-layout]')];
  const bannerList = document.querySelector('#hero-banner-list');
  const bannerManagerStatus = document.querySelector('#banner-manager-status');
  const createBannerButton = document.querySelector('#create-banner');
  const duplicateBannerButton = document.querySelector('#duplicate-banner');
  const deleteBannerButton = document.querySelector('#delete-banner');
  const deleteBannerDialog = document.querySelector('#delete-banner-dialog');
  const confirmDeleteBanner = document.querySelector('#confirm-delete-banner');
  const heroPreviewToast = document.querySelector('#hero-preview-toast');
  const episodeEditorFrame = document.querySelector('#admin-episode-editor');
  const episodeEditorStatus = document.querySelector('#episode-editor-status');
  let bannerItems = [];
  let bannerBaseline = new Map();
  let bannerBaselineEnabled = new Map();
  let bannerBaselineOrder = [];
  let selectedBannerId = '';
  let bannersLoaded = false;
  let bannerDirty = false;
  let heroPreviewToastTimer = 0;
  let previewEditField = null;
  let heroPreviewLayout = 'horizontal';
  let approvedEpisodes = [];
  let episodeSearchEntries = [];
  let episodeCatalogLoaded = false;
  let pendingEpisodeCopy = null;
  let highlightedEpisodeIndex = -1;
  const draftAutosaveTimers = new Map();
  const draftAutosaveInFlight = new Map();
  const draftAutosaveRequested = new Set();
  siteContentForm.elements.hero_effect_es.addEventListener('change', () => {
    siteContentForm.elements.hero_effect_en.value = siteContentForm.elements.hero_effect_es.value;
  });
  const siteContentFields = [
    ['hero.eyebrow', 'hero_eyebrow_es', 'hero_eyebrow_en'],
    ['hero.title.first', 'hero_title_first_es', 'hero_title_first_en'],
    ['hero.title.second', 'hero_title_second_es', 'hero_title_second_en'],
    ['hero.description', 'hero_description_es', 'hero_description_en'],
    ['hero.cta', 'hero_cta_es', 'hero_cta_en'],
    ['hero.image', 'hero_image_es', 'hero_image_en'],
    ['hero.effect', 'hero_effect_es', 'hero_effect_en'],
    ['hero.image.alt', 'hero_image_alt_es', 'hero_image_alt_en'],
    ['hero.mediaType', 'hero_media_type', 'hero_media_type'],
    ['hero.episode', 'hero_episode_id', 'hero_episode_id'],
    ['hero.mediaStyle', 'hero_media_style', 'hero_media_style'],
    ['hero.mediaShadow', 'hero_media_shadow', 'hero_media_shadow'],
    ['hero.isNew', 'hero_is_new', 'hero_is_new'],
    ['hero.startAt', 'hero_start_at', 'hero_start_at'],
    ['hero.endAt', 'hero_end_at', 'hero_end_at']
  ];
  const adminViews = [...document.querySelectorAll('[data-admin-view]')];
  const isProductionHost = ['mandarinita.art', 'www.mandarinita.art'].includes(location.hostname);
  const contentEnvironmentLabel = isProductionHost ? 'Producción' : 'Preview';
  if (siteContentFootnote) {
    siteContentFootnote.textContent = isProductionHost
      ? 'Estás editando los banners de Producción. Los cambios guardados se verán en el sitio público.'
      : 'Estás en Preview. Los cambios guardados aquí no modifican la portada de Producción.';
  }
  const sectionLinks = [...document.querySelectorAll('.admin-sidebar nav a, .admin-quick-link')];
  for (const link of document.querySelectorAll('.admin-sidebar nav a')) {
    const label = link.querySelector('span:not(.admin-nav-icon)')?.textContent?.trim();
    if (label) { link.title = label; link.setAttribute('aria-label', label); }
  }
  let currentView = '';
  const escape = value => String(value || '').replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character]);
  function showAdminAlert(message) {
    if (!adminAlert || !adminAlertMessage || !message) return;
    adminAlertMessage.textContent = String(message).slice(0, 360);
    adminAlert.hidden = false;
  }
  adminAlertDismiss?.addEventListener('click', () => { adminAlert.hidden = true; });
  function showRuntimeError(message) {
    if (!message) return;
    showAdminAlert(`La administración encontró un problema: ${String(message).slice(0, 300)}`);
  }
  window.addEventListener('error', event => showRuntimeError(event.message || 'Error al cargar una sección.'));
  window.addEventListener('unhandledrejection', event => showRuntimeError(event.reason?.message || event.reason || 'Falló una solicitud.'));
  const collapsedPreference = (() => { try { return localStorage.getItem('mandarinita-admin-sidebar-collapsed') === 'true'; } catch { return false; } })();
  privateContent.classList.toggle('sidebar-collapsed', collapsedPreference);
  sidebarToggle?.setAttribute('aria-expanded', String(!collapsedPreference));
  sidebarToggle?.setAttribute('aria-label', collapsedPreference ? 'Expandir menú' : 'Contraer menú');
  sidebarToggle?.addEventListener('click', () => {
    const collapsed = privateContent.classList.toggle('sidebar-collapsed');
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle.setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Contraer menú');
    try { localStorage.setItem('mandarinita-admin-sidebar-collapsed', String(collapsed)); } catch { /* The menu still works without storage. */ }
  });
  function dominantImageColor(image) {
    if (!image?.naturalWidth || !image?.naturalHeight) return '';
    try {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 18;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return '';
      context.drawImage(image, 0, 0, 18, 18);
      const pixels = context.getImageData(0, 0, 18, 18).data;
      const buckets = new Map();
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] < 96) continue;
        const rgb = [pixels[i], pixels[i + 1], pixels[i + 2]].map(channel => Math.round(channel / 32) * 32);
        const key = rgb.join(',');
        buckets.set(key, (buckets.get(key) || 0) + pixels[i + 3]);
      }
      const best = [...buckets].sort((a, b) => b[1] - a[1])[0]?.[0];
      return best ? `rgb(${best})` : '';
    } catch { return ''; }
  }
  function updateEpisodeImageFrame() {
    if (!heroImagePreview) return;
    const isEpisode = heroMediaType?.value === 'episode';
    heroImagePreview.dataset.mediaType = isEpisode ? 'episode' : 'image';
    if (!isEpisode) {
      heroImagePreview.style.removeProperty('--episode-aspect-ratio');
      heroImagePreview.style.removeProperty('--episode-frame-color');
      return;
    }
    if (!heroImagePreview.naturalWidth || !heroImagePreview.naturalHeight) return;
    heroImagePreview.style.setProperty('--episode-aspect-ratio', `${heroImagePreview.naturalWidth} / ${heroImagePreview.naturalHeight}`);
    const color = dominantImageColor(heroImagePreview);
    if (color) heroImagePreview.style.setProperty('--episode-frame-color', color);
  }
  heroImagePreview?.addEventListener('load', updateEpisodeImageFrame);
  async function loadInquiries() {
    refreshInbox.disabled = true;
    try {
      const response = await fetch('/api/admin/inquiries?limit=50', { credentials: 'same-origin', cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo abrir el buzón.');
      const inquiries = result.inquiries || [];
      const newCount = inquiries.filter(item => item.status === 'new').length;
      inboxCount.textContent = newCount ? `${newCount} nuevas` : 'Al día';
      inboxStatus.textContent = inquiries.length ? `${inquiries.length} consultas recientes.` : 'Todavía no han llegado consultas.';
      inboxList.replaceChildren();
      for (const item of inquiries) {
        const card = document.createElement('article');
        card.className = `inquiry-card inquiry-${item.status}`;
        const date = new Date(item.created_at).toLocaleString('es-DO', { dateStyle: 'medium', timeStyle: 'short' });
        card.innerHTML = `<div class="inquiry-card-top"><div><p class="admin-kicker">${escape(date)}</p><h3>${escape(item.name)}</h3><p class="inquiry-email">${escape(item.email)}</p></div><label class="inquiry-status-label">Estado<select aria-label="Estado de la consulta"><option value="new">Nueva</option><option value="reviewing">Revisando</option><option value="replied">Respondida</option><option value="archived">Archivada</option></select></label></div>${item.project ? `<p class="inquiry-project">${escape(item.project)}</p>` : ''}<p class="inquiry-message">${escape(item.message).replace(/\n/g, '<br>')}</p><a class="inquiry-reply" href="mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent('Sobre tu proyecto · Mandarinita')}">Responder <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 17 17 7M7 7h10v10"/></svg></a>`;
        const select = card.querySelector('select');
        select.value = item.status;
        select.addEventListener('change', async () => {
          select.disabled = true;
          try {
            const update = await fetch('/api/admin/inquiries', { method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, status: select.value }) });
            const result = await update.json();
            if (!update.ok) throw new Error(result.error || 'No se guardó el estado.');
            card.className = `inquiry-card inquiry-${select.value}`;
            inboxStatus.textContent = 'Estado actualizado.';
            inboxCount.textContent = `${inboxList.querySelectorAll('.inquiry-new').length} nuevas`;
          } catch (error) {
            showAdminAlert(`No se pudo actualizar la consulta: ${error.message}`);
            inboxStatus.textContent = error.message;
            select.value = item.status;
          } finally { select.disabled = false; }
        });
        inboxList.append(card);
      }
    } catch (error) {
      inboxStatus.textContent = error.message;
      inboxCount.textContent = 'Sin conexión';
      showAdminAlert(`No se pudieron cargar los mensajes: ${error.message}`);
    } finally { refreshInbox.disabled = false; }
  }
  async function loadAnalytics() {
    refreshAnalytics.disabled = true;
    analyticsStatus.textContent = 'Consultando las visitas de los últimos siete días…';
    try {
      const response = await fetch('/api/admin/analytics', { credentials: 'same-origin', cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudieron consultar las visitas.');
      analyticsVisits.textContent = new Intl.NumberFormat('es-DO').format(result.visits || 0);
      analyticsRequests.textContent = new Intl.NumberFormat('es-DO').format(result.requests || 0);
      const max = Math.max(1, ...result.days.map(day => Number(day.visits) || 0));
      analyticsDays.replaceChildren();
      for (const day of result.days) {
        const date = new Date(`${day.date}T12:00:00Z`);
        const item = document.createElement('div');
        item.className = 'analytics-day';
        item.setAttribute('aria-label', `${date.toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'short' })}: ${day.visits} visitas`);
        const track = document.createElement('span');
        track.className = 'analytics-day-track';
        const bar = document.createElement('span');
        bar.className = 'analytics-day-bar';
        bar.style.height = `${Math.max(4, Math.round((Number(day.visits) / max) * 100))}%`;
        bar.title = `${new Intl.NumberFormat('es-DO').format(day.visits)} visitas`;
        track.append(bar);
        const label = document.createElement('span');
        label.textContent = date.toLocaleDateString('es-DO', { weekday: 'short' }).replace('.', '');
        const value = document.createElement('strong');
        value.textContent = new Intl.NumberFormat('es-DO').format(day.visits || 0);
        item.append(track, label, value);
        analyticsDays.append(item);
      }
      analyticsStatus.textContent = `Datos del ${new Date(`${result.period.start}T12:00:00Z`).toLocaleDateString('es-DO')} al ${new Date(`${result.period.end}T12:00:00Z`).toLocaleDateString('es-DO')}.`;
    } catch (error) {
      analyticsStatus.textContent = error.message;
      showAdminAlert(`No se pudieron cargar las métricas: ${error.message}`);
      analyticsVisits.textContent = '—';
      analyticsRequests.textContent = '—';
      analyticsDays.replaceChildren();
    } finally { refreshAnalytics.disabled = false; }
  }
  const setBannerStatus = message => { if (bannerManagerStatus) bannerManagerStatus.textContent = message; };
  const setSiteContentStatus = message => { if (siteContentStatus) siteContentStatus.textContent = message; };
  const selectedBanner = () => bannerItems.find(item => item.id === selectedBannerId);
  const bannerSignature = banner => JSON.stringify({ position: banner.position, enabled: banner.enabled, ctaHref: banner.ctaHref, fields: banner.fields });
  function hasPendingBannerChanges() {
    return bannerItems.some(item => !bannerBaseline.has(item.id) || bannerBaseline.get(item.id) !== bannerSignature(item))
      || bannerItems.some((item, index) => bannerBaselineOrder[index] !== item.id)
      || bannerItems.length !== bannerBaselineOrder.length;
  }
  function updateBannerSaveState() {
    bannerDirty = hasPendingBannerChanges();
    const submit = siteContentForm.querySelector('[type="submit"]');
    const savingDraft = draftAutosaveInFlight.has(selectedBannerId);
    const saving = submit?.dataset.busy === 'true' || savingDraft;
    const selectedIsDraft = selectedBanner()?.enabled === false && bannerBaselineEnabled.get(selectedBannerId) === false;
    if (siteContentSaveState) {
      const state = saving ? 'saving' : bannerDirty ? 'dirty' : 'saved';
      siteContentSaveState.dataset.state = state;
      siteContentSaveState.querySelectorAll('[data-save-icon]').forEach(icon => { icon.hidden = icon.dataset.saveIcon !== state; });
      const label = siteContentSaveState.querySelector('span');
      if (label) label.textContent = saving ? (savingDraft ? 'Guardando borrador…' : 'Guardando…') : bannerDirty ? 'Cambios sin guardar' : selectedIsDraft ? 'Borrador guardado en la nube' : 'Todo guardado';
      siteContentSaveState.setAttribute('aria-label', saving ? (savingDraft ? 'Guardando borrador en la nube' : 'Guardando cambios') : bannerDirty ? 'Hay cambios sin guardar' : selectedIsDraft ? 'Borrador guardado en la nube' : 'Todos los cambios están guardados');
    }
    if (submit && !saving) submit.disabled = !bannerDirty;
    updateDeleteBannerState();
  }
  function hasPendingChangesExcept(id) {
    return bannerItems.some(item => item.id !== id && bannerBaseline.get(item.id) !== bannerSignature(item));
  }
  function scheduleDraftAutosave(id, delay = 700) {
    const banner = bannerItems.find(item => item.id === id);
    if (!banner || banner.enabled || bannerBaselineEnabled.get(id) !== false) return;
    window.clearTimeout(draftAutosaveTimers.get(id));
    const timer = window.setTimeout(() => {
      draftAutosaveTimers.delete(id);
      void saveDraftToCloud(id);
    }, delay);
    draftAutosaveTimers.set(id, timer);
  }
  async function saveDraftToCloud(id) {
    const pending = draftAutosaveInFlight.get(id);
    if (pending) {
      draftAutosaveRequested.add(id);
      await pending;
      return;
    }
    const banner = bannerItems.find(item => item.id === id);
    if (!banner || banner.enabled || bannerBaselineEnabled.get(id) !== false) return;
    const snapshot = JSON.parse(JSON.stringify(banner));
    const snapshotSignature = bannerSignature(snapshot);
    if (bannerBaseline.get(id) === snapshotSignature) return;
    const task = (async () => {
      if (id === selectedBannerId) {
        updateBannerSaveState();
        setSiteContentStatus('Guardando el borrador en la nube…');
      }
      const response = await fetch('/api/admin/banners', {
        method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banner: snapshot })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar el borrador en la nube.');
      const index = bannerItems.findIndex(item => item.id === id);
      if (index < 0) return;
      const currentSignature = bannerSignature(bannerItems[index]);
      bannerBaseline.set(id, bannerSignature(result.banner));
      bannerBaselineEnabled.set(id, false);
      if (currentSignature === snapshotSignature) bannerItems[index] = result.banner;
      updateBannerSaveState();
      renderBannerList();
      if (id === selectedBannerId && currentSignature === snapshotSignature) {
        setBannerStatus('Borrador guardado en la nube. Sigue inactivo hasta que lo actives.');
        setSiteContentStatus('Borrador guardado en la nube. Para mostrarlo en la portada, actívalo y guarda los cambios.');
      }
      if (bannerSignature(bannerItems[index]) !== bannerBaseline.get(id)) scheduleDraftAutosave(id);
    })();
    draftAutosaveInFlight.set(id, task);
    updateBannerSaveState();
    try {
      await task;
    } catch (error) {
      if (id === selectedBannerId) {
        showAdminAlert(`No se pudo guardar el borrador en la nube: ${error.message} Tus cambios siguen en esta pantalla; vuelve a intentarlo antes de salir.`);
        setBannerStatus(error.message);
        setSiteContentStatus(`${error.message} Este cambio aún no está guardado; reintenta antes de recargar.`);
      }
    } finally {
      draftAutosaveInFlight.delete(id);
      updateBannerSaveState();
      if (draftAutosaveRequested.delete(id)) scheduleDraftAutosave(id, 0);
    }
  }
  function updateDeleteBannerState() {
    const isNewDraft = Boolean(selectedBannerId) && !bannerBaseline.has(selectedBannerId);
    const otherChanges = hasPendingChangesExcept(selectedBannerId);
    const canDiscardDraft = isNewDraft && !otherChanges;
    deleteBannerButton.disabled = bannerItems.length <= 1 || (bannerDirty && !canDiscardDraft);
    deleteBannerButton.title = bannerItems.length <= 1
      ? 'Debe quedar al menos un banner en la portada.'
      : bannerDirty && !canDiscardDraft ? 'Guarda los otros cambios antes de quitar este banner.'
        : canDiscardDraft ? 'Descartar este borrador sin publicarlo.' : '';
  }
  function fromLocalDateTime(value) {
    if (!value) return '';
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? date.toISOString() : '';
  }
  function toLocalDateTime(value) {
    const date = new Date(value);
    if (!value || !Number.isFinite(date.getTime())) return '';
    const pad = number => String(number).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  async function loadEpisodeCatalog() {
    if (episodeCatalogLoaded) return;
    episodeCatalogLoaded = true;
    try {
      const [response, characterResponse, objectResponse] = await Promise.all([
        fetch('/episodes.json', { cache: 'no-store' }),
        fetch('/characters.json', { cache: 'no-store' }),
        fetch('/episode-objects.json', { cache: 'no-store' })
      ]);
      if (!response.ok || !characterResponse.ok || !objectResponse.ok) throw new Error('No se pudo cargar el catálogo de episodios y sus metadatos.');
      const [catalog, characterCatalog, objectCatalog] = await Promise.all([response.json(), characterResponse.json(), objectResponse.json()]);
      const characters = new Map((characterCatalog.characters || []).map(item => [item.id, item]));
      const objects = new Map((objectCatalog.objects || []).map(item => [item.id, item]));
      const localizedName = record => typeof record?.name === 'string' ? record.name : record?.name?.es || record?.name?.en || '';
      approvedEpisodes = (catalog.episodes || []).filter(entry => entry.status === 'published'
        && entry.type === 'comic' && entry.complete === true && Number.isInteger(entry.episodeNumber)
        && typeof entry.id === 'string' && /^[a-z0-9-]{1,100}$/i.test(entry.id)
        && entry.panels?.[0] && (entry.panels[0].watermarkedSrc || entry.panels[0].src)?.startsWith('assets/'));
      const labelValues = (ids, source) => ids.flatMap(id => {
        const record = source.get(id);
        return record ? [id, localizedName(record), record.name?.en, ...(record.aliases?.es || []), ...(record.aliases?.en || [])].filter(Boolean) : [id];
      });
      episodeSearchEntries = approvedEpisodes.map(entry => {
        const titleEs = typeof entry.title === 'string' ? entry.title : entry.title?.es || `Episodio ${entry.episodeNumber}`;
        const titleEn = typeof entry.title === 'string' ? entry.title : entry.title?.en || titleEs;
        const characterLabels = (entry.characters || []).map(id => localizedName(characters.get(id)) || id);
        const objectLabels = (entry.objects || []).map(id => localizedName(objects.get(id)) || id);
        const characterSearchTerms = labelValues(entry.characters || [], characters);
        const objectSearchTerms = labelValues(entry.objects || [], objects);
        const descriptions = (entry.panels || []).flatMap(panel => [panel.alt?.es, panel.alt?.en]).filter(Boolean);
        const searchable = normalizeSearch([entry.episodeNumber, titleEs, titleEn, entry.id, ...characterSearchTerms, ...objectSearchTerms, ...descriptions].join(' '));
        return { entry, titleEs, titleEn, characterLabels, objectLabels, searchable };
      });
      renderEpisodeOptions();
    } catch (error) {
      setBannerStatus(error.message);
      showAdminAlert(error.message);
      heroEpisodeOptions.replaceChildren();
      heroEpisodeOptions.hidden = true;
      heroEpisodeSelection.textContent = 'No se pudo cargar el catálogo. Recarga la sección para volver a intentar.';
    }
  }
  function normalizeSearch(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  }
  function renderEpisodeOptions() {
    const query = normalizeSearch(heroEpisodeSearch.value.trim());
    const matches = episodeSearchEntries.filter(item => !query || item.searchable.includes(query)).slice(0, 8);
    heroEpisodeOptions.replaceChildren();
    highlightedEpisodeIndex = matches.length ? 0 : -1;
    for (const [index, item] of matches.entries()) {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'hero-episode-option';
      option.id = `hero-episode-option-${index}`;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', String(index === highlightedEpisodeIndex));
      const title = document.createElement('strong');
      title.textContent = `Ep. ${item.entry.episodeNumber} · ${item.titleEs}`;
      const meta = document.createElement('small');
      const details = [];
      if (item.characterLabels.length) details.push(`Personajes: ${item.characterLabels.join(', ')}`);
      if (item.objectLabels.length) details.push(`Objetos: ${item.objectLabels.join(', ')}`);
      meta.textContent = details.join(' · ') || item.entry.panels[0]?.alt?.es || 'Episodio publicado';
      option.append(title, meta);
      option.addEventListener('mousedown', event => event.preventDefault());
      option.addEventListener('click', () => chooseFeaturedEpisode(item.entry.id));
      heroEpisodeOptions.append(option);
    }
    const isOpen = document.activeElement === heroEpisodeSearch && Boolean(query);
    heroEpisodeOptions.hidden = !isOpen;
    heroEpisodeSearch.setAttribute('aria-expanded', String(isOpen));
    if (isOpen && highlightedEpisodeIndex >= 0) heroEpisodeSearch.setAttribute('aria-activedescendant', `hero-episode-option-${highlightedEpisodeIndex}`);
    else heroEpisodeSearch.removeAttribute('aria-activedescendant');
    if (query && !matches.length && isOpen) {
      const empty = document.createElement('p');
      empty.className = 'hero-episode-empty';
      empty.textContent = 'No encontramos episodios con esos datos.';
      heroEpisodeOptions.append(empty);
    }
  }
  function episodeCopy(entry, isNew) {
    const titleEs = typeof entry.title === 'string' ? entry.title : entry.title?.es || `Episodio ${entry.episodeNumber}`;
    const titleEn = typeof entry.title === 'string' ? entry.title : entry.title?.en || titleEs;
    return {
      'hero.eyebrow': { es: isNew ? 'Nuevo episodio' : 'Episodio destacado', en: isNew ? 'New episode' : 'Featured episode' },
      'hero.title.first': { es: `Episodio ${entry.episodeNumber}`, en: `Episode ${entry.episodeNumber}` },
      'hero.title.second': { es: titleEs, en: titleEn }
    };
  }
  function episodeCopyIsCustom(banner, entry) {
    const currentNew = banner.fields['hero.isNew']?.es === 'true';
    const generated = episodeCopy(entry, currentNew);
    const originals = {
      'hero.eyebrow': ['Humor ilustrado desde República Dominicana', 'Illustrated humor from the Dominican Republic'],
      'hero.title.first': ['La vida tiene', 'Life has'],
      'hero.title.second': ['sus gajos.', 'its rough edges.']
    };
    return Object.entries(generated).some(([key, value]) => {
      const saved = banner.fields[key];
      const matchesGenerated = saved?.es === value.es && saved?.en === value.en;
      const matchesOriginal = originals[key]?.includes(saved?.es) && originals[key]?.includes(saved?.en);
      return !matchesGenerated && !matchesOriginal;
    });
  }
  function applyEpisodeCopy(entry) {
    const banner = selectedBanner();
    if (!banner) return;
    Object.assign(banner.fields, episodeCopy(entry, siteContentForm.elements.hero_is_new.checked));
    for (const [key, value] of Object.entries(episodeCopy(entry, siteContentForm.elements.hero_is_new.checked))) {
      const field = siteContentFields.find(([candidate]) => candidate === key);
      if (field) {
        siteContentForm.elements[field[1]].value = value.es;
        siteContentForm.elements[field[2]].value = value.en;
      }
    }
    captureBannerForm();
  }
  function chooseFeaturedEpisode(id) {
    const banner = selectedBanner();
    const episode = approvedEpisodes.find(item => item.id === id);
    if (!banner || !episode) return;
    const previous = approvedEpisodes.find(item => item.id === banner.fields['hero.episode']?.es);
    const custom = (!previous || previous.id !== id) && episodeCopyIsCustom(banner, previous || { episodeNumber: 0, title: { es: '', en: '' } });
    heroEpisodeId.value = id;
    heroEpisodeSearch.value = `Ep. ${episode.episodeNumber} · ${(typeof episode.title === 'string' ? episode.title : episode.title?.es) || ''}`;
    heroEpisodeOptions.hidden = true;
    heroEpisodeSearch.setAttribute('aria-expanded', 'false');
    const searchableEntry = episodeSearchEntries.find(item => item.entry.id === id);
    const metadataLabel = [...(searchableEntry?.characterLabels || []), ...(searchableEntry?.objectLabels || [])].join(' · ');
    heroEpisodeSelection.textContent = `${siteContentForm.elements.hero_is_new.checked ? 'Nuevo episodio · ' : ''}Ep. ${episode.episodeNumber} · ${typeof episode.title === 'string' ? episode.title : episode.title?.es || ''}${metadataLabel ? ` · ${metadataLabel}` : ''}`;
    pendingEpisodeCopy = custom ? episode : null;
    if (custom) heroEpisodeCustomDialog.showModal();
    else applyEpisodeCopy(episode);
    updateBannerMediaUI();
    captureBannerForm();
  }
  function updateBannerMediaUI() {
    const isEpisode = heroMediaType.value === 'episode';
    updateEpisodeImageFrame();
    heroEpisodeWrap.hidden = !isEpisode;
    heroEpisodeSearch.disabled = !isEpisode;
    heroEpisodeSearch.required = isEpisode;
    heroEpisodeId.required = false;
    siteContentForm.querySelector('.site-content-upload-label').hidden = isEpisode;
    heroImageFile.disabled = isEpisode;
    heroEffectLabel.hidden = isEpisode;
    heroMediaStyleLabel.hidden = !isEpisode;
    heroMediaShadowLabel.hidden = !isEpisode;
    siteContentForm.elements.hero_is_new.disabled = !isEpisode;
    heroImagePreview.dataset.tilt = siteContentForm.elements.hero_media_style.value;
    heroImagePreview.dataset.shadow = siteContentForm.elements.hero_media_shadow.value;
    siteContentForm.elements.hero_effect_es.disabled = isEpisode;
    if (!isEpisode) return;
    siteContentForm.elements.hero_effect_es.value = 'still';
    siteContentForm.elements.hero_effect_en.value = 'still';
    const episode = approvedEpisodes.find(item => item.id === heroEpisodeId.value);
    if (!episode) {
      heroImageStatus.textContent = 'Selecciona un episodio publicado para usar su primera viñeta.';
      heroEpisodeSelection.textContent = 'Busca un episodio y selecciónalo de las sugerencias.';
      return;
    }
    const panel = episode.panels[0];
    const imagePath = panel.watermarkedSrc || panel.src;
    if (!/^assets\/[A-Za-z0-9._/-]+\.(?:png|webp|jpe?g)$/i.test(imagePath)) return;
    heroImagePreview.src = new URL(imagePath, location.href).href;
    heroImagePreview.alt = `Primera viñeta del episodio ${episode.episodeNumber}`;
    heroImageStatus.textContent = `Primera viñeta · episodio ${episode.episodeNumber}`;
    siteContentForm.elements.hero_image_es.value = imagePath;
    siteContentForm.elements.hero_image_en.value = imagePath;
    const title = typeof episode.title === 'string' ? episode.title : episode.title?.es || `Episodio ${episode.episodeNumber}`;
    for (const [name, lang] of [['hero_image_alt_es', 'es'], ['hero_image_alt_en', 'en']]) {
      const alt = panel.alt?.[lang] || panel.alt?.es || title;
      siteContentForm.elements[name].value = `${lang === 'en' ? 'First panel of episode' : 'Primera viñeta del episodio'} ${episode.episodeNumber}: ${alt}`.slice(0, 300);
    }
  }
  function closeEpisodeSuggestions() {
    heroEpisodeOptions.hidden = true;
    heroEpisodeSearch.setAttribute('aria-expanded', 'false');
    heroEpisodeSearch.removeAttribute('aria-activedescendant');
  }
  heroEpisodeSearch.addEventListener('focus', renderEpisodeOptions);
  heroEpisodeSearch.addEventListener('input', () => {
    const selected = approvedEpisodes.find(item => item.id === heroEpisodeId.value);
    const expected = selected ? `Ep. ${selected.episodeNumber} · ${(typeof selected.title === 'string' ? selected.title : selected.title?.es) || ''}` : '';
    if (heroEpisodeSearch.value !== expected) heroEpisodeId.value = '';
    renderEpisodeOptions();
    if (!heroEpisodeId.value && heroMediaType.value === 'episode') {
      heroImageStatus.textContent = 'Selecciona un resultado para destacar su primera viñeta.';
      heroEpisodeSelection.textContent = 'Elige un episodio de las sugerencias para continuar.';
      captureBannerForm();
    }
  });
  heroEpisodeSearch.addEventListener('keydown', event => {
    const options = [...heroEpisodeOptions.querySelectorAll('[role="option"]')];
    if (event.key === 'Escape') { closeEpisodeSuggestions(); return; }
    if (!options.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      highlightedEpisodeIndex = (highlightedEpisodeIndex + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      options.forEach((option, index) => option.setAttribute('aria-selected', String(index === highlightedEpisodeIndex)));
      heroEpisodeSearch.setAttribute('aria-activedescendant', options[highlightedEpisodeIndex].id);
    } else if (event.key === 'Enter' && highlightedEpisodeIndex >= 0) {
      event.preventDefault();
      options[highlightedEpisodeIndex].click();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.hero-episode-picker')) closeEpisodeSuggestions();
  });
  document.querySelector('#hero-episode-apply-copy').addEventListener('click', () => {
    if (pendingEpisodeCopy) applyEpisodeCopy(pendingEpisodeCopy);
    pendingEpisodeCopy = null;
    heroEpisodeCustomDialog.close();
    setSiteContentStatus('Texto actualizado con el título y el anuncio del episodio.');
  });
  document.querySelector('#hero-episode-keep-copy').addEventListener('click', () => {
    pendingEpisodeCopy = null;
    heroEpisodeCustomDialog.close();
    captureBannerForm();
    setSiteContentStatus('Se conservaron tus textos personalizados.');
  });
  siteContentForm.elements.hero_is_new.addEventListener('change', () => {
    const banner = selectedBanner();
    const episode = approvedEpisodes.find(item => item.id === heroEpisodeId.value);
    if (banner && episode) {
      if (!episodeCopyIsCustom(banner, episode)) applyEpisodeCopy(episode);
      else {
        pendingEpisodeCopy = episode;
        heroEpisodeCustomDialog.showModal();
      }
    }
    captureBannerForm();
  });
  function captureBannerForm() {
    const banner = selectedBanner();
    if (!banner) return;
    let changed = false;
    for (const [key, esName, enName] of siteContentFields) {
      const inputValue = inputName => {
        const input = siteContentForm.elements[inputName];
        const value = input.type === 'checkbox' ? String(input.checked) : input.value;
        return inputName === 'hero_start_at' || inputName === 'hero_end_at' ? fromLocalDateTime(value) : value;
      };
      const es = inputName => inputValue(inputName);
      const esValue = es(esName);
      const enValue = key === 'hero.effect' || esName === enName ? esValue : es(enName);
      if (banner.fields[key].es !== esValue || banner.fields[key].en !== enValue) changed = true;
      banner.fields[key] = {
        es: esValue,
        en: enValue
      };
    }
    banner.fields['hero.effect'].en = banner.fields['hero.effect'].es;
    banner.ctaHref = banner.fields['hero.mediaType'].es === 'episode'
      ? `/?episode=${encodeURIComponent(banner.fields['hero.episode'].es)}`
      : '#historietas';
    updateBannerSaveState();
    if (changed) {
      if (!banner.enabled && bannerBaselineEnabled.get(banner.id) === false) {
        setBannerStatus('Guardando el borrador en la nube…');
        scheduleDraftAutosave(banner.id);
      } else {
        setBannerStatus(`Hay cambios pendientes. Guárdalos para publicarlos en ${contentEnvironmentLabel}.`);
      }
    }
    updateBannerPreview();
  }
  function fillBannerForm() {
    const banner = selectedBanner();
    if (!banner) {
      siteContentForm.hidden = true;
      return;
    }
    for (const [key, esName, enName] of siteContentFields) {
      const value = banner.fields[key];
      const es = key === 'hero.startAt' || key === 'hero.endAt' ? toLocalDateTime(value.es) : value.es;
      const en = key === 'hero.startAt' || key === 'hero.endAt' ? toLocalDateTime(value.en) : value.en;
      const esInput = siteContentForm.elements[esName];
      if (esInput.type === 'checkbox') esInput.checked = es === 'true'; else esInput.value = es;
      const enInput = siteContentForm.elements[enName];
      if (enInput.type === 'checkbox') enInput.checked = en === 'true'; else enInput.value = en;
    }
    siteContentForm.elements.banner_id.value = banner.id;
    siteContentForm.elements.hero_effect_en.value = banner.fields['hero.effect'].es;
    heroImagePreview.src = new URL(banner.fields['hero.image'].es, location.href).href;
    heroImageStatus.textContent = 'Imagen de este banner';
    const selectedEpisode = approvedEpisodes.find(item => item.id === banner.fields['hero.episode']?.es);
    heroEpisodeSearch.value = selectedEpisode ? `Ep. ${selectedEpisode.episodeNumber} · ${(typeof selectedEpisode.title === 'string' ? selectedEpisode.title : selectedEpisode.title?.es) || ''}` : '';
    const selectedMeta = episodeSearchEntries.find(item => item.entry.id === selectedEpisode?.id);
    const selectedLabels = [...(selectedMeta?.characterLabels || []), ...(selectedMeta?.objectLabels || [])].join(' · ');
    heroEpisodeSelection.textContent = selectedEpisode ? `${siteContentForm.elements.hero_is_new.checked ? 'Nuevo episodio · ' : ''}Ep. ${selectedEpisode.episodeNumber} · ${(typeof selectedEpisode.title === 'string' ? selectedEpisode.title : selectedEpisode.title?.es) || ''}${selectedLabels ? ` · ${selectedLabels}` : ''}` : 'Ningún episodio seleccionado.';
    updateBannerMediaUI();
    document.querySelector('#site-content-editor-title').textContent = `Editar banner ${bannerItems.indexOf(banner) + 1}`;
    siteContentForm.hidden = false;
    updateDeleteBannerState();
    duplicateBannerButton.disabled = bannerItems.length >= 8;
    duplicateBannerButton.title = bannerItems.length >= 8 ? 'El carrusel admite hasta ocho banners.' : '';
    heroImageFile.value = '';
    updateBannerPreview();
  }
  function updateBannerPreview() {
    const banner = selectedBanner();
    if (!bannerPreview?.contentWindow || !banner) return;
    const previewBanners = bannerItems.filter(item => item.enabled || item.id === selectedBannerId);
    const selectedIndex = Math.max(0, previewBanners.findIndex(item => item.id === selectedBannerId));
    bannerPreview.contentWindow.postMessage({
      type: 'mandarinita:preview-banner',
      banners: previewBanners,
      selectedIndex,
      layout: heroPreviewLayout
    }, location.origin);
  }
  function setHeroPreviewLayout(layout) {
    heroPreviewLayout = layout === 'vertical' ? 'vertical' : 'horizontal';
    if (previewStage) previewStage.dataset.layout = heroPreviewLayout;
    document.querySelector('.hero-admin-preview')?.setAttribute('data-layout', heroPreviewLayout);
    for (const button of previewLayoutButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.previewLayout === heroPreviewLayout));
    }
    updateBannerPreview();
  }
  for (const button of previewLayoutButtons) {
    button.addEventListener('click', () => setHeroPreviewLayout(button.dataset.previewLayout));
  }
  function showHeroPreviewToast(message) {
    if (!heroPreviewToast) return;
    window.clearTimeout(heroPreviewToastTimer);
    heroPreviewToast.textContent = message;
    heroPreviewToast.hidden = false;
    heroPreviewToastTimer = window.setTimeout(() => { heroPreviewToast.hidden = true; }, 3800);
  }
  function focusPreviewField(field, language, bannerNumber) {
    previewEditField?.element?.classList.remove('preview-edit-target');
    window.clearTimeout(previewEditField?.timer);
    if (field === 'hero.image') {
      const artwork = siteContentForm.querySelector('.site-content-artwork');
      artwork?.classList.add('preview-edit-target');
      previewEditField = { element: artwork, timer: window.setTimeout(() => artwork?.classList.remove('preview-edit-target'), 2600) };
      heroImageFile.scrollIntoView({ behavior: 'smooth', block: 'center' });
      heroImageFile.focus({ preventScroll: true });
      setSiteContentStatus(`Banner ${bannerNumber}: imagen seleccionada en la vista previa. Elige el archivo nuevo en “Imagen y movimiento”.`);
      showHeroPreviewToast(`Banner ${bannerNumber}: seleccionaste la imagen. Elige el archivo nuevo en “Imagen y movimiento”.`);
      return;
    }
    const fieldConfig = siteContentFields.find(([key]) => key === field);
    if (!fieldConfig || !['es', 'en'].includes(language)) return;
    const [, spanishName, englishName] = fieldConfig;
    const control = field === 'hero.episode' ? heroEpisodeSearch : siteContentForm.elements[language === 'en' ? englishName : spanishName];
    const group = control?.closest('.site-content-pair');
    if (!control || !group) return;
    group.classList.add('preview-edit-target');
    previewEditField = { element: group, timer: window.setTimeout(() => group.classList.remove('preview-edit-target'), 3000) };
    control.scrollIntoView({ behavior: 'smooth', block: 'center' });
    control.focus({ preventScroll: true });
    const languageLabel = field === 'hero.episode' ? '' : ` · ${language === 'en' ? 'English' : 'Español'}`;
    setSiteContentStatus(`Banner ${bannerNumber} · ${group.querySelector('legend')?.textContent || 'el campo'}${languageLabel}. Los cambios aparecen en la vista previa.`);
  }
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== bannerPreview?.contentWindow) return;
    if (event.data?.type === 'mandarinita:preview-edit') {
      const requestedBanner = typeof event.data.bannerId === 'string' ? bannerItems.find(item => item.id === event.data.bannerId) : null;
      if (requestedBanner && requestedBanner.id !== selectedBannerId) {
        captureBannerForm();
        selectedBannerId = requestedBanner.id;
        fillBannerForm();
        renderBannerList();
      }
      const bannerIndex = bannerItems.findIndex(item => item.id === selectedBannerId);
      focusPreviewField(event.data.field, event.data.language, Math.max(1, bannerIndex + 1));
      return;
    }
    if (event.data?.type === 'mandarinita:preview-action') {
      const label = typeof event.data.label === 'string' ? event.data.label.trim().slice(0, 70) : '';
      showHeroPreviewToast(`${label ? `“${label}”` : 'El botón'} responde. En la portada pública llevará a las historietas.`);
    }
  });
  function createIcon(pathData) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.8');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    svg.append(path);
    return svg;
  }
  function renderBannerList(focusAction = null) {
    bannerList.replaceChildren();
    bannerItems.forEach((banner, index) => {
      const row = document.createElement('div');
      row.className = `hero-banner-row${banner.id === selectedBannerId ? ' is-selected' : ''}`;
      row.setAttribute('role', 'listitem');
      const choose = document.createElement('button');
      choose.type = 'button';
      choose.className = 'hero-banner-select';
      choose.setAttribute('aria-current', banner.id === selectedBannerId ? 'true' : 'false');
      const image = document.createElement('img');
      image.src = new URL(banner.fields['hero.image'].es, location.href).href;
      image.alt = '';
      image.loading = 'lazy';
      const copy = document.createElement('span');
      copy.className = 'hero-banner-copy';
      const title = document.createElement('strong');
      title.textContent = `${banner.fields['hero.title.first'].es} ${banner.fields['hero.title.second'].es}`.trim();
      const detail = document.createElement('small');
      const featuredEpisode = approvedEpisodes.find(entry => entry.id === banner.fields['hero.episode']?.es);
      detail.textContent = banner.fields['hero.mediaType']?.es === 'episode'
        ? `${banner.fields['hero.isNew']?.es === 'true' ? 'Nuevo · ' : ''}${featuredEpisode ? `Ep. ${featuredEpisode.episodeNumber}` : 'Episodio destacado'}`
        : banner.fields['hero.effect'].es === 'orbit' ? 'Órbita de episodios' : 'Imagen fija';
      copy.append(title, detail);
      const indexLabel = document.createElement('span');
      indexLabel.className = 'hero-banner-index';
      indexLabel.textContent = String(index + 1).padStart(2, '0');
      choose.append(image, copy, indexLabel);
      choose.addEventListener('click', () => {
        captureBannerForm();
        selectedBannerId = banner.id;
        fillBannerForm();
        renderBannerList();
      });
      const enabledLabel = document.createElement('label');
      enabledLabel.className = 'hero-banner-enabled';
      const enabled = document.createElement('input');
      enabled.type = 'checkbox';
      enabled.checked = banner.enabled;
      enabled.setAttribute('aria-label', `Mostrar banner ${index + 1} en el sitio`);
      enabled.addEventListener('change', () => {
        if (!enabled.checked && bannerItems.filter(item => item.enabled).length <= 1) {
          enabled.checked = true;
          setBannerStatus('Deja al menos un banner activo en la portada.');
          showAdminAlert('Debe quedar al menos un banner activo en la portada.');
          return;
        }
        banner.enabled = enabled.checked;
        updateBannerSaveState();
        updateBannerPreview();
        setBannerStatus(`Hay cambios pendientes. Guárdalos para publicarlos en ${contentEnvironmentLabel}.`);
      });
      const startsAt = Date.parse(banner.fields['hero.startAt']?.es || '');
      const endsAt = Date.parse(banner.fields['hero.endAt']?.es || '');
      const availability = !banner.enabled ? 'Borrador'
        : Number.isFinite(endsAt) && endsAt <= Date.now() ? 'Vencido'
          : Number.isFinite(startsAt) && startsAt > Date.now() ? 'Programado' : 'Activo';
      enabledLabel.append(enabled, document.createTextNode(availability));
      const moveGroup = document.createElement('div');
      moveGroup.className = 'hero-banner-order';
      for (const [direction, path, label] of [['up', 'm18 15-6-6-6 6', 'Subir'], ['down', 'm6 9 6 6 6-6', 'Bajar']]) {
        const move = document.createElement('button');
        move.type = 'button';
        move.className = 'admin-refresh hero-banner-move';
        move.dataset.action = direction;
        move.dataset.bannerId = banner.id;
        move.disabled = direction === 'up' ? index === 0 : index === bannerItems.length - 1;
        move.setAttribute('aria-label', `${label} banner ${index + 1}`);
        move.append(createIcon(path));
        move.addEventListener('click', () => {
          const offset = direction === 'up' ? -1 : 1;
          [bannerItems[index], bannerItems[index + offset]] = [bannerItems[index + offset], bannerItems[index]];
          updateBannerSaveState();
          updateBannerPreview();
          setBannerStatus(`Orden pendiente. Guarda los cambios para publicarlos en ${contentEnvironmentLabel}.`);
          renderBannerList(direction);
        });
        moveGroup.append(move);
      }
      row.append(choose, enabledLabel, moveGroup);
      bannerList.append(row);
    });
    createBannerButton.disabled = !bannersLoaded || bannerItems.length >= 8;
    if (focusAction) {
      const button = [...bannerList.querySelectorAll('[data-action]')].find(item => item.dataset.action === focusAction);
      button?.focus();
    }
  }
  async function loadBanners() {
    if (bannersLoaded) return;
    setBannerStatus('Cargando banners…');
    try {
      await loadEpisodeCatalog();
      const response = await fetch('/api/admin/banners', { credentials: 'same-origin', cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudieron cargar los banners.');
      bannerItems = result.banners || [];
      bannerBaseline = new Map(bannerItems.map(item => [item.id, bannerSignature(item)]));
      bannerBaselineEnabled = new Map(bannerItems.map(item => [item.id, item.enabled]));
      bannerBaselineOrder = bannerItems.map(item => item.id);
      selectedBannerId = bannerItems.find(item => item.enabled)?.id || bannerItems[0]?.id || '';
      bannersLoaded = true;
      updateBannerSaveState();
      renderBannerList();
      fillBannerForm();
      setBannerStatus(bannerItems.length ? `${bannerItems.length} ${bannerItems.length === 1 ? 'banner' : 'banners'} en la portada.` : 'Aún no hay banners.');
      updateBannerSaveState();
      setSiteContentStatus(`Edita el banner. Usa Guardar cambios o Ctrl/Cmd+S para publicarlo en ${contentEnvironmentLabel}.`);
    } catch (error) { setBannerStatus(error.message); showAdminAlert(`No se pudieron cargar los banners: ${error.message}`); }
  }
  async function createBanner() {
    createBannerButton.disabled = true;
    try {
      const response = await fetch('/api/admin/banners', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo crear el banner.');
      bannerItems.push(result.banner);
      selectedBannerId = result.banner.id;
      bannerBaseline.set(result.banner.id, bannerSignature(result.banner));
      bannerBaselineEnabled.set(result.banner.id, false);
      bannerBaselineOrder.push(result.banner.id);
      updateBannerSaveState();
      renderBannerList();
      fillBannerForm();
      setBannerStatus('Borrador creado y guardado en la nube. Sigue inactivo hasta que lo actives.');
      setSiteContentStatus('Este borrador ya está guardado en la nube. Sus cambios se guardan automáticamente mientras permanece inactivo.');
      siteContentForm.elements.hero_title_first_es.focus();
    } catch (error) { setBannerStatus(error.message); showAdminAlert(`No se pudo crear el borrador: ${error.message}`); }
    finally { createBannerButton.disabled = bannerItems.length >= 8; }
  }
  async function duplicateBanner() {
    const source = selectedBanner();
    if (!source || bannerItems.length >= 8) return;
    duplicateBannerButton.disabled = true;
    setSiteContentStatus('Preparando una copia de este banner…');
    try {
      const response = await fetch('/api/admin/banners', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sourceId: source.id }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo duplicar el banner.');
      const clone = {
        ...result.banner,
        enabled: false,
        ctaHref: source.ctaHref,
        fields: JSON.parse(JSON.stringify(source.fields))
      };
      const sourceIndex = bannerItems.findIndex(item => item.id === source.id);
      bannerItems.splice(sourceIndex + 1, 0, clone);
      selectedBannerId = clone.id;
      bannerBaseline.set(clone.id, bannerSignature(result.banner));
      bannerBaselineEnabled.set(clone.id, false);
      bannerBaselineOrder.push(clone.id);
      updateBannerSaveState();
      renderBannerList();
      fillBannerForm();
      setBannerStatus('Copia creada como borrador en la nube. Sigue inactiva hasta que la actives.');
      setSiteContentStatus('Los cambios del borrador se guardan automáticamente en la nube. Actívalo y guarda cuando quieras mostrarlo.');
      scheduleDraftAutosave(clone.id);
      siteContentForm.elements.hero_title_first_es.focus();
    } catch (error) {
      setSiteContentStatus(error.message);
      setBannerStatus(error.message);
      showAdminAlert(`No se pudo duplicar el banner: ${error.message}`);
    } finally {
      duplicateBannerButton.disabled = bannerItems.length >= 8;
    }
  }
  async function saveBanners() {
    captureBannerForm();
    for (const timer of draftAutosaveTimers.values()) window.clearTimeout(timer);
    draftAutosaveTimers.clear();
    if (draftAutosaveInFlight.size) await Promise.all([...draftAutosaveInFlight.values()]);
    captureBannerForm();
    for (const timer of draftAutosaveTimers.values()) window.clearTimeout(timer);
    draftAutosaveTimers.clear();
    if (!bannerDirty) { setSiteContentStatus('No hay cambios pendientes.'); return; }
    const submit = siteContentForm.querySelector('[type="submit"]');
    if (submit.dataset.busy === 'true') return;
    submit.dataset.busy = 'true';
    submit.disabled = true;
    updateBannerSaveState();
    setSiteContentStatus(`Guardando banners en ${contentEnvironmentLabel}…`);
    try {
      const response = await fetch('/api/admin/banners', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ banners: bannerItems }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudieron publicar los banners.');
      bannerItems = result.banners;
      bannerDirty = false;
      bannerBaseline = new Map(bannerItems.map(item => [item.id, bannerSignature(item)]));
      bannerBaselineEnabled = new Map(bannerItems.map(item => [item.id, item.enabled]));
      bannerBaselineOrder = bannerItems.map(item => item.id);
      renderBannerList();
      fillBannerForm();
      updateBannerSaveState();
      setBannerStatus(`Cambios publicados en ${contentEnvironmentLabel}.`);
      const activeCount = bannerItems.filter(item => item.enabled).length;
      setSiteContentStatus(activeCount ? `Listo: ${activeCount} ${activeCount === 1 ? 'banner activo' : 'banners activos'} publicado${activeCount === 1 ? '' : 's'} en ${contentEnvironmentLabel}. Recarga la portada para verlos.` : 'Los cambios se guardaron, pero no se publicaron banners: activa al menos uno para que aparezca en la portada.');
    } catch (error) {
      setSiteContentStatus(error.message);
      setBannerStatus(error.message);
      showAdminAlert(`No se pudieron guardar los banners: ${error.message}`);
    } finally { submit.dataset.busy = 'false'; updateBannerSaveState(); }
  }
  async function deleteBanner() {
    const deletingDraft = selectedBanner()?.enabled === false;
    if (hasPendingChangesExcept(selectedBannerId)) {
      setBannerStatus('Guarda los cambios de los otros banners antes de descartar este borrador.');
      return;
    }
    confirmDeleteBanner.disabled = true;
    try {
      const response = await fetch('/api/admin/banners', { method: 'DELETE', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selectedBannerId }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo quitar el banner.');
      bannerItems = result.banners;
      bannerBaseline = new Map(bannerItems.map(item => [item.id, bannerSignature(item)]));
      bannerBaselineEnabled = new Map(bannerItems.map(item => [item.id, item.enabled]));
      bannerBaselineOrder = bannerItems.map(item => item.id);
      selectedBannerId = bannerItems.find(item => item.enabled)?.id || bannerItems[0]?.id || '';
      updateBannerSaveState();
      renderBannerList();
      fillBannerForm();
      setBannerStatus(deletingDraft ? 'Borrador descartado sin publicarlo.' : `Banner quitado del carrusel de ${contentEnvironmentLabel}.`);
      deleteBannerDialog.close();
    } catch (error) { setBannerStatus(error.message); showAdminAlert(`No se pudo eliminar el banner: ${error.message}`); }
    finally { confirmDeleteBanner.disabled = false; }
  }
  heroImageFile.addEventListener('change', async () => {
    const file = heroImageFile.files?.[0];
    if (!file) return;
    const submit = siteContentForm.querySelector('[type="submit"]');
    heroImageFile.disabled = true;
    submit.disabled = true;
    heroImageStatus.textContent = `Subiendo imagen a ${contentEnvironmentLabel}…`;
    const form = new FormData();
    form.append('image', file);
    try {
      const response = await fetch('/api/admin/site-content/image', { method: 'POST', credentials: 'same-origin', body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo subir la imagen.');
      siteContentForm.elements.hero_image_es.value = result.path;
      siteContentForm.elements.hero_image_en.value = result.path;
      heroImagePreview.src = result.path;
      heroImageStatus.textContent = 'Subida. Guarda para aplicar este cambio al sitio.';
      captureBannerForm();
    } catch (error) {
      heroImageStatus.textContent = error.message;
      showAdminAlert(`No se pudo subir la imagen: ${error.message}`);
    } finally {
      heroImageFile.disabled = false;
      updateBannerSaveState();
    }
  });
  siteContentForm.addEventListener('submit', async event => {
    event.preventDefault();
    await saveBanners();
  });
  document.addEventListener('keydown', event => {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 's' || currentView !== 'sitio' || !bannerDirty) return;
    event.preventDefault();
    void saveBanners();
  });
  window.addEventListener('beforeunload', event => {
    if (!bannerDirty) return;
    event.preventDefault();
    event.returnValue = '';
  });
  window.addEventListener('online', () => {
    for (const banner of bannerItems) {
      if (!banner.enabled && bannerBaselineEnabled.get(banner.id) === false && bannerBaseline.get(banner.id) !== bannerSignature(banner)) {
        scheduleDraftAutosave(banner.id, 0);
      }
    }
  });
  siteContentForm.addEventListener('input', event => {
    if (event.target !== heroImageFile && event.target !== siteContentForm.elements.hero_is_new) captureBannerForm();
  });
  siteContentForm.addEventListener('change', event => {
    if ([heroMediaType, heroEpisodeId, siteContentForm.elements.hero_media_style, siteContentForm.elements.hero_media_shadow].includes(event.target)) updateBannerMediaUI();
    if (event.target === siteContentForm.elements.hero_effect_es) siteContentForm.elements.hero_effect_en.value = event.target.value;
    if (event.target !== heroImageFile) captureBannerForm();
  });
  bannerPreview?.addEventListener('load', updateBannerPreview);
  createBannerButton.addEventListener('click', createBanner);
  duplicateBannerButton.addEventListener('click', duplicateBanner);
  deleteBannerButton.addEventListener('click', () => {
    if (hasPendingChangesExcept(selectedBannerId)) { const message = 'Guarda los cambios de los otros banners antes de quitar este banner.'; setBannerStatus(message); showAdminAlert(message); return; }
    const isNewDraft = selectedBanner()?.enabled === false;
    if (bannerDirty && !isNewDraft) { const message = 'Guarda los cambios pendientes antes de quitar un banner.'; setBannerStatus(message); showAdminAlert(message); return; }
    if (bannerItems.length <= 1) { const message = 'Debe quedar al menos un banner en la portada.'; setBannerStatus(message); showAdminAlert(message); return; }
    document.querySelector('#delete-banner-title').textContent = isNewDraft ? '¿Descartar este borrador?' : '¿Quitar este banner?';
    document.querySelector('#delete-banner-description').textContent = isNewDraft
      ? 'Este banner todavía no se ha publicado. Se descartará sin cambiar los banners guardados.'
      : `Dejará de aparecer en el carrusel de ${contentEnvironmentLabel}. La imagen subida se conserva en el almacén.`;
    document.querySelector('#confirm-delete-banner').textContent = isNewDraft ? 'Descartar borrador' : 'Quitar banner';
    deleteBannerDialog.showModal();
  });
  document.querySelector('#cancel-delete-banner').addEventListener('click', () => deleteBannerDialog.close());
  confirmDeleteBanner.addEventListener('click', deleteBanner);
  function showAdminView(id, { updateHistory = true, focusHeading = false } = {}) {
    const view = adminViews.find(item => item.id === id) || adminViews[0];
    if (!view || (currentView === view.id && !focusHeading)) return;
    currentView = view.id;
    for (const item of adminViews) item.hidden = item !== view;
    for (const link of document.querySelectorAll('.admin-sidebar nav a')) {
      const active = link.hash === `#${view.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
      if (active && link.closest('.admin-sidebar nav') && matchMedia('(max-width: 760px)').matches) {
        link.scrollIntoView({ block: 'nearest', inline: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      }
    }
    if (updateHistory && location.hash !== `#${view.id}`) history.pushState(null, '', `#${view.id}`);
    if (focusHeading) {
      const heading = view.querySelector('h1, h2');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    if (view.id === 'episodios' && episodeEditorFrame && !episodeEditorFrame.dataset.loaded) {
      episodeEditorFrame.dataset.loaded = 'true';
      episodeEditorStatus.textContent = 'Cargando el editor de episodios…';
      episodeEditorFrame.src = episodeEditorFrame.dataset.src;
    }
    if (view.id === 'sitio') loadBanners();
    if (view.id === 'buzon') loadInquiries();
    if (view.id === 'rendimiento') loadAnalytics();
  }
  for (const link of sectionLinks) link.addEventListener('click', event => {
    const id = link.hash.slice(1);
    if (!adminViews.some(view => view.id === id)) return;
    event.preventDefault();
    showAdminView(id, { focusHeading: true });
  });
  window.addEventListener('popstate', () => showAdminView(location.hash.slice(1), { updateHistory: false }));
  window.addEventListener('hashchange', () => showAdminView(location.hash.slice(1), { updateHistory: false }));
  refreshInbox.addEventListener('click', loadInquiries);
  refreshAnalytics.addEventListener('click', loadAnalytics);
  fetch('/api/auth/session', { credentials: 'same-origin', cache: 'no-store' })
    .then(response => response.json())
    .then(session => {
      if (!session.configured) throw new Error('No está configurado el acceso privado.');
      if (!session.user) { location.replace('/acceso.html?area=admin'); return; }
      document.body.classList.remove('admin-locked');
      privateContent.hidden = false;
      user.textContent = `Sesión: ${session.user.login}`;
      showAdminView(location.hash.slice(1) || 'resumen', { updateHistory: false });
    })
    .catch(() => { location.replace('/acceso.html?area=admin&reason=check'); });
  logout.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {});
    privateContent.hidden = true;
    document.body.classList.add('admin-locked');
    location.assign('/');
  });
  episodeEditorFrame?.addEventListener('load', () => {
    try {
      const editorDocument = episodeEditorFrame.contentDocument;
      const loaded = editorDocument?.querySelector('#project-home') && editorDocument?.querySelector('#editor-view');
      episodeEditorStatus.textContent = loaded
        ? 'Editor cargado. Sus borradores y sincronización con GitHub funcionan como en la sección independiente.'
        : 'El editor no mostró su interfaz. Ábrelo en otra pestaña para revisar el acceso o el estado de carga.';
    } catch {
      episodeEditorStatus.textContent = 'El editor requiere la sesión de GitHub. Ábrelo en otra pestaña si no aparece en este panel.';
    }
  });
  if (episodeEditorFrame) {
    window.setTimeout(() => {
      if (episodeEditorFrame.dataset.loaded === 'true' && episodeEditorStatus.textContent === 'Cargando el editor de episodios…') {
        episodeEditorStatus.textContent = 'El editor está tardando en responder. Puedes continuar desde el editor independiente mientras revisamos esta integración.';
      }
    }, 12000);
  }
})();
