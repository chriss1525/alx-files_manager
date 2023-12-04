// initialising a mongoDb connection

import { MongoClient } from 'mongodb';

class DBClient {
  // constructor
  constructor() {
    // class variables
    this.db = null;
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    // connect to db
    const url = `mongodb://${host}:${port}/`;
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
      }

      this.db = client.db(database);

      // Check if collections exist, and create them if not
      this.createCollectionIfNotExists('users');
      this.createCollectionIfNotExists('files');
    });
  }

  // class functions
  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }

  async findUser(user) {
    return this.db.collection('users').findOne(user);
  }

  async createUser(user) {
    return this.db.collection('users').insertOne(user);
  }
  // Helper function to create a collection if it doesn't exist
  async createCollectionIfNotExists(collectionName) {
    const collections = await this.db.listCollections({ name: collectionName }).toArray();
    if (collections.length === 0) {
      await this.db.createCollection(collectionName);
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
