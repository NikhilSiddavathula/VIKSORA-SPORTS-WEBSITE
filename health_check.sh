#!/bin/bash

# VIKSORASPORTS Backend Health Check Script
# Usage: ./health_check.sh

echo "🏥 VIKSORASPORTS Backend Health Check"
echo "======================================"

BASE_URL="https://api.viksorasports.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local url=$1
    local name=$2
    local method=${3:-GET}
    
    echo -n "Testing $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST "$url" -H "Content-Type: application/json" -o /tmp/response.json)
    else
        response=$(curl -s -w "%{http_code}" "$url" -o /tmp/response.json)
    fi
    
    http_code="${response: -3}"
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✅ OK${NC} (HTTP $http_code)"
        if command -v jq &> /dev/null; then
            cat /tmp/response.json | jq '.' 2>/dev/null || cat /tmp/response.json
        else
            cat /tmp/response.json
        fi
    elif [ "$http_code" -eq 503 ]; then
        echo -e "${YELLOW}⚠️  Service Unavailable${NC} (HTTP $http_code)"
        cat /tmp/response.json
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $http_code)"
        cat /tmp/response.json
    fi
    echo ""
}

# Test all endpoints
echo "1. Basic Server Health"
test_endpoint "$BASE_URL/" "Root Endpoint"

echo "2. Health Check"
test_endpoint "$BASE_URL/api/health" "Health Endpoint"

echo "3. Authentication System"
test_endpoint "$BASE_URL/api/auth/test" "Auth Test"
test_endpoint "$BASE_URL/api/auth/login-test" "Auth Environment Test" "POST"

echo "4. CORS Configuration"
test_endpoint "$BASE_URL/api/cors-test" "CORS Test"

echo "5. Debug Information"
test_endpoint "$BASE_URL/api/debug" "Debug Endpoint"

echo "6. Games API"
test_endpoint "$BASE_URL/api/games/test" "Games Test"

echo "7. Database Test"
test_endpoint "$BASE_URL/api/db/test" "Database Test" || echo "Database test endpoint may not exist"

# Summary
echo "======================================"
echo "🏁 Health Check Complete"
echo ""
echo "📋 What to check:"
echo "   ✅ All endpoints return 200 OK"
echo "   ✅ Database shows 'Connected'"
echo "   ✅ Environment variables are set"
echo "   ✅ No 500 errors"
echo ""
echo "🚨 If any tests fail:"
echo "   1. Check Vercel deployment logs"
echo "   2. Verify environment variables"
echo "   3. Check MongoDB Atlas connection"
echo "   4. Review recent code changes"

# Cleanup
rm -f /tmp/response.json