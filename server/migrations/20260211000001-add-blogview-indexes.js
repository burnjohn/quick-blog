import dbLogger from '../utils/dbLogger.js'

/**
 * Migration: Add indexes to blogviews collection
 * Created: 2026-02-11
 */

export async function up(db) {
  try {
    dbLogger.logMigration('20260211000001-add-blogview-indexes', 'STARTING', 'Adding indexes to blogviews collection')

    await db.collection('blogviews').createIndex(
      { blog: 1, visitorKey: 1, viewedAt: 1 },
      { name: 'blogview_blog_visitor_date_index' }
    )

    await db.collection('blogviews').createIndex(
      { blog: 1, viewedAt: 1 },
      { name: 'blogview_blog_date_index' }
    )

    await db.collection('blogviews').createIndex(
      { viewedAt: 1 },
      { name: 'blogview_date_index' }
    )

    dbLogger.logMigration('20260211000001-add-blogview-indexes', 'SUCCESS', 'Indexes created successfully')
    console.info('✅ Migration up: Indexes created on blogviews collection')
  } catch (error) {
    dbLogger.logError('20260211000001-add-blogview-indexes UP', error)
    throw error
  }
}

export async function down(db) {
  try {
    dbLogger.logMigration('20260211000001-add-blogview-indexes', 'ROLLING_BACK', 'Removing indexes from blogviews collection')

    await db.collection('blogviews').dropIndex('blogview_blog_visitor_date_index')
    await db.collection('blogviews').dropIndex('blogview_blog_date_index')
    await db.collection('blogviews').dropIndex('blogview_date_index')

    dbLogger.logMigration('20260211000001-add-blogview-indexes', 'ROLLED_BACK', 'Indexes removed successfully')
    console.info('✅ Migration down: Indexes removed from blogviews collection')
  } catch (error) {
    dbLogger.logError('20260211000001-add-blogview-indexes DOWN', error)
    throw error
  }
}
