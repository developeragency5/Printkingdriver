import http from "node:http";
import fs from "node:fs/promises";
import { existsSync, watch as fsWatch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "public");
const IS_DEV = process.env.NODE_ENV !== "production";

// --- Live reload (dev only) -------------------------------------------------
const reloadClients = new Set();
let reloadTimer = null;
function notifyReload() {
  if (reloadTimer) return;
  reloadTimer = setTimeout(() => {
    reloadTimer = null;
    for (const res of reloadClients) {
      try { res.write("data: reload\n\n"); } catch {}
    }
  }, 120); // debounce burst writes (e.g. minify run touching many files)
}
if (IS_DEV) {
  try {
    fsWatch(ROOT, { recursive: true }, (_evt, filename) => {
      if (!filename) return;
      // Ignore editor swap files
      if (/(^|\/)\./.test(filename)) return;
      notifyReload();
    });
    console.log("Live reload watcher active on", ROOT);
  } catch (e) {
    console.warn("Live reload watcher failed:", e.message);
  }
}
const RELOAD_SNIPPET = `<script>(function(){try{var es;function connect(){es=new EventSource('/__reload');es.onmessage=function(){location.reload()};}connect();window.addEventListener('pagehide',function(){if(es){es.close();es=null;}});window.addEventListener('pageshow',function(e){if(e.persisted&&!es)connect();});}catch(e){}})();</script>`;

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
    // Live-reload SSE endpoint (dev only)
    if (IS_DEV && req.url === "/__reload") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      });
      res.write("retry: 1000\n\n");
      reloadClients.add(res);
      req.on("close", () => reloadClients.delete(res));
      return;
    }

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
    let data = await fs.readFile(file);
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
    // Dev-only: inject live-reload snippet before </body> so the browser
    // refreshes automatically when files in /public change.
    if (IS_DEV && isHtml) {
      const html = data.toString("utf8");
      const injected = html.includes("</body>")
        ? html.replace("</body>", RELOAD_SNIPPET + "</body>")
        : html + RELOAD_SNIPPET;
      data = Buffer.from(injected, "utf8");
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
