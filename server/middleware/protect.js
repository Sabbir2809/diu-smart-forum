// Dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// protect
exports.protect = catchAsync(async (req, res, next) => {
  const { headers } = req.body;
  let token;
  if (headers.authorization && headers.authorization.startsWith('Bearer')) {
    token = headers.authorization.split(' ')[1];
  }
  if (!token || token === 'undefined' || token === 'null') {
    return next(new AppError('You are not logged in!! Please log in to get access', 401));
  }

  try {
    //* 2) verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //* 3) check if user is still exist
    const freshUser = await User.findById(decoded.id);

    if (!freshUser) {
      return next(new AppError('The user belonging to this token is not exist', 401));
    }
    req.body.user = freshUser;
    next();
  } catch (err) {
    if (err.message === 'jwt expired') {
      return next(new AppError('Your session is expired!! Please log in again', 401));
    }
  }
});
