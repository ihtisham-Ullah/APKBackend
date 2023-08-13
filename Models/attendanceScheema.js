const mongoose = require('mongoose');

const clockInSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    clockInTime: { type: Date, required: true },
    clockOutTime: { type: Date },
});

const ClockIn = mongoose.model('ClockIn', clockInSchema,);

module.exports = ClockIn;




