// create API endpoints

// import express
const express = require('express');

const router = express.Router();

// import controller
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const FilesController = require('../controllers/FilesController');

// define endpoints
router
  .route('/status')
  .get(AppController.getStatus);

router
  .route('/stats')
  .get(AppController.getStats);

router
  .route('/users')
  .post(UsersController.postNew);

router
  .route('/files')
  .post(FilesController.postUpload)

module.exports = router;
