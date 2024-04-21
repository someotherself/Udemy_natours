const Complaint = require('./../models/complaintModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

// Route handlers
exports.aliasOpenComplaint = async (req, res, next) => {
  req.query.sort = '-complaintValue';
  req.query.dateClosed = { $eq: null };
  next();
};
exports.getAllComplaints = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Complaint.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const allComplaints = await features.query;
  res.status(200).json({
    status: 'success',
    results: allComplaints.length,
    data: {
      allComplaints
    }
  });
});
exports.getComplaint = catchAsync(async (req, res, next) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'Success',
    data: { complaint }
  });
});
exports.createComplaint = catchAsync(async (req, res, next) => {
  const newComplaint = await Complaint.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      complaint: newComplaint
    }
  });
});
exports.updateComplaint = catchAsync(async (req, res, next) => {
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    // Very important setting
    runValidators: true
  });
  if (!complaint) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      complaint: complaint
    }
  });
});
exports.deleteComplaint = catchAsync(async (req, res, next) => {
  const complaint = await Complaint.findByIdAndDelete(req.params.id);
  if (!complaint) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
exports.getComplaintStats = catchAsync(async (req, res, next) => {
  const stats = await Complaint.aggregate([
    {
      $match: {
        complaintValue: { $gte: 5 }
      }
    },
    {
      $group: {
        _id: { $toUpper: '$gasketType' },
        numComplaints: { $sum: 1 },
        totalComplaintValue: { $sum: '$complaintValue' },
        avgComplaintValue: { $avg: '$complaintValue' },
        maxComplaintValue: { $max: '$complaintValue' }
      }
    },
    {
      $sort: {
        avgComplaintValue: 1
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
exports.getMonthlyStats = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const stats = await Complaint.aggregate([
    {
      $match: {
        dateOpened: {
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lte: new Date(`${year}-12-31T23:59:59.999Z`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$dateOpened' },
        sumComplaints: { $sum: 1 },
        // Pushes all the items into an array.
        tours: { $push: '$Customer' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    // {
    //   $limit: 2
    // },
    {
      // '0' hides fields, '1' shows them.
      $project: {
        _id: 0
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});
