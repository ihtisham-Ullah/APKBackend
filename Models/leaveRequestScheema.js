const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    startDate: Date,
    endDate: Date,
    reason: String,
        // status: String
   
});

const LeaveRequest = mongoose.model('LeaveRequest', employeeSchema);

module.exports = LeaveRequest;
