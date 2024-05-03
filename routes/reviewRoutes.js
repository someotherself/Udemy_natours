const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authenticationController = require('./../controllers/authenticationController');

// mergeParams gives the tourRouter access to the tourId param
const router = express.Router({ mergeParams: true });

router.use(authenticationController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authenticationController.restrict('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authenticationController.restrict('user', 'admin'),
    reviewController.deleteReview
  )
  .patch(
    authenticationController.restrict('user', 'admin'),
    reviewController.updateReview
  );

module.exports = router;
