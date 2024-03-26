const fs = require("fs");
const complaints = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/complaints.json`));

exports.checkID = (req, res, next, val) => {
  console.log(`Complaint id is: ${val}`);
  if (req.params.id * 1 > complaints.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.NCR) {
    return res.status(400).json({
      status: "Fail",
      message: "Missing NCR number",
    });
  }
  next();
};

// Route handlers
exports.getAllComplaints = (req, res) => {
  console.log(req.reqestTime);
  res.status(200).json({
    status: "success",
    result: complaints.length,
    data: {
      complaints: complaints,
    },
  });
};
exports.getComplaint = (req, res) => {
  const id = req.params.id * 1;
  const complaint = complaints[id - 1];
  res.status(200).json({
    status: "success",
    complaint,
  });
};
exports.createComplaint = (req, res) => {
  const newId = complaints[complaints.length - 1].id + 1;
  const newComplaint = Object.assign({ id: newId }, req.body);

  complaints.push(newComplaint);
  fs.writeFile(`${__dirname}/dev-data/data/complaints.json`, JSON.stringify(complaints), (err) => {
    res.status(201).json({
      staus: "success",
      data: {
        tour: newComplaint,
      },
    });
  });
  res.set("Done");
};
exports.updateComplaint = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      complaint: "<Updates complaint here...>",
    },
  });
};
exports.deleteComplaint = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
