const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const professionalAuth = require('../middleware/professionalAuth');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const {
    upload: documentControllerUpload,
    getDocuments,
    uploadDocument,
    deleteDocument
} = require('../controllers/documentController');

// Assicurati che la directory uploads esista
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurazione di multer per il caricamento dei file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const originalName = path.parse(file.originalname).name;
        const extension = path.extname(file.originalname);
        cb(null, `${originalName}_${timestamp}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo di file non supportato'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

// Middleware per gestire errori di upload
const handleUploadError = (err, req, res, next) => {
    console.error('Errore upload:', err);
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ message: 'Il file è troppo grande. Dimensione massima: 10MB' });
        }
    }
    return res.status(400).json({ message: err.message });
};

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

// Configurazione storage per i documenti di verifica
const verificationStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.user._id;
        const userDir = path.join(__dirname, '../uploads/verification', userId.toString());
        
        // Crea la directory se non esiste
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        cb(null, userDir);
    },
    filename: function (req, file, cb) {
        // Genera un nome file sicuro con timestamp
        const timestamp = Date.now();
        const safeFileName = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        cb(null, safeFileName);
    }
});

// Configurazione upload
const verificationUpload = multer({
    storage: verificationStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limite
    },
    fileFilter: function (req, file, cb) {
        // Verifica tipo file
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Tipo file non supportato. Usa PDF, JPEG o PNG'));
        }
        cb(null, true);
    }
});

// Middleware per gestire errori upload
const handleVerificationUpload = (req, res, next) => {
    const uploadSingle = verificationUpload.single('document');
    
    uploadSingle(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File troppo grande. Massimo 5MB.' });
            }
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

// Upload documento di verifica
router.post('/upload/:documentType', auth, handleVerificationUpload, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nessun file caricato' });
        }

        const allowedDocumentTypes = [
            'identityDocument',
            'professionalLicense',
            'criminalRecord',
            'businessRegistration',
            'vatDocument'
        ];

        const { documentType } = req.params;
        if (!allowedDocumentTypes.includes(documentType)) {
            fs.unlinkSync(req.file.path); // Elimina il file se il tipo non è valido
            return res.status(400).json({ error: 'Tipo documento non valido' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ error: 'Utente non trovato' });
        }

        // Inizializza professionalVerification se non esiste
        if (!user.professionalVerification) {
            user.professionalVerification = {
                status: 'pending',
                documents: {}
            };
        }

        // Aggiorna il documento
        const relativePath = path.relative(
            path.join(__dirname, '..'),
            req.file.path
        ).replace(/\\/g, '/');
        
        user.professionalVerification.documents[documentType] = {
            file: relativePath,
            verified: false,
            uploadDate: new Date()
        };

        // Se è una licenza professionale o registrazione, aggiungi i campi extra
        if (req.body.number && documentType === 'professionalLicense') {
            user.professionalVerification.documents.professionalLicense.number = req.body.number;
        }
        if (req.body.expiryDate && documentType === 'professionalLicense') {
            user.professionalVerification.documents.professionalLicense.expiryDate = new Date(req.body.expiryDate);
        }
        if (req.body.registrationNumber && documentType === 'businessRegistration') {
            user.professionalVerification.documents.businessRegistration.registrationNumber = req.body.registrationNumber;
        }
        if (req.body.issueDate && documentType === 'criminalRecord') {
            user.professionalVerification.documents.criminalRecord.issueDate = new Date(req.body.issueDate);
        }

        await user.save();

        res.status(200).json({
            message: 'Documento caricato con successo',
            document: user.professionalVerification.documents[documentType]
        });

    } catch (error) {
        // Se c'è un errore, elimina il file caricato
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: error.message });
    }
});

// Ottieni stato verifica documenti
router.get('/verification-status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }

        res.status(200).json({
            status: user.professionalVerification?.status || 'pending',
            documents: user.professionalVerification?.documents || {}
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Elimina documento
router.delete('/document/:documentType', auth, async (req, res) => {
    try {
        const { documentType } = req.params;
        const user = await User.findById(req.user._id);

        if (!user || !user.professionalVerification?.documents?.[documentType]) {
            return res.status(404).json({ error: 'Documento non trovato' });
        }

        const filePath = path.join(__dirname, '..', user.professionalVerification.documents[documentType].file);
        
        // Elimina il file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Rimuovi il riferimento dal database
        user.professionalVerification.documents[documentType] = undefined;
        await user.save();

        res.status(200).json({ message: 'Documento eliminato con successo' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Routes
router.get('/', protect, getDocuments);
router.post('/upload', protect, upload.single('file'), uploadDocument);
router.delete('/:id', protect, deleteDocument);

// Routes per i documenti generali
router.get('/', protect, async (req, res) => {
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
});

router.post('/upload', protect, upload.single('file'), async (req, res) => {
    try {
        console.log('Upload richiesto da utente:', req.user._id);
        if (!req.file) {
            return res.status(400).json({ message: 'Nessun file caricato' });
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
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Errore nel caricamento del documento:', error);
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        console.log('Richiesta eliminazione documento:', req.params.id);
        const document = await Document.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!document) {
            return res.status(404).json({ message: 'Documento non trovato' });
        }

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
});

// Routes per i documenti dei progetti
router.get('/project/:projectId', protect, async (req, res) => {
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

router.post('/project/:projectId/upload', protect, upload.single('file'), async (req, res) => {
    try {
        const projectId = req.params.projectId;
        
        // Verifica che il progetto esista
        const project = await Project.findById(projectId);
        if (!project) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ message: "Progetto non trovato" });
        }
        
        // Verifica che l'utente sia il proprietario o un collaboratore
        if (project.owner.toString() !== req.user._id.toString() && 
            !project.collaborators.includes(req.user._id)) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(403).json({ message: "Non autorizzato" });
        }
        
        const document = new Document({
            name: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            mimeType: req.file.mimetype,
            project: projectId,
            user: req.user._id,
            description: req.body.description || '',
            category: req.body.category || 'Altro'
        });
        
        await document.save();
        res.status(201).json(document);
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 