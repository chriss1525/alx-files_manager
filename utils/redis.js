/**
 * RedisClient class for creating a Redis client.
 */
import { createClient } from 'redis';

const { promisify } = require('util');

class RedisClient {
  /**
   * Create a client to Redis Database.
   * @returns {RedisClient} A Redis client instance.
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', () => {
      console.log('Error connecting to Redis');
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  isAlive() {
    return this.isClientConnected;
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const value = await getAsync(key);
    return value;
  }

  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }
}

// Create a redisclient instance
const redisClient = new RedisClient();
// export client instance
export default redisClient;
