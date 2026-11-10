import {
  SOURCES, DEVICES, ANALYTICS_DAYS, DEFAULT_SEED, SOURCE_SHARES, COUNTRY_SHARES, DEVICE_SHARES,
  HOUR_WEIGHTS, WEEKDAY_FACTORS, GROWTH_PER_YEAR, BASE_DAILY_VIEWS, SPIKE, CATEGORY_POPULARITY,
  TAG_BOOST, SOURCE_ENGAGEMENT, RATES
} from '../../fixtures/analyticsProfile.js'

const DAY_MS = 24 * 60 * 60 * 1000

// Deterministic PRNG: same numeric seed -> same sequence in [0, 1)
export const mulberry32 = (seed) => {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6D2B79F5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Mixes integers into one 32-bit seed so each (post, day, source) has its own stream
const mixSeed = (...parts) => parts.reduce((h, p) => Math.imul(h ^ (p + 0x9E3779B9), 0x85EBCA6B) >>> 0, 0x811C9DC5)

export const startOfUtcDay = (date) => {
  const d = new Date(date)
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

const between = (rng, [min, max]) => min + (max - min) * rng()

// Splits an integer total across weights (with noise) so that the parts always sum to total
const distribute = (total, entries, rng, noise = 0.25) => {
  const weights = entries.map(([, w]) => w * (1 + (rng() - 0.5) * 2 * noise))
  const sum = weights.reduce((a, b) => a + b, 0)
  const raw = weights.map(w => (w / sum) * total)
  const parts = raw.map(Math.floor)
  let rest = total - parts.reduce((a, b) => a + b, 0)
  const order = raw.map((r, i) => [r - parts[i], i]).sort((a, b) => b[0] - a[0] || a[1] - b[1])
  for (let k = 0; rest > 0; k = (k + 1) % order.length, rest--) parts[order[k][1]]++
  return parts
}

export const postPopularity = ({ category, tags = [] }, rng) => {
  const boost = Math.max(1, ...tags.map(tag => TAG_BOOST[tag] || 1))
  return BASE_DAILY_VIEWS * (CATEGORY_POPULARITY[category] || 1) * boost * (0.8 + rng() * 0.5)
}

// Views multiplier by post age: publish-day spike decaying into a long tail
const ageFactor = (age) => SPIKE.tail + (SPIKE.peak - SPIKE.tail) * Math.exp(-age / SPIKE.decayDays)

const buildRow = ({ post, popularity, date, dayIndex, source, seed, postIndex, sourceIndex }) => {
  const rng = mulberry32(mixSeed(seed, postIndex, Math.floor(date.getTime() / DAY_MS), sourceIndex))
  const age = Math.round((date - post.day) / DAY_MS)
  const growth = 1 + GROWTH_PER_YEAR * (dayIndex / (ANALYTICS_DAYS - 1))
  const expected = popularity * growth * WEEKDAY_FACTORS[date.getUTCDay()] * ageFactor(age) * SOURCE_SHARES[source]
  const views = Math.round(expected * (0.8 + rng() * 0.4))
  if (views <= 0) return null

  const unique = Math.min(views, Math.round(views * between(rng, RATES.unique)))
  const engagedRate = RATES.engaged * SOURCE_ENGAGEMENT[source] * (0.85 + rng() * 0.3)
  const engagedReads = Math.min(views, Math.round(views * engagedRate))
  // Interactions are capped sequentially so likes + comments + shares <= engagedReads
  const likes = Math.min(engagedReads, Math.round(engagedReads * RATES.likes * (0.7 + rng() * 0.6)))
  const comments = Math.min(engagedReads - likes, Math.round(engagedReads * RATES.comments * (0.5 + rng())))
  const shares = Math.min(engagedReads - likes - comments, Math.round(engagedReads * RATES.shares * (0.6 + rng() * 0.8)))
  const interactions = likes + comments + shares
  const subscriptions = Math.min(interactions, Math.round(interactions * RATES.subscribe * (0.6 + rng() * 0.8)))

  const countryEntries = Object.entries(COUNTRY_SHARES)
  const countryParts = distribute(views, countryEntries, rng)
  const countries = Object.fromEntries(countryEntries.map(([code], i) => [code, countryParts[i]]))
  const deviceParts = distribute(views, DEVICES.map(d => [d, DEVICE_SHARES[d]]), rng, 0.15)

  return {
    blog: post.id,
    date,
    source,
    views,
    uniqueVisitors: unique,
    readTimeSec: Math.round(views * between(rng, RATES.readTimeSec)),
    scrollDepthSum: Math.round(views * between(rng, RATES.scrollDepth)),
    engagedReads,
    likes,
    comments,
    shares,
    subscriptions,
    countries,
    devices: Object.fromEntries(DEVICES.map((d, i) => [d, deviceParts[i]])),
    hours: distribute(views, HOUR_WEIGHTS.map((w, h) => [h, w]), rng, 0.2)
  }
}

/**
 * Pure, deterministic generator.
 * posts: [{ id, publishedAt, category, tags }]; endDate: last day (inclusive).
 * Returns one row per (post, day, source) from the publish day (or window start) to endDate.
 */
export const generateAnalyticsRows = ({ posts, endDate, seed = DEFAULT_SEED, days = ANALYTICS_DAYS }) => {
  const end = startOfUtcDay(endDate)
  const start = new Date(end.getTime() - (days - 1) * DAY_MS)
  const rows = []
  posts.forEach((rawPost, postIndex) => {
    const post = { ...rawPost, day: startOfUtcDay(rawPost.publishedAt) }
    const popularity = postPopularity(post, mulberry32(mixSeed(seed, postIndex, 7)))
    const first = post.day > start ? post.day : start
    for (let t = first.getTime(); t <= end.getTime(); t += DAY_MS) {
      const date = new Date(t)
      const dayIndex = Math.round((t - start.getTime()) / DAY_MS)
      SOURCES.forEach((source, sourceIndex) => {
        const row = buildRow({ post, popularity, date, dayIndex, source, seed, postIndex, sourceIndex })
        if (row) rows.push(row)
      })
    }
  })
  return rows
}

// Adapts persisted blogs (Mongoose docs or lean objects) to generator input
export const buildAnalyticsDocs = (blogs, endDate = new Date(), seed = DEFAULT_SEED) =>
  generateAnalyticsRows({
    posts: blogs.map(blog => ({
      id: blog._id,
      publishedAt: blog.createdAt,
      category: blog.category,
      tags: blog.tags || []
    })),
    endDate,
    seed
  })
