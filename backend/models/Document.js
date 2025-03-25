const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isCAD: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indice per migliorare le prestazioni delle query
documentSchema.index({ project: 1, type: 1 });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document; 