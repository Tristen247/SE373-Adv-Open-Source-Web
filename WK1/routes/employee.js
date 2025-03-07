const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const { isAuthenticated } = require('../routes/auth'); // Ensure authentication

// Get all employees
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const employees = await Employee.find().lean();
        res.render('employees/viewEmployee', { employees });
    } catch (err) {
        res.status(500).send('Error retrieving employees: ' + err.message);
    }
});

// Render create employee form
router.get('/create', isAuthenticated, (req, res) => {
    res.render('employees/createEmployee');
});

// Create a new employee
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        await Employee.create(req.body);
        res.redirect('/employees');
    } catch (err) {
        res.status(500).send('Error creating employee: ' + err.message);
    }
});

// Render edit employee form
router.get('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).lean();
        if (!employee) return res.status(404).send('Employee not found');
        res.render('employees/editEmployee', { employee });
    } catch (err) {
        res.status(500).send('Error loading employee: ' + err.message);
    }
});

// Update an employee
router.post('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        await Employee.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/employees');
    } catch (err) {
        res.status(500).send('Error updating employee: ' + err.message);
    }
});

// Delete an employee
router.get('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const deletedEmp = await Employee.findByIdAndDelete(req.params.id).lean();
        if (!deletedEmp) return res.status(404).send('Employee not found');
        res.render('employees/deleteEmployee', { employee: deletedEmp });
    } catch (err) {
        res.status(500).send('Error deleting employee: ' + err.message);
    }
});

module.exports = router;