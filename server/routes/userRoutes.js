// Dependencies
const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  protect,
  logout,
  verifyAccount,
  forgotPassword,
  resetPassword,
  addToStarred,
  favourites,
  fetchData,
  updateProfile,
} = require('./../controllers/authController');

// router router
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/verify', verifyAccount);
router.post('/new/password', forgotPassword);
router.post('/reset/password', resetPassword);
router.post('/add/starred', protect, addToStarred);
router.post('/fetch/favourites', protect, favourites);
router.post('/fetch/data', protect, fetchData);
router.post('/update/profile', protect, updateProfile);

// export
module.exports = router;
