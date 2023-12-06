// authentication for users
import crypto from 'crypto';
import redisClient from '../utils/redis';

const { v4: uuidv4 } = require('uuid');

const AuthController = {
  getConnect: async (req, res) => {
    try {
      const base64Credentials = req.headers.authorization.replace('Basic ', '');
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
      const [email, password] = credentials.split(':');

      if (!email || !password) {
        return res.status(400).send({ error: 'Missing email or password' });
      }

      const user = JSON.parse(await redisClient.get(email));
      if (!user) {
        return res.status(401).send({ error: 'Unauthorized' });
      }
      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

      if (user.password === hashedPassword) {
        const token = uuidv4();
        const key = `auth_${token}`;

        await redisClient.setex(key, 24 * 60 * 60, JSON.stringify(user));

        return res.status(200).send({ token });
      }
      return res.status(401).send({ error: 'Unauthorized' });
    } catch (error) {
      // handle errors
      console.log(error);
    }
  },

  getDisconnect: async (req, res) => {
    try {
      const token = req.headers['x-token'];
      const user = await redisClient.get(`auth_${token}`);

      if (!user) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      await redisClient.del(`auth_${token}`);

      return res.status(204).send();
    } catch (error) {
      // handle errors
      console.log(error);
    }
  },
};

module.exports = AuthController;