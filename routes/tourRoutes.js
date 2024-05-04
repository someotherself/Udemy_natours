const express = require('express');
const tourController = require('./../controllers/tourController');
const authenticationController = require('./../controllers/authenticationController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

// router
//   .route('/:tourId/reviews')
//   .post(authenticationController.protect, authenticationController.restrict('user'), reviewController.createReview);

router.use('/:tourId/reviews', reviewRouter);
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
router.use(authenticationController.protect);
router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(authenticationController.restrict('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);
router.route('/tours-within/:distance/center/:latlng/:unit').get(tourController.getToursWithin);
router.route('/distances/:latlng/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authenticationController.restrict('admin', 'lead-guide'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authenticationController.restrict('admin', 'lead-guide'), tourController.updateTour)
  .delete(authenticationController.restrict('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;
