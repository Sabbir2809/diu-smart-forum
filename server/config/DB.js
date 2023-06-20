// Dependencies
const mongoose = require('mongoose');

// MongoDB Connection
const connectDB = async (options = {}) => {
  try {
    mongoose.set('strictQuery', false);
    // connect
    await mongoose.connect(process.env.DATABASE, options);
    console.log(`MONGODB CONNECTED SUCCESSFULLY`);
    // event
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB Connection Error: ', error.message);
    });
  } catch (error) {
    console.error('Could Not Connect to MongoDB: ', error.message);
  }
};

// export
module.exports = connectDB;
