const { db2 } = require("../db"); // Import db2 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,          // Prevent duplicates
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,          // Prevent duplicates
    lowercase: true,       // Convert to lowercase before storing
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  dateJoined: {
    type: Date,
    default: Date.now
  }
});

module.exports = db2.model('User', userSchema);