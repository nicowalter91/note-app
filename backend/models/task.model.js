// Task Model for Trainer Tasks
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    dueDate: { 
        type: Date 
    },
    tags: { 
        type: [String], 
        default: [] 
    },
    isPinned: { 
        type: Boolean, 
        default: false 
    },
    userId: { 
        type: String, 
        required: true 
    },
    assignedTo: [{ 
        type: String 
    }],
    category: {
        type: String,
        enum: ['training', 'match', 'administrative', 'other'],
        default: 'training'
    },
    completedOn: { 
        type: Date 
    },
    createdOn: { 
        type: Date, 
        default: Date.now 
    },
    updatedOn: { 
        type: Date, 
        default: Date.now 
    }
});

// Add text indexes for advanced searching
taskSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Update the updatedOn field whenever a task is modified
taskSchema.pre('save', function(next) {
    this.updatedOn = Date.now();
    next();
});

module.exports = mongoose.model("Task", taskSchema);
