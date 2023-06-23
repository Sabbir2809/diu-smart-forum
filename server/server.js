// Dependencies
const app = require('./app');
const { connectDB } = require('./config/connectDB');
require('dotenv').config();

// PORT
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  // MongoDB Connection
  connectDB();
});
