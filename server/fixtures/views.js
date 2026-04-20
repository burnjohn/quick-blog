// View generation configuration used by the seed script to create realistic
// BlogView data (REQ-7.1 – REQ-7.8). Not persisted to the database directly.
export const viewConfig = {
  categoryMultiplier: {
    Technology: 1.0,
    Lifestyle: 0.75,
    Startup: 0.5,
    Finance: 0.3
  },
  weekdayBias: {
    weekday: 1.0,
    weekend: 0.5
  },
  growthFactor: 1.2,
  referrerDistribution: {
    direct: 0.5,
    search: 0.25,
    social: 0.15,
    other: 0.1
  }
}
