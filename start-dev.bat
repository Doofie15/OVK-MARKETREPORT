@echo off
title OVK Wool Market - Development Server

echo.
echo ================================
echo  OVK Wool Market Report
echo  Development Server Options
echo ================================
echo.
echo 1. Local development (localhost only)
echo 2. Network development (accessible on WiFi)
echo.
set /p choice="Choose option (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo Starting local development server...
    echo Access at: http://localhost:5173
    echo.
    "node_modules\.bin\vite"
) else if "%choice%"=="2" (
    echo.
    echo Starting network development server...
    call start-network-dev.bat
) else (
    echo Invalid choice. Starting local server...
    "node_modules\.bin\vite"
)

pause
