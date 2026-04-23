import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "public");
const OUT = path.join(__dirname, "dist", "public");

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });
await fs.cp(SRC, OUT, { recursive: true });
console.log(`Built static site → ${OUT}`);
