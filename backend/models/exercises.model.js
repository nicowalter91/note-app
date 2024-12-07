const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        organisation: { type: String, required: true },
        durchfuehrung: { type: String, required: true },
        coaching: { type: String, required: true },
        variante: { type: String },
        date: { type: Date, default: Date.now },
        imageUrl: { type: String },
        isPinnedExercise: { type: Boolean, default: false },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Exercise", exerciseSchema);
