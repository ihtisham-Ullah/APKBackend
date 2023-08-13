const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        salespersonId: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        cloudinary_id: {
            type: String,
            required: true,
        },

    },

    {
        collection: "Media",
    }
);

mongoose.model("Media", MediaSchema);