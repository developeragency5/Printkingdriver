import http from "node:http";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "public");

const PORT = Number(process.env.PORT);
if (!PORT || Number.isNaN(PORT)) {
  console.error("PORT env var is required");
  process.exit(1);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".ico":  "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".txt":  "text/plain; charset=utf-8",
};

function safeJoin(base, target) {
  const resolved = path.normalize(path.join(base, target));
  if (!resolved.startsWith(base)) return null;
  return resolved;
}

async function tryFile(p) {
  try {
    const st = await fs.stat(p);
    if (st.isFile()) return p;
  } catch {}
  return null;
}

async function resolvePath(urlPath) {
  // Strip query
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  let target = safeJoin(ROOT, clean);
  if (!target) return null;

  // Direct hit
  let f = await tryFile(target);
  if (f) return f;

  // Directory → index.html
  if (existsSync(target)) {
    try {
      const st = await fs.stat(target);
      if (st.isDirectory()) {
        const idx = path.join(target, "index.html");
        f = await tryFile(idx);
        if (f) return f;
      }
    } catch {}
  }

  // Pretty URLs: /drivers/chipset → /drivers/chipset.html
  f = await tryFile(target + ".html");
  if (f) return f;

  return null;
}

const server = http.createServer(async (req, res) => {
  try {
    const file = await resolvePath(req.url);
    if (!file) {
      const notFound = path.join(ROOT, "404.html");
      const nf = await tryFile(notFound);
      if (nf) {
        const data = await fs.readFile(nf);
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
        return;
      }
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(file).toLowerCase();
    const data = await fs.readFile(file);
    const isAsset = /\.(webp|png|jpe?g|gif|svg|ico|css|js|woff2?|ttf)$/i.test(file);
    const isHtml = ext === ".html";
    let cacheControl;
    if (process.env.NODE_ENV === "production") {
      if (isAsset) cacheControl = "public, max-age=31536000, immutable";
      else if (isHtml) cacheControl = "public, max-age=300, must-revalidate";
      else cacheControl = "public, max-age=3600";
    } else {
      cacheControl = "no-store";
    }
    res.writeHead(200, {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": cacheControl,
    });
    res.end(data);
  } catch (err) {
    console.error("Server error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal server error");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`PrintKingDriver static site → http://0.0.0.0:${PORT}`);
});
