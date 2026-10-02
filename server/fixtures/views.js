/**
 * Configuration for deterministic BlogView generation during seeding.
 * Seed script uses these values to generate ~750 views with realistic distribution.
 */
export const viewConfig = {
  totalViews: { min: 700, max: 800 },
  uniqueVisitors: { min: 80, max: 120 },
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
