import { useState } from 'react'
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

const SEVERITY_LABEL = { critical: 'Critical', high: 'High', working: 'Working' }

function SourceLine({ text }) {
  if (!text) return null
  return <p className="audit-source">{text}</p>
}

/* Persistent hero for the audit-cluster tabs (Site Audit, Where You Rank,
   Competitors, The Plan, Concepts, The Offer, Your Dashboard) — modelled on
   the real Echelon Legal pitch page, which keeps one big headline + stat row
   fixed above its own tab row so the depth stays visible no matter which
   sub-tab is open, instead of resetting to a small heading each time. */
export function AuditHero({ data }) {
  const audit = data.auditFindings
  if (!data.plan.heroHeadline || !audit) return null

  return (
    <div className="audit-hero">
      <div className="audit-hero-top">
        <div className="audit-hero-brand">
          <span className="audit-hero-brand-mark">DCF</span>
          <span className="audit-hero-brand-sub">Diaz Consulting Firm</span>
        </div>
        <div className="audit-hero-prepared">
          Prepared for {data.plan.company}
          {data.plan.heroPreparedFor && <><br />{data.plan.heroPreparedFor}</>}
        </div>
      </div>

      <h1 className="audit-hero-headline">
        {data.plan.heroHeadline.split('|').map((part, i) =>
          i === 1 ? <em key={i}>{part}</em> : <span key={i}>{part}</span>,
        )}
      </h1>
      {data.plan.heroSub && <p className="audit-hero-sub">{data.plan.heroSub}</p>}

      <AuditHeadline stats={audit.headline} />
    </div>
  )
}

function AuditHeadline({ stats }) {
  if (!stats?.length) return null
  return (
    <div className="audit-headline-row">
      {stats.map((s, i) => (
        <div key={i} className="audit-headline-stat">
          <div className="audit-headline-val">{s.val}</div>
          <div className="audit-headline-lbl">{s.lbl}</div>
        </div>
      ))}
    </div>
  )
}

/* A finding with real quotable proof (a literal line copied from the source,
   a hard number, a dated citation) flips to show that evidence front and
   center instead of leaving it buried mid-paragraph in the narrative detail.
   Findings without a distinct `evidence` field just don't flip — never
   inventing proof that isn't there. Same CSS 3D-flip mechanic as the Command
   Center's Next Actions cards. */
