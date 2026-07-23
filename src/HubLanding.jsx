import { motion } from 'framer-motion'
import { daysUntil, countdownLabel, byInterviewDate } from './dates'

export default function HubLanding({ roster, onOpen }) {
  const plans = [...roster.plans].sort(byInterviewDate)
  const next = plans.find((p) => p.kind !== 'consulting' && p.kind !== 'client')

  return (
    <motion.div
      className="main-content"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <div className="hub-hero">
        <div className="hub-eyebrow">{roster.hub.brand}</div>
        <h1 className="hub-title">{roster.hub.title}</h1>
        <p className="hub-sub">{roster.hub.subtitle}</p>
        <div className="hub-meta-row">
          <span>
            <span className="health-dot dot-green" style={{ marginRight: 6 }} />
            {plans.length} live {plans.length === 1 ? 'plan' : 'plans'}
          </span>
          {next && <span>Next up · {next.company} · {countdownLabel(daysUntil(next.interviewDate)).num} {countdownLabel(daysUntil(next.interviewDate)).lbl}</span>}
          <span>Updated {roster.hub.updated}</span>
        </div>
      </div>

      <div className="hub-grid">
        {plans.map((p, i) => (
          <PlanCard key={p.id} plan={p} index={i} onOpen={() => onOpen(p)} />
        ))}
      </div>
    </motion.div>
  )
}

// Stop the click from also bubbling up to the card's own onOpen — otherwise
// launching the site/dashboard link-button also fires the card's main action.
function stopAnd(fn) {
  return (e) => {
    e.stopPropagation()
    fn?.(e)
  }
}

function PlanCard({ plan, index, onOpen }) {
  const isConsulting = plan.kind === 'consulting'
  const isClient = plan.kind === 'client'
  const isBadgeless = isConsulting || isClient
  const days = isBadgeless ? null : daysUntil(plan.interviewDate)
  const { num, lbl } = isBadgeless ? {} : countdownLabel(days)
  const urgency = isBadgeless ? '' : days < 0 ? 'past' : days <= 3 ? 'imminent' : ''

  return (
    <motion.div
      className="plan-card"
      style={{ '--plan-accent': plan.accent }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen()}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -3 }}
    >
      <div className="plan-card-head">
        <div className="plan-mark">{plan.mark}</div>
        <div>
          <div className="plan-card-company">{plan.company}</div>
          <div className="plan-card-role">{plan.role}</div>
        </div>
        {isClient ? (
          <div className="plan-countdown">
            <div className="plan-countdown-num" style={{ fontSize: 15, color: 'var(--gold)' }}>
              ● Live
            </div>
            <div className="plan-countdown-lbl">active client</div>
          </div>
        ) : isConsulting ? (
          <div className="plan-countdown">
            <div className="plan-countdown-num" style={{ fontSize: 15, color: 'var(--gold)' }}>
              ● Open
            </div>
            <div className="plan-countdown-lbl">active pursuit</div>
          </div>
        ) : (
          <div className={`plan-countdown ${urgency}`}>
            <div className="plan-countdown-num">{num}</div>
            <div className="plan-countdown-lbl">{lbl}</div>
          </div>
        )}
      </div>

      <div className="plan-when">{isBadgeless ? plan.pitchDateLabel : plan.interviewLabel}</div>
      <div className="plan-who">{plan.who}</div>
      <div className="plan-thesis">{plan.thesis}</div>
      {plan.comp && <div className="plan-who"><strong style={{ color: 'var(--text)' }}>Comp:</strong> {plan.comp}</div>}

      <div className="plan-headline">
        {plan.headline.map((h, j) => (
          <div key={j} className="plan-headline-item">
            <div className="v">{h.val}</div>
            <div className="l">{h.lbl}</div>
          </div>
        ))}
      </div>

      <div className="plan-card-foot">
        <span className="plan-stage-chip">{plan.stage}</span>
        <div className="plan-card-links">
          {plan.site && (
            <a
              className="plan-link-btn"
              href={plan.site}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stopAnd()}
            >
              Site ↗
            </a>
          )}
          {plan.dashboard && (
            <a
              className="plan-link-btn"
              href={plan.dashboard}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stopAnd()}
            >
              Dashboard ↗
            </a>
          )}
          {!plan.site && !plan.dashboard && (
            <span className="plan-card-open-hint">
              {isClient ? 'Open dashboard →' : 'Open plan of action →'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
