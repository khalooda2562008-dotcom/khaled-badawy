// يُشغَّل وقت النشر: يكتب config.js بالمفتاح من GitHub Secrets (بدون وضعه في المستودع).
import { writeFileSync } from "node:fs";

const key = (process.env.OPENAI_API_KEY || "").trim();
const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

writeFileSync(
  "config.js",
  `window.NEXUS_AI = ${JSON.stringify({ key, model, base: "https://api.openai.com/v1" }, null, 2)};\n`
);

console.log("config.js written. key:", key ? key.slice(0, 7) + "…" : "NONE (AI will ask for a key in the browser)");
