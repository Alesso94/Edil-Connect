const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const professionalVerificationSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    documents: {
        identityDocument: {
            file: String,
            verified: { type: Boolean, default: false },
            uploadDate: { type: Date, default: Date.now }
        },
        professionalLicense: {
            file: String,
            verified: { type: Boolean, default: false },
            uploadDate: { type: Date, default: Date.now },
            number: String,
            expiryDate: Date
        },
        criminalRecord: {
            file: String,
            verified: { type: Boolean, default: false },
            uploadDate: { type: Date, default: Date.now },
            issueDate: Date
        },
        businessRegistration: {
            file: String,
            verified: { type: Boolean, default: false },
            uploadDate: { type: Date, default: Date.now },
            registrationNumber: String
        },
        vatDocument: {
            file: String,
            verified: { type: Boolean, default: false },
            uploadDate: { type: Date, default: Date.now }
        }
    },
    verificationNotes: [{
        note: String,
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    verifiedAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['professional', 'business', 'admin'],
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    contactInfo: {
        phone: {
            type: String,
            required: true
        },
        pec: {
            type: String,
            required: true
        },
        alternativeEmail: String
    },
    professionalInfo: {
        profession: {
            type: String,
            required: function() { return this.role === 'professional'; }
        },
        licenseNumber: {
            type: String,
            required: function() { return this.role === 'professional'; }
        },
        professionalOrder: {
            type: String,
            required: function() { return this.role === 'professional'; }
        },
        orderRegistrationDate: {
            type: Date,
            required: function() { return this.role === 'professional'; }
        }
    },
    businessInfo: {
        companyName: {
            type: String,
            required: function() { return this.role === 'business'; }
        },
        vatNumber: {
            type: String,
            required: function() { return this.role === 'business'; }
        },
        businessType: {
            type: String,
            required: function() { return this.role === 'business'; }
        },
        registrationNumber: String,
        legalAddress: {
            street: String,
            city: String,
            postalCode: String,
            country: {
                type: String,
                default: 'Italia'
            }
        }
    },
    professionalVerification: professionalVerificationSchema,
    fiscalCode: {
        type: String,
        required: function() { return this.role === 'public'; }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
            required: false
        }
    }],
    subscriptionActive: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash della password prima del salvataggio
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Genera token JWT e refresh token
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }  // Token principale valido per 7 giorni
    );
    
    const refreshToken = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '30d' }  // Refresh token valido per 30 giorni
    );

    user.tokens = user.tokens.concat({ token, refreshToken });
    await user.save();
    return { token, refreshToken };
};

// Rimuovi dati sensibili quando l'oggetto viene convertito in JSON
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.verificationToken;
    delete userObject.verificationTokenExpires;

    return userObject;
};

// Metodo per trovare un utente tramite credenziali
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Utente non trovato');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Password non corretta');
    }

    if (!user.isVerified && !user.isAdmin) {
        throw new Error('Account non verificato. Controlla la tua email per verificare l\'account o richiedi un nuovo link di verifica.');
    }

    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
