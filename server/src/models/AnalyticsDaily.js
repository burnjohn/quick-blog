import mongoose from 'mongoose'
import { SOURCES } from '../constants/analytics.js'

const count = { type: Number, default: 0, min: 0 }

// One document = one day of traffic for a (post, traffic source) pair. Days are UTC midnight.
const analyticsDailySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  source: { type: String, enum: SOURCES, required: true },
  views: count,
  uniqueVisitors: count,
  readTimeSec: count, // sum over views
  scrollDepthSum: count, // sum of scroll percents; average = sum / views
  engagedReads: count, // reads with scroll >= 75%
  likes: count,
  comments: count,
  shares: count,
  subscriptions: count,
  countries: { type: Map, of: Number, default: {} }, // country code -> views
  devices: {
    desktop: count,
    mobile: count,
    tablet: count
  },
  hours: { type: [Number], default: () => new Array(24).fill(0) } // views per UTC hour
}, { versionKey: false })

analyticsDailySchema.index({ date: 1, blog: 1 })
analyticsDailySchema.index({ blog: 1, date: 1 })

const AnalyticsDaily = mongoose.model('AnalyticsDaily', analyticsDailySchema)

export default AnalyticsDaily
