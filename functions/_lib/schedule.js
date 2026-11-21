const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TIME_WITH_ZONE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/i;

export function scheduleInstant(value) {
  if (typeof value !== 'string') return NaN;
  if (DATE_ONLY.test(value)) {
    const midnight = new Date(`${value}T00:00:00.000Z`);
    if (!Number.isFinite(midnight.getTime()) || midnight.toISOString().slice(0, 10) !== value) return NaN;
    return Date.parse(`${value}T00:00:00-04:00`);
  }
  if (!DATE_TIME_WITH_ZONE.test(value)) return NaN;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : NaN;
}

export function validScheduleDate(value) {
  return Number.isFinite(scheduleInstant(value));
}

export function scheduleHasStarted(value, now = Date.now()) {
  const timestamp = scheduleInstant(value);
  return Number.isFinite(timestamp) && timestamp <= now;
}

export function scheduleIsAfter(later, earlier) {
  const laterTime = scheduleInstant(later);
  const earlierTime = scheduleInstant(earlier);
  return Number.isFinite(laterTime) && Number.isFinite(earlierTime) && laterTime > earlierTime;
}
