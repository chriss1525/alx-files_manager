// initialising a mongoDb connection

import { MongoClient } from 'mongodb';

class DBClient {
  // constructor
  constructor() {
    // connection url
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.url = `mongodb://${this.host}:${this.port}`;
  }

  // class functions
  isAlive() {
    if (this.client.isConnected()) {
      return true;
    }
    return false;
  }

  async nbUsers() {
    const users = await this.client.db(this.database).collection('users').countDocuments();
    return users;
  }

  async nbFiles() {
    const files = await this.client.db(this.database).collection('files').countDocuments();
    return files;
  }
}

const dbClient = new DBClient();
dbClient.client = new MongoClient(dbClient.url, { useUnifiedTopology: true });
export default dbClient;
