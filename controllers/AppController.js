// api controller
import dbClient from '../utils/db';

const AppController = {
  getStatus: async (req, res) => {
    try {
      const redisStatus = await dbClient.isAlive();
      const dbStatus = await dbClient.isAlive();

      res.status(200).json({
        db: dbStatus,
        redis: redisStatus,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  },

  getStats: async (req, res) => {
    try {
      const users = await dbClient.nbUsers();
      const files = await dbClient.nbFiles();

      res.status(200).json({
        users,
        files,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  },
};

module.exports = AppController;
