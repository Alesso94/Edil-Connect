require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// URI di connessione a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edilizia_platform';

console.log('Connecting to MongoDB at:', MONGODB_URI);

// Connessione al database
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    createTestUser();
  }).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Funzione per creare un utente di test direttamente nel database
async function createTestUser() {
  try {
    console.log('Creating test user...');
    // Creiamo manualmente un utente nel database
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Usa direttamente il database anziché il modello
    const deleteResult = await mongoose.connection.db.collection('users').deleteOne({ email: 'admin@edilconnect.it' });
    console.log('Delete result:', deleteResult);
    
    // Inserisci un nuovo utente
    const newUser = {
      name: 'Admin',
      email: 'admin@edilconnect.it',
      password: hashedPassword,
      profession: 'Architetto',
      role: 'admin',
      isAdmin: true,
      isVerified: true,
      tokens: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const insertResult = await mongoose.connection.db.collection('users').insertOne(newUser);
    console.log('Insert result:', insertResult);
    
    // Verifica che l'utente sia stato creato
    const checkUser = await mongoose.connection.db.collection('users').findOne({ email: 'admin@edilconnect.it' });
    console.log('User created:', checkUser ? 'Yes' : 'No');
    if (checkUser) {
      console.log('User details:', {
        name: checkUser.name,
        email: checkUser.email,
        isAdmin: checkUser.isAdmin,
        isVerified: checkUser.isVerified
      });
    }
    
    console.log('Test user created successfully and verified directly in database');
    process.exit(0);
  } catch (err) {
    console.error('Error creating test user:', err);
    process.exit(1);
  }
} 