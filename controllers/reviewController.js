const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const Review = require('./../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const allReviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: allReviews.length,
    data: {
      allReviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id; // req.user is from the protect middleware
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newReview
    }
  });
});
