import { motion } from 'framer-motion'

/* ── shared shells ── */

function Tab({ children }) {
  return (
    <motion.div
      className="tab-content"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      {children}
    </motion.div>
  )
}

function GlassCard({ children, className = '', style }) {
  return (
    <motion.div
      className={`glass-card ${className}`}
      style={style}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ borderColor: 'rgba(232,168,56,0.3)' }}
    >
      {children}
    </motion.div>
  )
}

function SectionHead({ badge, title, credit, badgeStyle }) {
  return (
    <div className="plan-section-head">
      <span
        className="plan-section-num"
        style={badgeStyle || { background: 'linear-gradient(135deg,#E8A838,#D4922A)', color: '#060A12' }}
      >
        {badge}
      </span>
      <div>
        <h2 className="plan-section-title">{title}</h2>
        {credit && <span className="plan-section-credit">{credit}</span>}
      </div>
    </div>
  )
}

function DataNote({ note }) {
  if (!note) return null
  return (
    <div className="data-note">
      <span className="data-note-tag">How to read this</span>
      <span>{note}</span>
    </div>
  )
}

function MetricRow({ metrics }) {
  return (
    <div className="metric-grid" style={{ marginTop: 16 }}>
      {metrics.map((m, i) => (
        <GlassCard key={i}>
          <div className="metric">
            <div className="metric-val">{m.val}</div>
            <div className="metric-lbl">{m.lbl}</div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}

/* ── RHYTHM — the 5 F's ── */

export function RhythmTab({ data }) {
  return (
    <Tab>
      <GlassCard>
        <SectionHead
          badge="5F"
          title="The 5 F's — Weekly Operating Rhythm"
          credit="Todd Caponi · The Transparent Sales Leader"
        />

        <div className="fives-grid">
          {data.fiveFs.map((f, i) => (
            <motion.div
              key={f.name}
              className={`f-card f-${f.color}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
            >
              <div className="f-letter">{f.letter}</div>
              <div className="f-name">{f.name}</div>
              <div className="f-desc">
                <strong>{f.desc.split('?')[0]}?</strong>
                {f.desc.split('?').slice(1).join('?')}
              </div>
              <div className="f-action">
                <strong>{data.plan.company} setup:</strong>{' '}
                {f.action.replace(
                  new RegExp(`^${data.plan.company} (ICP|setup|fundamentals|KPIs|culture):\\s*`, 'i'),
                  '',
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="story-block">
          <span className="story-gold">How I use this:</span> {data.rhythmStory}
        </div>
      </GlassCard>

      <MetricRow metrics={data.metrics} />
    </Tab>
  )
}

/* ── FUNNEL ── */

export function FunnelTab({ data, hideMetrics = false }) {
  return (
    <Tab>
      <GlassCard>
        <SectionHead badge="▽" title="Funnel Architecture — How Pipeline Gets Built" />

        <DataNote note={data.plan.dataNote} />

        <div className="story-block">
          <span className="story-gold">The shape of this funnel:</span> {data.funnelStory}
        </div>

        <div className="funnel-wrap">
          {data.funnelStages.map((s, i) => (
            <div key={i}>
              <div className="funnel-stage">
                <div className={`funnel-bar funnel-${s.color}`} style={{ width: `${s.width}%` }}>
                  {s.bar}
                </div>
                <div className="funnel-num">{s.num}</div>
                <div className="funnel-math">{s.math}</div>
              </div>

              {i === 0 && (
                <div className="grid-2 funnel-sources">
                  {data.funnelSources.map((src, j) => (
                    <div key={j} className="funnel-gate">
                      <div className="gate-label">← {src.label}</div>
                      <div className="gate-desc">{src.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              {s.gate && i === 1 && (
                <div className="funnel-gate">
                  <div className="gate-label">{data.qualificationGate.label}</div>
                  <div className="gate-desc">
                    {data.qualificationGate.items.map((q, k) => (
                      <div key={k}>
                        <strong>{q.letter}</strong>
                        {q.text}
                      </div>
                    ))}
                    <div className="gate-hard-rule">{data.qualificationGate.hardRule}</div>
                  </div>
                </div>
              )}

              {s.gate && i === 3 && (
                <div className="funnel-gate">
                  <div className="gate-label">{data.aeAcceptance.label}</div>
                  <div className="gate-desc">
                    {data.aeAcceptance.items.map((a, k) => (
                      <div key={k}>
                        <strong>{a.range}:</strong> {a.text}
                      </div>
                    ))}
                    <div className="gate-hard-rule">{data.aeAcceptance.target}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!hideMetrics && <MetricRow metrics={data.metrics} />}
      </GlassCard>
    </Tab>
  )
}

/* ── CONTENT ── */

export function ContentTab({ data }) {
  return (
    <Tab>
      <GlassCard>
        <SectionHead
          badge="CQ"
          title="Content That Qualifies — Not Just Content That Fills a Sequence"
          badgeStyle={{ background: 'var(--green)', color: '#060A12' }}
        />

        <div className="content-why">
          <span className="story-gold">Most sequences are noise.</span>{' '}
          <span className="content-why-body">{data.contentWhy}</span>
        </div>

        <div className="grid-2 content-grid">
          {data.contentWedges.map((w, i) => (
            <motion.div
              key={i}
              className={`content-card content-${w.color}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2 }}
            >
              <div className="content-head">
                <span className="content-icon" style={{ background: `var(--${w.color})` }} />
                {w.head}
              </div>
              <div className="content-body">
                {w.subject && (
                  <p className="content-row">
                    <span className="content-label">Subject:</span> {w.subject}
                  </p>
                )}
                <p className="content-row">
                  <span className="content-label">Observation:</span> {w.observation}
                </p>
                <p className="content-row">
                  <span className="content-label">Value link:</span> {w.valueLink}
                </p>
                <p className="content-row">
                  <span className="content-label">Ask:</span> {w.ask}
                </p>
                <p className="content-qualifies">{w.qualifies}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </Tab>
  )
}

/* ── SITE AUDIT ── */

export function AuditTab({ data }) {
  const audit = data.auditFindings
  if (!audit) return <Tab><GlassCard>No audit recorded for this plan.</GlassCard></Tab>

  return (
    <Tab>
      <GlassCard>
        <SectionHead
          badge="⌕"
          title={audit.label}
          badgeStyle={{ background: 'linear-gradient(135deg,#F87171,#DC2626)', color: '#060A12' }}
        />

        <p className="audit-intro">{audit.intro}</p>

        <div className="grid-2">
          <div>
            <div className="audit-col-label gap">Gaps — fixable, and mine to fix</div>
            {audit.gaps.map((g, i) => (
              <motion.div
                key={i}
                className="audit-item gap"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="audit-item-title">{g.title}</div>
                <div className="audit-item-detail">{g.detail}</div>
                <div className="audit-item-fix">
                  <strong>Fix:</strong> {g.fix}
                </div>
              </motion.div>
            ))}
          </div>

          <div>
            <div className="audit-col-label ok">Already working — do not touch</div>
            {audit.working.map((w, i) => (
              <motion.div
                key={i}
                className="audit-item ok"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="audit-item-title">{w.title}</div>
                <div className="audit-item-detail">{w.detail}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>
    </Tab>
  )
}

/* ── MILESTONES + BUILD HISTORY ── */

const PHASE_CLASS = { blue: 'phase-card-blue', amber: 'phase-card-amber', green: 'phase-card-green' }
const LOG_ICON = { dashboard: '📊', build: '🔨', message: '💬' }

export function MilestonesTab({ data }) {
  return (
    <Tab>
      <GlassCard>
        <SectionHead badge="→" title="30 / 60 / 90 — Milestones That Prove the Engine Works" />

        <div className="phases-grid">
          {data.phases.map((p, i) => (
            <motion.div
              key={i}
              className={`phase-card ${PHASE_CLASS[p.color]}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <div className="phase-num">{p.num}</div>
              <div className="phase-sub">{p.sub}</div>
              <ul className="phase-list">
                {p.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="story-block">
          <span className="story-gold">The proof point:</span> {data.phaseProof}
        </div>
      </GlassCard>

      <GlassCard style={{ marginTop: 16 }}>
        <SectionHead
          badge="◴"
          title="Build History"
          badgeStyle={{
            background: 'linear-gradient(135deg,#1B3A4B,#0F2836)',
            color: '#E8A838',
            border: '1px solid rgba(232,168,56,0.3)',
          }}
        />
        <div className="activity-feed">
          {data.activityLog.map((entry, i) => (
            <div key={i} className="activity-entry">
              <div className="ae-icon">{LOG_ICON[entry.icon] || '•'}</div>
              <div className="ae-dot-line">
                <div className="ae-dot" />
                {i < data.activityLog.length - 1 && <div className="ae-line" />}
              </div>
              <div className="ae-body">
                <div className="ae-header">
                  <span className="ae-label">{entry.label}</span>
                  <span className="ae-date">{entry.date}</span>
                </div>
                <p className="ae-detail">{entry.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </Tab>
  )
}

/* ── PITCH + OPEN QUESTIONS + LINKS ── */

export function PitchTab({ data }) {
  const links = data.plan.links || []

  return (
    <Tab>
      <div className="close-box">
        <SectionHead
          badge="✧"
          title="What I'm Proposing"
          badgeStyle={{ background: '#A78BFA', color: '#060A12' }}
        />

        <div className="close-lines">
          {data.closingPoints.map((line, i) => {
            const match = line.match(/^"([^"]+)"\s*(.*)$/)
            return (
              <motion.div
                key={i}
                className="close-line"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {match ? (
                  <>
                    <span className="close-hl">"{match[1]}"</span> {match[2]}
                  </>
                ) : (
                  line
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="pitch-meta">
          <MetaRow label="Author" value={data.plan.author} />
          <MetaRow label="Interview" value={data.plan.interviewLabel} />
          <MetaRow label="Version" value={`${data.plan.version} · ${data.plan.date}`} />
        </div>
      </div>

      {data.openQuestions?.length > 0 && (
        <GlassCard style={{ marginTop: 16 }}>
          <SectionHead
            badge="?"
            title="Questions I'm Asking Them"
            badgeStyle={{ background: '#A78BFA', color: '#060A12' }}
          />
          {data.openQuestions.map((q, i) => (
            <motion.div
              key={i}
              className="oq-item"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="oq-q">{q.q}</div>
              <div className="oq-why">{q.why}</div>
            </motion.div>
          ))}
        </GlassCard>
      )}

      {links.length > 0 && (
        <GlassCard style={{ marginTop: 16 }}>
          <SectionHead
            badge="↗"
            title="Supporting Artifacts"
            badgeStyle={{ background: 'linear-gradient(135deg,#1B3A4B,#0F2836)', color: '#E8A838' }}
          />
          <div className="plan-links">
            {links.map((l, i) => (
              <a key={i} className="plan-link" href={l.url} target="_blank" rel="noreferrer">
                {l.label}
                <span className="plan-link-arrow">↗</span>
              </a>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="cta">
        <button className="cta-btn" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>
    </Tab>
  )
}

function MetaRow({ label, value }) {
  return (
    <div className="pitch-meta-row">
      <span className="pitch-meta-label">{label}</span>
      <span className="pitch-meta-value">{value}</span>
    </div>
  )
}
