const express = require('express');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// Dati di esempio nel formato corretto
const mockProfessionals = [
  {
    _id: '1',
    profession: 'Ingegnere Civile',
    specializations: 'Progettazione strutturale, Calcoli sismici, BIM',
    company: 'Studio Tecnico Rossi',
    address: 'Roma, RM',
    yearsOfExperience: 15,
    email: 'mario.rossi@example.com',
    phone: '123-456-7890',
    licenseNumber: 'ING-12345',
    education: 'Laurea in Ingegneria Civile, Politecnico di Milano',
    bio: 'Ingegnere civile con 15 anni di esperienza nella progettazione strutturale e calcoli sismici. Specializzato in BIM e progetti di edilizia residenziale e commerciale.',
    createdAt: '2023-01-15T10:30:00.000Z'
  },
  {
    _id: '2',
    profession: 'Architetto',
    specializations: 'Design sostenibile, Ristrutturazioni, Interior design',
    company: 'Bianchi Architettura',
    address: 'Milano, MI',
    yearsOfExperience: 12,
    email: 'laura.bianchi@example.com',
    phone: '098-765-4321',
    licenseNumber: 'ARCH-54321',
    education: 'Laurea in Architettura, Università La Sapienza di Roma',
    bio: 'Architetto con passione per il design sostenibile e le ristrutturazioni. Esperienza in progetti residenziali e commerciali con focus su efficienza energetica e materiali eco-sostenibili.',
    createdAt: '2023-03-22T14:45:00.000Z'
  },
  {
    _id: '3',
    profession: 'Geometra',
    specializations: 'Rilievi topografici, Catasto, Pratiche edilizie',
    company: 'Studio Verdi',
    address: 'Napoli, NA',
    yearsOfExperience: 8,
    email: 'giuseppe.verdi@example.com',
    phone: '555-123-4567',
    licenseNumber: 'GEO-98765',
    education: 'Diploma di Geometra, Istituto Tecnico per Geometri',
    bio: 'Geometra specializzato in rilievi topografici e pratiche catastali. Esperienza nella gestione di pratiche edilizie e consulenza tecnica per compravendite immobiliari.',
    createdAt: '2023-05-10T09:15:00.000Z'
  }
];

// Dati di esempio per i preventivi
const mockQuotes = [
  {
    _id: '101',
    userId: 'user123',
    professionalId: '1',
    title: 'Ristrutturazione bagno',
    description: 'Ristrutturazione completa di un bagno di 6mq con sostituzione sanitari, piastrelle e impianti.',
    budget: '5000-8000',
    location: 'Roma, RM',
    timeline: 'Entro 3 mesi',
    attachments: ['bagno_attuale.jpg'],
    status: 'pending',
    createdAt: '2023-06-15T10:30:00.000Z',
    responses: []
  },
  {
    _id: '102',
    userId: 'user456',
    professionalId: '2',
    title: 'Progetto casa unifamiliare',
    description: 'Progettazione di una casa unifamiliare di circa 120mq su due livelli con giardino.',
    budget: '15000-20000',
    location: 'Milano, MI',
    timeline: 'Entro 6 mesi',
    attachments: ['terreno.jpg', 'requisiti.pdf'],
    status: 'in_progress',
    createdAt: '2023-07-20T14:45:00.000Z',
    responses: [
      {
        professionalId: '2',
        amount: 18500,
        description: 'Progettazione completa con rendering 3D e pratiche comunali incluse.',
        estimatedTime: '4 mesi',
        createdAt: '2023-07-25T09:30:00.000Z'
      }
    ]
  }
];

// Route di test
app.get('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

// Route per ottenere tutti i professionisti
app.get('/api/professionals', (req, res) => {
  res.json(mockProfessionals);
});

// Route per ottenere un singolo professionista per ID
app.get('/api/professionals/:id', (req, res) => {
  const { id } = req.params;
  const professional = mockProfessionals.find(p => p._id === id);
  
  if (!professional) {
    return res.status(404).json({ message: 'Professionista non trovato' });
  }
  
  res.json(professional);
});

// NUOVE ROUTE PER I PREVENTIVI

// Ottieni tutti i preventivi (con filtri opzionali)
app.get('/api/quotes', (req, res) => {
  const { userId, professionalId, status } = req.query;
  
  let filteredQuotes = [...mockQuotes];
  
  if (userId) {
    filteredQuotes = filteredQuotes.filter(q => q.userId === userId);
  }
  
  if (professionalId) {
    filteredQuotes = filteredQuotes.filter(q => q.professionalId === professionalId);
  }
  
  if (status) {
    filteredQuotes = filteredQuotes.filter(q => q.status === status);
  }
  
  res.json(filteredQuotes);
});

// Ottieni un singolo preventivo per ID
app.get('/api/quotes/:id', (req, res) => {
  const { id } = req.params;
  const quote = mockQuotes.find(q => q._id === id);
  
  if (!quote) {
    return res.status(404).json({ message: 'Preventivo non trovato' });
  }
  
  res.json(quote);
});

// Crea un nuovo preventivo
app.post('/api/quotes', (req, res) => {
  const newQuote = {
    _id: `${Date.now()}`,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString(),
    responses: []
  };
  
  mockQuotes.push(newQuote);
  res.status(201).json(newQuote);
});

// Aggiorna un preventivo esistente
app.put('/api/quotes/:id', (req, res) => {
  const { id } = req.params;
  const quoteIndex = mockQuotes.findIndex(q => q._id === id);
  
  if (quoteIndex === -1) {
    return res.status(404).json({ message: 'Preventivo non trovato' });
  }
  
  mockQuotes[quoteIndex] = {
    ...mockQuotes[quoteIndex],
    ...req.body,
    _id: id // Assicuriamo che l'ID non venga modificato
  };
  
  res.json(mockQuotes[quoteIndex]);
});

// Aggiungi una risposta a un preventivo
app.post('/api/quotes/:id/responses', (req, res) => {
  const { id } = req.params;
  const quoteIndex = mockQuotes.findIndex(q => q._id === id);
  
  if (quoteIndex === -1) {
    return res.status(404).json({ message: 'Preventivo non trovato' });
  }
  
  const newResponse = {
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  mockQuotes[quoteIndex].responses.push(newResponse);
  mockQuotes[quoteIndex].status = 'in_progress';
  
  res.status(201).json(mockQuotes[quoteIndex]);
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server di test semplificato in esecuzione sulla porta ${port}`);
  console.log('Endpoint disponibili:');
  console.log('- GET /test');
  console.log('- GET /api/professionals');
  console.log('- GET /api/professionals/:id');
  console.log('- GET /api/quotes');
  console.log('- GET /api/quotes/:id');
  console.log('- POST /api/quotes');
  console.log('- PUT /api/quotes/:id');
  console.log('- POST /api/quotes/:id/responses');
}); 