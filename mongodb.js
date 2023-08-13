const mongoose = require("mongoose");

const mongodb = async () => {
  try {
    await mongoose.connect(process.env.mongoUrl);
    console.log("Connect to MongoDB successfully");
  } catch (error) {
    console.log("Connect failed " + error.message);
  }
};

module.exports = mongodb;
