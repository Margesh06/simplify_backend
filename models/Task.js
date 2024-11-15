const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['completed', 'pending'], default: 'pending' },
});

module.exports = mongoose.model('Task', taskSchema);
