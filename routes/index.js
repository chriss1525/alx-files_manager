// create API endpoints

// import express
let express = require('express');
const router = express.Router();

// import controller
const AppController = require('../controllers/AppController');

// define endpoints
router
  .route('/status')
  .get(AppController.getStatus)

router
  .route('/stats')
  .get(AppController.getStats)

module.exports = router;

