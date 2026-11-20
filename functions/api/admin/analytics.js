import { isAuthConfigured, json, readSession } from '../../_lib/session.js';

export async function onRequestGet({ request, env }) {
  if (!isAuthConfigured(env)) return json({ error: 'La administración privada no está configurada.' }, 503);
  const session = await readSession(request, env.SESSION_SECRET);
  if (!session || session.email !== env.MANDARINITA_SYNC_EMAIL.trim().toLowerCase()) {
    return json({ error: 'Inicia sesión con tu cuenta autorizada de GitHub.' }, 401);
  }
  if (!env.MANDARINITA_INBOX) return json({ error: 'Las estadísticas no tienen una base de datos conectada en este entorno.' }, 503);

  const end = new Date();
  const endDay = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
  const start = new Date(endDay.getTime() - 6 * 86400000);
  const nextDay = new Date(endDay.getTime() + 86400000);
  const startDate = start.toISOString().slice(0, 10);
  const endDate = endDay.toISOString().slice(0, 10);
  let pageViews;
  let inquiryCount;
  try {
    [pageViews, inquiryCount] = await Promise.all([
      env.MANDARINITA_INBOX.prepare(
        'SELECT day, SUM(views) AS views FROM public_page_views_daily WHERE day >= ? AND day <= ? GROUP BY day'
      ).bind(startDate, endDate).all(),
      env.MANDARINITA_INBOX.prepare(
        'SELECT COUNT(*) AS count FROM inquiries WHERE created_at >= ? AND created_at < ?'
      ).bind(start.toISOString(), nextDay.toISOString()).first()
    ]);
  } catch (error) {
    console.error('Admin analytics query failed', { name: error?.name || 'Error' });
    return json({ error: 'No se pudieron leer las estadísticas. Actualiza la sección para volver a intentarlo.' }, 503);
  }
  const byDate = new Map((pageViews.results || []).map(row => [row.day, Number(row.views) || 0]));
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start.getTime() + index * 86400000).toISOString().slice(0, 10);
    return { date: day, visits: byDate.get(day) || 0 };
  });
  return json({
    period: { start: days[0].date, end: days.at(-1).date },
    visits: days.reduce((total, day) => total + day.visits, 0),
    inquiries: Number(inquiryCount?.count) || 0,
    days
  });
}
