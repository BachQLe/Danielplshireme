import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RuleKitchenSink } from './components/rules/RuleKitchenSink.tsx'

// The rule-system kitchen sink lives at /#rules. A hash gate rather than a
// router: this is a one-page site, and adding react-router to host a single
// internal demo page would be the tail wagging the dog.
const isRulesDemo = window.location.hash === '#rules'

// Neither page has any state worth preserving across the switch, so a full
// reload is the simplest correct way to pick up the new hash — no need to
// wire a listener into React just to re-run this one check in place.
window.addEventListener('hashchange', () => window.location.reload())

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isRulesDemo ? <RuleKitchenSink /> : <App />}</StrictMode>,
)
