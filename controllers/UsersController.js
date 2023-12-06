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

      // Modify the structure of newUser before sending in the response
      const formattedUser = {
        id: newUser.insertedId,
        email: newUser.ops[0].email,
      };

      return res.status(201).send(formattedUser);
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};

module.exports = UsersController;
