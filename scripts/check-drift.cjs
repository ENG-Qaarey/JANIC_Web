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
    if (res.length === 0) continue;
    const have = new Set(res.map((r) => r.COLUMN_NAME));
    const missing = parsed[name].filter((f) => !have.has(f.col));
    if (missing.length) {
      console.log(`${name} MISSING:`);
      missing.forEach((f) => console.log(`   ${f.col} ${f.type}${f.optional ? "?" : ""}`));
    }
  }
  await p.$disconnect();
})();