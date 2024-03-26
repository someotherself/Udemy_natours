const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

// Server start
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port} in ${app.get('env')} environment`);
});
