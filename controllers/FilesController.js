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

  getShow: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req;

      // Find the file document
      const file = await dbClient.files.findOne({ _id: id });

      if (!file) {
        return res.status(404).send({ error: 'File not found' });
      }

      if (file.isPublic !== true && file.userId !== userId) {
        return res.status(404).send({ error: 'File not found' });
      }

      const storage = process.env.FOLDER_PATH || '/tmp/files_manager';
      const filePath = `${storage}/${file._id}`;

      // Read the file data from disk
      const fileData = await fs.readFile(filePath);

      // Convert the file data to a base64 string
      const fileData64 = fileData.toString('base64');

      // Create the response
      const response = {
        ...file,
        data: fileData64,
      };

      return res.status(200).send(response);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: error.message });
    }
  },

  getIndex: async (req, res) => {
    try {
      const { parentId } = req.query;
      const { userId } = req;

      // Find the file documents
      const query = parentId ? { parentId } : { userId };
      const files = await dbClient.files.find(query).toArray();

      // Create the response
      const response = files.map((file) => {
        const { _id, name, type, isPublic } = file;
        return { id: _id, name, type, isPublic };
      });

      return res.status(200).send(response);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: error.message });
    }
  },
};

module.exports = FilesController;
