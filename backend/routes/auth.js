const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// @route   POST /api/auth/register
// @desc    Register a new employee
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, department, role } = req.body;

        // Check if employee already exists
        let employee = await Employee.findOne({ email });
        if (employee) {
            return res.status(400).json({ message: 'Employee already exists with this email' });
        }

        // Create new employee instance
        employee = new Employee({
            name,
            email,
            password, // Note: In a production app, we will hash this later using bcrypt!
            department,
            role
        });

        await employee.save();
        res.status(201).json({ message: 'Employee registered successfully!', employee });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;