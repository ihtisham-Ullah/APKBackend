const mongoose = require("mongoose");
const userDetailSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
  },
  {
    collection: "Userinfo",
  }
);

mongoose.model("Userinfo", userDetailSchema);
