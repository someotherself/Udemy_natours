const mongoose = require('mongoose');
const Tour = require('./tourModel');

// review / rating / createdAt / ref to tour / ref to user
const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review cannot be empty.'] },
    rating: {
      type: Number,
      required: [true, 'A review must have a rating'],
      min: 1,
      max: 5
    },
    description: {
      type: String,
      default: null
    },
    createdAt: { type: Date, default: Date.now },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.']
    }
  },
  {
    collection: 'reviews',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function(next) {
  // populate is only recommened in small apps
  // this.populate({ path: 'tour', select: 'name' }).populate({ path: 'user', select: 'name photo' });
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  // 'this' points to the current model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5 // Or any default/fallback average rating
    });
  }
};

reviewSchema.post('save', function() {
  // 'this' points to the current review
  this.constructor.calcAverageRatings(this.tour);
});

// Ensures that a user can only create 1 review per tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true, name: 'tour_1_user_1' });

reviewSchema.pre(/^findOneAnd/, async function(next) {
  // This will not work, because it's trying to access a query that was already executed
  // const review = await this.findOne()
  // getQuery() constructs a new query
  this._original = await this.model.findOne(this.getQuery());
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  console.log(this.model.constructor);
  if (this._original) {
    await this._original.constructor.calcAverageRatings(this._original.tour);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
