# Guida al Deploy su Render.com

## Deploy del Backend

1. Accedi a [Render.com](https://render.com/) e crea un account o accedi con il tuo account esistente.

2. Nella dashboard, clicca su "New +" e seleziona "Web Service".

3. Collega il tuo repository GitHub o GitLab dove è ospitato il progetto.

4. Configura il servizio:
   - Nome: `edilconnect-backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Seleziona il piano che preferisci (Free è disponibile per i test)

5. Nella sezione "Environment Variables", aggiungi le seguenti variabili:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: [inserisci il tuo URI MongoDB]
   - `JWT_SECRET`: [inserisci il tuo secret]
   - `ADMIN_CODE`: [inserisci il codice admin]
   - `EMAIL_USER`: [inserisci l'email]
   - `EMAIL_PASS`: [inserisci la password dell'email]
   - `EMAIL_SERVICE`: `gmail`
   - `FRONTEND_URL`: [URL del tuo frontend dopo il deploy, ad esempio https://edilconnect.netlify.app]
   - `PORT`: `10000` (Render assegnerà automaticamente questa porta)
   - `STRIPE_SECRET_KEY`: [inserisci la tua chiave segreta di Stripe]
   - `STRIPE_WEBHOOK_SECRET`: [inserisci il secret per i webhook di Stripe]

6. Clicca su "Create Web Service" e attendi che il deploy sia completato.

7. Prendi nota dell'URL generato da Render (es. https://edilconnect-backend.onrender.com).

## Configurazione di Stripe

1. Accedi al tuo dashboard di [Stripe](https://dashboard.stripe.com/).
2. Vai su Developers > API keys per ottenere la `STRIPE_SECRET_KEY`.
3. Per configurare il webhook, vai su Developers > Webhooks > Add endpoint.
4. Imposta l'URL del webhook: `https://edilconnect-backend.onrender.com/api/subscriptions/webhook`.
5. Seleziona gli eventi da monitorare: `checkout.session.completed` e `invoice.payment_failed`.
6. Una volta creato il webhook, Stripe ti fornirà il Signing Secret che dovrai utilizzare come `STRIPE_WEBHOOK_SECRET`.

## Deploy del Frontend su Netlify

1. Accedi a [Netlify](https://www.netlify.com/) e crea un account o accedi con quello esistente.

2. Clicca su "New site from Git" e collega il tuo repository.

3. Configura il deploy:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/build`

4. Nelle impostazioni del sito, vai alla sezione "Environment variables" e aggiungi:
   - `REACT_APP_API_URL`: [URL del backend generato da Render]

5. Clicca su "Deploy site" e attendi che il deploy sia completato.

6. Una volta completato, puoi configurare un dominio personalizzato se necessario.

## Verificare che tutto funzioni

1. Visita l'URL del frontend e verifica che l'applicazione funzioni correttamente.
2. Testa il login e le altre funzionalità principali.
3. Verifica che la connessione al backend funzioni correttamente.

## Risoluzione dei problemi comuni

- **CORS error**: Assicurati che `FRONTEND_URL` nel backend sia configurato correttamente.
- **Errori di connessione al database**: Verifica che la stringa di connessione MongoDB sia corretta.
- **Problemi con le API**: Controlla i log del backend su Render per identificare eventuali errori.

Per visualizzare i log su Render:
1. Vai alla dashboard del tuo servizio
2. Clicca sulla scheda "Logs"
3. Esamina i log per identificare eventuali errori

## Aggiornamenti

Per aggiornare l'applicazione, è sufficiente fare push delle modifiche nel repository Git collegato. Render e Netlify rileveranno automaticamente le modifiche e avvieranno un nuovo deploy. 