(() => {
  const user = document.querySelector('#admin-user');
  const logout = document.querySelector('#admin-logout');
  const number = new Intl.NumberFormat('es-DO');

  async function initializeSession() {
    try {
      const response = await fetch('/api/auth/session', { credentials: 'same-origin', cache: 'no-store' });
      const session = await response.json();
      if (!response.ok || !session.configured) throw new Error('No se pudo verificar la sesión.');
      if (!session.user) { location.replace('/acceso.html?area=admin'); return false; }
      user.textContent = `Sesión: ${session.user.login}`;
      return true;
    } catch {
      location.replace('/acceso.html?area=admin&reason=check');
      return false;
    }
  }

  logout.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {});
    location.assign('/');
  });

  function message(text, isError = false) {
    const status = document.querySelector('#inquiry-load-status, #analytics-status');
    if (!status) return;
    status.textContent = text;
    status.classList.toggle('admin-data-error', isError);
  }

  function renderInquiry(item) {
    const card = document.createElement('article');
    card.className = `inquiry-card inquiry-${item.status}`;
    const top = document.createElement('div');
    top.className = 'inquiry-card-top';
    const contact = document.createElement('div');
    const date = document.createElement('p');
    date.className = 'admin-kicker';
    const createdAt = new Date(item.created_at);
    date.textContent = Number.isNaN(createdAt.getTime()) ? 'Fecha no disponible' : createdAt.toLocaleString('es-DO', { dateStyle: 'medium', timeStyle: 'short' });
    const name = document.createElement('h3');
    name.textContent = item.name || 'Sin nombre';
    const email = document.createElement('p');
    email.className = 'inquiry-email';
    email.textContent = item.email || '';
    contact.append(date, name, email);
    const statusLabel = document.createElement('label');
    statusLabel.className = 'inquiry-status-label';
    statusLabel.append(document.createTextNode('Estado'));
    const select = document.createElement('select');
    select.setAttribute('aria-label', `Estado de la consulta de ${item.name || 'cliente'}`);
    for (const [value, label] of [['new', 'Nueva'], ['reviewing', 'Revisando'], ['replied', 'Respondida'], ['archived', 'Archivada']]) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      select.append(option);
    }
    select.value = item.status;
    select.addEventListener('change', async () => {
      const previous = item.status;
      select.disabled = true;
      try {
        const response = await fetch('/api/admin/inquiries', {
          method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, status: select.value })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || `No se guardó el cambio (${response.status}).`);
        item.status = select.value;
        card.className = `inquiry-card inquiry-${item.status}`;
        message('Estado actualizado.');
      } catch (error) {
        select.value = previous;
        message(error.message, true);
      } finally { select.disabled = false; }
    });
    statusLabel.append(select);
    top.append(contact, statusLabel);
    card.append(top);
    if (item.project) {
      const project = document.createElement('p');
      project.className = 'inquiry-project';
      project.textContent = item.project;
      card.append(project);
    }
    const body = document.createElement('p');
    body.className = 'inquiry-message';
    body.textContent = item.message || '';
    card.append(body);
    const reply = document.createElement('a');
    reply.className = 'inquiry-reply';
    reply.href = `mailto:${encodeURIComponent(item.email || '')}?subject=${encodeURIComponent('Sobre tu proyecto · Mandarinita')}`;
    reply.textContent = 'Responder';
    card.append(reply);
    return card;
  }

  async function loadInbox() {
    const list = document.querySelector('#admin-inquiries-list');
    const count = document.querySelector('#inquiry-count');
    const button = document.querySelector('#refresh-inquiries');
    if (!list || !count || !button) return;
    button.disabled = true;
    message('Consultando el buzón…');
    try {
      const response = await fetch('/api/admin/inquiries?limit=50', { credentials: 'same-origin', cache: 'no-store' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `El buzón respondió con un error (${response.status}).`);
      if (!Array.isArray(result.inquiries)) throw new Error('El buzón respondió con un formato inesperado.');
      list.replaceChildren(...result.inquiries.map(renderInquiry));
      const newCount = result.inquiries.filter(item => item.status === 'new').length;
      count.textContent = newCount ? `${newCount} nuevas` : 'Al día';
      message(result.inquiries.length ? `${result.inquiries.length} consultas cargadas.` : 'Todavía no han llegado consultas.');
    } catch (error) {
      count.textContent = 'No disponible';
      message(error.message || 'No se pudo cargar el buzón. Actualiza para volver a intentarlo.', true);
    } finally { button.disabled = false; }
  }

  async function loadAnalytics() {
    const button = document.querySelector('#refresh-analytics');
    const visits = document.querySelector('#analytics-visits');
    const inquiries = document.querySelector('#analytics-requests');
    const chart = document.querySelector('#analytics-days');
    if (!button || !visits || !inquiries || !chart) return;
    button.disabled = true;
    message('Consultando las métricas…');
    try {
      const response = await fetch('/api/admin/analytics', { credentials: 'same-origin', cache: 'no-store' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || `Las métricas respondieron con un error (${response.status}).`);
      if (!Array.isArray(result.days)) throw new Error('Las métricas respondieron con un formato inesperado.');
      visits.textContent = number.format(result.visits || 0);
      inquiries.textContent = number.format(result.inquiries || 0);
      const max = Math.max(1, ...result.days.map(day => Number(day.visits) || 0));
      chart.replaceChildren();
      for (const day of result.days) {
        const date = new Date(`${day.date}T12:00:00Z`);
        const item = document.createElement('div');
        item.className = 'analytics-day';
        item.setAttribute('aria-label', `${date.toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'short' })}: ${day.visits} páginas vistas`);
        const track = document.createElement('span');
        track.className = 'analytics-day-track';
        const bar = document.createElement('span');
        bar.className = 'analytics-day-bar';
        bar.style.height = `${Math.max(4, Math.round((Number(day.visits) / max) * 100))}%`;
        bar.title = `${number.format(day.visits)} páginas vistas`;
        track.append(bar);
        const label = document.createElement('span');
        label.textContent = date.toLocaleDateString('es-DO', { weekday: 'short' }).replace('.', '');
        const value = document.createElement('strong');
        value.textContent = number.format(day.visits || 0);
        item.append(track, label, value);
        chart.append(item);
      }
      message(`Datos desde el ${new Date(`${result.period.start}T12:00:00Z`).toLocaleDateString('es-DO')}.`);
    } catch (error) {
      visits.textContent = '—';
      inquiries.textContent = '—';
      chart.replaceChildren();
      message(error.message || 'No se pudieron cargar las métricas. Actualiza para volver a intentarlo.', true);
    } finally { button.disabled = false; }
  }

  initializeSession().then(ok => {
    if (!ok) return;
    if (document.querySelector('#admin-inquiries-list')) loadInbox();
    if (document.querySelector('#analytics-days')) loadAnalytics();
  });
  document.querySelector('#refresh-inquiries')?.addEventListener('click', loadInbox);
  document.querySelector('#refresh-analytics')?.addEventListener('click', loadAnalytics);
})();
