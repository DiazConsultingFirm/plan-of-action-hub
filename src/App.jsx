import { useState, useEffect, useCallback } from 'react'
import Backdrop from './Backdrop'
import HubLanding from './HubLanding'
import PlanView from './PlanView'
import './index.css'
import './hub.css'

const ROSTER_URL = `${import.meta.env.BASE_URL}plans/index.json`
const planUrl = (file) => `${import.meta.env.BASE_URL}plans/${file}`

// Same mechanism as the Command Center's toggle: a data-theme attribute on
// <html>, persisted to localStorage, read by index.html's anti-flash script
// before React even mounts. Dark stays the default everyone has already
// seen; light is the opt-in, not the other way around like Command Center —
// this hub already shipped dark-only, so flipping the default would change
// the look for every existing link out with no upside.
function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark',
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('poaTheme', theme)
    } catch {
      // localStorage can throw in private-browsing contexts — theme just
      // won't persist across reloads, which is a fine degrade.
    }
  }, [theme])

  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

// target="_top" matters here specifically: this hub is usually opened as an
// in-page iframe tab inside the Command Center itself. A normal link would
// navigate just the iframe (landing you on the CC's own homepage nested
// inside the hub's own tab, which is confusing/wrong). _top breaks out and
// navigates the real top-level window, so "back to Command Center" means
// the same thing whether this hub is standalone or embedded.
function CommandCenterLink() {
  return (
    <a href="http://localhost:8045/" target="_top" className="cc-home-link" title="Back to Command Center">
      ← Command Center
    </a>
  )
}

export default function App() {
  const [roster, setRoster] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [initialTab, setInitialTab] = useState('full')
  const [planCache, setPlanCache] = useState({})
  const [error, setError] = useState(null)
  const [theme, toggleTheme] = useTheme()

  useEffect(() => {
    fetch(ROSTER_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`roster ${r.status}`)
        return r.json()
      })
      .then(setRoster)
      .catch((e) => setError(`Could not load the plan roster (${e.message}).`))
  }, [])

  const openPlan = useCallback(
    (entry, tab = 'full') => {
      // Client cards (Gerlach, Robert Davis) get the same in-hub Plan of
      // Action page as everyone else once a plans/*.json exists for them —
      // the Site/Dashboard buttons on the card itself are what link straight
      // out to their real live pages. Only fall back to an external redirect
      // for a client entry that doesn't have a plan file built yet.
      if (entry.kind === 'client' && entry.external && !entry.file) {
        window.open(entry.external, '_blank', 'noopener')
        return
      }
      setActiveId(entry.id)
      setInitialTab(tab)
      if (planCache[entry.id]) return
      fetch(planUrl(entry.file))
        .then((r) => {
          if (!r.ok) throw new Error(`plan ${r.status}`)
          return r.json()
        })
        .then((data) => setPlanCache((prev) => ({ ...prev, [entry.id]: data })))
        .catch((e) => setError(`Could not load the ${entry.company} plan (${e.message}).`))
    },
    [planCache],
  )

  if (error) return <ErrorScreen message={error} />
  if (!roster) return <LoadingScreen />

  const activeEntry = roster.plans.find((p) => p.id === activeId) || null
  const activeData = activeId ? planCache[activeId] : null

  // ?flat=1 drops the animated backdrop entirely — useful for printing.
  const flat = new URLSearchParams(window.location.search).has('flat')

  return (
    <div className="app-shell">
      {!flat && <Backdrop />}
      {/* Only on the landing — inside a plan, the topbar's own "Command
          Center ↗" link (next to "← Plan of Action Hub") covers this
          without overlapping the topbar's title/back-link. */}
      {!activeEntry && <CommandCenterLink />}
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <div className="hud-overlay">
        {!activeEntry ? (
          <HubLanding roster={roster} onOpen={openPlan} />
        ) : !activeData ? (
          <LoadingScreen />
        ) : (
          <PlanView
            key={activeEntry.id}
            data={activeData}
            roster={roster}
            initialTab={initialTab}
            onHome={() => setActiveId(null)}
            onSwitch={openPlan}
          />
        )}
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-pulse" />
      <p>Loading plans…</p>
    </div>
  )
}

function ErrorScreen({ message }) {
  return (
    <div className="loading-screen">
      <p className="error-text">{message}</p>
    </div>
  )
}
