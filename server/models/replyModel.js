// Dependencies
const mongoose = require('mongoose');

// Forum Post Replay Schema
const replySchema = new mongoose.Schema(
  {
    replyToPost: { type: mongoose.Schema.ObjectId, ref: 'doubt' },

    creator: { type: mongoose.Schema.ObjectId, ref: 'User' },

    reply: { type: String, required: [true, 'Reply cannot be empty'] },

    upVotes: { type: Array, default: [] },

    downVotes: { type: Array, default: [] },

    createdAt: { type: Date, default: Date.now() },
  },

  { timestamps: true, versionKey: false }
);

// Forum Post Replay Model
const Reply = mongoose.model('Reply', replySchema);
// export
module.exports = Reply;
