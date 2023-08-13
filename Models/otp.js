const mongoose = require("mongoose");
const otpschema = new mongoose.Schema(
  {
    email: String,
    code: String,
    expireIn: Number,
  },
  {
    timestamps: true,
  }
);

let otp = mongoose.model(" otp", otpschema, "otp");
module.exports = otp;
