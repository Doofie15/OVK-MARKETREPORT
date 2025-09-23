# OVK Wool Market - Network Development Server
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host " OVK Wool Market Report" -ForegroundColor White
Write-Host " Network Development Server" -ForegroundColor White
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Getting your network IP address..." -ForegroundColor Yellow
Write-Host ""

# Get the local IP address (more reliable method)
try {
    $localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.*"})[0].IPAddress
    
    if (-not $localIP) {
        # Fallback method
        $localIP = (Test-Connection -ComputerName $env:COMPUTERNAME -Count 1).IPv4Address.IPAddressToString
    }
    
    Write-Host "Your computer's local IP address: " -NoNewline -ForegroundColor Green
    Write-Host $localIP -ForegroundColor White
} catch {
    Write-Host "Could not determine local IP address automatically." -ForegroundColor Red
    Write-Host "Please run 'ipconfig' to find your IPv4 Address manually." -ForegroundColor Yellow
    $localIP = "YOUR_COMPUTER_IP"
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host " MOBILE ACCESS INSTRUCTIONS" -ForegroundColor White
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Make sure your Samsung S25 is on the same WiFi network" -ForegroundColor White
Write-Host "2. Open Chrome or Samsung Internet browser" -ForegroundColor White
Write-Host "3. Navigate to: " -NoNewline -ForegroundColor White
Write-Host "http://$localIP:5173" -ForegroundColor Green
Write-Host ""
Write-Host "For debugging, use: " -NoNewline -ForegroundColor White
Write-Host "http://$localIP:5173?debug=true" -ForegroundColor Yellow
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Generate QR code URL for easy access
$qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://$localIP:5173"
Write-Host "QR Code for easy access: $qrUrl" -ForegroundColor Magenta
Write-Host ""

Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Start the development server
try {
    npm run dev:network
} catch {
    Write-Host "Error starting development server. Make sure you're in the project directory and npm is installed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
}
