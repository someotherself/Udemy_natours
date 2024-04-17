const Complaint = require('./../models/complaintModel');
const APIFeatures = require('./../utils/apiFeatures');
// Route handlers

exports.aliasOpenComplaint = async (req, res, next) => {
  req.query.sort = '-complaintValue';
  req.query.dateClosed = { $eq: null };
  next();
};
exports.getAllComplaints = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'Fail',
      message: 'Error'
    });
  }
};
exports.getComplaint = async (req, res) => {
  try {
    const singleComplaint = await Complaint.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: { singleComplaint }
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'Fail',
      message: 'Error'
    });
  }
};
exports.createComplaint = async (req, res) => {
  try {
    const newComplaint = await Complaint.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        complaint: newComplaint
      }
    });
  } catch (err) {
    if ((err.code = 11000)) {
      return res.status(400).json({ status: 'failed', message: 'The NCR number already exists.' });
    }
    res.status(500).json({
      status: 'fail',
      message: 'Invalid data sent!'
    });
  }
};
exports.updateComplaint = async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        complaint: updatedComplaint
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed'
    });
  }
};
exports.deleteComplaint = async (req, res) => {
  await Complaint.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null
  });
  try {
  } catch (err) {
    res.status(400).json({
      status: 'failed'
    });
  }
};
exports.getComplaintStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'failed'
    });
  }
};
exports.getMonthlyStats = async (req, res) => {
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
  try {
  } catch (err) {
    res.status(400).json({
      status: 'failed'
    });
  }
};
