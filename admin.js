(() => {
  const user = document.querySelector('#admin-user');
  const privateContent = document.querySelector('#admin-private-content');
  const logout = document.querySelector('#admin-logout');
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
  const heroImageFile = document.querySelector('#hero-image-file');
  const heroImagePreview = document.querySelector('#hero-image-preview');
  const heroImageStatus = document.querySelector('#hero-image-status');
  const heroMediaType = document.querySelector('#hero-media-type');
  const heroEpisodeSelect = document.querySelector('#hero-episode-id');
  const heroEpisodeWrap = document.querySelector('#hero-episode-select-wrap');
  const heroEffectLabel = document.querySelector('#hero-effect-label');
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
  let bannerItems = [];
  let bannerBaseline = new Map();
  let selectedBannerId = '';
  let bannersLoaded = false;
  let bannerDirty = false;
  let heroPreviewToastTimer = 0;
  let previewEditField = null;
  let heroPreviewLayout = 'horizontal';
  let approvedEpisodes = [];
  let episodeCatalogLoaded = false;
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
    ['hero.startAt', 'hero_start_at', 'hero_start_at'],
    ['hero.endAt', 'hero_end_at', 'hero_end_at']
  ];
  const adminViews = [...document.querySelectorAll('[data-admin-view]')];
  const sectionLinks = [...document.querySelectorAll('.admin-sidebar nav a, .admin-quick-link')];
  let currentView = '';
  const escape = value => String(value || '').replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character]);
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
            inboxStatus.textContent = error.message;
            select.value = item.status;
          } finally { select.disabled = false; }
        });
        inboxList.append(card);
      }
    } catch (error) {
      inboxStatus.textContent = error.message;
      inboxCount.textContent = 'Sin conexión';
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
      analyticsVisits.textContent = '—';
      analyticsRequests.textContent = '—';
      analyticsDays.replaceChildren();
    } finally { refreshAnalytics.disabled = false; }
  }
  const setBannerStatus = message => { if (bannerManagerStatus) bannerManagerStatus.textContent = message; };
  const setSiteContentStatus = message => { if (siteContentStatus) siteContentStatus.textContent = message; };
  const selectedBanner = () => bannerItems.find(item => item.id === selectedBannerId);
  const bannerSignature = banner => JSON.stringify({ position: banner.position, enabled: banner.enabled, ctaHref: banner.ctaHref, fields: banner.fields });
  function hasPendingChangesExcept(id) {
    return bannerItems.some(item => item.id !== id && bannerBaseline.get(item.id) !== bannerSignature(item));
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
      const response = await fetch('/episodes.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('No se pudo cargar el catálogo de episodios.');
      const catalog = await response.json();
      approvedEpisodes = (catalog.episodes || []).filter(entry => entry.status === 'published'
        && entry.type === 'comic' && entry.complete === true && Number.isInteger(entry.episodeNumber)
        && typeof entry.id === 'string' && /^[a-z0-9-]{1,100}$/i.test(entry.id)
        && entry.panels?.[0] && (entry.panels[0].watermarkedSrc || entry.panels[0].src)?.startsWith('assets/'));
      heroEpisodeSelect.replaceChildren(new Option('Selecciona un episodio', ''));
      for (const entry of approvedEpisodes) {
        const title = typeof entry.title === 'string' ? entry.title : entry.title?.es || `Episodio ${entry.episodeNumber}`;
        heroEpisodeSelect.add(new Option(`Ep. ${entry.episodeNumber} · ${title}`, entry.id));
      }
      if (!approvedEpisodes.length) heroEpisodeSelect.replaceChildren(new Option('No hay episodios publicados disponibles', ''));
    } catch (error) {
      heroEpisodeSelect.replaceChildren(new Option('No se pudo cargar el catálogo', ''));
      setBannerStatus(error.message);
    }
  }
  function updateBannerMediaUI() {
    const isEpisode = heroMediaType.value === 'episode';
    heroEpisodeWrap.hidden = !isEpisode;
    heroEpisodeSelect.disabled = !isEpisode;
    heroEpisodeSelect.required = isEpisode;
    siteContentForm.querySelector('.site-content-upload-label').hidden = isEpisode;
    heroImageFile.disabled = isEpisode;
    heroEffectLabel.hidden = isEpisode;
    siteContentForm.elements.hero_effect_es.disabled = isEpisode;
    if (!isEpisode) return;
    siteContentForm.elements.hero_effect_es.value = 'still';
    siteContentForm.elements.hero_effect_en.value = 'still';
    const episode = approvedEpisodes.find(item => item.id === heroEpisodeSelect.value);
    if (!episode) {
      heroImageStatus.textContent = 'Selecciona un episodio publicado para usar su primera viñeta.';
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
  function captureBannerForm() {
    const banner = selectedBanner();
    if (!banner) return;
    let changed = false;
    for (const [key, esName, enName] of siteContentFields) {
      const inputValue = inputName => {
        const value = siteContentForm.elements[inputName].value;
        return inputName === 'hero_start_at' || inputName === 'hero_end_at' ? fromLocalDateTime(value) : value;
      };
      const es = inputValue(esName);
      const en = key === 'hero.effect' || esName === enName ? es : inputValue(enName);
      if (banner.fields[key].es !== es || banner.fields[key].en !== en) changed = true;
      banner.fields[key] = {
        es,
        en
      };
    }
    banner.fields['hero.effect'].en = banner.fields['hero.effect'].es;
    if (changed) {
      bannerDirty = true;
      updateDeleteBannerState();
      setBannerStatus('Hay cambios pendientes. Guárdalos para publicarlos en Preview.');
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
      siteContentForm.elements[esName].value = es;
      siteContentForm.elements[enName].value = en;
    }
    siteContentForm.elements.banner_id.value = banner.id;
    siteContentForm.elements.hero_effect_en.value = banner.fields['hero.effect'].es;
    heroImagePreview.src = new URL(banner.fields['hero.image'].es, location.href).href;
    heroImageStatus.textContent = 'Imagen de este banner';
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
    const control = siteContentForm.elements[language === 'en' ? englishName : spanishName];
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
        ? featuredEpisode ? `Episodio destacado · Ep. ${featuredEpisode.episodeNumber}` : 'Episodio destacado'
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
          return;
        }
        banner.enabled = enabled.checked;
        bannerDirty = true;
        updateBannerPreview();
        updateDeleteBannerState();
        setBannerStatus('Hay cambios pendientes. Guárdalos para publicarlos en Preview.');
      });
      const startsAt = Date.parse(banner.fields['hero.startAt']?.es || '');
      const endsAt = Date.parse(banner.fields['hero.endAt']?.es || '');
      const availability = !banner.enabled ? 'Inactivo'
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
          bannerDirty = true;
          updateDeleteBannerState();
          updateBannerPreview();
          setBannerStatus('Orden pendiente. Guarda los cambios para publicarlos en Preview.');
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
      selectedBannerId = bannerItems.find(item => item.enabled)?.id || bannerItems[0]?.id || '';
      bannersLoaded = true;
      bannerDirty = false;
      renderBannerList();
      fillBannerForm();
      setBannerStatus(bannerItems.length ? `${bannerItems.length} ${bannerItems.length === 1 ? 'banner' : 'banners'} en la portada.` : 'Aún no hay banners.');
      setSiteContentStatus('Edita este banner; los cambios se guardan directamente en Preview.');
    } catch (error) { setBannerStatus(error.message); }
  }
  async function createBanner() {
    createBannerButton.disabled = true;
    try {
      const response = await fetch('/api/admin/banners', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo crear el banner.');
      bannerItems.push(result.banner);
      selectedBannerId = result.banner.id;
      bannerDirty = true;
      renderBannerList();
      fillBannerForm();
      setBannerStatus('Banner nuevo, todavía en borrador. Cámbialo y guarda para publicarlo.');
      siteContentForm.elements.hero_title_first_es.focus();
    } catch (error) { setBannerStatus(error.message); }
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
      bannerDirty = true;
      renderBannerList();
      fillBannerForm();
      setBannerStatus('Copia creada como borrador inactivo. Ajusta el contenido y guarda para publicarla en Preview.');
      setSiteContentStatus('Edita la copia. Se mantiene inactiva hasta que la actives y guardes los cambios.');
      siteContentForm.elements.hero_title_first_es.focus();
    } catch (error) {
      setSiteContentStatus(error.message);
      setBannerStatus(error.message);
    } finally {
      duplicateBannerButton.disabled = bannerItems.length >= 8;
    }
  }
  async function saveBanners() {
    captureBannerForm();
    const submit = siteContentForm.querySelector('[type="submit"]');
    submit.disabled = true;
    setSiteContentStatus('Guardando banners en Preview…');
    try {
      const response = await fetch('/api/admin/banners', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ banners: bannerItems }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudieron publicar los banners.');
      bannerItems = result.banners;
      bannerDirty = false;
      bannerBaseline = new Map(bannerItems.map(item => [item.id, bannerSignature(item)]));
      renderBannerList();
      fillBannerForm();
      setBannerStatus('Cambios publicados en Preview.');
      setSiteContentStatus('Listo: los banners ya aparecen en Preview. Recarga la portada para verlos.');
    } catch (error) {
      setSiteContentStatus(error.message);
      setBannerStatus(error.message);
    } finally { submit.disabled = false; updateDeleteBannerState(); }
  }
  async function deleteBanner() {
    const deletingDraft = !bannerBaseline.has(selectedBannerId);
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
      selectedBannerId = bannerItems.find(item => item.enabled)?.id || bannerItems[0]?.id || '';
      bannerDirty = false;
      renderBannerList();
      fillBannerForm();
      setBannerStatus(deletingDraft ? 'Borrador descartado sin publicarlo.' : 'Banner quitado del carrusel de Preview.');
      deleteBannerDialog.close();
    } catch (error) { setBannerStatus(error.message); }
    finally { confirmDeleteBanner.disabled = false; }
  }
  heroImageFile.addEventListener('change', async () => {
    const file = heroImageFile.files?.[0];
    if (!file) return;
    const submit = siteContentForm.querySelector('[type="submit"]');
    heroImageFile.disabled = true;
    submit.disabled = true;
    heroImageStatus.textContent = 'Subiendo imagen a Preview…';
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
    } finally {
      heroImageFile.disabled = false;
      submit.disabled = false;
    }
  });
  siteContentForm.addEventListener('submit', async event => {
    event.preventDefault();
    const submit = siteContentForm.querySelector('[type="submit"]');
    submit.disabled = true;
    await saveBanners();
  });
  siteContentForm.addEventListener('input', event => { if (event.target !== heroImageFile) captureBannerForm(); });
  siteContentForm.addEventListener('change', event => {
    if (event.target === heroMediaType || event.target === heroEpisodeSelect) updateBannerMediaUI();
    if (event.target === siteContentForm.elements.hero_effect_es) siteContentForm.elements.hero_effect_en.value = event.target.value;
    if (event.target !== heroImageFile) captureBannerForm();
  });
  bannerPreview?.addEventListener('load', updateBannerPreview);
  createBannerButton.addEventListener('click', createBanner);
  duplicateBannerButton.addEventListener('click', duplicateBanner);
  deleteBannerButton.addEventListener('click', () => {
    if (hasPendingChangesExcept(selectedBannerId)) { setBannerStatus('Guarda los cambios de los otros banners antes de quitar este banner.'); return; }
    const isNewDraft = !bannerBaseline.has(selectedBannerId);
    if (bannerDirty && !isNewDraft) { setBannerStatus('Guarda los cambios pendientes antes de quitar un banner.'); return; }
    if (bannerItems.length <= 1) { setBannerStatus('Debe quedar al menos un banner en la portada.'); return; }
    document.querySelector('#delete-banner-title').textContent = isNewDraft ? '¿Descartar este borrador?' : '¿Quitar este banner?';
    document.querySelector('#delete-banner-description').textContent = isNewDraft
      ? 'Este banner todavía no se ha publicado. Se descartará sin cambiar los banners guardados.'
      : 'Dejará de aparecer en el carrusel de Preview. La imagen subida se conserva en el almacén.';
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
      if (!session.user) { location.replace('/api/auth/github?area=admin'); return; }
      document.body.classList.remove('admin-locked');
      privateContent.hidden = false;
      user.textContent = `Sesión: ${session.user.login}`;
      showAdminView(location.hash.slice(1) || 'resumen', { updateHistory: false });
    })
    .catch(() => { user.textContent = 'No se pudo verificar el acceso'; });
  logout.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {});
    privateContent.hidden = true;
    document.body.classList.add('admin-locked');
    location.assign('/');
  });
})();
