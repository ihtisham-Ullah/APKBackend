const mongoose = require("mongoose");

const targetedLocationSchema=new mongoose.Schema({
    location:String,
    lat:String,
    long:String,
})

const taskDetailSchema = new mongoose.Schema(
    {
        taskName: String,
        taskDescription: String,
        startDate: String,
        endDate: String,
        taskPriority: String,
        taskType: String,
        targetLocation: targetedLocationSchema,
        salespersonId: String,
    },
    {
        collection: "CreateTask",
    }
);
mongoose.model("CreateTask", taskDetailSchema);