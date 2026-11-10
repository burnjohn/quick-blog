// Constants that shape the synthetic analytics data (see src/utils/analyticsGenerator.js)
export { SOURCES, DEVICES, ANALYTICS_DAYS } from '../src/constants/analytics.js'

export const DEFAULT_SEED = 20251110

// Share of views per traffic source
export const SOURCE_SHARES = { direct: 0.22, search: 0.4, social: 0.19, referral: 0.12, email: 0.07 }

// Share of views per country (ISO 3166-1 alpha-2)
export const COUNTRY_SHARES = {
  US: 0.26, GB: 0.1, DE: 0.09, IN: 0.11, CA: 0.07, FR: 0.06, BR: 0.07, AU: 0.05, NL: 0.04, UA: 0.05, PL: 0.04, ES: 0.06
}

export const DEVICE_SHARES = { desktop: 0.46, mobile: 0.45, tablet: 0.09 }

// Relative views per UTC hour of day: quiet at night, lunch bump, evening peak
export const HOUR_WEIGHTS = [
  0.35, 0.28, 0.24, 0.22, 0.24, 0.32, 0.5, 0.75, 1, 1.15, 1.2, 1.25,
  1.35, 1.3, 1.2, 1.15, 1.2, 1.3, 1.5, 1.7, 1.75, 1.45, 0.95, 0.6
]

// Weekly seasonality: index 0 = Sunday (Date#getUTCDay)
export const WEEKDAY_FACTORS = [0.6, 1.05, 1.1, 1.1, 1.05, 0.95, 0.6]

export const GROWTH_PER_YEAR = 0.6 // +60% over the analytics window
export const BASE_DAILY_VIEWS = 55
export const SPIKE = { peak: 3.2, decayDays: 6, tail: 0.28 }

export const CATEGORY_POPULARITY = { Technology: 1.35, Startup: 1.05, Finance: 0.9, Lifestyle: 0.8 }
export const TAG_BOOST = { react: 1.25, javascript: 1.15, nodejs: 1.1, typescript: 1.1, startup: 1.05, investing: 1.1 }

// Per-source engagement multipliers (applied to the base rates below)
export const SOURCE_ENGAGEMENT = { direct: 1.1, search: 1, social: 0.8, referral: 1.05, email: 1.3 }

export const RATES = {
  unique: [0.72, 0.88], // uniqueVisitors / views
  engaged: 0.42, // share of views with scroll >= 75%
  likes: 0.12, // of engaged reads
  comments: 0.025,
  shares: 0.04,
  subscribe: 0.18, // of interactions
  scrollDepth: [48, 72], // average scroll percent
  readTimeSec: [95, 240]
}
