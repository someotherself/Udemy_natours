const fs = require('fs');
const Complaint = require('./../models/complaintModel');

// Route handlers
exports.getAllComplaints = (req, res) => {
  console.log(req.reqestTime);
  res.status(200).json({
    status: 'success'
  });
};

exports.getComplaint = (req, res) => {};

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
exports.updateComplaint = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      complaint: '<Updates complaint here...>'
    }
  });
};
exports.deleteComplaint = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
