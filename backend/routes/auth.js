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
// @route   POST /api/auth/login
// @desc    Authenticate employee & get token (Login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if the employee exists
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 2. Compare plain-text input password with the database hash
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 3. Import jsonwebtoken
        const jwt = require('jsonwebtoken');

        // 4. Create the session payload
        const payload = {
            employee: {
                id: employee.id,
                role: employee.role
            }
        };

        // 5. Sign the token with your .env secret
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }, // Token lasts for 1 day
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    message: "Login successful!", 
                    token, 
                    employee: { name: employee.name, role: employee.role } 
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;