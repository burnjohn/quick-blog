import dbLogger from '../utils/dbLogger.js'

/**
 * Migration: Add indexes to blogs collection
 * Created: 2024-10-14
 */

export async function up(db) {
  try {
    dbLogger.logMigration('20241014000001-add-blog-indexes', 'STARTING', 'Adding indexes to blogs collection')

    // Create text index for search
    await db.collection('blogs').createIndex(
      { title: 'text', description: 'text' },
      { name: 'blog_search_index' }
    )

    // Create index for category filtering
    await db.collection('blogs').createIndex(
      { category: 1 },
      { name: 'blog_category_index' }
    )

    // Create index for sorting by date
    await db.collection('blogs').createIndex(
      { createdAt: -1 },
      { name: 'blog_date_index' }
    )

    // Create compound index for author and date
    await db.collection('blogs').createIndex(
      { author: 1, createdAt: -1 },
      { name: 'blog_author_date_index' }
    )

    dbLogger.logMigration('20241014000001-add-blog-indexes', 'SUCCESS', 'Indexes created successfully')
    console.log('✅ Migration up: Indexes created on blogs collection')
  } catch (error) {
    dbLogger.logError('20241014000001-add-blog-indexes UP', error)
    throw error
  }
}

export async function down(db) {
  try {
    dbLogger.logMigration('20241014000001-add-blog-indexes', 'ROLLING_BACK', 'Removing indexes from blogs collection')

    await db.collection('blogs').dropIndex('blog_search_index')
    await db.collection('blogs').dropIndex('blog_category_index')
    await db.collection('blogs').dropIndex('blog_date_index')
    await db.collection('blogs').dropIndex('blog_author_date_index')

    dbLogger.logMigration('20241014000001-add-blog-indexes', 'ROLLED_BACK', 'Indexes removed successfully')
    console.log('✅ Migration down: Indexes removed from blogs collection')
  } catch (error) {
    dbLogger.logError('20241014000001-add-blog-indexes DOWN', error)
    throw error
  }
}

