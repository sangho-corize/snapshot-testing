# Jest API Snapshot Testing

> Automatically test APIs and detect response changes using Jest snapshot testing

**📖 Documentation:** [English](README.md) | [Tiếng Việt](README.vi.md)

## Quick Start

### 1. Configure APIs

Edit `src/api.ts`:

```typescript
export const endpoints: ApiEndpoint[] = [
  {
    name: "Get Users",
    url: "http://localhost:3000/api/users",
  },
];
```

### 2. Run Tests (First Time)

```bash
npm test
```

Creates snapshots in `__tests__/__snapshots__/api.test.ts.snap`.

### 3. Run Tests (Subsequent)

```bash
npm test
```

Jest automatically compares responses with saved snapshots.

### 4. Update Snapshots (When Needed)

```bash
npm test -- -u
```

---

## Property Matchers for Dynamic Fields

For dynamic fields (IDs, timestamps, tokens), use property matchers:

```typescript
expect(user).toMatchSnapshot({
  id: expect.any(Number),
  createdAt: expect.any(String),
  token: expect.any(String),
});
```

Snapshot will be:

```javascript
exports[`Create User 1`] = `
{
  "id": Any<Number>,
  "name": "John Doe",
  "createdAt": Any<String>,
  "token": Any<String>
}
`;
```

---

## Commands

| Command                | Description      |
| ---------------------- | ---------------- |
| `npm test`             | Run all tests    |
| `npm test -- -u`       | Update snapshots |
| `npm run test:watch`   | Watch mode       |
| `npm run test:verbose` | Verbose output   |

---

## Authentication

Create `.env` file:

```bash
API_BASE_URL=http://localhost:3000
ACCESS_TOKEN=your-jwt-token
CUSTOM_HEADERS={"X-Api-Key":"your-key"}
```

---

## Workflow

1. **First run**: `npm test` → Creates snapshots
2. **Make code changes**
3. **Run again**: `npm test` → Compares with snapshots
4. **If changed**: Review diff → Update with `npm test -- -u` if intentional

---

## Features

- ✅ **Automatic comparison** - Jest handles diffing
- ✅ **Property matchers** - Handle dynamic fields elegantly
- ✅ **Git-friendly** - Snapshots are readable text files
- ✅ **CI/CD ready** - Detect breaking changes automatically
- ✅ **TypeScript** - Full type safety

---

For detailed guide, see [README.vi.md](README.vi.md) (Vietnamese).
