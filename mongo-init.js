db = db.getSiblingDB('ishahbak');

// Create application user
db.createUser({
  user: 'ishahbak_app',
  pwd: 'app_password123',
  roles: [
    {
      role: 'readWrite',
      db: 'ishahbak'
    }
  ]
});

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'email', 'password'],
      properties: {
        username: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'must be a valid email address and is required'
        },
        password: {
          bsonType: 'string',
          description: 'must be a string and is required'
        }
      }
    }
  }
});

db.createCollection('posts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['author', 'content'],
      properties: {
        author: {
          bsonType: 'objectId',
          description: 'must be an ObjectId and is required'
        },
        content: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        mediaUrl: {
          bsonType: ['string', 'null'],
          description: 'must be a string or null'
        }
      }
    }
  }
});

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.posts.createIndex({ "author": 1 });
db.posts.createIndex({ "createdAt": -1 }); 