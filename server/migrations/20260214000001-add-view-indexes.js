import dbLogger from '../src/utils/dbLogger.js'

/**
 * Migration: Add indexes to views collection
 * Created: 2026-02-14
 */

export async function up(db) {
  try {
    dbLogger.logMigration('20260214000001-add-view-indexes', 'STARTING', 'Adding indexes to views collection')

    // Compound index for deduplication: one view per session per blog per 24h
    await db.collection('views').createIndex(
      { blog: 1, sessionId: 1, createdAt: 1 },
      { name: 'view_dedup_index' }
    )

    // Index for analytics queries: views per blog over time
    await db.collection('views').createIndex(
      { blog: 1, createdAt: 1 },
      { name: 'view_blog_date_index' }
    )

    // Index for time-range queries
    await db.collection('views').createIndex(
      { createdAt: 1 },
      { name: 'view_date_index' }
    )

    dbLogger.logMigration('20260214000001-add-view-indexes', 'SUCCESS', 'Indexes created successfully')
  } catch (error) {
    dbLogger.logError('20260214000001-add-view-indexes UP', error)
    throw error
  }
}

export async function down(db) {
  try {
    dbLogger.logMigration('20260214000001-add-view-indexes', 'ROLLING_BACK', 'Removing indexes from views collection')

    await db.collection('views').dropIndex('view_dedup_index')
    await db.collection('views').dropIndex('view_blog_date_index')
    await db.collection('views').dropIndex('view_date_index')

    dbLogger.logMigration('20260214000001-add-view-indexes', 'ROLLED_BACK', 'Indexes removed successfully')
  } catch (error) {
    dbLogger.logError('20260214000001-add-view-indexes DOWN', error)
    throw error
  }
}
