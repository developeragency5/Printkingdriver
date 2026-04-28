import http from "node:http";
import fs from "node:fs/promises";
import { existsSync, watch as fsWatch } from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync, brotliCompressSync, constants as zlibConst } from "node:zlib";
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
    cache.clear();
  }, 120);
}
if (IS_DEV) {
  try {
    fsWatch(ROOT, { recursive: true }, (_evt, filename) => {
      if (!filename) return;
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
  ".xml":  "application/xml; charset=utf-8",
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

// Compressible MIME prefixes — text-based formats benefit from gzip/brotli;
// already-compressed binary formats (png/jpg/woff2) do not.
function isCompressible(mime) {
  return /^(text\/|application\/(javascript|json|xml|ld\+json)|image\/svg\+xml)/.test(mime);
}

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
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  let target = safeJoin(ROOT, clean);
  if (!target) return null;
  let f = await tryFile(target);
  if (f) return f;
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
  f = await tryFile(target + ".html");
  if (f) return f;
  return null;
}

// In-memory cache of {raw, gzip, br, etag, mime} keyed by absolute file path.
// Cleared on file change in dev. Bounded implicitly by site size (~6.5MB raw).
const cache = new Map();

function buildEntry(file, ext, raw) {
  const mime = MIME[ext] ?? "application/octet-stream";
  const compressible = isCompressible(mime) && raw.length >= 256;
  const etag = '"' + createHash("sha1").update(raw).digest("base64").slice(0, 16) + '"';
  const entry = { raw, mime, etag, compressible, gzip: null, br: null };
  if (compressible) {
    try {
      entry.gzip = gzipSync(raw, { level: 6 });
      entry.br = brotliCompressSync(raw, {
        params: { [zlibConst.BROTLI_PARAM_QUALITY]: 5 },
      });
    } catch {}
  }
  return entry;
}

function pickEncoding(acceptEncoding, entry) {
  if (!entry.compressible) return null;
  const ae = (acceptEncoding || "").toLowerCase();
  if (entry.br && ae.includes("br")) return { name: "br", body: entry.br };
  if (entry.gzip && ae.includes("gzip")) return { name: "gzip", body: entry.gzip };
  return null;
}

const server = http.createServer(async (req, res) => {
  try {
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
    const isAsset = /\.(webp|png|jpe?g|gif|svg|ico|css|js|woff2?|ttf)$/i.test(file);
    const isHtml = ext === ".html";

    // Read + (optionally) inject live-reload before caching.
    let raw;
    let cacheKey = file;
    if (IS_DEV && isHtml) {
      const html = (await fs.readFile(file)).toString("utf8");
      raw = Buffer.from(
        html.includes("</body>")
          ? html.replace("</body>", RELOAD_SNIPPET + "</body>")
          : html + RELOAD_SNIPPET,
        "utf8"
      );
      cacheKey = file + "?dev";
    }

    let entry = cache.get(cacheKey);
    if (!entry) {
      if (!raw) raw = await fs.readFile(file);
      entry = buildEntry(file, ext, raw);
      cache.set(cacheKey, entry);
    }

    // Cache-Control: even in dev we want browsers to revalidate (return 304)
    // rather than re-download the full payload on every page navigation.
    let cacheControl;
    if (process.env.NODE_ENV === "production") {
      if (isAsset) cacheControl = "public, max-age=31536000, immutable";
      else if (isHtml) cacheControl = "public, max-age=300, must-revalidate";
      else cacheControl = "public, max-age=3600";
    } else {
      // Dev: must-revalidate ensures HTML refetch picks up changes,
      // but the ETag short-circuit returns 304 when content is unchanged.
      cacheControl = "no-cache";
    }

    // ETag-based 304
    if (req.headers["if-none-match"] === entry.etag) {
      res.writeHead(304, {
        "ETag": entry.etag,
        "Cache-Control": cacheControl,
      });
      res.end();
      return;
    }

    const headers = {
      "Content-Type": entry.mime,
      "Cache-Control": cacheControl,
      "ETag": entry.etag,
      "Vary": "Accept-Encoding",
    };

    // HEAD requests
    if (req.method === "HEAD") {
      headers["Content-Length"] = String(entry.raw.length);
      res.writeHead(200, headers);
      res.end();
      return;
    }

    const enc = pickEncoding(req.headers["accept-encoding"], entry);
    if (enc) {
      headers["Content-Encoding"] = enc.name;
      headers["Content-Length"] = String(enc.body.length);
      res.writeHead(200, headers);
      res.end(enc.body);
    } else {
      headers["Content-Length"] = String(entry.raw.length);
      res.writeHead(200, headers);
      res.end(entry.raw);
    }
  } catch (err) {
    console.error("Server error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal server error");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`PrintKingDriver static site → http://0.0.0.0:${PORT}`);
  console.log(`  • gzip + brotli compression: enabled`);
  console.log(`  • ETag revalidation: enabled`);
  console.log(`  • live-reload: ${IS_DEV ? "enabled" : "disabled"}`);
});
