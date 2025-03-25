const mongoose = require('mongoose');
const Professional = require('./models/Professional');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Connessione a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edilizia_platform')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Elimina i dati esistenti
      await Professional.deleteMany({});
      console.log('Professionisti esistenti eliminati');
      
      // Crea utenti e professionisti di test
      const professionalsData = [
        {
          userEmail: 'architetto@example.com',
          userName: 'Mario Rossi',
          profession: 'Architetto',
          company: 'Studio Architettura Moderna',
          address: 'Via Roma 123, Milano',
          phone: '+39 02 1234567',
          email: 'architetto@example.com',
          licenseNumber: 'ARCH123456',
          education: 'Laurea in Architettura',
          specializations: 'Progettazione residenziale, Ristrutturazioni, Design di interni',
          bio: 'Architetto con 15 anni di esperienza in progettazione residenziale e commerciale.',
          yearsOfExperience: 15
        },
        {
          userEmail: 'ingegnere@example.com',
          userName: 'Laura Bianchi',
          profession: 'Ingegnere Civile',
          company: 'Ingegneria Strutturale Srl',
          address: 'Corso Italia 45, Roma',
          phone: '+39 06 7654321',
          email: 'ingegnere@example.com',
          licenseNumber: 'ING789012',
          education: 'Laurea in Ingegneria Civile',
          specializations: 'Calcoli strutturali, Progettazione antisismica, BIM',
          bio: 'Ingegnere specializzato in progettazione strutturale e analisi sismica.',
          yearsOfExperience: 10
        },
        {
          userEmail: 'geometra@example.com',
          userName: 'Giuseppe Verdi',
          profession: 'Geometra',
          company: 'Studio Tecnico Rossi',
          address: 'Via Verdi 78, Torino',
          phone: '+39 011 9876543',
          email: 'geometra@example.com',
          licenseNumber: 'GEO345678',
          education: 'Diploma di Geometra',
          specializations: 'Catasto, Pratiche edilizie, Rilievi topografici',
          bio: 'Geometra con esperienza in pratiche catastali e amministrative.',
          yearsOfExperience: 8
        }
      ];
      
      for (const data of professionalsData) {
        // Cerca o crea l'utente
        let user = await User.findOne({ email: data.userEmail });
        
        if (!user) {
          user = new User({
            email: data.userEmail,
            password: bcrypt.hashSync('password123', 10),
            name: data.userName,
            role: 'professional',
            profession: data.profession,
            license: data.licenseNumber,
            isVerified: true
          });
          
          await user.save();
          console.log(`Utente ${data.userName} creato`);
        }
        
        // Crea il professionista
        const professional = new Professional({
          user: user._id,
          profession: data.profession,
          company: data.company,
          address: data.address,
          phone: data.phone,
          email: data.email,
          licenseNumber: data.licenseNumber,
          education: data.education,
          specializations: data.specializations,
          bio: data.bio,
          yearsOfExperience: data.yearsOfExperience,
          isVerified: true
        });
        
        await professional.save();
        console.log(`Professionista ${data.profession} inserito`);
      }
      
      console.log('Professionisti di test inseriti nel database');
      
      // Chiudi la connessione
      mongoose.disconnect();
      console.log('Disconnesso da MongoDB');
      
    } catch (error) {
      console.error('Errore durante il seeding:', error);
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  }); 