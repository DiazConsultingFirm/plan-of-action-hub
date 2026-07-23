/**
 * Interview-date helpers. All dates are plain ISO calendar days ("2026-07-23")
 * and are compared in local time, so "days away" matches what Evans sees on a
 * wall calendar rather than a UTC-shifted value.
 */

const MS_PER_DAY = 86_400_000

function toLocalMidnight(isoDay) {
  const [y, m, d] = isoDay.split('-').map(Number)
  return new Date(y, m - 1, d).getTime()
}

/** Whole days from today to `isoDay`. Negative once the date has passed. */
export function daysUntil(isoDay, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return Math.round((toLocalMidnight(isoDay) - today) / MS_PER_DAY)
}

/** Short human label for a countdown: "Today", "Tomorrow", "3 days", "Passed". */
export function countdownLabel(days) {
  if (days < 0) return { num: 'Past', lbl: 'interview held' }
  if (days === 0) return { num: 'Today', lbl: 'interview day' }
  if (days === 1) return { num: '1', lbl: 'day away' }
  return { num: String(days), lbl: 'days away' }
}

/**
 * Sort plans soonest-first. Interview-kind plans (a real date on the calendar)
 * always sort ahead of consulting-kind plans (an open pursuit, no fixed date —
 * see PlanView's isConsulting), since those have no "days away" urgency to
 * rank by. Among interview plans: soonest first, already-held pushed to the
 * end. Among consulting plans: most recently touched first.
 */
export function byInterviewDate(a, b) {
  const aConsulting = a.kind === 'consulting'
  const bConsulting = b.kind === 'consulting'
  if (aConsulting !== bConsulting) return aConsulting ? 1 : -1
  if (aConsulting && bConsulting) {
    return (b.pitchDate || '').localeCompare(a.pitchDate || '')
  }
  const da = daysUntil(a.interviewDate)
  const db = daysUntil(b.interviewDate)
  const rank = (d) => (d < 0 ? 1 : 0)
  if (rank(da) !== rank(db)) return rank(da) - rank(db)
  return da - db
}
