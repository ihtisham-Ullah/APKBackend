const mongoose = require("mongoose");

const sendTaskDetailSchema = new mongoose.Schema(
    {

        taskName: String,
        taskStatus: String,
        CompletedTask: String,
        CurrentLocation: String,
        feedback: String,
        image: String,
        userId: String,
        taskId: String
    },
    {
        collection: "TaskDetail",
    }
);
mongoose.model("TaskDetail", sendTaskDetailSchema);  
