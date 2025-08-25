# 🔑 Personal Access Tokens (PATs) - API Documentation

## 📋 Overview

Personal Access Tokens provide a secure way to authenticate with the API without using your password. They are ideal for programmatic access, scripts, and third-party integrations.

## 🚀 Quick Start

### 1. Create a Token

```bash
curl -X POST http://localhost:8080/api/personal-access-tokens \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "My API Script",
    "description": "Token for automated data processing",
    "expirationDays": 90
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Token personal creado exitosamente",
  "warning": "Guarda este token en un lugar seguro. No podrás verlo nuevamente.",
  "data": {
    "id": 1,
    "name": "My API Script",
    "tokenPrefix": "tscp_123...",
    "fullToken": "tscp_1234567890abcdef1234567890abcdef12345678",
    "expiresAt": "2025-11-23T14:30:00",
    "createdAt": "2025-08-25T14:30:00",
    "isActive": true,
    "isExpired": false
  }
}
```

⚠️ **Important**: Save the `fullToken` immediately - it won't be shown again!

### 2. Use the Token

```bash
curl -X GET http://localhost:8080/api/reservas/mis-reservas \
  -H "Authorization: Bearer tscp_1234567890abcdef1234567890abcdef12345678"
```

## 📚 API Endpoints

### Create Token
- **POST** `/api/personal-access-tokens`
- **Auth Required**: JWT token
- **Body**:
  ```json
  {
    "name": "Token Name",
    "description": "Optional description",
    "expirationDays": 365
  }
  ```

### List Tokens
- **GET** `/api/personal-access-tokens`
- **Auth Required**: JWT token
- **Response**: Array of token objects (without full token)

### Revoke Token
- **DELETE** `/api/personal-access-tokens/{tokenId}`
- **Auth Required**: JWT token

### Revoke All Tokens
- **DELETE** `/api/personal-access-tokens`
- **Auth Required**: JWT token

### Usage Guide
- **GET** `/api/personal-access-tokens/guide`
- **Auth Required**: None
- **Response**: Usage documentation

## 🔧 Configuration Options

### Token Name Rules
- Required field
- 1-100 characters
- Only letters, numbers, spaces, hyphens, underscores
- Must be unique per user

### Expiration Options
- `null` or `0`: Never expires (uses default: 365 days)
- Positive number: Expires after specified days
- Maximum recommended: 365 days

### Rate Limits
- Maximum 10 active tokens per user
- Token length: 40 characters + 'tscp_' prefix

## 🛡️ Security Best Practices

### ✅ Do's
- Store tokens securely (environment variables, secret managers)
- Use descriptive names to identify token purposes
- Set appropriate expiration dates
- Revoke unused tokens regularly
- Use HTTPS in production

### ❌ Don'ts
- Never commit tokens to version control
- Don't share tokens between applications
- Don't use tokens in URLs or logs
- Don't use overly broad permissions

## 💻 Code Examples

### JavaScript/Node.js
```javascript
const apiToken = process.env.TECSUP_API_TOKEN;

const response = await fetch('http://localhost:8080/api/reservas', {
  headers: {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

### Python
```python
import os
import requests

api_token = os.getenv('TECSUP_API_TOKEN')

headers = {
    'Authorization': f'Bearer {api_token}',
    'Content-Type': 'application/json'
}

response = requests.get('http://localhost:8080/api/reservas', headers=headers)
data = response.json()
```

### cURL
```bash
# Set as environment variable
export TECSUP_API_TOKEN="tscp_your_token_here"

# Use in requests
curl -X GET http://localhost:8080/api/reservas \
  -H "Authorization: Bearer $TECSUP_API_TOKEN"
```

## 🔍 Token Format

Personal Access Tokens follow this format:
- **Prefix**: `tscp_` (TECSUP identifier)
- **Length**: 44 characters total (4 prefix + 40 random)
- **Characters**: a-z, A-Z, 0-9
- **Example**: `tscp_1234567890abcdefghijklmnopqrstuvwxyzABCD`

## 📊 Management

### Token Information
Each token includes:
- **Name**: User-defined identifier
- **Description**: Optional purpose description
- **Created**: Timestamp of creation
- **Last Used**: Timestamp of last API call
- **Expires**: Optional expiration date
- **Status**: Active/Revoked

### Monitoring
- Track token usage through `lastUsedAt` field
- Monitor for unused tokens to revoke
- Set up alerts for token expiration

## 🚨 Troubleshooting

### Common Issues

**401 Unauthorized**
- Token may be expired or revoked
- Check if token is correctly formatted
- Verify Authorization header format

**403 Forbidden**
- Token is valid but lacks required permissions
- Check if endpoint requires specific user roles

**Token Not Working**
- Ensure Bearer prefix is included
- Check for extra spaces or characters
- Verify token hasn't been revoked

### Debug Steps
1. Verify token format: `tscp_` + 40 characters
2. Check token status via `/api/personal-access-tokens`
3. Confirm endpoint requires authentication
4. Test with fresh token

## 🔄 Migration from JWT

Personal Access Tokens work alongside JWT tokens:
- Use JWT for interactive user sessions
- Use PATs for automated/programmatic access
- Same permissions and access levels
- Seamless authentication fallback

## 📝 Token Lifecycle

1. **Creation**: Generate via API with JWT auth
2. **Active Use**: Include in Authorization headers
3. **Monitoring**: Track usage and expiration
4. **Renewal**: Create new token before expiration
5. **Revocation**: Delete when no longer needed

This documentation provides everything needed to implement and use Personal Access Tokens securely with the TECSUP Reservation System API.