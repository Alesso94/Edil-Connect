const express = require('express');
const router = express.Router();
const Professional = require('../models/Professional');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Registrazione come professionista
router.post('/register', auth, async (req, res) => {
  try {
    // Verifica se l'utente è già registrato come professionista
    const existingProfessional = await Professional.findOne({ user: req.user.id });
    if (existingProfessional) {
      return res.status(400).json({ message: 'Sei già registrato come professionista' });
    }

    // Crea un nuovo professionista
    const professional = new Professional({
      user: req.user.id,
      profession: req.body.profession,
      company: req.body.company,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      licenseNumber: req.body.licenseNumber,
      education: req.body.education,
      specializations: req.body.specializations,
      bio: req.body.bio,
      yearsOfExperience: req.body.yearsOfExperience
    });

    await professional.save();

    res.status(201).json({
      message: 'Registrazione come professionista completata con successo',
      professional
    });
  } catch (error) {
    console.error('Errore nella registrazione del professionista:', error);
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
});

// Verifica se l'utente è un professionista
router.get('/check', auth, async (req, res) => {
  try {
    const professional = await Professional.findOne({ user: req.user.id });
    if (!professional) {
      return res.status(404).json({ 
        isProfessional: false,
        message: 'Non sei registrato come professionista' 
      });
    }

    res.json({
      isProfessional: true,
      isVerified: professional.isVerified,
      professional
    });
  } catch (error) {
    console.error('Errore nella verifica del professionista:', error);
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
});

// Ottieni tutti i professionisti (accessibile a tutti)
router.get('/', async (req, res) => {
  try {
    const professionals = await Professional.find({ isVerified: true })
      .populate('user', 'name email')
      .select('-__v');
    
    res.json(professionals);
  } catch (error) {
    console.error('Errore nel recupero dei professionisti:', error);
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
});

// Ottieni un professionista specifico per ID (accessibile a tutti)
router.get('/:id', async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id)
      .populate('user', 'name email')
      .select('-__v');
    
    if (!professional) {
      return res.status(404).json({ message: 'Professionista non trovato' });
    }

    res.json(professional);
  } catch (error) {
    console.error('Errore nel recupero del professionista:', error);
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
});

// Aggiorna il profilo del professionista (solo il professionista stesso)
router.put('/profile', auth, async (req, res) => {
  try {
    let professional = await Professional.findOne({ user: req.user.id });
    if (!professional) {
      return res.status(404).json({ message: 'Profilo professionista non trovato' });
    }

    // Campi che possono essere aggiornati
    const updateFields = [
      'profession', 'company', 'address', 'phone', 'email',
      'licenseNumber', 'education', 'specializations', 'bio', 'yearsOfExperience'
    ];

    // Aggiorna solo i campi forniti
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        professional[field] = req.body[field];
      }
    });

    professional.updatedAt = Date.now();
    await professional.save();

    res.json({
      message: 'Profilo professionista aggiornato con successo',
      professional
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento del profilo:', error);
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
});

// Verifica un professionista (solo admin)
router.put('/:id/verify', auth, adminAuth, async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return res.status(404).json({ message: 'Professionista non trovato' });
    }

    if (professional.isVerified) {
      return res.status(400).json({ message: 'Professionista già verificato' });
    }

    professional.isVerified = true;
    professional.verificationDate = Date.now();
    await professional.save();

    res.json({
      message: 'Professionista verificato con successo',
      professional
    });
  } catch (error) {
    console.error('Errore nella verifica del professionista:', error);
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
});

// Ottieni tutti i professionisti in attesa di verifica (solo admin)
router.get('/admin/pending', auth, adminAuth, async (req, res) => {
  try {
    const pendingProfessionals = await Professional.find({ isVerified: false })
      .populate('user', 'name email')
      .select('-__v');
    
    res.json(pendingProfessionals);
  } catch (error) {
    console.error('Errore nel recupero dei professionisti in attesa:', error);
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
});

// Cerca professionisti per specializzazione
router.get('/search/specialization', async (req, res) => {
  try {
    const { specialization } = req.query;
    if (!specialization) {
      return res.status(400).json({ message: 'Parametro di ricerca mancante' });
    }

    const professionals = await Professional.find({
      specializations: { $regex: specialization, $options: 'i' },
      isVerified: true
    }).populate('user', 'name email');

    res.json(professionals);
  } catch (error) {
    console.error('Errore nella ricerca dei professionisti:', error);
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
});

// Elimina un professionista (solo admin o il professionista stesso)
router.delete('/:id', auth, async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return res.status(404).json({ message: 'Professionista non trovato' });
    }

    // Verifica che l'utente sia il proprietario del profilo o un admin
    const user = await User.findById(req.user.id);
    if (professional.user.toString() !== req.user.id && !user.isAdmin) {
      return res.status(403).json({ message: 'Non autorizzato' });
    }

    await Professional.findByIdAndDelete(req.params.id);
    res.json({ message: 'Profilo professionista eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione del professionista:', error);
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
});

module.exports = router; 