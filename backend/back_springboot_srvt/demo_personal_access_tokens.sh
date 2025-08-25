#!/bin/bash

# Personal Access Token Demo Script
# This script demonstrates how to use Personal Access Tokens with the TECSUP API

# Configuration
API_BASE_URL="http://localhost:8080"
JWT_TOKEN=""  # You need to provide a valid JWT token to create PATs
PAT_TOKEN=""  # Will be filled after creating a PAT

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔑 Personal Access Token Demo${NC}"
echo "================================"

# Function to make API calls with error handling
api_call() {
    local method=$1
    local endpoint=$2
    local auth_token=$3
    local data=$4
    
    echo -e "\n${YELLOW}➤ $method $endpoint${NC}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            "$API_BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $auth_token")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            "$API_BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $auth_token" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ Success ($http_code)${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body"
        return 0
    else
        echo -e "${RED}✗ Error ($http_code)${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body"
        return 1
    fi
}

# Check if JWT token is provided
if [ -z "$JWT_TOKEN" ]; then
    echo -e "${RED}Error: Please set JWT_TOKEN variable with a valid JWT token${NC}"
    echo "You can get one by logging in through /api/auth/signin"
    exit 1
fi

echo "Starting demo with JWT token: ${JWT_TOKEN:0:20}..."

# 1. Get usage guide (no auth required)
echo -e "\n${BLUE}1. Getting PAT Usage Guide${NC}"
api_call "GET" "/api/personal-access-tokens/guide" ""

# 2. Create a new Personal Access Token
echo -e "\n${BLUE}2. Creating Personal Access Token${NC}"
create_response=$(api_call "POST" "/api/personal-access-tokens" "$JWT_TOKEN" '{
    "name": "Demo API Token",
    "description": "Token created for demonstration purposes",
    "expirationDays": 30
}')

if [ $? -eq 0 ]; then
    # Extract the full token from the response
    PAT_TOKEN=$(echo "$create_response" | jq -r '.data.fullToken // empty')
    echo -e "${GREEN}✓ PAT Token created: ${PAT_TOKEN:0:20}...${NC}"
else
    echo -e "${RED}✗ Failed to create PAT token${NC}"
    exit 1
fi

# 3. List all tokens for user
echo -e "\n${BLUE}3. Listing Personal Access Tokens${NC}"
api_call "GET" "/api/personal-access-tokens" "$JWT_TOKEN"

# 4. Test API access using PAT instead of JWT
echo -e "\n${BLUE}4. Testing API Access with PAT${NC}"
echo "Using PAT token for authentication instead of JWT..."

# Try to access a protected endpoint with PAT
api_call "GET" "/api/reservas/mis-reservas" "$PAT_TOKEN"

# If that fails, try another endpoint that might exist
if [ $? -ne 0 ]; then
    echo "Trying alternative endpoint..."
    api_call "GET" "/api/perfil" "$PAT_TOKEN"
fi

# 5. Get token list again to see last used timestamp
echo -e "\n${BLUE}5. Checking Token Usage Timestamp${NC}"
api_call "GET" "/api/personal-access-tokens" "$JWT_TOKEN"

# 6. Revoke the demo token (cleanup)
echo -e "\n${BLUE}6. Cleanup - Revoking Demo Token${NC}"
# First get the token ID from the list
token_list=$(api_call "GET" "/api/personal-access-tokens" "$JWT_TOKEN")
token_id=$(echo "$token_list" | jq -r '.data[0].id // empty' 2>/dev/null)

if [ -n "$token_id" ] && [ "$token_id" != "null" ]; then
    echo "Revoking token with ID: $token_id"
    api_call "DELETE" "/api/personal-access-tokens/$token_id" "$JWT_TOKEN"
else
    echo "Could not extract token ID, skipping revocation"
fi

echo -e "\n${GREEN}✓ Demo completed!${NC}"

# Summary
echo -e "\n${BLUE}📋 Summary${NC}"
echo "=========="
echo "• Created a Personal Access Token"
echo "• Listed user tokens"
echo "• Used PAT for API authentication"
echo "• Cleaned up by revoking the token"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "• Store PAT tokens securely (environment variables)"
echo "• Use descriptive names for your tokens"
echo "• Set appropriate expiration dates"
echo "• Revoke unused tokens regularly"