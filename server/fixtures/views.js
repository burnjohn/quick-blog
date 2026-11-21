/**
 * Configuration for deterministic BlogView generation during seeding.
 * Seed script uses these values to generate ~1,500–1,800 views (after weekend
 * thinning) with realistic distribution across ~34 published posts.
 */
export const viewConfig = {
  totalViews: { min: 1650, max: 1950 },
  uniqueVisitors: { min: 180, max: 260 },
  referrerDistribution: {
    search: 0.45,
    social: 0.3,
    direct: 0.2,
    other: 0.05
  },
  categoryPopularity: {
    Technology: 1.0,
    Lifestyle: 0.75,
    Startup: 0.5,
    Finance: 0.3
  },
  weekdayMultiplier: 1.3,
  growthFactor: 1.5
}
