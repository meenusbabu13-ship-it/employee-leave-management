const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // <-- 1. Import bcrypt
const Employee = require('../models/Employee');

// @route   POST /api/auth/register
// @desc    Register a new employee
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, department, role } = req.body;

        if (!name || !email || !password || !department || !role) {
            return res.status(400).json({ message: 'Please provide name, email, password, department, and role' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        let employee = await Employee.findOne({ email: normalizedEmail });
        if (employee) {
            return res.status(400).json({ message: 'Employee already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        employee = new Employee({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            department: department.trim(),
            role: role.trim()
        });

        await employee.save();
        res.status(201).json({ message: 'Employee registered successfully!', employee });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate employee & get token (Login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        const employee = await Employee.findOne({ email: normalizedEmail });
        if (!employee) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const jwt = require('jsonwebtoken');

        const payload = {
            employee: {
                id: employee.id,
                role: employee.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    message: 'Login successful!', 
                    token, 
                    employee: { name: employee.name, role: employee.role, email: employee.email } 
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;