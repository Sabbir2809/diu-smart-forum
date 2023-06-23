// Dependencies
const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController');
const { createPost, fetchAll, fetchOptions, vote } = require('./../controllers/postController');

// post router
router.post('/create', protect, createPost);
router.post('/fetch/all', fetchAll);
router.post('/fetch/options', protect, fetchOptions);
router.post('/vote', protect, vote);

// export
module.exports = router;
