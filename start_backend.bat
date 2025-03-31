@echo off
echo Starting Edil-Connect Backend...

:: Set project path
set PROJECT_PATH=%~dp0

:: Start Backend
cd %PROJECT_PATH%backend
call npm install
call npm start

echo.
echo Backend started successfully!
echo Running on http://localhost:5000
echo.
echo Press any key to close this window...
pause