

/**
 * RedisClient class for creating a Redis client.
 */
const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  /**
   * Create a client to Redis Database.
   * @returns {RedisClient} A Redis client instance.
   */
  constructor() {
    this.client = await redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });

    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
  }

  isAlive() {
    return new Promise((resolve) => {
      this.client.on('connect', () => resolve(true));
      this.client.on('error', () => resolve(false));
    });
  }

  async get(key) {
    return this.getAsync(key);
  }

  async set(key, value, duration) {
    await this.setAsync(key, value, 'EX', duration);
  }
}

// Create a redisclient instance
const redisClient = new RedisClient();
// export client instance
module.exports.redisClient = redisClient;
