# External API Response Testing with Jest Snapshot

> Test external APIs and detect response changes using Jest's snapshot comparison

## 🎯 Quick Start

### 1. Configure APIs

Edit `api-config.ts`:

```typescript
export const apiEndpoints: ApiEndpoint[] = [
  {
    url: "https://ipinfo.io/161.185.160.93/geo",
    filename: "ipinfo-geo.json",
  },
  {
    url: "https://api.zippopotam.us/us/33162",
    filename: "zippopotam-33162.json",
  },
];
```

### 2. Capture BEFORE state

```bash
npm run test:before
```

Saves current API responses to `before/` directory.

### 3. APIs change or update config

- Wait for external API to change
- Update API configuration
- Test different scenarios

### 4. Capture AFTER and Compare

```bash
npm run test:after
```

Automatically:

1. Captures new responses to `after/`
2. Compares with `before/` using **Jest snapshot diff**
3. Shows clear Expected vs Received format

## 📋 Commands

| Command               | Description                                  |
| --------------------- | -------------------------------------------- |
| `npm run test:before` | Capture responses to `before/`               |
| `npm run test:after`  | Capture to `after/` + compare with `before/` |
| `npm run compare`     | Compare existing `before/` and `after/`      |

## 🔄 Workflow

```
1. Configure APIs (api-config.ts)
   ↓
2. npm run test:before
   → Saves to before/*.json
   ↓
3. ... APIs change or update config ...
   ↓
4. npm run test:after
   → Captures to after/*.json
   → Shows Jest snapshot diff
```

## 📊 Example Output

### test:after (with changes)

```
🔍 Comparing API responses using Jest Snapshot: before/ vs after/

⚠️  ipinfo-geo.json: CHANGED

- Expected
+ Received

@@ -4,8 +4,8 @@
   "ip": "161.185.160.93",
   "loc": "40.7143,-74.0060",
   "org": "AS22252 The City of New York",
-  "postal": "10001123132",
+  "postal": "10001",
   "readme": "https://ipinfo.io/missingauth",
-  "region": "New Yorksss",
+  "region": "New York",
   "timezone": "America/New_York",
 }

✅ zippopotam-33162.json: No changes

📊 Summary:
   Identical: 1 files
   Changed:   1 files

⚠️  API responses have changed!
Exit code: 1
```

### test:after (no changes)

```
✅ ipinfo-geo.json: No changes
✅ zippopotam-33162.json: No changes

📊 Summary:
   Identical: 2 files
   Changed:   0 files

✅ All responses identical!
Exit code: 0
```

## ✨ Features

### Jest Snapshot Diff

Uses **jest-diff** library for professional snapshot comparison:

- ✅ Clear `- Expected` / `+ Received` format
- ✅ Context lines for readability
- ✅ Smart object comparison
- ✅ Same format as Jest tests

### Other Features

- ✅ **No local server** - Test any external API
- ✅ **Flexible config** - Edit APIs in one file
- ✅ **Color output** - Red/green highlighting
- ✅ **Auto normalize** - Handles timestamps
- ✅ **Exit codes** - CI/CD friendly
- ✅ **Custom headers** - Authentication support

## 🔑 Custom Headers (Optional)

Create `.env` for authenticated APIs:

```bash
# Access token
ACCESS_TOKEN=your-token-here

# Custom headers (JSON)
CUSTOM_HEADERS={"X-Api-Key": "key123"}
```

See [HEADERS-GUIDE.md](HEADERS-GUIDE.md) for details.

## 🎓 Use Cases

### Monitor Third-Party APIs

```typescript
{
  url: 'https://api.github.com/users/octocat',
  filename: 'github-user.json'
}
```

### Compare Environments

```bash
# Production
npm run test:before

# Switch to staging URLs in api-config.ts
npm run test:after  # Shows differences
```

### Regression Testing

```bash
# Before changes
npm run test:before

# After deployment
npm run test:after  # Detect regressions
```

## 🔧 Configuration

### Adding APIs

Edit `api-config.ts`:

```typescript
export const apiEndpoints: ApiEndpoint[] = [
  {
    url: "https://api.example.com/data",
    filename: "my-api.json",
  },
];
```

### Normalizing Responses

Edit `normalizeResponse()` in `scripts/capture-responses.ts` to handle dynamic fields:

```typescript
// Normalize timestamp fields
if (key === "timestamp" || key === "createdAt" || key === "updatedAt") {
  normalized[key] = "2025-01-01T00:00:00.000Z";
}
```

## 📝 Notes

- **`before/`** - Commit to track API responses
- **`after/`** - Can gitignore (temporary)
- **Exit codes:**
  - `0` = No changes (CI pass)
  - `1` = Changes detected (CI fail)

## 🚀 Quick Start

```bash
# Setup
git clone <repo>
npm install

# Configure APIs in api-config.ts

# Capture baseline
npm run test:before

# Later, check for changes
npm run test:after
```

## 📦 Dependencies

The project uses:

- **jest-diff** - Professional snapshot comparison
- **jest-snapshot** - Snapshot utilities
- **pretty-format** - Object formatting
- **axios** - HTTP client
- **chalk** - Colored terminal output
- **dotenv** - Environment variables

No full Jest framework required!

---

**See also:**

- [api-config.ts](api-config.ts) - Configure your APIs
- [HEADERS-GUIDE.md](HEADERS-GUIDE.md) - Authentication setup
