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
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
      if (err) console.log(err);
      this.db = db.db(database);
      this.db.createCollection('users');
      this.db.createCollection('files');
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
}

const dbClient = new DBClient();
dbClient.client = new MongoClient(dbClient.url, { useUnifiedTopology: true });
export default dbClient;
