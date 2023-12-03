// create API endpoints

// import express
let express = require('express');
const router = express.Router();

// import controller
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');

// define endpoints
router
  .route('/status')
  .get(AppController.getStatus)

router
  .route('/stats')
  .get(AppController.getStats)

router
  .route('/users')
  .post(UsersController.postNew)


module.exports = router;

