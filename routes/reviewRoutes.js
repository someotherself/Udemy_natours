const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authenticationController = require('./../controllers/authenticationController');

// mergeParams gives the tourRouter access to the tourId param
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authenticationController.protect,
    authenticationController.restrict('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authenticationController.protect,
    authenticationController.restrict('admin'),
    reviewController.deleteReview
  )
  .patch(
    authenticationController.protect,
    authenticationController.restrict('admin'),
    reviewController.updateReview
  );

module.exports = router;
