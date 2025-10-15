// Migration configuration for migrate-mongo
// https://github.com/seppevs/migrate-mongo
require('dotenv').config()

module.exports = {
  mongodb: {
    url: process.env.MONGODB_URI || 'mongodb://quickblog:quickblog123@localhost:27017/quickblog',
    options: {}
  },

  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'esm',
}
