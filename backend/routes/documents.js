const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const professionalAuth = require('../middleware/professionalAuth');

// Configurazione di multer per l'upload dei file
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const projectId = req.params.projectId;
    const dir = `./uploads/${projectId}`;
    
    // Crea la cartella del progetto se non esiste
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    // Genera un nome file unico con timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Filtro per i tipi di file consentiti
const fileFilter = (req, file, cb) => {
  // Accetta solo PDF, immagini, documenti Office e CAD
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.dwg',
    'application/vnd.dxf',
    'application/acad'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo di file non supportato'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite di 10MB
  }
});

// Rotta per caricare un documento per un progetto specifico
router.post('/:projectId/upload', professionalAuth, upload.single('file'), async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    // Verifica che il progetto esista
    const project = await Project.findById(projectId);
    if (!project) {
      // Elimina il file se il progetto non esiste
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: "Progetto non trovato" });
    }
    
    // Verifica che l'utente sia il proprietario o un collaboratore
    if (project.owner.toString() !== req.user._id.toString() && 
        !project.collaborators.includes(req.user._id)) {
      // Elimina il file se l'utente non è autorizzato
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({ message: "Non autorizzato" });
    }
    
    // Crea il documento nel database
    const document = new Document({
      name: req.file.filename,
      type: 'document',
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
      project: projectId,
      uploadedBy: req.user._id,
      description: req.body.description || '',
      category: req.body.category || 'Altro'
    });
    
    await document.save();
    
    // Popola i dati dell'utente che ha caricato il documento
    await document.populate('uploadedBy', 'name email');
    
    res.status(201).json(document);
  } catch (error) {
    // Elimina il file in caso di errore
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
});

// Rotta per ottenere tutti i documenti di un progetto
router.get('/:projectId', professionalAuth, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    // Verifica che il progetto esista
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Progetto non trovato" });
    }
    
    // Verifica che l'utente sia il proprietario o un collaboratore
    if (project.owner.toString() !== req.user._id.toString() && 
        !project.collaborators.includes(req.user._id)) {
      return res.status(403).json({ message: "Non autorizzato" });
    }
    
    // Ottieni tutti i documenti del progetto
    const documents = await Document.find({ project: projectId })
                                   .populate('uploadedBy', 'name email')
                                   .sort({ createdAt: -1 });
    
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rotta per scaricare un documento
router.get('/:projectId/download/:documentId', professionalAuth, async (req, res) => {
  try {
    const { projectId, documentId } = req.params;
    
    // Verifica che il documento esista
    const document = await Document.findById(documentId);
    if (!document || document.project.toString() !== projectId) {
      return res.status(404).json({ message: "Documento non trovato" });
    }
    
    // Verifica che il progetto esista
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Progetto non trovato" });
    }
    
    // Verifica che l'utente sia il proprietario o un collaboratore
    if (project.owner.toString() !== req.user._id.toString() && 
        !project.collaborators.includes(req.user._id)) {
      return res.status(403).json({ message: "Non autorizzato" });
    }
    
    // Invia il file
    res.download(document.path, document.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rotta per eliminare un documento
router.delete('/:projectId/document/:documentId', professionalAuth, async (req, res) => {
  try {
    const { projectId, documentId } = req.params;
    
    // Verifica che il documento esista
    const document = await Document.findById(documentId);
    if (!document || document.project.toString() !== projectId) {
      return res.status(404).json({ message: "Documento non trovato" });
    }
    
    // Verifica che il progetto esista
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Progetto non trovato" });
    }
    
    // Verifica che l'utente sia il proprietario o un collaboratore
    if (project.owner.toString() !== req.user._id.toString() && 
        !project.collaborators.includes(req.user._id)) {
      return res.status(403).json({ message: "Non autorizzato" });
    }
    
    // Elimina il file dal filesystem
    if (fs.existsSync(document.path)) {
      fs.unlinkSync(document.path);
    }
    
    // Elimina il documento dal database
    await Document.findByIdAndDelete(documentId);
    
    res.json({ message: "Documento eliminato con successo" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rotta per verificare se l'utente è un professionista
router.get('/check-professional', auth, async (req, res) => {
  try {
    // Verifica se l'utente è un professionista
    const professional = await Professional.findOne({ user: req.user._id });
    
    if (!professional) {
      return res.json({ 
        isProfessional: false,
        message: 'L\'utente non è un professionista registrato'
      });
    }
    
    res.json({ 
      isProfessional: true,
      professional: {
        id: professional._id,
        name: req.user.name,
        email: req.user.email,
        profession: professional.profession,
        specializations: professional.specializations
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 