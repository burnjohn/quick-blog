import dbLogger from '../utils/dbLogger.js'

/**
 * Migration: Add indexes to comments collection
 * Created: 2024-10-14
 */

export async function up(db) {
  try {
    dbLogger.logMigration('20241014000002-add-comment-indexes', 'STARTING', 'Adding indexes to comments collection')

    // Create index for finding comments by blog
    await db.collection('comments').createIndex(
      { blogId: 1 },
      { name: 'comment_blog_index' }
    )

    // Create index for sorting by date
    await db.collection('comments').createIndex(
      { createdAt: -1 },
      { name: 'comment_date_index' }
    )

    // Create compound index for blog and date
    await db.collection('comments').createIndex(
      { blogId: 1, createdAt: -1 },
      { name: 'comment_blog_date_index' }
    )

    dbLogger.logMigration('20241014000002-add-comment-indexes', 'SUCCESS', 'Indexes created successfully')
    console.log('✅ Migration up: Indexes created on comments collection')
  } catch (error) {
    dbLogger.logError('20241014000002-add-comment-indexes UP', error)
    throw error
  }
}

export async function down(db) {
  try {
    dbLogger.logMigration('20241014000002-add-comment-indexes', 'ROLLING_BACK', 'Removing indexes from comments collection')

    await db.collection('comments').dropIndex('comment_blog_index')
    await db.collection('comments').dropIndex('comment_date_index')
    await db.collection('comments').dropIndex('comment_blog_date_index')

    dbLogger.logMigration('20241014000002-add-comment-indexes', 'ROLLED_BACK', 'Indexes removed successfully')
    console.log('✅ Migration down: Indexes removed from comments collection')
  } catch (error) {
    dbLogger.logError('20241014000002-add-comment-indexes DOWN', error)
    throw error
  }
}

