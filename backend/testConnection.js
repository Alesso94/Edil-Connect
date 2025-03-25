const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Alessandro:<PcP8sdhUXRakVxa3>@edilconnect.5om6i.mongodb.net/EdilConnect?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));