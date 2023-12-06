// files controller
import dbClient from '../utils/db';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import mimeTypes from 'mime-types';

const FilesController = {
  postUpload: async (req, res) => {
    try {
      const { name, type, parentId, isPublic, data } = req.body;
      const { userId } = req;

      // Create a new file document
      const file = {
        _id: uuidv4(),
        name,
        type,
        parentId,
        isPublic,
        userId,
      };

      // Insert the file document into the collection
      const result = await dbClient.files.insertOne(file);

      if (result.insertedCount !== 1) {
        throw new Error('Failed to insert file into the database.');
      }

      const storage = process.env.FOLDER_PATH || '/tmp/files_manager';
      const filePath = `${storage}/${file._id}`;
      const fileData = Buffer.from(data, 'base64');

      // Write the file data to disk
      await fs.writeFile(filePath, fileData);

      return res.status(201).send(file);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: error.message });
    }
  },
};

module.exports = FilesController;
