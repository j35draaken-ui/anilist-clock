const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { URL } = require('node:url');

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, 'public');
const FONT = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const THEMES = {
  dark: { digits: '#e7f5f7', seconds: '#55d6e8', colon: '#668493', label: '#9cb4bb', panel: '#081820' },
  light: { digits: '#25313c', seconds: '#187f9a', colon: '#8293a0', label: '#5e6d77', panel: '#f4f8f7' },
};

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.ico': 'image/x-icon',
};

function escapeXml(value) {
  return String(value).replace(/[&<>\"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
  }[character]));
}

function normalizeFlag(value) {
  const flag = String(value || '').trim().toLowerCase();
  return /^[a-z]{2}(?:-[a-z]{3})?$/.test(flag) ? flag : '';
}

function normalizeLabel(value) {
  return String(value || '').trim().slice(0, 28);
}

function timeIn(timeZone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date()).map((part) => [part.type, part.value]));

  return { h: Number(parts.hour) % 24, m: Number(parts.minute), s: Number(parts.second) };
}

function neutralFlag() {
  return `<g aria-label="flag unavailable"><rect width="18" height="12" rx="1.5" fill="#1b3440"/><circle cx="9" cy="6" r="3.2" fill="none" stroke="#55d6e8" stroke-width="0.9"/><path d="M9 1.5v1.7M9 8.8v1.7M4.5 6h1.7M11.8 6h1.7" stroke="#55d6e8" stroke-width="0.8" stroke-linecap="round"/></g>`;
}

async function loadFlag(code) {
  if (!code) return { markup: '', found: false };

  try {
    const response = await fetch(`https://flagcdn.com/${code}.svg`);
    if (!response.ok) return { markup: neutralFlag(), found: false };
    const encoded = Buffer.from(await response.text(), 'utf8').toString('base64');
    return {
      markup: `<image href="data:image/svg+xml;base64,${encoded}" width="18" height="12" preserveAspectRatio="none" clip-path="url(#flagCorners)"/>`,
      found: true,
    };
  } catch {
    return { markup: neutralFlag(), found: false };
  }
}

function strip(x, digits, step, offset, color, width = 11, height = 22) {
  const rows = digits.map((_, index) => `0,${-index * height}`).join(';');
  const texts = digits.map((digit, index) => `<text x="${width / 2}" y="${index * height + 17}">${digit}</text>`).join('');
  return `<svg x="${x}" y="4" width="${width}" height="${height}" overflow="hidden"><g fill="${color}" text-anchor="middle">${texts}<animateTransform attributeName="transform" type="translate" calcMode="discrete" values="${rows}" dur="${digits.length * step}s" begin="-${offset}s" repeatCount="indefinite"/></g></svg>`;
}

function colon(x, color) {
  return `<text x="${x + 3}" y="20" text-anchor="middle" fill="${color}">:<animate attributeName="opacity" values="1;0.28" calcMode="discrete" dur="1s" repeatCount="indefinite"/></text>`;
}

async function renderClock(url) {
  const requestedTimeZone = url.searchParams.get('tz') || 'UTC';
  const requestedFlag = String(url.searchParams.get('flag') || '').trim().toLowerCase();
  const flag = normalizeFlag(requestedFlag);
  const label = normalizeLabel(url.searchParams.get('label'));
  const themeName = url.searchParams.get('theme') === 'light' ? 'light' : 'dark';
  const colors = THEMES[themeName];

  let timeZone = requestedTimeZone;
  let time;
  let timezoneWarning = false;
  try {
    time = timeIn(timeZone);
  } catch {
    timeZone = 'UTC';
    time = timeIn('UTC');
    timezoneWarning = true;
  }

  const flagData = requestedFlag && !flag
    ? { markup: neutralFlag(), found: false }
    : await loadFlag(flag);
  const flagMarkup = flagData.markup;
  const d10 = '0123456789'.split('');
  const d6 = '012345'.split('');
  const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
  const secondsOfDay = time.h * 3600 + time.m * 60 + time.s;
  const parts = [];
  let x = flagMarkup ? 26 : 1;

  parts.push(strip(x, hours.map((value) => value[0]), 3600, secondsOfDay, colors.digits)); x += 11;
  parts.push(strip(x, hours.map((value) => value[1]), 3600, secondsOfDay, colors.digits)); x += 11;
  parts.push(colon(x, colors.colon)); x += 6;
  parts.push(strip(x, d6, 600, time.m * 60 + time.s, colors.digits)); x += 11;
  parts.push(strip(x, d10, 60, (time.m % 10) * 60 + time.s, colors.digits)); x += 11;
  parts.push(colon(x, colors.colon)); x += 6;
  parts.push(strip(x, d6, 10, time.s, colors.seconds)); x += 11;
  parts.push(strip(x, d10, 1, time.s % 10, colors.seconds)); x += 11;

  const warningLabel = timezoneWarning
    ? (label ? `${label} · UTC` : 'UTC fallback')
    : (!flagData.found && requestedFlag ? 'flag unavailable' : '');
  const visibleLabel = timezoneWarning ? warningLabel : (label || warningLabel);
  const labelX = x + 8;
  const width = Math.round(visibleLabel ? labelX + visibleLabel.length * 6.6 + 2 : x + 2);
  const title = `${timeZone} clock${visibleLabel ? ` — ${visibleLabel}` : ''}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="30" viewBox="0 0 ${width} 30" role="img" aria-label="${escapeXml(title)}"><title>${escapeXml(title)}</title><defs><clipPath id="flagCorners"><rect width="18" height="12" rx="1.5"/></clipPath></defs><g transform="translate(1 9)">${flagMarkup}</g><g font-family="${FONT}" font-size="18" font-weight="600">${parts.join('')}</g>${visibleLabel ? `<text x="${labelX}" y="19.5" font-family="${FONT}" font-size="12" fill="${colors.label}">${escapeXml(visibleLabel)}</text>` : ''}</svg>`;
}

async function serveStatic(request, response, pathname) {
  let relativePath;
  try {
    relativePath = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Bad request');
    return;
  }

  const filePath = path.resolve(PUBLIC_DIR, `.${relativePath}`);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  try {
    const body = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      'Content-Type': CONTENT_TYPES[extension] || 'application/octet-stream',
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=3600',
    });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Method not allowed');
    return;
  }

  if (url.pathname === '/_health') {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end('ok');
    return;
  }

  if (url.pathname === '/clock.svg') {
    const svg = await renderClock(url);
    response.writeHead(200, {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    });
    if (request.method === 'HEAD') response.end();
    else response.end(svg);
    return;
  }

  if (request.method === 'HEAD') {
    response.writeHead(404);
    response.end();
    return;
  }
  await serveStatic(request, response, url.pathname);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`AniList Clock Studio listening on ${PORT}`);
});
