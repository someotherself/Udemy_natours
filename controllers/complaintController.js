const Complaint = require('./../models/complaintModel');

// Route handlers
exports.getAllComplaints = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ['Description', 'complaintValue', 'creditValue'];
    excludeFields.forEach(el => {
      delete queryObj[el];
    });
    const queryAllComplaints = Complaint.find(queryObj);
    const allComplaints = await queryAllComplaints;
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
      return res
        .status(400)
        .json({ status: 'failed', message: 'The NCR number already exists.' });
    }
    res.status(500).json({
      status: 'fail',
      message: 'Invalid data sent!'
    });
  }
};
exports.updateComplaint = async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
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
