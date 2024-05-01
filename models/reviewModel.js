const mongoose = require('mongoose');

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
    tour: { type: mongoose.Schema.ObjectId, ref: 'Tour', required: [true, 'Review must belong to a tour.'] },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: [true, 'Review must belong to a user.'] }
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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
