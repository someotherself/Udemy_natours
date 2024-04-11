const Complaint = require('./../models/complaintModel');

// Route handlers

exports.aliasOpenComplaint = async (req, res, next) => {
  req.query.sort = '-complaintValue';
  req.query.dateClosed = { $eq: null };
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1. Filtering
    const queryObj = { ...this.queryString };
    // All the params used for filtering, sorting, limiting need to be included here
    const excludeFields = ['sort', 'fields', 'page', 'limit'];
    excludeFields.forEach(el => {
      delete queryObj[el];
    });
    // 2. Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('NCR');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    if (this.queryString.page && this.queryString.limit) {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = page - 1 + limit;
      this.query = this.query.skip(skip).limit(limit);
    }
    return this;
  }
}

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
// I want to add aliasing to my rest api (mongoose). I would like to add this filter to it
// exports.aliasOpenComplaint = async (req, res, next) => {
//   req.query.sort = 'NCR';
//   nrxt();
// };
