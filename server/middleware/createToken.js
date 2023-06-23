// Dependencies
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// has password
const hashPassword = async (pass) => {
  pass = await bcrypt.hash(pass, 10);
  return pass;
};

// sign token
const signToken = (id, expiryTime) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expiryTime === undefined ? process.env.JWT_EXPIRES_IN : expiryTime,
  });
};

// create token
const createSendToken = (user, statusCode, res, expiryTime) => {
  const token = signToken(user._id, expiryTime);

  const cookieOptions = {
    expires: new Date(Date.now() + 5 * 24 * 3600000),
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    token: token,
    data: user,
  });
};

module.exports = {
  createSendToken,
  signToken,
  hashPassword,
};
