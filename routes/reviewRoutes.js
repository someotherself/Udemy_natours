const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authenticationController = require('./../controllers/authenticationController');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authenticationController.protect, authenticationController.restrict('user'), reviewController.createReview);

module.exports = router;
