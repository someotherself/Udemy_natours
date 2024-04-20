const mongoose = require('mongoose');

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
