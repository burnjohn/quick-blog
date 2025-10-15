// Migration configuration for migrate-mongo
// https://github.com/seppevs/migrate-mongo

module.exports = {
  mongodb: {
    url: 'mongodb://admin:admin123@localhost:27017/quickblog?authSource=admin',
    options: {}
  },

  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'esm',
}
