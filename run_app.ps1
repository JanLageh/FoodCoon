# Run FoodCoon Mock API and Flutter Web App
Write-Host "Starting FoodCoon Mock API and Flutter App..." -ForegroundColor Cyan

$env:CHROME_EXECUTABLE = "$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\Application\brave.exe"

# Start mock API if not already responding
try {
    $null = Invoke-RestMethod -Uri "http://localhost:3000/api/restaurants" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "Mock API is already running on http://localhost:3000/api" -ForegroundColor Green
} catch {
    Write-Host "Starting Mock API server on port 3000..." -ForegroundColor Yellow
    Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "$PSScriptRoot\mock-api" -WindowStyle Hidden
    Start-Sleep -Seconds 2
}

Set-Location "$PSScriptRoot\food_coon_app"
Write-Host "Launching Flutter Web in browser..." -ForegroundColor Green

if (Test-Path $env:CHROME_EXECUTABLE) {
    flutter run -d chrome
} else {
    flutter run -d web-server --web-port=8080
}
