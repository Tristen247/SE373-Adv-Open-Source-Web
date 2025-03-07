require("dotenv").config();
const moment = require("moment"); // For date formatting
const express = require('express');
const session = require("express-session");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs = require("express-handlebars");
const path = require('path');
const passport = require("passport");
const flash = require("connect-flash");
const fs = require('fs');
const PORT = 3000;

const app = express();
const router = express.Router();

const Employee = require("./models/employee");  
const { isAuthenticated } = require('./routes/auth'); // Ensure authentication

// View Engine Setup
app.engine('hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: false,
  helpers: {
    eq: (a, b) => a === b,
    formatAsDate: (date, format) => {
      if (!date) return ''; // If no date, return empty string
      if (!(date instanceof Date) && typeof date !== "string") return ''; // Ensure valid date
      if (typeof format !== "string") format = "MM/DD/YYYY"; // Ensure is string format
      return moment(date).local().format(format);
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Body-Parser / URL-Encoded Setup
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Express-Session Middleware (must come before passport session)
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Passport Configuration
require("./config/passport")(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Messaging
app.use(flash());

// Global Variables for Flash Messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Mount Routes AFTER session + flash are configured
app.use("/employees", require("./routes/employee"));
app.use("/", require("./routes/auth").router);
app.use("/", require("./routes/crud"));

// MongoDB Connection
const mongoURI = "mongodb://localhost:27017/Empl";
mongoose.connect(mongoURI);
const db = mongoose.connection;

// Check Connection
db.on("error", console.error.bind(console, "MongoDB Connection error"));
db.once("open", () => {
  console.log('connected to MongoDB Database');
});

// Example Route
app.get("/nodemon", (req, res) => {
  res.sendStatus(500);
});

// Start the Server
app.listen(PORT, () => {
  console.log("Server running on port 3000.");
});
