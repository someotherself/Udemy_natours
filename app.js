const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();
const port = 3000;

const complaints = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/complaints.json`));

// Middleware
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  req.reqestTime = new Date().toISOString();
  next();
});

// Route handlers
const getAllComplaints = (req, res) => {
  console.log(req.reqestTime);
  res.status(200).json({
    status: "success",
    result: complaints.length,
    data: {
      complaints: complaints,
    },
  });
};
const getComplaint = (req, res) => {
  const id = req.params.id * 1;
  const complaint = complaints[id - 1];
  res.status(200).json({
    status: "success",
    complaint,
  });
};
const createComplaint = (req, res) => {
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
const updateComplaint = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      complaint: "<Updates complaint here...>",
    },
  });
};
const deleteComplaint = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};

// Routes
app.route("/api/v1/complaints").get(getAllComplaints).post(createComplaint);
app.route("/api/v1/complaints/:id").get(getComplaint).patch(updateComplaint).delete(deleteComplaint);

// Server start
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
