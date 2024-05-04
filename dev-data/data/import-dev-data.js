const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel.js');
const User = require('./../../models/userModel.js');
const Review = require('./../../models/reviewModel.js');
dotenv.config({ path: './config.env' });

(async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('DB connection successful');
  } catch (err) {
    console.log(err);
  }
})();

// READ JSON FILE
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// IMPORT TOUR DATA INTO DB
// const importData = async () => {
//   try {
//     await Tour.create(tours);
//     console.log('Data succesfully loaded');
//     process.exit();
//   } catch (err) {
//     console.log(err);
//   }
// };

// IMPORT USER DATA INTO DB
// const importData = async () => {
//   try {
//     await User.create(users, { validateBeforeSave: false });
//     console.log('Data succesfully loaded');
//     process.exit();
//   } catch (err) {
//     console.log(err);
//   }
// };

// IMPORT REVIEW DATA INTO DB
const importData = async () => {
  try {
    await User.create(reviews, { validateBeforeSave: false });
    console.log('Data succesfully loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL TOURS FROM DB
// const deleteData = async () => {
//   try {
//     await tour.deleteMany();
//     console.log('Data succesfully deleted');
//     process.exit();
//   } catch (err) {
//     console.log(err);
//   }
// };

// DELETE ALL USERS FROM DB
// const deleteData = async () => {
//   try {
//     await User.deleteMany();
//     console.log('Data succesfully deleted');
//     process.exit();
//   } catch (err) {
//     console.log(err);
//   }
// };

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
