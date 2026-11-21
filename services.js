(() => {
  const form = document.querySelector('#project-inquiry-form');
  const status = document.querySelector('#inquiry-status');
  if (!form || !status) return;
  const startedAt = form.elements.startedAt;
  startedAt.value = String(Date.now());
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const submit = form.querySelector('[type="submit"]');
    const english = document.documentElement.dataset.lang === 'en';
    submit.disabled = true;
    status.textContent = english ? 'Sending your note…' : 'Enviando tu mensaje…';
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || (english ? 'We could not send the message.' : 'No pudimos enviar el mensaje.'));
      status.textContent = english ? 'Thanks. Your note is in the private inbox.' : 'Gracias. Tu mensaje llegó al buzón privado.';
      form.reset();
      startedAt.value = String(Date.now());
    } catch (error) {
      status.textContent = error.message || (english ? 'We could not send the message. Try again.' : 'No pudimos enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      submit.disabled = false;
    }
  });
})();
