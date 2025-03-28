const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['professional', 'admin'],
        default: 'professional'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpires: {
        type: Date
    },
    // Campi specifici per professionisti
    profession: {
        type: String,
        required: true
    },
    license: {
        type: String,
        required: function() { return this.role === 'professional'; }
    },
    // Campi specifici per utenti pubblici
    fiscalCode: {
        type: String,
        required: function() { return this.role === 'public'; }
    },
    phone: {
        type: String,
        required: function() { return this.role === 'public'; }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash della password prima del salvataggio
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Genera token JWT
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

// Rimuovi dati sensibili quando l'oggetto viene convertito in JSON
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.verificationToken;
    delete userObject.verificationTokenExpires;

    return userObject;
};

// Trova utente per credenziali
userSchema.statics.findByCredentials = async (email, password) => {
    console.log('Tentativo di login per email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
        console.log('Utente non trovato per email:', email);
        throw new Error('Email non trovata');
    }

    console.log('Utente trovato, verifica password...');
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        console.log('Password non valida per utente:', email);
        throw new Error('Password non valida');
    }

    if (!user.isVerified) {
        console.log('Utente non verificato:', email);
        throw new Error('Verifica la tua email prima di accedere');
    }

    console.log('Login riuscito per utente:', email);
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
