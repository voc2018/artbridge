#!/usr/bin/env node
/* ArtBridge local server — no dependencies.
   Serves the site and appends each LA artist application to data/la-applications.csv.
   Run:  node server.js      then open http://localhost:8080/#apply
   This is a temporary store until a real database exists. Keep the CSV private. */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const S = require('./application-schema.js');

const ROOT = __dirname;
const CSV = path.join(ROOT, 'data', 'la-applications.csv');
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '127.0.0.1';
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.md': 'text/markdown; charset=utf-8', '.ico': 'image/x-icon'
};

function send(res, status, body, type = 'application/json; charset=utf-8', extra = {}) {
  res.writeHead(status, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff', ...extra });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function countRows() {
  if (!fs.existsSync(CSV)) return 0;
  // Each record ends with \r\n; embedded newlines inside answers are \n only (browser textarea).
  return Math.max(0, fs.readFileSync(CSV, 'utf8').split('\r\n').filter(Boolean).length - 1);
}

function append(record) {
  fs.mkdirSync(path.dirname(CSV), { recursive: true });
  if (!fs.existsSync(CSV)) fs.writeFileSync(CSV, '﻿' + S.headerLine() + '\r\n');
  const clean = {};
  for (const k of S.COLUMNS) clean[k] = String(record[k] ?? '').replace(/\r\n?/g, '\n');
  fs.appendFileSync(CSV, S.rowLine(clean) + '\r\n');
}

function readBody(req, limit = 200000) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > limit) { reject(new Error('Too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const p = decodeURIComponent(url.pathname);

  if (p === '/api/applications/status' && req.method === 'GET') return send(res, 200, { csv: true, file: 'data/la-applications.csv', count: countRows() });

  if (p === '/api/applications' && req.method === 'POST') {
    try {
      const { record } = JSON.parse(await readBody(req));
      const problems = S.validate(record);
      if (problems.length) return send(res, 400, { error: 'Invalid application', fields: problems });
      append(record);
      console.log(`+ application ${record.id} · ${record.full_name} · total ${countRows()}`);
      return send(res, 201, { ok: true, file: 'data/la-applications.csv' });
    } catch (e) { return send(res, 400, { error: 'Bad request' }); }
  }

  if (p === '/api/applications.csv' && req.method === 'GET') {
    if (!fs.existsSync(CSV)) return send(res, 200, '﻿' + S.headerLine() + '\r\n', 'text/csv; charset=utf-8');
    return send(res, 200, fs.readFileSync(CSV), 'text/csv; charset=utf-8', { 'Content-Disposition': 'attachment; filename="la-applications.csv"', 'Cache-Control': 'no-store' });
  }

  if (p.startsWith('/api/')) return send(res, 404, { error: 'Not found' });
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Method not allowed' });

  // Static files. Never serve the applications CSV or server source directly.
  let file = path.normalize(path.join(ROOT, p === '/' ? 'index.html' : p));
  if (!file.startsWith(ROOT + path.sep) && file !== ROOT) return send(res, 403, { error: 'Forbidden' });
  if (file === CSV || path.basename(file) === 'server.js') return send(res, 403, { error: 'Forbidden' });
  fs.stat(file, (err, st) => {
    if (!err && st.isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (err2, data) => {
      if (err2) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
      send(res, 200, data, TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`ArtBridge running at http://localhost:${PORT}/`);
  console.log(`LA application form:  http://localhost:${PORT}/#apply`);
  console.log(`Applications are saved to: ${path.relative(process.cwd(), CSV) || CSV}`);
});
