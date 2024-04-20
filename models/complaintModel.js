const mongoose = require('mongoose');
const slugify = require('slugify');

const complaintSchema = new mongoose.Schema(
  {
    NCR: {
      type: Number,
      required: [true, 'NCR number is required'],
      unique: true,
      min: [1, 'NCR number must have at least 1 digit'],
      max: [1000, 'NCR number is too high']
    },
    slug: String,
    Customer: { type: String, required: [true, 'A record must have a customer name'] },
    orderNo: { type: Array, required: false },
    replacementOrder: { type: String, default: null },
    invoiceNo: { type: Array, default: null },
    complaintValue: { type: Number, default: null },
    creditValue: { type: Number, default: null },
    Description: { type: String, default: null },
    raisedBy: { type: String, required: true, maxlength: [2, 'Too many characters. Please enter a valid name'] },
    dateOpened: {
      type: Date,
      required: true
    },
    dateClosed: {
      type: Date,
      default: null
      // Example only. This kind of validation only works for new data (not updates).
      // validate: {
      //   validator: function(val) {
      //     if (val === null) return true;
      //     // Needs to return true or false only.
      //     return new Date(val) > new Date(this.get('dateOpened'));
      //   },
      //   message: 'Closing date must be after the opening date.'
      // }
    },
    gasketType: { type: String, required: false },
    originCode: { type: String, required: false },
    rootCauseCode: { type: String, required: false },
    supplier: { type: String, required: false },
    accept: { type: Boolean, default: true },
    draftComplaint: {
      type: Boolean,
      default: false
    }
  },
  { collection: 'Test1', toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

complaintSchema.virtual('daysOpen').get(function() {
  if (this.dateClosed !== null) return;
  const today = new Date();
  const dateOpened = new Date(this.dateOpened);
  const differenceMiliseconds = today - dateOpened;
  return Math.floor(differenceMiliseconds / (1000 * 60 * 60 * 24));
});

// Document middleware; runs before .save() and .create(); But not .insertMany(), .findByIdAndUpdate
// This is also called a pre-save hook
// Multiple pre or post document middleware can be used
complaintSchema.pre('save', function(next) {
  this.slug = slugify(this.NCR.toString(), { lowercase: true });
  next();
});

// complaintSchema.post('save', function(doc, next) {
//   next();
// });

// Query middleware
// A regex can be used to filter for more hooks (find, findOne etc)
// 'this' is now an query object
// Hides the records which are drafts
// Looks for not equal to true, in case records are missing the field
complaintSchema.pre(/^find/, function(next) {
  this.find({ draftComplaint: { $ne: true } });
  this.start = Date.now();
  next();
});

// Aggregation middleware
complaintSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { draftComplaint: { $ne: true } } });
  next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
