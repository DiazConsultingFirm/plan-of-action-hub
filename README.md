# Plan of Action Hub

**Live: https://diazconsultingfirm.github.io/plan-of-action-hub/**

A full, researched plan of action for every live opportunity — one per company, written before
the call rather than after it.

Each plan answers the same question in the same structure: how would this person actually build
the thing you are hiring them to build, starting Monday. The weekly operating rhythm. Where
pipeline comes from and what gets filtered out. What the first outreach actually says. What is
true by day 30, 60 and 90. And the questions worth asking back.

Built by [Diaz Consulting Firm](https://diazconsultingfirm.github.io/).

## What's inside

| Plan | Role | Sections |
|---|---|---|
| **EverEffect** | Business Development Manager | Rhythm · Funnel · Content · **Site Audit** · 30/60/90 · Pitch |
| **FusionAuth** | Senior SDR / BDR Lead | Rhythm · Funnel · Content · 30/60/90 · Pitch |

The landing page sorts by date with a live countdown, so the next conversation is always the
first card.

## Ground rules for the content

Two rules govern everything written here.

**Nothing is invented.** Every company, trigger event, date and site finding is publicly sourced
and checkable. Where an account is named, the event that put it on the list has a date and a
publication behind it. Where a claim could not be verified, it is not in here.

**A projection is never dressed as a fact.** Where the numbers are proposed targets rather than a
company's actual figures, the page says so in a banner above them. The EverEffect funnel is
labelled this way, because no internal agency figures were available before the call.

The same discipline applies to what is left out. Specific compensation, negotiation posture and
private introductions are not published — those belong in a conversation, not on a page.

## Running it locally

```bash
npm install
npm run dev        # development, port 8042
npm run build      # production build into docs/
```

Or double-click **`Open-Plan-Hub.bat`** to serve the built site and open a browser.

The hub loads its plan files when the page opens, so it needs to be served rather than opened
straight off disk. Append `?flat=1` to the URL to drop the animated backdrop for printing.

## Adding another plan

1. Add `public/plans/<company>.json`.
2. Add a matching entry to `public/plans/index.json` under `plans` — `id`, `file`, `company`,
   `role`, `mark`, `accent`, `stage`, `interviewDate` (as `YYYY-MM-DD`), `interviewLabel`, `who`,
   `thesis`, and three `headline` figures.
3. `npm run build`.

A plan declares its own sections through `plan.tabs`. Six renderers exist — `rhythm`, `funnel`,
`content`, `audit`, `milestones`, `pitch` — and listing a subset simply hides the rest. That is
why FusionAuth shows five sections and EverEffect shows six.

Set `plan.dataNote` whenever the funnel figures are targets rather than reported numbers. It
renders as a banner readers see before the chart.

## Built with

React 19, Vite, Framer Motion. No 3D libraries, no charting library, no UI kit — about 100 KB
over the wire, so it opens quickly on a phone.

```
src/
  App.jsx          shell, roster fetch, plan cache
  HubLanding.jsx   the landing roster of cards
  PlanView.jsx     per-plan header, switcher, section routing
  PlanTabs.jsx     the six section renderers
  Backdrop.jsx     ambient background, CSS only
  dates.js         countdown and sorting helpers
  hub.css          hub styles, layered over the DCF design system
public/plans/      index.json roster plus one file per plan
docs/              built site, served by GitHub Pages
```
