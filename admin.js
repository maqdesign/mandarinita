(() => {
  const user = document.querySelector('#admin-user');
  const logout = document.querySelector('#admin-logout');
  fetch('/api/auth/session', { credentials: 'same-origin', cache: 'no-store' })
    .then(response => response.json())
    .then(session => {
      if (!session.configured) throw new Error('No está configurado el acceso privado.');
      if (!session.user) { location.replace('/api/auth/github?area=admin'); return; }
      user.textContent = `Sesión: ${session.user.login}`;
    })
    .catch(() => { user.textContent = 'No se pudo verificar el acceso'; });
  logout.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST', headers: { 'Origin': location.origin }, credentials: 'same-origin' }).catch(() => {});
    location.assign('/');
  });
  document.querySelectorAll('.admin-sidebar nav a').forEach(link => link.addEventListener('click', () => {
    document.querySelectorAll('.admin-sidebar nav a').forEach(item => item.classList.toggle('active', item === link));
  }));
})();
