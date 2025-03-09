const mongoose = require("mongoose");

// Employee DB Connection
const mongoURI1 = "mongodb://localhost:27017/Empl";
const db1 = mongoose.createConnection(mongoURI1, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
db1.on("error", (err) =>
  console.error("Employee DB Connection Error:", err)
);
db1.once("open", () =>
  console.log("Connected to Employee DB")
);

// User DB Connection
const mongoURI2 = "mongodb://localhost:27017/User";
const db2 = mongoose.createConnection(mongoURI2, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
db2.on("error", (err) =>
  console.error("User DB Connection Error:", err)
);
db2.once("open", () =>
  console.log("Connected to User DB")
);

module.exports = { db1, db2 };
