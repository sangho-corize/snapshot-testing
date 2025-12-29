# Custom Headers Configuration Guide

## Overview

The capture-responses script supports custom HTTP headers including **access tokens** for testing authenticated APIs.

## Setup

### 1. Create `.env` file

Copy the example file:

```bash
cp .env.example .env
```

### 2. Configure Headers

Edit `.env` file with your configuration:

```bash
# Access Token (automatically adds Authorization header)
ACCESS_TOKEN=your-actual-token-here

# Custom Headers (JSON format)
CUSTOM_HEADERS={"X-Api-Key": "your-api-key", "X-Client-Id": "client-123"}

# API Base URL (optional)
API_BASE_URL=http://localhost:3000
```

## Usage Examples

### Example 1: Access Token Only

**.env:**

```bash
ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Result:** Adds header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Example 2: Custom API Key

**.env:**

```bash
CUSTOM_HEADERS={"X-Api-Key": "sk_test_123456"}
```

**Result:** Adds header:

```
X-Api-Key: sk_test_123456
```

### Example 3: Multiple Headers

**.env:**

```bash
ACCESS_TOKEN=my-token
CUSTOM_HEADERS={"X-Api-Key": "key123", "X-Client-Id": "client-abc", "X-Request-Id": "req-001"}
```

**Result:** Adds headers:

```
Authorization: Bearer my-token
X-Api-Key: key123
X-Client-Id: client-abc
X-Request-Id: req-001
```

## Running Tests with Headers

```bash
# Capture with configured headers
npm run test:before

# You'll see output:
# 🔑 Custom headers configured:
#    Authorization: Bearer my-...
#    X-Api-Key: key123
```

## Security Notes

⚠️ **Important:**

- ✅ `.env` is in `.gitignore` - won't be committed
- ✅ Tokens are **masked** in console output (only first 10 chars shown)
- ✅ Never commit `.env` to version control
- ✅ Share `.env.example` (without real tokens) with team

## Workflow

### Development

```bash
# 1. Configure your token
echo "ACCESS_TOKEN=dev-token-123" > .env

# 2. Capture baseline
npm run test:before

# 3. Make changes...

# 4. Compare
npm run test:after
```

### Different Environments

Create multiple env files:

```bash
.env.dev      # Development tokens
.env.staging  # Staging tokens
.env.prod     # Production tokens (be careful!)
```

Use with:

```bash
# Load specific env file
cp .env.dev .env
npm run test:before
```

## Troubleshooting

### Headers not working?

1. **Check .env file exists**

   ```bash
   ls -la .env
   ```

2. **Verify environment loading**

   - Script automatically loads `.env` on startup
   - Check console for "🔑 Custom headers configured"

3. **JSON format for CUSTOM_HEADERS**

   ```bash
   # ✅ Correct
   CUSTOM_HEADERS={"key": "value"}

   # ❌ Wrong (missing quotes)
   CUSTOM_HEADERS={key: value}
   ```

### Token not being sent?

Check your API server to verify headers:

```typescript
// In your API route
app.get("/users", (req, res) => {
  console.log("Headers:", req.headers);
  // Should show: authorization: 'Bearer your-token'
});
```

## Example Output

With headers configured:

```
📸 Capturing API responses to before/

🔑 Custom headers configured:
   Authorization: Bearer eyJhbGc...
   X-Api-Key: sk_test_1234

  Calling GET /health...
    ✅ Saved to health.json (200)
  Calling GET /users...
    ✅ Saved to users-list.json (200)
...
```

Without headers:

```
📸 Capturing API responses to before/

  Calling GET /health...
    ✅ Saved to health.json (200)
...
```

## Advanced: Dynamic Tokens

For frequently expiring tokens, create a script:

```bash
#!/bin/bash
# refresh-token.sh

# Get new token from your auth service
TOKEN=$(curl -s https://auth.api.com/token | jq -r '.access_token')

# Update .env
echo "ACCESS_TOKEN=$TOKEN" > .env

# Run tests
npm run test:before
```

Then:

```bash
chmod +x refresh-token.sh
./refresh-token.sh
```
