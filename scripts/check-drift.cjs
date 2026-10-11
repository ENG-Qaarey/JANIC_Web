const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const p = new PrismaClient();
const schema = fs.readFileSync("prisma/schema.prisma", "utf8");

const models = schema.match(/model\s+\w+\s*\{[\s\S]*?\n\}/g) || [];
const parsed = {};
for (const m of models) {
  const name = m.match(/model\s+(\w+)/)[1];
  const body = m.slice(m.indexOf("{") + 1, m.lastIndexOf("}"));
  const fields = [];
  for (const line of body.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("//") || t.startsWith("@@")) continue;
    const fm = t.match(/^(\w+)\s+(String|Int|Boolean|DateTime|Float|Decimal)\b(\?)?/);
    if (fm) fields.push({ col: fm[1], type: fm[2], optional: !!fm[3] });
  }
  parsed[name] = fields;
}

(async () => {
  const missingTables = [];
  const missingCols = [];

  for (const name of Object.keys(parsed)) {
    const table = name.toLowerCase();
    let res;
    try {
      res = await p.$queryRawUnsafe(
        `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='janic_db' AND TABLE_NAME='${table}'`
      );
    } catch (e) {
      continue;
    }

    // Table entirely absent — previously skipped by the column-only check.
    if (res.length === 0) {
      missingTables.push({ model: name, table, cols: parsed[name] });
      continue;
    }

    const have = new Set(res.map((r) => r.COLUMN_NAME));
    const missing = parsed[name].filter((f) => !have.has(f.col));
    if (missing.length) missingCols.push({ model: name, table, missing });
  }

  if (missingTables.length === 0 && missingCols.length === 0) {
    console.log("No drift: all tables and columns present.");
  }

  if (missingTables.length) {
    console.log("\nMISSING TABLES:");
    for (const t of missingTables) {
      console.log(`  ${t.model}  (${t.table}) — ${t.cols.length} columns`);
    }
  }

  if (missingCols.length) {
    console.log("\nMISSING COLUMNS:");
    for (const c of missingCols) {
      console.log(`  ${c.model}:`);
      c.missing.forEach((f) => console.log(`     ${f.col} ${f.type}${f.optional ? "?" : ""}`));
    }
  }

  console.log(
    `\nsummary: ${missingTables.length} missing table(s), ${missingCols.length} table(s) with missing columns`
  );
  await p.$disconnect();
})();