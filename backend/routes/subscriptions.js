const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Configurazione piani
const SUBSCRIPTION_PLANS = {
    monthly: {
        id: 'monthly',
        name: 'Abbonamento Mensile',
        amount: 2999, // 29.99 EUR
        interval: 'month'
    },
    annual: {
        id: 'annual',
        name: 'Abbonamento Annuale',
        amount: 29900, // 299.00 EUR
        interval: 'year'
    }
};

// GET /api/subscriptions/plans - Ottieni piani disponibili
router.get('/plans', async (req, res) => {
    try {
        res.json(SUBSCRIPTION_PLANS);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/subscriptions/create-checkout-session - Crea sessione di pagamento
router.post('/create-checkout-session', auth, async (req, res) => {
    try {
        const { planId } = req.body;
        const plan = SUBSCRIPTION_PLANS[planId];
        
        if (!plan) {
            return res.status(400).json({ message: 'Piano non valido' });
        }

        // Crea o recupera il cliente Stripe
        let customer;
        const existingSubscription = await Subscription.findOne({ user: req.user._id });
        
        if (existingSubscription?.stripeCustomerId) {
            customer = await stripe.customers.retrieve(existingSubscription.stripeCustomerId);
        } else {
            customer = await stripe.customers.create({
                email: req.user.email,
                metadata: {
                    userId: req.user._id.toString()
                }
            });
        }

        // Crea la sessione di checkout
        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: plan.name,
                        description: `Accesso alla piattaforma EdilConnect - ${plan.name}`
                    },
                    unit_amount: plan.amount,
                    recurring: {
                        interval: plan.interval
                    }
                },
                quantity: 1
            }],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
            metadata: {
                userId: req.user._id.toString(),
                planId: planId
            }
        });

        res.json({ 
            sessionId: session.id,
            url: session.url
        });
    } catch (error) {
        console.error('Errore creazione sessione:', error);
        res.status(500).json({ message: error.message });
    }
});

// POST /api/subscriptions/webhook - Gestisce webhook Stripe
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            const userId = session.metadata.userId;
            const planId = session.metadata.planId;
            const plan = SUBSCRIPTION_PLANS[planId];

            // Aggiorna o crea abbonamento
            const subscriptionData = {
                user: userId,
                status: 'active',
                plan: planId,
                amount: plan.amount,
                startDate: new Date(),
                endDate: new Date(Date.now() + (planId === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
                stripeCustomerId: session.customer,
                stripeSubscriptionId: session.subscription,
                paymentHistory: [{
                    paymentId: session.payment_intent,
                    amount: plan.amount,
                    currency: 'eur',
                    status: 'completed',
                    date: new Date()
                }]
            };

            await Subscription.findOneAndUpdate(
                { user: userId },
                subscriptionData,
                { upsert: true, new: true }
            );

            // Aggiorna stato utente
            await User.findByIdAndUpdate(userId, {
                'subscriptionActive': true
            });

            break;
        }
        case 'invoice.payment_failed': {
            const session = event.data.object;
            const subscription = await Subscription.findOne({
                stripeSubscriptionId: session.subscription
            });

            if (subscription) {
                subscription.status = 'inactive';
                await subscription.save();

                await User.findByIdAndUpdate(subscription.user, {
                    'subscriptionActive': false
                });
            }
            break;
        }
    }

    res.json({ received: true });
});

// GET /api/subscriptions/status - Ottieni stato abbonamento
router.get('/status', auth, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ user: req.user._id });
        
        if (!subscription) {
            return res.json({
                active: false,
                message: 'Nessun abbonamento attivo'
            });
        }

        res.json({
            active: subscription.status === 'active',
            plan: subscription.plan,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            autoRenew: subscription.autoRenew
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/subscriptions/verify-session/:sessionId - Verifica stato sessione di checkout
router.get('/verify-session/:sessionId', auth, async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Recupera la sessione da Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (!session) {
            return res.status(404).json({ message: 'Sessione non trovata' });
        }

        // Verifica che la sessione appartenga all'utente corrente
        if (session.metadata && session.metadata.userId !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Accesso non autorizzato' });
        }

        // Trova l'abbonamento associato a questa sessione
        const subscription = await Subscription.findOne({ 
            user: req.user._id,
            stripeSubscriptionId: session.subscription
        });

        if (!subscription) {
            return res.status(404).json({ message: 'Abbonamento non trovato' });
        }

        // Ottieni il nome del piano
        const planId = subscription.plan;
        const planName = planId === 'monthly' ? 'Piano Mensile' : 'Piano Annuale';

        res.json({
            status: subscription.status,
            planId: subscription.plan,
            planName,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            autoRenew: subscription.autoRenew
        });
    } catch (error) {
        console.error('Errore verifica sessione:', error);
        res.status(500).json({ message: error.message });
    }
});

// POST /api/subscriptions/cancel - Cancella abbonamento
router.post('/cancel', auth, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ user: req.user._id });
        
        if (!subscription || subscription.status !== 'active') {
            return res.status(400).json({ message: 'Nessun abbonamento attivo da cancellare' });
        }

        // Cancella abbonamento su Stripe
        if (subscription.stripeSubscriptionId) {
            await stripe.subscriptions.del(subscription.stripeSubscriptionId);
        }

        subscription.status = 'cancelled';
        subscription.autoRenew = false;
        await subscription.save();

        await User.findByIdAndUpdate(req.user._id, {
            'subscriptionActive': false
        });

        res.json({ message: 'Abbonamento cancellato con successo' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 