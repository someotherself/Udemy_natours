const express = require('express');
const tourController = require('./../controllers/tourController');
const authenticationController = require('./../controllers/authenticationController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router();

// router.param('id', tourController.checkID);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authenticationController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authenticationController.protect,
    authenticationController.restrict('admin', 'lead-guide'),
    tourController.deleteTour
  );

router
  .route('/:tourId/reviews')
  .post(authenticationController.protect, authenticationController.restrict('user'), reviewController.createReview);

module.exports = router;
