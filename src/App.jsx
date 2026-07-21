import { useState, useEffect, useCallback } from 'react'
import Backdrop from './Backdrop'
import HubLanding from './HubLanding'
import PlanView from './PlanView'
import './index.css'
import './hub.css'

const ROSTER_URL = `${import.meta.env.BASE_URL}plans/index.json`
const planUrl = (file) => `${import.meta.env.BASE_URL}plans/${file}`

export default function App() {
  const [roster, setRoster] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [planCache, setPlanCache] = useState({})
  const [error, setError] = useState(null)

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
