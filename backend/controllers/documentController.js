const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
    try {
        console.log('Richiesta documenti da utente:', req.user._id);
        const documents = await Document.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        console.log('Documenti trovati:', documents.length);
        res.json(documents);
    } catch (error) {
        console.error('Errore nel recupero dei documenti:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload a document
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res) => {
    try {
        console.log('Upload richiesto da utente:', req.user._id);
        
        if (!req.file) {
            return res.status(400).json({ message: 'Nessun file caricato' });
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Utente non autenticato' });
        }

        const document = new Document({
            name: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimeType: req.file.mimetype,
            user: req.user._id,
            description: req.body.description || 'Documento caricato',
            category: req.body.category || 'Altro'
        });

        await document.save();
        console.log('Documento salvato:', document);
        res.status(201).json(document);
    } catch (error) {
        // Elimina il file in caso di errore
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Errore nel caricamento del documento:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
    try {
        console.log('Richiesta eliminazione documento:', req.params.id);
        const document = await Document.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!document) {
            return res.status(404).json({ message: 'Documento non trovato' });
        }

        // Elimina il file fisico
        if (fs.existsSync(document.path)) {
            fs.unlinkSync(document.path);
        }

        await document.deleteOne();
        console.log('Documento eliminato con successo');
        res.json({ message: 'Documento eliminato con successo' });
    } catch (error) {
        console.error('Errore nella cancellazione del documento:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDocuments,
    uploadDocument,
    deleteDocument
}; 