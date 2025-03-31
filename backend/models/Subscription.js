const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending', 'cancelled'],
        default: 'pending'
    },
    plan: {
        type: String,
        enum: ['monthly', 'annual'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'EUR'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    stripeCustomerId: {
        type: String
    },
    stripeSubscriptionId: {
        type: String
    },
    paymentHistory: [{
        paymentId: String,
        amount: Number,
        currency: String,
        status: String,
        date: Date
    }],
    autoRenew: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Aggiorna la data di modifica prima del salvataggio
subscriptionSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription; 