function AuditItemCard({ f, severity, index }) {
  const [flipped, setFlipped] = useState(false)
  const hasEvidence = Boolean(f.evidence)

  return (
    <motion.div
      className={`audit-item sev-${severity} ${hasEvidence ? 'has-evidence audit-item-flip' : ''} ${flipped ? 'flipped' : ''}`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={hasEvidence ? () => setFlipped((v) => !v) : undefined}
      role={hasEvidence ? 'button' : undefined}
      tabIndex={hasEvidence ? 0 : undefined}
    >
      {hasEvidence ? (
        <div className="audit-item-flip-inner">
          <div className="audit-item-face">
            <div className="audit-item-title">{f.title}</div>
            <div className="audit-item-detail">{f.detail}</div>
            {f.fix && (
              <div className="audit-item-fix">
                <strong>Fix:</strong> {f.fix}
              </div>
            )}
            <div className="evidence-hint">See the evidence ↗</div>
          </div>
          <div className="audit-item-face audit-item-face-back">
            <div className="evidence-label">The evidence</div>
            <p className="evidence-quote">{f.evidence}</p>
            {f.evidenceSource && <div className="evidence-source">{f.evidenceSource}</div>}
          </div>
        </div>
      ) : (
        <>
          <div className="audit-item-title">{f.title}</div>
          <div className="audit-item-detail">{f.detail}</div>
          {f.fix && (
            <div className="audit-item-fix">
              <strong>Fix:</strong> {f.fix}
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}

function AuditFindingsGroup({ severity, items }) {
  if (!items?.length) return null
  return (
    <div className="audit-group">
      <div className={`audit-col-label sev-${severity}`}>
        <span className={`sev-dot sev-${severity}`} />
        {SEVERITY_LABEL[severity]} ({items.length})
      </div>
      {items.map((f, i) => (
        <AuditItemCard key={i} f={f} severity={severity} index={i} />
      ))}
    </div>
  )
}

function AuditRankingTable({ table }) {
  if (!table) return null
  return (
    <div className="audit-block">
      <div className="plan-section-head" style={{ marginBottom: 10 }}>
        <div>
          <h3 className="audit-block-title">{table.label}</h3>
          {table.note && <p className="audit-block-note">{table.note}</p>}
        </div>
      </div>
      <div className="audit-table-wrap">
        <table className="audit-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Result</th>
              <th>Why they rank</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i} className={r.isSubject ? 'audit-table-subject' : ''}>
                <td>{r.rank}</td>
                <td>{r.result}</td>
                <td>{r.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SourceLine text={table.sourceLine} />
    </div>
  )
}

function AuditCompetitorTable({ table }) {
  if (!table) return null
  return (
    <div className="audit-block">
      <div className="plan-section-head" style={{ marginBottom: 10 }}>
        <div>
          <h3 className="audit-block-title">{table.label}</h3>
          {table.note && <p className="audit-block-note">{table.note}</p>}
        </div>
      </div>
      <div className="audit-table-wrap">
        <table className="audit-table audit-table-compare">
          <thead>
            <tr>
              <th>Attribute</th>
              {table.columns.map((c, i) => (
                <th key={i} className={i === table.columns.length - 1 ? 'audit-col-future' : ''}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i}>
                <td className="audit-attr">{r.attribute}</td>
                {r.values.map((v, j) => (
                  <td key={j} className={j === r.values.length - 1 ? 'audit-col-future' : ''}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SourceLine text={table.sourceLine} />
    </div>
  )
}

/* Each screen below is one page from the real client audit format — Site
   Audit, Where You Rank, Competitors — split into its own tab instead of one
   long scroll, so the depth of the research is visible at a glance rather
   than buried. All three read from the same `auditFindings` object. */

function findingsFrom(audit) {
  // Two schema shapes are supported so older plans don't need a rewrite:
  // legacy = { gaps: [], working: [] } (binary); current = { findings: [] }
  // grouped by severity.
  return audit.findings || [
    ...(audit.gaps || []).map((g) => ({ ...g, severity: 'high' })),
    ...(audit.working || []).map((w) => ({ ...w, severity: 'working' })),
  ]
}

export function AuditTab({ data }) {
  const audit = data.auditFindings
  if (!audit) return <Tab><GlassCard>No audit recorded for this plan.</GlassCard></Tab>

  const findings = findingsFrom(audit)
  const bySeverity = (sev) => findings.filter((f) => f.severity === sev)

  return (
    <Tab>
      <GlassCard>
        <SectionHead
          badge="⌕"
          title={audit.label}
          badgeStyle={{ background: 'linear-gradient(135deg,#F87171,#DC2626)', color: '#060A12' }}
        />

        <p className="audit-intro">{audit.intro}</p>
        <AuditHeadline stats={audit.headline} />
        <SourceLine text={audit.sourceLine} />

        <div className="grid-2" style={{ marginTop: 18 }}>
          <div>
            <AuditFindingsGroup severity="critical" items={bySeverity('critical')} />
            <AuditFindingsGroup severity="high" items={bySeverity('high')} />
          </div>
          <div>
            <AuditFindingsGroup severity="working" items={bySeverity('working')} />
          </div>
        </div>
      </GlassCard>
    </Tab>
  )
}

export function RankingTab({ data }) {
  const audit = data.auditFindings
  const table = audit?.rankingTable || audit?.targetBoard
  if (!table) return <Tab><GlassCard>No ranking research recorded for this plan.</GlassCard></Tab>

  return (
    <Tab>
      <GlassCard>
        <SectionHead
          badge="◎"
          title="Where You Rank"
          badgeStyle={{ background: 'linear-gradient(135deg,#3A7AAA,#1B3A4B)', color: '#E8A838' }}
        />
        <AuditRankingTable table={table} />
      </GlassCard>
    </Tab>
  )
}

export function CompetitorsTab({ data }) {
  const table = data.auditFindings?.competitorTable
  if (!table) return <Tab><GlassCard>No competitive research recorded for this plan.</GlassCard></Tab>

  return (
    <Tab>
      <GlassCard>
        <SectionHead
          badge="⚔"
          title="Competitors"
          badgeStyle={{ background: 'linear-gradient(135deg,#A78BFA,#7C3AED)', color: '#060A12' }}
        />
        <AuditCompetitorTable table={table} />
      </GlassCard>
    </Tab>
  )
}

/* ── CONCEPTS — only present when a plan ships real design directions ── */

export function ConceptsTab({ data }) {
  const concepts = data.concepts
  if (!concepts?.length) return <Tab><GlassCard>No design concepts recorded for this plan.</GlassCard></Tab>

  return (
    <Tab>
      <GlassCard>
        <SectionHead
          badge="◐"
          title="Concepts — Two Directions, Built for This Firm"
          badgeStyle={{ background: 'linear-gradient(135deg,#3BA55C,#1F7A3D)', color: '#060A12' }}
        />
        {data.conceptsIntro && <p className="audit-intro">{data.conceptsIntro}</p>}
        <div className="grid-2" style={{ marginTop: 14 }}>
          {concepts.map((c, i) => (
            <motion.div
              key={i}
              className="concept-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="concept-eyebrow">{c.eyebrow}</div>
              <div className="concept-name">{c.name}</div>
              <p className="concept-desc">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </Tab>
  )
}

/* ── THE OFFER — only present when a plan has real priced tiers ── */

export function OfferTab({ data }) {
  const tiers = data.offerTiers
  if (!tiers?.length) return <Tab><GlassCard>No offer recorded for this plan.</GlassCard></Tab>

  return (
    <Tab>
      <GlassCard>
        <SectionHead
          badge="$"
          title="The Offer"
          badgeStyle={{ background: 'linear-gradient(135deg,#E8A838,#B8862A)', color: '#060A12' }}
        />
        {data.offerIntro && <p className="audit-intro">{data.offerIntro}</p>}
        <div className="offer-grid" style={{ marginTop: 14 }}>
          {tiers.map((t, i) => (
            <motion.div
              key={i}
              className={`offer-card ${t.recommended ? 'offer-recommended' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {t.recommended && <div className="offer-badge">Recommended</div>}
              <div className="offer-name">{t.name}</div>
              <div className="offer-price">
                {t.price}
                {t.priceNote && <span className="offer-price-note"> {t.priceNote}</span>}
              </div>
              <div className="offer-sub">{t.sub}</div>
              <ul className="offer-list">
                {t.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        {data.offerWhyNow && (
          <div className="story-block" style={{ marginTop: 16 }}>
            <span className="story-gold">Why now:</span> {data.offerWhyNow}
          </div>
        )}
      </GlassCard>
    </Tab>
  )
}

/* ── YOUR DASHBOARD — tweaked for an employer plan: not a live client
   analytics tool, a 90-day tracking view built from the same metrics and
   milestones already in the plan. Same underlying data as Rhythm + Milestones,
   presented as something to check progress against, not new content. ── */

export function DashboardTab({ data }) {
  return (
    <Tab>
      <GlassCard>
        <SectionHead
          badge="◫"
          title="Your Dashboard — Tracking the First 90 Days"
          badgeStyle={{
            background: 'linear-gradient(135deg,#1B3A4B,#0F2836)',
            color: '#E8A838',
            border: '1px solid rgba(232,168,56,0.3)',
          }}
        />
        <p className="audit-intro">
          {data.plan.kind === 'consulting'
            ? 'The same live-dashboard discipline DCF runs for every retained client — rankings, calls, and bookings tracked from day one, not guessed at by month three.'
            : "Not a live product — a plain view of what proves the plan is working, checked the same way every week. This is what I'd actually be tracking, not a slide."}
        </p>

        <MetricRow metrics={data.metrics} />

        <div className="dash-tracker" style={{ marginTop: 18 }}>
          {data.phases.map((p, i) => (
            <div key={i} className="dash-tracker-row">
              <div className={`dash-tracker-num phase-num`}>{p.num}</div>
              <div className="dash-tracker-body">
                <div className="dash-tracker-sub">{p.sub}</div>
                <ul className="phase-list">
                  {p.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="story-block" style={{ marginTop: 16 }}>
          <span className="story-gold">What "on track" looks like:</span> {data.phaseProof}
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
        <SectionHead badge="→" title={data.plan.milestonesTitle || '30 / 60 / 90 — Milestones That Prove the Engine Works'} />

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
          <MetaRow
            label={data.plan.kind === 'consulting' ? 'Status' : 'Interview'}
            value={data.plan.kind === 'consulting' ? data.plan.pitchDateLabel : data.plan.interviewLabel}
          />
          {data.plan.contact && <MetaRow label="Contact" value={data.plan.contact} />}
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

/* Real work-sample dashboards — the type of research/audit work we actually
   do for clients (e.g. the Echelon Legal site audit), kept as a curated list
   per-plan in plan.dashboards so it's easy to pull one up live on a call if
   asked "can you show me an example." Links point at the same Command Center
   local server (localhost:8045) this app itself is served through when
   opened via Open-Command-Center.bat, so they resolve same-origin. */
export function DashboardsTab({ data }) {
  const dashboards = data.plan.dashboards || []

  return (
    <Tab>
      <GlassCard>
        <SectionHead
          badge="◫"
          title="Dashboards — Work Samples"
          badgeStyle={{ background: 'linear-gradient(135deg,#1B3A4B,#0F2836)', color: '#E8A838' }}
        />
        <p style={{ fontSize: 12.5, color: 'var(--text-dim)', marginBottom: 14, lineHeight: 1.5 }}>
          Real, live examples of the research and audit work DCF does for clients — the kind of
          thing worth pulling up on the call if they ask to see an example.
        </p>
        {dashboards.length > 0 ? (
          <div className="dash-grid">
            {dashboards.map((d, i) => (
              <motion.a
                key={i}
                className="dash-card"
                href={d.url}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <span className="dash-card-icon">{d.icon || '📊'}</span>
                <span className="dash-card-title">{d.label}</span>
                {d.note && <span className="dash-card-note">{d.note}</span>}
                <span className="dash-card-arrow">Open ↗</span>
              </motion.a>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No dashboards linked for this plan yet.
          </p>
        )}
      </GlassCard>
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
