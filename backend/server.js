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
const userRoutes = require('./routes/users');
const documentRoutes = require('./routes/documents');
const projectsRoutes = require('./routes/projects');
const professionalsRoutes = require('./routes/professionals');
const settingsRoutes = require('./routes/settings');
const adminRoutes = require('./routes/admin');
const subscriptionRoutes = require('./routes/subscriptions');
const testRouter = require('./routes/test');

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

console.log('Configurazione CORS con origine:', FRONTEND_URL);

// Configurazione CORS - DEVE essere prima di qualsiasi altra middleware
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600 // 10 minuti
}));

// Logging middleware per CORS
app.use((req, res, next) => {
    console.log('Richiesta ricevuta:', {
        method: req.method,
        url: req.url,
        origin: req.headers.origin,
        headers: req.headers
    });
    next();
});

// Logging middleware per le risposte
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
        console.log('Headers di risposta:', res.getHeaders());
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
const verificationDir = path.join(uploadDir, 'verification');

[uploadDir, documentsDir, cadDir, verificationDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Directory creata: ${dir}`);
    }
});

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/professionals', professionalsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/test', testRouter);

// Serve i file statici dalla cartella uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Middleware per il webhook di Stripe (deve essere prima del middleware json)
app.use('/api/subscriptions/webhook', express.raw({type: 'application/json'}));

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
  console.log('CORS origin:', FRONTEND_URL);
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
