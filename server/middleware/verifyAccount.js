// Dependencies
const jwt = require('jsonwebtoken');
const UnverifiedUser = require('../models/UnverifiedUser');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

// verify account
exports.verifyAccount = catchAsync(async (req, res) => {
  const token = req.query.token;
  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
      let response = {};
      if (err) {
        response.isError = true;
        response.message = 'Verification link is expired!!';
        response.status = 403;
      } else {
        const user = await UnverifiedUser.findOne({ name: data.id });
        if (!user) {
          res.send('Account is already verified!');
          return;
          // res.redirect(`http://localhost:3000/response?status=100`);
          // return;
        }
        await UnverifiedUser.findOneAndDelete({ name: data.id });
        await User.create({
          name: user.name,
          displayName: user.name,
          photo: process.env.DEFAULT_PROFILE_PIC,
          email: user.email,
          password: user.password,
        });

        response.isError = false;
        response.message =
          'Your Account is Verified Successfully :) Please wait you will automatically be redirected to login page';
        response.status = 201;
      }
      res.redirect(
        `http://localhost:3000/response?message=${response.message}&navigate=${true}&error=${false}`
      );
    });
  } catch (err) {
    res.redirect(`http://localhost:3000/response?status=503`);
  }
});
