const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // <-- 1. Import bcrypt
const Employee = require('../models/Employee');

// @route   POST /api/auth/register
// @desc    Register a new employee
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, department, role } = req.body;

        // Check if employee already exists
        let employee = await Employee.findOne({ email });
        if (employee) {
            return res.status(400).json({ message: 'Employee already exists' });
        }

        // Create new employee instance
        employee = new Employee({
            name,
            email,
            password,
            department,
            role
        });

        // 2. Hash the password before saving
        const salt = await bcrypt.genSalt(10); // Generate a secure salt
        employee.password = await bcrypt.hash(password, salt); // Hash it!

        await employee.save();
        res.status(201).json({ message: 'Employee registered successfully!', employee });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;