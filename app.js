const fs = require("fs");
const express = require("express");
const { dirname } = require("path");

const app = express();
const port = 3000;

const complaints = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/complaints.json`));

// Route handler
app.get("/api/v1/complaints", (req, res) => {
  res.status(200).json({
    status: "success",
    result: complaints.length,
    data: {
      complaints: complaints,
    },
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
