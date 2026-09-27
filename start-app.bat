@echo off
title Mimir Metals - Shop Floor Part Setup Assistant (Machine #14)
echo ===================================================================
echo   MIMIR METALS -- SHOP FLOOR ASSISTANT
echo   Machine: MM-14 (JBF-30B4SUL 4-Station Bolt Former)
echo   Warren, Michigan
echo ===================================================================
echo.
echo Starting application server on http://localhost:3000 ...
echo.

:: Ensure we are in the script's directory
cd /d "%~dp0"

:: Check if node exists
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found on PATH. Please install Node.js.
    pause
    exit /b 1
)

:: Launch browser after 2 seconds in background
start "" /b cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"

:: Start the Express server (serves both API and frontend UI)
node server/server.js
pause
