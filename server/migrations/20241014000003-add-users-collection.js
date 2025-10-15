import dbLogger from '../utils/dbLogger.js'

/**
 * Migration: Add users collection with indexes
 * Created: 2024-10-14
 */

export async function up(db) {
  try {
    dbLogger.logMigration('20241014000003-add-users-collection', 'STARTING', 'Creating users collection')

    // Create unique index for email
    await db.collection('users').createIndex(
      { email: 1 },
      { unique: true, name: 'user_email_unique' }
    )

    // Create index for role-based queries
    await db.collection('users').createIndex(
      { role: 1 },
      { name: 'user_role_index' }
    )

    // Create index for active users
    await db.collection('users').createIndex(
      { isActive: 1 },
      { name: 'user_active_index' }
    )

    dbLogger.logMigration('20241014000003-add-users-collection', 'SUCCESS', 'Users collection created with indexes')
    console.log('✅ Migration up: Users collection created')
  } catch (error) {
    dbLogger.logError('20241014000003-add-users-collection UP', error)
    throw error
  }
}

export async function down(db) {
  try {
    dbLogger.logMigration('20241014000003-add-users-collection', 'ROLLING_BACK', 'Removing users indexes')

    await db.collection('users').dropIndex('user_email_unique')
    await db.collection('users').dropIndex('user_role_index')
    await db.collection('users').dropIndex('user_active_index')

    dbLogger.logMigration('20241014000003-add-users-collection', 'ROLLED_BACK', 'Users indexes removed')
    console.log('✅ Migration down: Users indexes removed')
  } catch (error) {
    dbLogger.logError('20241014000003-add-users-collection DOWN', error)
    throw error
  }
}

