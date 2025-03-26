require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const mongoose = require('mongoose');
const axios = require('axios');

// Import Models
const User = require('./models/User');
const Project = require('./models/Project');
const Document = require('./models/Document');
const projectRoutes = require('./routes/projects');
const authRoutes = require('./routes/users');
const documentRoutes = require('./routes/documents');
const usersRoutes = require('./routes/users');
const projectsRoutes = require('./routes/projects');
const documentsRoutes = require('./routes/documents');
const professionalsRoutes = require('./routes/professionals');
const settingsRoutes = require('./routes/settings');

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

// Connessione a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Database connesso con successo');
  })
  .catch(err => {
    console.error('Errore di connessione al database:', err);
    process.exit(1); // Termina il server se la connessione fallisce
  });

// Crea le cartelle necessarie se non esistono
const uploadDir = path.join(__dirname, 'uploads');
const documentsDir = path.join(uploadDir, 'documents');
const cadDir = path.join(uploadDir, 'cad');

[uploadDir, documentsDir, cadDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Directory creata: ${dir}`);
    }
});

// Configurazione CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3003', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Configurazione storage per i file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = req.params.type || 'documents';
        const dir = path.join(__dirname, 'uploads', type);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/professionals', professionalsRoutes);
app.use('/api/settings', settingsRoutes);

// Avvio del server
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Gestione della chiusura del server
process.on('SIGTERM', () => {
  console.log('SIGTERM ricevuto. Chiusura del server...');
  server.close(() => {
    console.log('Server chiuso');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT ricevuto. Chiusura del server...');
  server.close(() => {
    console.log('Server chiuso');
    process.exit(0);
  });
});
