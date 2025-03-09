const { db1 } = require("../db"); // Import db1
const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  department: String,
  startDate: Date,
  jobTitle: String,
  salary: Number,
});

module.exports = db1.model("Employee", EmployeeSchema, "employee");


/*

//**Need to move after model folder implementation**
// Define the schema
const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  department: String,
  startDate: Date,
  jobTitle: String,
  salary: Number,
});
const Employee = mongoose.model('Employee', employeeSchema, "employee");

*/