// @ts-check
// Minimal static server for dist/, behaving like a typical static host:
// directory → index.html, unknown path → 404.html with status 404.
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT) || 4173;

/** @type {Record<string, string>} */
const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
};

/** @param {string} urlPath @returns {Promise<string | null>} */
async function resolveFile(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  const candidate = path.resolve(DIST, `.${path.posix.normalize(decoded)}`);
  if (candidate !== DIST && !candidate.startsWith(DIST + path.sep)) return null; // path traversal
  try {
    const info = await stat(candidate);
    if (info.isDirectory()) {
      const index = path.join(candidate, 'index.html');
      await stat(index);
      return index;
    }
    return candidate;
  } catch {
    return null;
  }
}

createServer(async (request, response) => {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost');
  // Mirror production: directory URLs always end in a slash (one canonical form, 301 otherwise).
  if (!pathname.endsWith('/') && !path.extname(pathname)) {
    const directory = await resolveFile(`${pathname}/`);
    if (directory) {
      response.writeHead(301, { Location: `${pathname}/` }).end();
      return;
    }
  }
  const file = await resolveFile(pathname);
  const target = file ?? path.join(DIST, '404.html');
  response.writeHead(file ? 200 : 404, {
    'Content-Type': CONTENT_TYPES[path.extname(target)] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  createReadStream(target).on('error', () => response.end()).pipe(response);
}).listen(PORT, () => {
  console.log(`Figlab preview: http://localhost:${PORT}/  (English: http://localhost:${PORT}/en/)`);
});
