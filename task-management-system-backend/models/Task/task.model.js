const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
        required: false,
    }, 
    category: {
        type: String,
        required: [true, 'Category is required'],
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required'],
    },
    status: {
        type: String,
        required: false,
    },
    priority: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: [true, 'Created at is required'],
    },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

