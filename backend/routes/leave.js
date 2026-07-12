const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

// @route   POST /api/leave/apply
// @desc    Apply for a new leave request
router.post('/apply', async (req, res) => {
    try {
        const { employee, leaveType, startDate, endDate, reason } = req.body;

        // Create a new leave request instance
        const newLeave = new Leave({
            employee, // Expects the MongoDB _id of the employee
            leaveType,
            startDate,
            endDate,
            reason
        });

        const savedLeave = await newLeave.save();
        res.status(201).json({ message: 'Leave request submitted successfully!', savedLeave });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/leave/all
// @desc    Get all leave requests (with employee details populated)
router.get('/all', async (req, res) => {
    try {
        // .populate() pulls in the corresponding employee's name and email details automatically
        const leaves = await Leave.find().populate('employee', ['name', 'email', 'department']);
        res.status(200).json(leaves);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;