// Dependencies
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/userModel');
const Post = require('../models/postModel');
const UnverifiedUser = require('../models/UnverifiedUser');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const { createSendToken, signToken, hashPassword } = require('../middleware/createToken');

// signup
exports.signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let verifiedUser = await User.findOne({ name: name });
    if (verifiedUser) {
      res.status(409).json('User already exist with provided username!!');
      return;
    }

    verifiedUser = await User.findOne({ email: email });
    if (verifiedUser) {
      res.status(409).json('User already exist with provided Email!!');
      return;
    }

    let findUser = await UnverifiedUser.findOne({ name: name });
    if (findUser) {
      jwt.verify(findUser.token, name, async (err, data) => {
        if (err) {
          await UnverifiedUser.findOneAndDelete({ name: name });
        } else {
          res.status(409).json('User already exist with provided username!!');
          return;
        }
      });
    }

    findUser = await UnverifiedUser.findOne({ email: email });
    if (findUser) {
      jwt.verify(findUser.token, name, async (err, data) => {
        if (err) {
          await UnverifiedUser.findOneAndDelete({ email: email });
        } else {
          res.status(409).json('A verification mail has already been sent!!');
          return;
        }
      });
    }
    const hashedPassword = await hashPassword(password);
    const token = signToken(name);
    await UnverifiedUser.create({ name: name, email: email, password: hashedPassword, token: token });

    const verificationURL = `${process.env.SERVER_URL}/user/verify?user=${name}&token=${token}`;
    const reportURL = `${process.env.CLIENT_URL}/report`;

    const message = `
    <html>
    <body>
        Hello user,
        <br />
            Thank you for joining with us. Click the below Link to verify your account.
            Please note that the link will work only for 2 hours so kindly verify before it expires.
            <br />
              <a href='${verificationURL}'>Click Here</a>
            <br />
            If this wasn't you please report this activity using below link,
            <br />
              <a href='${reportURL}'>Click Here</a>
            <br />
        Regards,
            DIU SMART FORUM
    </html>
    </body>
    `;

    try {
      await sendEmail({
        email: email,
        subject: 'Verify your account',
        message: message,
      });
      res.status(201).json('Verification mail sent successfully!');
    } catch (err) {
      res.status(500).json('Internal Error while sending mail!');
      return;
    }
  } catch (err) {
    if (err.code == 11000) {
      res.status(409).json('User already exists!');
    } else {
      res.status(500).json('Internal server error! Please try again!!');
    }
  }
});

// login
exports.login = catchAsync(async (req, res) => {
  const { index, password } = req.body;

  let user = await User.findOne({ email: index });
  if (!user) {
    user = await User.findOne({ name: index });
  }

  if (!user) {
    res.status(404).json('User does not exists!!');
    return;
  }

  const isPasswordCorrect = await user.correctPassword(password, user.password);

  if (!isPasswordCorrect) {
    res.status(401).json('Incorrect password!!');
  } else {
    createSendToken(user, 200, res, '9999 years');
    return;
  }
});

// logout
exports.logout = catchAsync(async (req, res) => {
  return res.status(200).json(null);
});

// forget password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).json('User does not exist in the system!');
    return;
  }

  const resetToken = jwt.sign({ name: user.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const resetURL = `${process.env.CLIENT_URL}/new/password?id=${resetToken}/`;
  const reportURL = `${process.env.CLIENT_URL}/report`;

  let message = `Forgot your password ? submit a PATCH request with your new password and password confirm to ${resetURL}`;
  message = `<html>
  <body>
      Hello ${user.name},
      <br />
          We've got an request to reset the password for your account. Click the below Link to reset your password.
          Please note that the link will work only for 2 hours so kindly reset before it expires.
          <br />
            <a href='${resetURL}'>Click Here</a>
          <br />
          If this wasn't you please report this activity using below link,
          <br />
            <a href='${reportURL}'>Click Here</a>
          <br />
      Regards,
      RxChat Team
  </html>
  </body>`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset Your password',
      message: message,
    });
    res.status(200).json('E-mail sent successfully!!');
  } catch (err) {
    res.status(500).json('Internal Error while sending mail!');
    return;
  }
});

// reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    let jwtToken = token.toString();
    jwtToken = jwtToken.substr(0, jwtToken.length - 1);

    jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, data) => {
      let response = 'Password changed successfully!';
      if (err) {
        response = 'Link is expired!!';
        res.status(503).json(`${response}`);
      } else {
        const hashedNewPass = await hashPassword(newPassword);
        await User.findOneAndUpdate({ name: data.name }, { password: hashedNewPass });
        response = 'Password changed successfully!';
        res.status(200).json(`${response}`);
      }
    });
  } catch (err) {
    res.status(503).json('Internal server error!!');
  }
});

// profile
exports.myProfile = catchAsync(async (req, res, next) => {
  res.status(200).json({
    data: req.user,
  });
});

// add to starred
exports.addToStarred = catchAsync(async (req, res) => {
  const { postData, user } = req.body;
  try {
    const likingUser = await User.findById(user._id);

    if (likingUser.favourites.indexOf(postData._id) === -1) likingUser.favourites.push(postData._id);
    else likingUser.favourites.splice(likingUser.favourites.indexOf(postData._id), 1);

    await likingUser.save();
    createSendToken(likingUser, 200, res, '9999 years');
  } catch (err) {
    res.status(500).json('Error occurred while processing! Please try again!');
  }
});

// favourites
exports.favourites = catchAsync(async (req, res) => {
  const { user } = req.body;
  const response = [];

  for (let i = 0; i < user.favourites.length; ++i) {
    const post = await Post.findById(user.favourites[i]);
    const owner = await User.findById(post.creator);
    response.push({ postData: post, ownerInfo: owner });
  }
  response.sort((a, b) => b.postData.createdAt - a.postData.createdAt);
  res.status(200).json(response);
});

// fetch data
exports.fetchData = catchAsync(async (req, res) => {
  const { name, user } = req.body;
  try {
    const _user = await User.findOne({ name: name });
    res.status(200).json(_user);
  } catch (err) {
    res.status(500).json('Error occurred while processing! Please try again!');
  }
});

// update profile
exports.updateProfile = catchAsync(async (req, res) => {
  const { displayName, password, gender, about, githubLink, linkedInLink, technicalSkills, photo, user } =
    req.body;

  try {
    const _user = await User.findById(user._id);

    _user.displayName = displayName;
    if (password.length >= 8) _user.password = await hashPassword(password);
    _user.gender = gender;
    _user.about = about;
    _user.githubLink = githubLink;
    _user.linkedInLink = linkedInLink;
    _user.technicalSkills = technicalSkills;
    _user.photo = photo;

    _user.save();
    createSendToken(_user, 200, res, '9999 years');
  } catch (err) {
    res.status(200).json({ error: err.message });
  }
});
