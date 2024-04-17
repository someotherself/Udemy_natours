const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Complaint = require('./../../models/complaintModel.js');
dotenv.config({ path: './config.env' });

(async () => {
  try {
    await mongoose.connect(process.env.DATABASE_LOCAL);
    console.log('DB connection successful');
  } catch (err) {
    console.log(err);
  }
})();

// READ JSON FILE
const complaints = JSON.parse(fs.readFileSync(`${__dirname}/complaints.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Complaint.create(complaints);
    console.log('Data succesfully loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL EXISTING DATA FROM DB

const deleteData = async () => {
  try {
    await Complaint.deleteMany();
    console.log('Data succesfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
