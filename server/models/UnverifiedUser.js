// Dependencies
const mongoose = require('mongoose');

// Unverified User Schema
const UnverifiedUserSchema = mongoose.Schema(
  {
    name: { type: String, lowercase: true, unique: true },

    email: { type: String, unique: true, lowercase: true },

    password: { type: String },

    token: { type: String, required: true },
  },

  { timestamps: true, versionKey: false }
);

// Unverified User Model
const UnverifiedUser = mongoose.model('UnverifiedUser', UnverifiedUserSchema);
// export
module.exports = UnverifiedUser;
