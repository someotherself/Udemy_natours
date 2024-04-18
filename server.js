const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

// MongoDB / Mongoose
(async () => {
  try {
    // await mongoose.connect(process.env.DATABASE_LOCAL);
    await mongoose.connect(process.env.DATABASE);
    console.log('DB connection successful');
  } catch (err) {
    console.log(err);
  }
})();

// Server start
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port} in ${app.get('env')} environment`);
});
