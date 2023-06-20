// Dependencies
const app = require('./app');
const connectDB = require('./config/db');

// MongoDB Connection
connectDB();

// PORT
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
