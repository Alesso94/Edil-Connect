const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['In Corso', 'Completato', 'In Attesa', 'Cancellato', 'In Pianificazione']
    },
    category: {
        type: String,
        required: true,
        enum: ['Ristrutturazione', 'Costruzione', 'Impianti', 'Design Interni', 'Manutenzione', 'Altro']
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    tasks: [taskSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indice per migliorare le prestazioni delle query
projectSchema.index({ user: 1, status: 1 });
projectSchema.index({ title: 'text', description: 'text' }); // Per la ricerca testuale

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 