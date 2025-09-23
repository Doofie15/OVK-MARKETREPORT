@echo off
title OVK Wool Market - Network Development Server

echo.
echo ================================
echo  OVK Wool Market Report
echo  Network Development Server
echo ================================
echo.

echo Getting your network IP address...
echo.

REM Get the local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        set LOCAL_IP=%%b
        goto :found
    )
)

:found
if "%LOCAL_IP%"=="" (
    echo Could not determine local IP address automatically.
    echo Please check your network connection.
    echo.
    echo You can find your IP manually by running: ipconfig
    echo Look for "IPv4 Address" under your active network adapter.
    echo.
    set LOCAL_IP=YOUR_COMPUTER_IP
) else (
    echo Your computer's local IP address: %LOCAL_IP%
)

echo.
echo ================================
echo  MOBILE ACCESS INSTRUCTIONS
echo ================================
echo.
echo 1. Make sure your phone is on the same WiFi network
echo 2. Open Chrome or Samsung Internet on your Samsung S25
echo 3. Navigate to: http://%LOCAL_IP%:5173
echo.
echo For debugging, add: http://%LOCAL_IP%:5173?debug=true
echo.
echo ================================
echo.

echo Starting development server...
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
npm run dev:network

pause
