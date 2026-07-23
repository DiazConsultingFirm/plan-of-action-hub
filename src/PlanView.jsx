import { useState } from 'react'
import { motion } from 'framer-motion'
import { daysUntil, countdownLabel } from './dates'
import { RhythmTab, FunnelTab, ContentTab, AuditTab, MilestonesTab, PitchTab } from './PlanTabs'

const TAB_LABELS = {
  full: 'Full Plan',
  rhythm: 'Rhythm',
  funnel: 'Funnel',
  content: 'Content',
  audit: 'Site Audit',
  milestones: '30/60/90',
  pitch: 'Pitch',
}

const TAB_COMPONENTS = {
  rhythm: RhythmTab,
  funnel: FunnelTab,
  content: ContentTab,
  audit: AuditTab,
  milestones: MilestonesTab,
  pitch: PitchTab,
}

/* The whole plan as one continuous document — the original static Plan of
   Action read this way, and the full scroll is what makes the depth visible.
   Sections stack in the plan's own tab order. */
function FullPlan({ data, sections }) {
  return (
    <>
      {sections.map((t) => {
        const Section = TAB_COMPONENTS[t]
        if (!Section) return null
        // Rhythm already shows the metric tiles; skip the duplicate row Funnel
        // would add right underneath it in the continuous view.
        const extra = t === 'funnel' ? { hideMetrics: true } : {}
        return <Section key={t} data={data} {...extra} />
      })}
    </>
  )
}

export default function PlanView({ data, roster, onHome, onSwitch }) {
  const sections = data.plan.tabs?.length ? data.plan.tabs : Object.keys(TAB_COMPONENTS)
  const tabs = ['full', ...sections]
  const [activeTab, setActiveTab] = useState('full')
  const days = daysUntil(data.plan.interviewDate)
  const { num, lbl } = countdownLabel(days)
  const ActiveTab = TAB_COMPONENTS[activeTab]

  return (
    <>
      <motion.header
        className="topbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="topbar-left">
          <div className="dcf-mark" style={{ background: data.plan.accent, color: '#060A12' }}>
            {data.plan.mark}
          </div>
          <div>
            <button type="button" className="hub-link-btn" onClick={onHome}>
              ← {roster.hub.title}
            </button>
            <h1 style={{ marginTop: 2 }}>{data.plan.title}</h1>
            <span className="topbar-sub">{data.plan.audience}</span>
          </div>
        </div>

        <div className="plan-switcher">
          {roster.plans.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`switch-pill ${p.id === data.plan.id ? 'active' : ''}`}
              onClick={() => onSwitch(p)}
            >
              {p.company}
            </button>
          ))}
        </div>

        <div className="topbar-right">
          <span className="health-indicator">
            <span className={`health-dot ${days < 0 ? 'dot-muted' : days <= 3 ? 'dot-yellow' : 'dot-green'}`} />
            <span className="health-label">{num} {lbl}</span>
          </span>
          <span className="status-badge badge-gold">{data.plan.statusLabel}</span>
          <span className="topbar-version">{data.plan.version}</span>
        </div>
      </motion.header>

      <nav className="tabbar">
        {tabs.map((t) => (
          <button
            key={t}
            className={`tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {TAB_LABELS[t] || t}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {/* No AnimatePresence here: its direct child is a plain component, so
            mode="wait" never sees the exit complete and the swap deadlocks. */}
        {activeTab === 'full' ? (
          <FullPlan key="full" data={data} sections={sections} />
        ) : (
          <ActiveTab key={activeTab} data={data} />
        )}
      </main>
    </>
  )
}
