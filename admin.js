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
    ['hero.image.alt', 'hero_image_alt_es', 'hero_image_alt_en']
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
        card.innerHTML = `<div class="inquiry-card-top"><div><p class="admin-kicker">${escape(date)}</p><h3>${escape(item.name)}</h3><p class="inquiry-email">${escape(item.email)}</p></div><label class="inquiry-status-label">Estado<select aria-label="Estado de la consulta"><option value="new">Nueva</option><option value="reviewing">Revisando</option><option value="replied">Respondida</option><option value="archived">Archivada</option></select></label></div>${item.project ? `<p class="inquiry-project">${escape(item.project)}</p>` : ''}<p class="inquiry-message">${escape(item.message).replace(/\n/g, '<br>')}</p><a class="inquiry-reply" href="mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent('Sobre tu proyecto · Mandarinita')}">Responder <span aria-hidden="true">↗</span></a>`;
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
  async function loadSiteContent() {
    siteContentStatus.textContent = 'Cargando los textos guardados…';
    try {
      const response = await fetch('/api/admin/site-content', { credentials: 'same-origin', cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudieron cargar los textos.');
      for (const [key, esName, enName] of siteContentFields) {
        const value = result.content?.[key];
        if (value) {
          siteContentForm.elements[esName].value = value.es;
          siteContentForm.elements[enName].value = value.en;
        }
      }
      heroImagePreview.src = new URL(siteContentForm.elements.hero_image_es.value, location.href).href;
      siteContentForm.elements.hero_effect_en.value = siteContentForm.elements.hero_effect_es.value;
      heroImageStatus.textContent = 'Imagen actual';
      siteContentStatus.textContent = result.updatedAt ? `Última publicación: ${new Date(result.updatedAt).toLocaleString('es-DO', { dateStyle: 'medium', timeStyle: 'short' })}.` : 'Aún no hay cambios guardados. Se muestran los textos originales.';
    } catch (error) { siteContentStatus.textContent = error.message; }
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
    siteContentStatus.textContent = 'Guardando y publicando en Preview…';
    const content = Object.fromEntries(siteContentFields.map(([key, esName, enName]) => [key, {
      es: siteContentForm.elements[esName].value.trim(),
      en: siteContentForm.elements[enName].value.trim()
    }]));
    content['hero.effect'].en = content['hero.effect'].es;
    try {
      const response = await fetch('/api/admin/site-content', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudieron publicar los textos.');
      siteContentStatus.textContent = 'Listo: los textos ya están publicados en Preview. Recarga la portada para verlos.';
    } catch (error) { siteContentStatus.textContent = error.message; }
    finally { submit.disabled = false; }
  });
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
    }
    if (updateHistory && location.hash !== `#${view.id}`) history.pushState(null, '', `#${view.id}`);
    if (focusHeading) {
      const heading = view.querySelector('h1, h2');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    if (view.id === 'sitio') loadSiteContent();
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
