const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Professional = require('./models/Professional');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// Route di test
app.get('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

// Route per ottenere tutti i professionisti
app.get('/api/professionals', async (req, res) => {
  try {
    const professionals = await Professional.find()
      .populate('user', 'name email')
      .select('-__v');
    
    res.json(professionals);
  } catch (error) {
    console.error('Errore nel recupero dei professionisti:', error);
    res.status(500).json({ message: 'Errore del server', error: error.message });
  }
});

// Connessione a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edilizia_platform')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Test server running on port ${port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err)); 