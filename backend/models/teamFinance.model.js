const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Schema für Mannschaftskasse-Einträge
const teamFinanceSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    amount: { type: Number, required: true },
    type: { 
        type: String, 
        required: true, 
        enum: ['income', 'expense'],
        default: 'expense'
    },
    category: { 
        type: String, 
        required: true,
        enum: [
            'equipment', 
            'travel', 
            'tournament', 
            'training', 
            'maintenance', 
            'fees', 
            'sponsorship',
            'donations',
            'fundraising',
            'other'
        ]
    },
    date: { type: Date, required: true, default: Date.now },
    receipt: {
        filename: { type: String, required: false },
        originalName: { type: String, required: false },
        mimetype: { type: String, required: false },
        size: { type: Number, required: false },
        uploadDate: { type: Date, default: Date.now }
    },
    userId: { type: String, required: true },
    teamId: { type: String, required: false }, // Falls später Teams implementiert werden
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now }
});

// Index für bessere Performance
teamFinanceSchema.index({ userId: 1, date: -1 });
teamFinanceSchema.index({ type: 1, category: 1 });

module.exports = mongoose.model("TeamFinance", teamFinanceSchema);
