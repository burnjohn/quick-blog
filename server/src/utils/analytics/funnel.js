import { interactionsOf } from './kpi.js'

// Views -> Engaged reads -> Interactions -> Subscriptions
export const buildFunnel = (totals) => [
  { key: 'views', label: 'Views', value: totals.views },
  { key: 'engagedReads', label: 'Engaged reads', value: totals.engagedReads },
  { key: 'interactions', label: 'Interactions', value: interactionsOf(totals) },
  { key: 'subscriptions', label: 'Subscriptions', value: totals.subscriptions }
]
