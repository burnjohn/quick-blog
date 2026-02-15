import crypto from 'crypto'

// Generate realistic view data for analytics seeding
// Patterns: weekday bias (~2x weekends), growth trend, category popularity,
// referrer distribution (40% direct, 30% search, 20% social, 10% other),
// ~5% admin views, 200-400 unique sessions, spread over 6 months
export function generateViewFixtures(blogs, count = 800) {
  const views = []
  const sessionIds = Array.from({ length: 300 }, () => crypto.randomUUID())

  const now = new Date()
  const sixMonthsAgo = new Date(now)
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  // Weight blogs by category for realistic popularity
  const categoryWeights = {
    Technology: 4,
    Startup: 3,
    Lifestyle: 2,
    Finance: 1
  }

  // Build weighted blog pool
  const weightedBlogs = []
  for (const blog of blogs) {
    const weight = categoryWeights[blog.category] || 1
    for (let i = 0; i < weight; i++) {
      weightedBlogs.push(blog)
    }
  }

  for (let i = 0; i < count; i++) {
    const blog = weightedBlogs[Math.floor(Math.random() * weightedBlogs.length)]

    // Generate date with growth trend + weekday bias
    const date = generateDate(sixMonthsAgo, now)

    // Random referrer with realistic distribution
    const referrer = pickReferrer()

    views.push({
      blog: blog._id,
      sessionId: sessionIds[Math.floor(Math.random() * sessionIds.length)],
      referrer,
      isAdmin: Math.random() < 0.05,
      createdAt: date
    })
  }

  return views
}

function generateDate(start, end) {
  // Bias toward more recent dates (growth trend)
  const range = end.getTime() - start.getTime()
  const random = Math.pow(Math.random(), 0.7) // bias toward 1.0 (recent)
  const timestamp = start.getTime() + random * range
  const date = new Date(timestamp)

  // Weekday bias: if weekend, 50% chance to push to nearest weekday
  const day = date.getDay()
  if ((day === 0 || day === 6) && Math.random() < 0.5) {
    date.setDate(date.getDate() + (day === 0 ? 1 : -1))
  }

  // Randomize time of day
  date.setHours(Math.floor(Math.random() * 24))
  date.setMinutes(Math.floor(Math.random() * 60))

  return date
}

function pickReferrer() {
  const r = Math.random()
  if (r < 0.4) return 'direct'
  if (r < 0.7) return 'search'
  if (r < 0.9) return 'social'
  return 'other'
}
