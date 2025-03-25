@echo off
echo Avvio dei server in corso...

:: Imposto il percorso assoluto del progetto
set PROJECT_PATH=C:\Users\aless\Desktop\edilizia_platform_backup_2

:: Avvio del backend
echo Avvio del backend...
start cmd /k "cd %PROJECT_PATH%\backend && npm start"

:: Attendo 5 secondi per dare tempo al backend di avviarsi
timeout /t 5

:: Avvio del frontend
echo Avvio del frontend...
start cmd /k "cd %PROJECT_PATH%\frontend && npm start"

echo.
echo Servers avviati! L'applicazione sara' disponibile su http://localhost:3000
echo Premi un tasto per chiudere questa finestra...
pause 