const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add an employee name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email address'],
        unique: true, // Prevents duplicate registrations
        match: [/.+\@.+\..+/, 'Please add a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['Employee', 'Admin'],
        default: 'Employee'
    },
    department: {
        type: String,
        required: [true, 'Please specify a department']
    }
}, {
    timestamps: true // Automatically tracks "createdAt" and "updatedAt"
});

module.exports = mongoose.model('Employee', EmployeeSchema);