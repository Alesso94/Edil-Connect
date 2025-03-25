const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    profession: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Inserisci un indirizzo email valido']
    },
    licenseNumber: {
        type: String,
        required: true,
        trim: true
    },
    education: {
        type: String,
        required: true,
        trim: true
    },
    specializations: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        required: true,
        trim: true
    },
    yearsOfExperience: {
        type: Number,
        required: true,
        min: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indice per migliorare le prestazioni delle query
professionalSchema.index({ profession: 1 });
professionalSchema.index({ specializations: 'text' });

// Metodo per verificare un professionista
professionalSchema.methods.verify = function() {
    this.isVerified = true;
    this.verificationDate = Date.now();
    return this.save();
};

// Metodo statico per trovare professionisti per specializzazione
professionalSchema.statics.findBySpecialization = function(specialization) {
    return this.find({ 
        specializations: { $regex: specialization, $options: 'i' } 
    });
};

const Professional = mongoose.model('Professional', professionalSchema);

module.exports = Professional; 