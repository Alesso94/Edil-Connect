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

// Import Models
const User = require('./models/User');
const Project = require('./models/Project');
const Document = require('./models/Document');

// Import Routes
const usersRoutes = require('./routes/users');
const projectsRoutes = require('./routes/projects');
const documentsRoutes = require('./routes/documents');
const professionalsRoutes = require('./routes/professionals');
const settingsRoutes = require('./routes/settings');

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Gestione errori MongoDB
mongoose.connection.on('error', (err) => {
  console.error('Errore di connessione MongoDB:', err);
  // Non terminiamo il processo, solo logghiamo l'errore
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnesso. Tentativo di riconnessione...');
  setTimeout(() => {
    mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000
    });
  }, 5000);
});

// Connessione a MongoDB con retry
const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000
    });
    console.log('Database connesso con successo');
  } catch (err) {
    console.error('Errore di connessione al database:', err);
    console.log('Tentativo di riconnessione tra 5 secondi...');
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

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
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://cerulean-rabanadas-040413.netlify.app']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  maxAge: 86400 // 24 ore
};

app.use(cors(corsOptions));

// Middleware per verificare la connessione al database
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database non disponibile',
      timestamp: new Date().toISOString()
    });
  }
  next();
});

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

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

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/professionals', professionalsRoutes);
app.use('/api/settings', settingsRoutes);

// Aggiungi alias per le route di autenticazione
app.use('/api/auth', usersRoutes);

// Endpoint base /api
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      users: '/api/users',
      projects: '/api/projects',
      documents: '/api/documents',
      professionals: '/api/professionals',
      settings: '/api/settings',
      health: '/api/health'
    }
  });
});

// Endpoint di test
app.get('/api/health', (req, res) => {
  console.log('Health check richiesto');
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware migliorato
app.use((err, req, res, next) => {
  console.error('Errore non gestito:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Errore interno del server';
  
  res.status(statusCode).json({ 
    message,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// Gestione errori non catturati
process.on('uncaughtException', (err) => {
  console.error('Errore non catturato:', err);
  // Non terminiamo il processo, solo logghiamo l'errore
  // In produzione, potremmo voler inviare una notifica
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejection non gestita:', reason);
  // Non terminiamo il processo, solo logghiamo l'errore
  // In produzione, potremmo voler inviare una notifica
});

// Avvio del server con gestione errori
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
  console.log('Ambiente:', process.env.NODE_ENV || 'development');
  console.log('CORS origins:', corsOptions.origin);
  console.log('MongoDB URI:', MONGODB_URI);
  console.log('JWT Secret:', JWT_SECRET ? 'Presente' : 'Non presente');
});

// Gestione della chiusura del server
const gracefulShutdown = () => {
  console.log('Chiusura del server...');
  server.close(() => {
    console.log('Server chiuso');
    mongoose.connection.close(false, () => {
      console.log('Connessione MongoDB chiusa');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
