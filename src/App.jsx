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

export default function App() {
  const [roster, setRoster] = useState(null)
  const [activeId, setActiveId] = useState(null)
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
    (entry) => {
      // Client dashboards (Gerlach, Robert Davis) are separately-built, already-
      // live apps — they don't have a plans/*.json to render in-hub. Link out
      // instead of trying to fetch a plan file that doesn't exist for them.
      if (entry.kind === 'client' && entry.external) {
        window.open(entry.external, '_blank', 'noopener')
        return
      }
      setActiveId(entry.id)
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
