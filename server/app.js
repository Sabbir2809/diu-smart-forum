// Dependencies
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const doubtRoutes = require('./routes/doubtRoutes');
const AppError = require('./utils/appError');

const tags = [
  'C++',
  'Java',
  'Python',
  'Depth-First-Search',
  'Breadth-First-Search',
  'Linked-List',
  'Two-Pointer',
  'Dynamic Programming',
  'Hashmap',
  'Array',
  'String',
  'Tree',
  'Graph',
  'Bit-Manipulation',
  'Sorting',
  'Trie',
  'Math',
  'Backtracking',
  'Divide and Conquer',
  'Stack',
  'Queue',
  'Matrix',
  'Siding Window',
  'Two Pointers',
  'Prefix Sum',
];

// Middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true }));

// The Most Powerful Image and Video APIs
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }

// All Routes
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/doubts', doubtRoutes);

app.get('/tags', async (req, res) => {
  res.status(200).json(tags);
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
});

// export
module.exports = app;
