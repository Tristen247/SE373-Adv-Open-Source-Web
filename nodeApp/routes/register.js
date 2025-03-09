const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// register 
router.get('/register', (req, res) => {
    res.render('register' , {
        title: 'User Registration'
    });
});

// POST /register
router.post('/register', async (req, res) => {
    try {
      const { username, email, password, password2 } = req.body;
  
      // ========== 1. Basic Validation ========== //
      // Check all required fields
      if (!username || !email || !password || !password2) {
        req.flash('error_msg', 'Please fill in all fields');
        return res.redirect('/register');
      }
  
      // Check password match
      if (password !== password2) {
        req.flash('error_msg', 'Passwords do not match');
        return res.redirect('/register');
      }
  
      // Optional: check password strength
      if (password.length < 6) {
        req.flash('error_msg', 'Password must be at least 6 characters');
        return res.redirect('/register');
      }
  
      // ========== 2. Check if email/username in use ========== //
      // manual check before adding [uniquw = true]
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      if (existingUser) {
        req.flash('error_msg', 'Username or Email already taken');
        return res.redirect('/register');
      }
  
      // ========== 3. Hash the Password ==========
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
  
      // ========== 4. Create the User ==========
      const newUser = new User({
        username,
        email,
        password: hash
      });
  
      await newUser.save();
  
      // Flash a success message and redirect
      req.flash('success_msg', 'Registration successful! You can now log in.');
      res.redirect('/login');
    } catch (err) {
      // ========== 5. Handle Errors ==========
      console.error('Registration error:', err);
      if (err.code === 11000) {
        // This is a duplicate key error from Mongo
        req.flash('error_msg', 'Username or Email already in use');
        return res.redirect('/register');
      }
      req.flash('error_msg', 'Something went wrong. Please try again.');
      res.redirect('/register');
    }
  });
  
  module.exports = router;