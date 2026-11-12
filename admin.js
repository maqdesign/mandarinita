(() => {
  const user = document.querySelector('#admin-user');
  const privateContent = document.querySelector('#admin-private-content');
  const logout = document.querySelector('#admin-logout');
  const inboxList = document.querySelector('#admin-inquiries-list');
  const inboxStatus = document.querySelector('#inquiry-load-status');
  const inboxCount = document.querySelector('#inquiry-count');
  const refreshInbox = document.querySelector('#refresh-inquiries');
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
  refreshInbox.addEventListener('click', loadInquiries);
  fetch('/api/auth/session', { credentials: 'same-origin', cache: 'no-store' })
    .then(response => response.json())
    .then(session => {
      if (!session.configured) throw new Error('No está configurado el acceso privado.');
      if (!session.user) { location.replace('/api/auth/github?area=admin'); return; }
      document.body.classList.remove('admin-locked');
      privateContent.hidden = false;
      user.textContent = `Sesión: ${session.user.login}`;
      loadInquiries();
    })
    .catch(() => { user.textContent = 'No se pudo verificar el acceso'; });
  logout.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {});
    privateContent.hidden = true;
    document.body.classList.add('admin-locked');
    location.assign('/');
  });
  document.querySelectorAll('.admin-sidebar nav a').forEach(link => link.addEventListener('click', () => {
    document.querySelectorAll('.admin-sidebar nav a').forEach(item => item.classList.toggle('active', item === link));
  }));
})();
