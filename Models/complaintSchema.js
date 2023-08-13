const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    userId: String,
});

module.exports = mongoose.model('complaint', complaintSchema);
