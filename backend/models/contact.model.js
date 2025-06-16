const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    organization: {
        type: String,
        trim: true,
        default: ""
    },
    position: {
        type: String,
        trim: true,
        default: ""
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: ""
    },
    phone: {
        type: String,
        trim: true,
        default: ""
    },
    mobile: {
        type: String,
        trim: true,
        default: ""
    },
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        country: { type: String, default: "" }
    },
    category: {
        type: String,
        enum: ["Vereine", "Schiedsrichter", "Verbände", "Sponsoren", "Medien", "Sonstige"],
        default: "Sonstige"
    },
    notes: {
        type: String,
        default: ""
    },
    tags: [{
        type: String,
        trim: true
    }],
    isPinned: {
        type: Boolean,
        default: false
    },
    lastContactDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index für bessere Suchperformance
contactSchema.index({ userId: 1, name: 1 });
contactSchema.index({ userId: 1, category: 1 });
contactSchema.index({ userId: 1, organization: 1 });

module.exports = mongoose.model("Contact", contactSchema);
