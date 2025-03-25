# EdilPro Platform

Piattaforma per la gestione di progetti edilizi e collaborazione tra professionisti.

## Installazione

1. Assicurati di avere Node.js installato sul tuo computer
2. Estrai il file ZIP in una cartella
3. Apri il terminale e naviga nella cartella del progetto

### Setup Backend
```bash
cd backend
npm install
node server.js
```
Il server backend sarà disponibile su http://localhost:3001

### Setup Frontend
```bash
cd frontend
npm install
npm start
```
L'applicazione sarà disponibile su http://localhost:3000

## Funzionalità
- Autenticazione professionisti
- Gestione progetti
- Upload documenti e file CAD
- Sistema di commenti
- Gestione attività

## Note
- Assicurati che entrambi i server (frontend e backend) siano in esecuzione
- La cartella `uploads` nel backend verrà creata automaticamente per i file caricati
- Per qualsiasi problema, contatta l'amministratore del progetto 