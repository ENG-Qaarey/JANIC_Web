# Janic + Neon Postgres + Cloudflare Workers Hyperdrive Setup

## Quick Summary (8 Steps)

1. **Login** — `npx wrangler login`
2. **Create Hyperdrive** — `npx wrangler hyperdrive create janic-db --connection-string="postgresql://neondb_owner:npg_xOedaT2n9vJZ@ep-dawn-sea-b40enbve-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"` → **copy the ID**
3. **Add binding** — add the `hyperdrive` block to your `wrangler.jsonc` with the ID
4. **Install driver** — `npm install pg`
5. **Update Worker code** — use `env.HYPERDRIVE.connectionString` with `pg`'s `Client`
6. **Migrate SQL** — convert MySQL-specific syntax to Postgres (see conversion table below)
7. **Deploy** — `npx wrangler deploy`
8. **Rotate password** — since it was shared in plain text, reset it in Neon and update Hyperdrive

---

## 1. Login to Cloudflare

```bash
npx wrangler login
```

---

## 2. Create Hyperdrive

Replace `YOUR_CONNECTION_STRING` with your actual Neon Postgres URL:

```bash
npx wrangler hyperdrive create janic-db \
  --connection-string="postgresql://neondb_owner:npg_xOedaT2n9vJZ@ep-dawn-sea-b40enbve-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

**⚠️ Important**: Copy the Hyperdrive ID output by this command. You'll need it in the next step.

---

## 3. Add Hyperdrive Binding to `wrangler.jsonc`

Create or update `wrangler.jsonc` at the root of your project:

```jsonc
{
  "name": "janic",
  "compatibility_date": "2026-10-28",
  "compatibility_flags": ["nodejs_terms"],
  "hyperdrive": {
    "ID": "YOUR_HYPERDRIVE_ID_HERE"
  }
}
```

Replace `YOUR_HYPERDRIVE_ID_HERE` with the ID from step 2.

---

## 4. Install `pg` Driver

```bash
npm install pg
```

---

## 5. Update Worker Code

Create or update your Worker file (e.g., `src/worker.ts` or `src/index.ts`):

```typescript
import { HYPERDRIVE } from "@cloudflare/workers-types";

// Get connection string from Hyperdrive binding
const connectionString = env.HYPERDRIVE!.connectionString;

// Create a pg Client
import { Client } from "pg";
const db = new Client({
  connectionString,
  // Optional: enable statement caching for performance
  statement_timeout: 30000,
});

export async function onRequest(context: { env: any }) {
  // Example: simple query
  await db.connect();
  
  try {
    const result = await db.query("SELECT version()");
    return new TextDecoder().decode(result.rows[0]);
  } finally {
    await db.end();
  }
}
```

**Note**: The `env.HYPERDRIVE.connectionString` is automatically populated by Cloudflare when you configure the binding in `wrangler.jsonc`.

---

## 6. MySQL → Postgres Syntax Conversion

Since your original schema may have MySQL-specific syntax, here's the conversion table:

| MySQL Syntax | Postgres Equivalent | Notes |
|---|---|---|
| `ENUM('value1', 'value2')` | `ENUM('value1', 'value2')` | Prisma handles this, but raw SQL needs care |
| `VARCHAR(191)` | `VARCHAR(191)` | Same, length preserved |
| `TEXT` | `TEXT` | Same |
| `DATETIME(3)` | `TIMESTAMP(3)` | Postgres uses TIMESTAMP |
| `INT AUTO_INCREMENT` | `SERIAL` | Use `GENERATED ALWAYS AS IDENTITY` |
| `utf8mb4_unicode_ci` | `utf8mb4_0900_ai_ci` or `varchar_pattern_ops` | Collation difference |
| `TINYINT(1) BOOL` | `BOOLEAN` | Direct replacement |
| `DATE` | `DATE` | Same |
| `TIMESTAMP` | `TIMESTAMP` | Same |
| `LIMIT N` | `LIMIT N` | Same |
| `OFFSET N` | `OFFSET N` | Same |
| `NOW()` | `NOW()` | Same |
| `UNIX_TIMESTAMP()` | `EXTRACT(EPOCH FROM now())` | For unix timestamps |
| `IFNULL(a, b)` | `COALESCE(a, b)` | Function rename |
| `AUTO_INCREMENT` | `GENERATED ALWAYS AS IDENTITY` | Identity columns |

**Example Conversion**:

MySQL:
```sql
CREATE TABLE `User` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Postgres:
```sql
CREATE TABLE "User" (
  id VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL,
  PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

---

## 7. Deploy

```bash
npx wrangler deploy
```

---

## 8. Rotate Password ⚠️

**Important**: The Neon password was shared in plain text during this conversation. For security:

1. **Reset your Neon password** at: https://app.neon.tech/project/settings/password
2. **Update the connection string** in `.env` and re-run the Hyperdrive setup:
   ```bash
   npx wrangler hyperdrive update janic-db \
     --connection-string="postgresql://neondb_owner:NEW_PASSWORD@ep-dawn-sea-b40enbve-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   ```

