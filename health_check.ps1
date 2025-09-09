# VIKSORASPORTS Backend Health Check Script (PowerShell)
# Usage: .\health_check.ps1

Write-Host "🏥 VIKSORASPORTS Backend Health Check" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

$BaseUrl = "https://api.viksorasports.com"

function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Name,
        [string]$Method = "GET"
    )
    
    Write-Host "Testing $Name... " -NoNewline
    
    try {
        if ($Method -eq "POST") {
            $response = Invoke-RestMethod -Uri $Url -Method POST -ContentType "application/json" -ErrorAction Stop
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method GET -ErrorAction Stop
        }
        
        Write-Host "✅ OK" -ForegroundColor Green
        Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Gray
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 503) {
            Write-Host "⚠️  Service Unavailable (HTTP $statusCode)" -ForegroundColor Yellow
        } else {
            Write-Host "❌ FAILED (HTTP $statusCode)" -ForegroundColor Red
        }
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
    Write-Host ""
}

# Test all endpoints
Write-Host "1. Basic Server Health"
Test-Endpoint "$BaseUrl/" "Root Endpoint"

Write-Host "2. Health Check"
Test-Endpoint "$BaseUrl/api/health" "Health Endpoint"

Write-Host "3. Authentication System"
Test-Endpoint "$BaseUrl/api/auth/test" "Auth Test"
Test-Endpoint "$BaseUrl/api/auth/login-test" "Auth Environment Test" "POST"

Write-Host "4. CORS Configuration"
Test-Endpoint "$BaseUrl/api/cors-test" "CORS Test"

Write-Host "5. Debug Information"
Test-Endpoint "$BaseUrl/api/debug" "Debug Endpoint"

Write-Host "6. Games API"
Test-Endpoint "$BaseUrl/api/games/test" "Games Test"

# Summary
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "🏁 Health Check Complete" -ForegroundColor Green
Write-Host ""
Write-Host "📋 What to check:" -ForegroundColor White
Write-Host "   ✅ All endpoints return 200 OK" -ForegroundColor Gray
Write-Host "   ✅ Database shows 'Connected'" -ForegroundColor Gray
Write-Host "   ✅ Environment variables are set" -ForegroundColor Gray
Write-Host "   ✅ No 500 errors" -ForegroundColor Gray
Write-Host ""
Write-Host "🚨 If any tests fail:" -ForegroundColor Yellow
Write-Host "   1. Check Vercel deployment logs" -ForegroundColor Gray
Write-Host "   2. Verify environment variables" -ForegroundColor Gray
Write-Host "   3. Check MongoDB Atlas connection" -ForegroundColor Gray
Write-Host "   4. Review recent code changes" -ForegroundColor Gray