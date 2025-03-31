require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

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

// Funzione per creare un utente di test
async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Elimina l'utente esistente se presente
    await User.deleteOne({ email: 'aless.pan79@gmail.com' });
    
    // Crea un nuovo utente usando il modello
    const newUser = new User({
      name: 'Alessandro Panetti',
      email: 'aless.pan79@gmail.com',
      password: 'password123',
      role: 'admin',
      isAdmin: true,
      isVerified: true,
      contactInfo: {
        phone: '+39 1234567890',
        address: 'Via Roma 123',
        city: 'Roma',
        province: 'RM',
        postalCode: '00100'
      },
      professionalInfo: {
        profession: 'Sviluppatore',
        licenseNumber: 'N/A',
        professionalOrder: 'N/A',
        orderRegistrationDate: new Date()
      }
    });
    
    await newUser.save();
    
    // Verifica che l'utente sia stato creato
    const checkUser = await User.findOne({ email: 'aless.pan79@gmail.com' });
    if (checkUser) {
      console.log('User created successfully:', {
        name: checkUser.name,
        email: checkUser.email,
        isAdmin: checkUser.isAdmin,
        isVerified: checkUser.isVerified
      });
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error creating test user:', err);
    process.exit(1);
  }
} 