---

## Conversion Table (MySQL → Postgres) - Detailed

| Feature | MySQL | Postgres | Comment |
|---------|-------|----------|---------|
| **ENUM** | `ENUM('a','b')` | `ENUM('a','b')` | Prisma maps these automatically |
| **SET** | `SET('a','b')` | Not native | Use `TEXT` array instead |
| **SERIAL** | `INT AUTO_INCREMENT` | `SERIAL` or `BIGSERIAL` | Postgres identity |
| **BIGSERIAL** | `BIGINT AUTO_INCREMENT` | `BIGSERIAL` | 8-byte integer |
| **UNSIGNED** | `INT UNSIGNED` | Remove UNSIGNED | Postgres int is signed |
| **DEFAULT CURRENT_TIMESTAMP** | `DEFAULT CURRENT_TIMESTAMP` | `DEFAULT NOW()` | Same meaning, different function |
| **CREATE TABLE ... ENGINE=InnoDB** | Not applicable | Not needed | Postgres uses tablespaces |
| **DISTINCT** | `SELECT DISTINCT col FROM tbl` | `SELECT DISTINCT col FROM tbl` | Same syntax |
| **GROUP BY** | `GROUP BY col` | `GROUP BY col` | Same |
| **ORDER BY** | `ORDER BY col` | `ORDER BY col` | Same |
| **JOIN** | `INNER JOIN, LEFT JOIN` | `INNER JOIN, LEFT JOIN` | Same |
| **Subqueries** | `WHERE id IN (SELECT...)` | `WHERE id IN (SELECT...)` | Same |
| **LIKE** | `col LIKE 'pattern'` | `col LIKE 'pattern'` | Same |
| **Regular Expressions** | `col REGEX 'pattern'` | `col ~ 'pattern'` | Different operator |
| **Case Insensitive** | `WHERE col LIKE '%abc%'` | `WHERE col ILIKE '%abc%'` | Postgres uses ILIKE |
| **Concatenation** | `CONCAT(a, b)` | `a || b` | Postgres uses `||` |
| **If/Else** | `IF(condition, true, false)` | `CASE WHEN condition THEN true ELSE false END` | CASE WHEN syntax |
| **Limit/Offset** | `LIMIT 10 OFFSET 0` | `LIMIT 10 OFFSET 0` | Same |
| **Row Number** | `SELECT @row := @row + 1` | `ROW_NUMBER() OVER (ORDER BY col)` | Window function |

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| `P3006: Migration failed to apply` | Schema drift between Prisma and DB | Run `prisma migrate reset` or `prisma db push` |
| `Connection timeout` | Hyperdrive not provisioned | Wait 2-3 mins after creating Hyperdrive, then deploy |
| `SSL connection error` | Missing `sslmode=require` | Add `?sslmode=require&channel_binding=require` to connection string |
| `Provider mismatch` | `migration_lock.toml` says MySQL but schema is Postgres | Delete `migration_lock.toml` and recreate migrations |
| `pg connection error` | Wrong connection string format | Ensure format: `postgresql://user:pass@host/db?sslmode=require` |
| `Deployment fails` | Missing `compatibility_flags` | Add `["nodejs_terms"]` to `wrangler.jsonc` |
| `Hyperdrive not found` | Wrong ID in `wrangler.jsonc` | Re-run step 2 and copy the correct ID |

---

## Quick Reference - All Commands in Order

```bash
# 1. Login
npx wrangler login

# 2. Create Hyperdrive (copy ID output)
npx wrangler hyperdrive create janic-db \
  --connection-string="postgresql://neondb_owner:npg_xOedaT2n9vJZ@ep-dawn-sea-b40enbve-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# 3. Update wrangler.jsonc with the ID
# (edit file manually, add hyperdrive.ID block)

# 4. Install pg driver
npm install pg

# 5. Update Worker code to use env.HYPERDRIVE.connectionString

# 6. Convert any MySQL raw SQL to Postgres (see conversion table)

# 7. Deploy
npx wrangler deploy

# 8. Rotate password (security!)
# - Reset password in Neon dashboard
# - Update .env and re-run step 2 to refresh Hyperdrive
```

---

## File Structure Reference

Your project should have these key files updated:

```
janic/
├── .env                  ← DATABASE_URL updated
├── wrangler.jsonc        ← hyperdrive binding added
├── wrangler.toml         ← may need compatibility_flags
├── package.json          ← pg dependency added
├── src/worker.ts         ← pg Client using env.HYPERDRIVE
├── prisma/
│   ├── schema.prisma     ← provider = "postgresql"
│   ├── migrations/       ← already synced
│   └── seed.js           ← already ran successfully
└── janic-neon-hyperdrive-setup.md  ← this guide (you are here)
```

---