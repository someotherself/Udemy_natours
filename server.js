const mongoose = require('mongoose');
// const Review = require('./models/reviewModel');
const Tour = require('./models/tourModel');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);

  console.error('Uncaught Exception!');
  server.close(() => {
    process.exit(1);
  });
});
// MongoDB / Mongoose
(async () => {
  try {
    // await mongoose.connect(process.env.DATABASE_LOCAL);
    await mongoose.connect(process.env.DATABASE);
    console.log('DB connection successful');
    // Waits for the indexes to build
    // await Review.init();
    // await Tour.init();
  } catch (err) {
    console.error(err.message);
    server.close(() => {
      process.exit(1);
    });
  }
})();

// Server start
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port} in ${app.get('env')} environment`);
});
