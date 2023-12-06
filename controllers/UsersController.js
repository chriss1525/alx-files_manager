// Users controller
import sha1 from 'sha1';
import dbClient from '../utils/db';

const UsersController = {
  postNew: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res.status(400).send({ error: 'Missing email' });
      }
      if (!password) {
        return res.status(400).send({ error: 'Missing password' });
      }
      const user = await dbClient.findUser({ email });
      if (user) {
        return res.status(400).send({ error: 'Already exist' });
      }
      const securePassword = sha1(password);
      const newUser = await dbClient.createUser({ email, password: securePassword });
      return res.status(201).send(newUser);
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },

  getMe: async (req, res) => {
    try {
      const { userId } = req;
      const user = await dbClient.findUser({ id: userId });
      if (!user) {
        return res.status(401).send({ error: 'Unauthorized' });
      }
      return res.status(200).send({ id: user.id, email: user.email });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};

module.exports = UsersController;
