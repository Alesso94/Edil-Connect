const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Middleware per verificare se l'utente è admin
router.use(auth, admin);

// Middleware per verificare che l'utente sia admin
const adminAuth = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            throw new Error('Accesso non autorizzato');
        }
        next();
    } catch (error) {
        res.status(403).json({ message: 'Accesso negato: richiesti privilegi di amministratore' });
    }
};

// GET /api/admin/verifications - Ottieni tutte le richieste di verifica
router.get('/verifications', auth, adminAuth, async (req, res) => {
    try {
        const users = await User.find({
            'professionalVerification.status': { $in: ['pending', 'rejected'] }
        }).select('name email role professionalVerification createdAt');

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/verifications/:userId - Ottieni dettagli verifica specifico utente
router.get('/verifications/:userId', auth, adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select('name email role professionalVerification contactInfo');
        
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/admin/verifications/:userId/verify/:documentType - Verifica un documento
router.post('/verifications/:userId/verify/:documentType', auth, adminAuth, async (req, res) => {
    try {
        const { userId, documentType } = req.params;
        const { verified, note } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        // Verifica che il documento esista
        if (!user.professionalVerification?.documents?.[documentType]) {
            return res.status(404).json({ message: 'Documento non trovato' });
        }

        // Aggiorna lo stato del documento
        user.professionalVerification.documents[documentType].verified = verified;

        // Aggiungi nota se presente
        if (note) {
            user.professionalVerification.verificationNotes.push({
                note,
                createdBy: req.user._id,
                createdAt: new Date()
            });
        }

        // Controlla se tutti i documenti sono verificati
        const allDocumentsVerified = Object.values(user.professionalVerification.documents)
            .every(doc => doc.verified === true);

        if (allDocumentsVerified) {
            user.professionalVerification.status = 'approved';
            user.professionalVerification.verifiedAt = new Date();
            user.professionalVerification.verifiedBy = req.user._id;
        }

        await user.save();

        res.json({
            message: 'Stato documento aggiornato con successo',
            documentStatus: user.professionalVerification.documents[documentType],
            verificationStatus: user.professionalVerification.status
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/admin/verifications/:userId/reject - Rifiuta la verifica
router.post('/verifications/:userId/reject', auth, adminAuth, async (req, res) => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        user.professionalVerification.status = 'rejected';
        user.professionalVerification.verificationNotes.push({
            note: reason,
            createdBy: req.user._id,
            createdAt: new Date()
        });

        await user.save();

        res.json({
            message: 'Verifica rifiutata con successo',
            status: user.professionalVerification.status
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/admin/verifications/:userId/documents/:documentType - Elimina un documento
router.delete('/verifications/:userId/documents/:documentType', auth, adminAuth, async (req, res) => {
    try {
        const { userId, documentType } = req.params;
        const user = await User.findById(userId);

        if (!user || !user.professionalVerification?.documents?.[documentType]) {
            return res.status(404).json({ message: 'Documento non trovato' });
        }

        // Elimina il file fisico
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '..', user.professionalVerification.documents[documentType].file);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Rimuovi il riferimento dal database
        user.professionalVerification.documents[documentType] = undefined;
        user.professionalVerification.status = 'pending';
        await user.save();

        res.json({ message: 'Documento eliminato con successo' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/admin/stats - Ottieni statistiche generali
router.get('/stats', [auth, admin], async (req, res) => {
    try {
        const stats = {
            totalUsers: await User.countDocuments(),
            totalProfessionals: await User.countDocuments({ role: 'professional' }),
            totalProjects: await Project.countDocuments(),
            pendingVerifications: await User.countDocuments({
                'professionalVerification.status': 'pending'
            })
        };

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email role createdAt');

        res.json({
            stats,
            recentUsers
        });
    } catch (error) {
        console.error('Errore nel recupero delle statistiche:', error);
        res.status(500).json({ error: 'Errore nel recupero delle statistiche' });
    }
});

module.exports = router; 