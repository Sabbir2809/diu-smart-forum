// Dependencies
const express = require('express');
const router = express.Router();
const { createPost, fetchAll, fetchOptions, vote } = require('./../controllers/postController');
const { protect } = require('../middleware/protect');

// post router
router.post('/create', protect, createPost);
router.post('/fetch/all', fetchAll);
router.post('/fetch/options', protect, fetchOptions);
router.post('/vote', protect, vote);

// export
module.exports = router;
