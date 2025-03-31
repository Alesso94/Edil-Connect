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
    size: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        default: 'Documento caricato'
    },
    category: {
        type: String,
        default: 'Altro'
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Rimuovi il campo path quando converti in JSON
documentSchema.methods.toJSON = function() {
    const doc = this.toObject();
    delete doc.path; // Non esporre il path del file
    return doc;
};

// Indice per migliorare le prestazioni delle query
documentSchema.index({ project: 1, type: 1 });

module.exports = mongoose.model('Document', documentSchema); 