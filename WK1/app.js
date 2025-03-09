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

/* --------------------------
   View Engine Setup
--------------------------- */
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: false,
    helpers: {
      eq: (a, b) => a === b,
      formatAsDate: (date, format) => {
        if (!date) return "";
        if (!(date instanceof Date) && typeof date !== "string")
          return "";
        if (typeof format !== "string") format = "MM/DD/YYYY";
        return moment(date).local().format(format);
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

/* --------------------------
   Middleware Setup
--------------------------- */
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

/* --------------------------
   Passport and Flash Setup
--------------------------- */
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

/* --------------------------
   Routes
--------------------------- */
app.use("/", require("./routes/auth").router);
app.use("/", require("./routes/employee"));
const registerRoute = require("./routes/register");
app.use("/", registerRoute);

// Example Route
app.get("/nodemon", (req, res) => {
  res.sendStatus(500);
});

/* --------------------------
   Start the Server
--------------------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});



/*
// MongoDB Connection Employee DB
const mongoURI = "mongodb://localhost:27017/Empl";
mongoose.connect(mongoURI);
const db = mongoose.connection;

// MongoDB Connection Employee DB
const mongoURI2 = "mongodb://localhost:27017/User";
mongoose.connect(mongoURI2);
const db2 = mongoose.connection;

// Check Connection
db.on("error", console.error.bind(console, "MongoDB Connection error"));
db.once("open", () => {
  console.log('connected to MongoDB Database: Empl');
});

// Check Connection
db2.on("error", console.error.bind(console, "MongoDB Connection error"));
db2.once("open", () => {
  console.log('connected to MongoDB Database: User');
});

*/