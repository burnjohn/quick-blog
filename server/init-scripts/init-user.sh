#!/bin/bash
# Create application user in MongoDB database
# This script uses environment variables from Docker Compose

echo "Creating database user from environment variables..."

mongosh --eval "
db = db.getSiblingDB('${MONGO_INITDB_DATABASE}');

// Create user with readWrite access
db.createUser({
  user: '${MONGO_INITDB_ROOT_USERNAME}',
  pwd: '${MONGO_INITDB_ROOT_PASSWORD}',
  roles: [
    {
      role: 'readWrite',
      db: '${MONGO_INITDB_DATABASE}'
    }
  ]
});

print('✅ Created user: ${MONGO_INITDB_ROOT_USERNAME} for database: ${MONGO_INITDB_DATABASE}');
"

echo "✅ Database user creation complete"

