const Complaint = require('./../models/complaintModel');

// Route handlers
exports.getAllComplaints = async (req, res) => {
  try {
    const allComplaints = await Complaint.find();
    res.status(200).json({
      status: 'success',
      results: allComplaints.length,
      data: {
        allComplaints
      }
    });
  } catch (err) {
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
    req.status(201).json({
      status: 'success',
      data: {
        complaint: newComplaint
      }
    });
  } catch (err) {
    res.status(400).json({
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
      { new: True, runValidators: True }
    );
    res.status(200).json({
      status: 'success',
      data: {
        complaint: updatedComplaint
      }
    });
  } catch (err) {
    console.log(err);
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
    console.log(err);
  }
};
