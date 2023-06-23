// Dependencies
const express = require('express');
const router = express.Router();
const {
  createDoubt,
  deleteDoubt,
  fetchAll,
  fetchSingleDoubt,
  vote,
  voteToReply,
  sortReplies,
  addReply,
} = require('../controllers/doubtController');
const { protect } = require('../middleware/protect');

// doubt router
router.post('/create', protect, createDoubt);
router.post('/delete', protect, deleteDoubt);
router.get('/fetch/all', fetchAll);
router.post('/fetch/doubt', fetchSingleDoubt);
router.post('/vote', protect, vote);
router.post('/vote/reply', protect, voteToReply);
router.post('/sort/reply', sortReplies);
router.post('/create/reply', protect, addReply);

// export
module.exports = router;
