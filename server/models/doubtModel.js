// Dependencies
const mongoose = require('mongoose');

// Notes Sharing Schema
const doubtSchema = new mongoose.Schema(
  {
    doubtTitle: { type: String, required: [true, 'Doubt cannot be empty'] },

    description: { type: String, required: [true, 'Description cannot be empty'] },

    tags: { type: Array, default: [] },

    media: { type: Array, default: [] },

    creator: { type: mongoose.Schema.ObjectId, ref: 'User' },

    upVotes: { type: Array, default: [] },

    downVotes: { type: Array, default: [] },

    createdAt: { type: Date, default: Date.now() },

    views: { type: Number, default: 0 },
  },

  { timestamps: true, versionKey: false }
);

// Notes Sharing Model
const Doubt = mongoose.model('Doubt', doubtSchema);
// export
module.exports = Doubt;
