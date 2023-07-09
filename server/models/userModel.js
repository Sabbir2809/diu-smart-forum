// Dependencies
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Users Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'user must have a name'] },
    displayName: { type: String, default: '' },
    email: {
      type: String,
      required: [true, 'user must provide an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'please provide a valid email'],
    },
    password: { type: String, required: [true, 'Please provide a password'] },
    role: { type: String, enum: ['user', 'expert', 'admin'], default: 'user' },
    posts: { type: mongoose.Schema.ObjectId, ref: 'Post' },
    photo: { type: String, default: process.env.DEFAULT_PROFILE_PIC },
    gender: { type: String, default: 'male' },
    about: { type: String, default: '' },
    favourites: { type: Array, default: [] },
    githubLink: { type: 'String', default: '' },
    linkedInLink: { type: String, default: '' },
    technicalSkills: { type: Array, default: [] },
    reputation: { type: Number, default: 0 },
    repliesCount: { type: Number, default: 0 },
    materialCount: { type: Number, default: 0 },
    doubtsCount: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

// Password Validation
userSchema.methods.correctPassword = async (candidatePassword, userPassword) =>
  await bcrypt.compare(candidatePassword, userPassword);

// Users Model
const User = mongoose.model('User', userSchema);
// export
module.exports = User;
