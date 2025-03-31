const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Da fare', 'In corso', 'Completata'],
        default: 'Da fare'
    },
    priority: {
        type: String,
        enum: ['Bassa', 'Media', 'Alta'],
        default: 'Media'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    location: {
        type: String
    },
    estimatedCost: {
        type: Number
    },
    status: {
        type: String,
        enum: ['Non iniziato', 'In corso', 'Completato', 'In pausa'],
        default: 'In corso'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tasks: [taskSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware pre-save per aggiornare updatedAt
projectSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Indice per migliorare le prestazioni delle query
projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ collaborators: 1 });
projectSchema.index({ name: 'text', description: 'text' }); // Per la ricerca testuale

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 