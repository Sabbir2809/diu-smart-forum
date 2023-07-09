// Dependencies
const mongoose = require('mongoose');

// Forum Post Schema
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'A post must have a title'], trim: true },

    description: { type: String, required: [true, 'A post must have a description'], trim: true },

    tags: { type: Array, default: [] },

    media: { type: String, required: [true, 'A file is must required to create a post!'], trim: true },

    creator: { type: mongoose.Schema.ObjectId, ref: 'User', required: [true, 'A post must have a creator'] },

    comments: { type: Array, default: [] },

    upVotes: { type: Array, default: [] },

    downVotes: { type: Array, default: [] },

    createdAt: { type: Date, default: Date.now() },
  },

  { timestamps: true, versionKey: false }
);

// Forum Post Model
const Post = mongoose.model('Post', postSchema);
// export
module.exports = Post;
