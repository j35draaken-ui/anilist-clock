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
  '.ttf': 'font/ttf',
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

function timeIn(timeZone, date) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date).map((part) => [part.type, part.value]));

  return { h: Number(parts.hour) % 24, m: Number(parts.minute), s: Number(parts.second) };
}

function isDaylight(date, latitude, longitude) {
  const dayOfYear = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    - Date.UTC(date.getUTCFullYear(), 0, 0)) / 86400000);
  const utcHour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (utcHour - 12) / 24);
  const equationOfTime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma)
    - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma)
    - 0.040849 * Math.sin(2 * gamma));
  const declination = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
    - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
    - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
  const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
  const solarMinutes = ((utcMinutes + equationOfTime + 4 * longitude) % 1440 + 1440) % 1440;
  const hourAngle = (solarMinutes / 4 - 180) * Math.PI / 180;
  const latitudeRadians = latitude * Math.PI / 180;
  const cosineZenith = Math.sin(latitudeRadians) * Math.sin(declination)
    + Math.cos(latitudeRadians) * Math.cos(declination) * Math.cos(hourAngle);
  return cosineZenith >= Math.cos(90.833 * Math.PI / 180);
}

function normalizeColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback;
}

function locationMap(x, latitude, longitude, coordinatesProvided, options) {
  const { water, land, grid, markerColor, markerSize } = options;
  const marker = coordinatesProvided
    ? `<circle cx="${1 + ((longitude + 180) / 360) * 94}" cy="${1 + ((90 - latitude) / 180) * 30}" r="${markerSize + 2}" fill="${markerColor}" fill-opacity=".24"/><circle cx="${1 + ((longitude + 180) / 360) * 94}" cy="${1 + ((90 - latitude) / 180) * 30}" r="${markerSize}" fill="${markerColor}" stroke="#ffffff" stroke-width="1.2"/>`
    : '<text x="48" y="18" text-anchor="middle" font-family="sans-serif" font-size="5" font-weight="600" letter-spacing=".7" fill="#ffffff">ADD COORDINATES</text>';
  const map = `<g aria-label="${coordinatesProvided ? 'Map showing selected location' : 'Map; coordinates needed to place marker'}"><rect x="0" y="0" width="96" height="32" rx="4" fill="${water}"/><g fill="none" stroke="${grid}" stroke-opacity=".42" stroke-width=".35"><path d="M0 8h96M0 16h96M0 24h96M24 0v32M48 0v32M72 0v32"/></g><g fill="${land}" stroke="${grid}" stroke-opacity=".42" stroke-width=".45"><path d="M9 6 14 3 22 4 25 7 31 7 34 11 31 13 29 17 25 17 23 21 20 19 18 15 14 13 13 10 10 9z"/><path d="m28 19 5 1 3 4-2 4-2 3-2-3-1-4-3-3z"/><path d="m43 7 4-2 4 1 2 3-3 2-4-1z"/><path d="m45 12 6-1 4 3 1 5-3 6-3 3-2-4-3-4-2-5z"/><path d="m51 6 8-2 7 2 7-1 9 4-2 4-6 1-2 4-5-1-4-3-5 1-4-3-5 1-2-3z"/><path d="m73 22 5 1 3 3-3 3-5-1-2-3z"/></g>${marker}</g>`;
  return `<svg x="${x}" y="3" width="96" height="32" viewBox="0 0 96 32">${map}</svg>`;
}

function neutralFlag() {
  return `<g aria-label="flag unavailable"><rect width="18" height="12" rx="1.5" fill="#1b3440"/><circle cx="9" cy="6" r="3.2" fill="none" stroke="#55d6e8" stroke-width="0.9"/><path d="M9 1.5v1.7M9 8.8v1.7M4.5 6h1.7M11.8 6h1.7" stroke="#55d6e8" stroke-width="0.8" stroke-linecap="round"/></g>`;
}

async function loadFlag(code) {
  if (!code) return { markup: '', found: false };

  try {
    const body = await fs.readFile(path.join(PUBLIC_DIR, 'flags', `${code}.svg`));
    const encoded = body.toString('base64');
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
  const sunEnabled = url.searchParams.get('sun') !== '0';
  const dotColor = normalizeColor(url.searchParams.get('dot'), '#2bd576');
  const dayColor = normalizeColor(url.searchParams.get('daycolor'), '#f2c94c');
  const nightColor = normalizeColor(url.searchParams.get('nightcolor'), '#83aaff');
  const mapEnabled = url.searchParams.get('map') !== '0';
  const mapWater = normalizeColor(url.searchParams.get('mapwater'), '#10242c');
  const mapLand = normalizeColor(url.searchParams.get('mapland'), '#31545a');
  const mapGrid = normalizeColor(url.searchParams.get('mapgrid'), '#557279');
  const mapMarkerColor = normalizeColor(url.searchParams.get('mapmarker'), dotColor);
  const rawMapMarkerSize = Number(url.searchParams.get('mapdot'));
  const mapMarkerSize = Number.isInteger(rawMapMarkerSize) && rawMapMarkerSize >= 2 && rawMapMarkerSize <= 7 ? rawMapMarkerSize : 4;
  const rawLatitude = url.searchParams.get('lat');
  const rawLongitude = url.searchParams.get('lon');
  const latitude = rawLatitude !== null && rawLatitude.trim() !== '' ? Number(rawLatitude) : NaN;
  const longitude = rawLongitude !== null && rawLongitude.trim() !== '' ? Number(rawLongitude) : NaN;
  const coordinatesProvided = Number.isFinite(latitude) && latitude >= -90 && latitude <= 90
    && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;

  let timeZone = requestedTimeZone;
  let time;
  let timezoneWarning = false;
  const now = new Date();
  try {
    time = timeIn(timeZone, now);
  } catch {
    timeZone = 'UTC';
    time = timeIn('UTC', now);
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
  const badgeX = visibleLabel ? labelX + visibleLabel.length * 6.6 + 9 : x + 8;
  const daylight = coordinatesProvided
    ? isDaylight(now, latitude, longitude)
    : time.h >= 6 && time.h < 18;
  const daylightText = daylight ? 'DAY' : 'NIGHT';
  const daylightColor = daylight ? dayColor : nightColor;
  const badgeWidth = 48;
  const width = Math.round(sunEnabled ? badgeX + badgeWidth + 2 : (visibleLabel ? labelX + visibleLabel.length * 6.6 + 2 : x + 2));
  const daylightDescription = sunEnabled
    ? ` — ${daylightText} ${coordinatesProvided ? 'at selected coordinates' : '(estimated from local time)'}`
    : '';
  const title = `${timeZone} clock${visibleLabel ? ` — ${visibleLabel}` : ''}${daylightDescription}`;
  const badge = sunEnabled
    ? `<g aria-label="${daylightText}${coordinatesProvided ? ', solar-calculated' : ', estimated from local time'}"><rect x="${badgeX}" y="5" width="${badgeWidth}" height="20" rx="10" fill="${daylightColor}" fill-opacity=".16"/><circle cx="${badgeX + 8}" cy="15" r="2.5" fill="${dotColor}"/><text x="${badgeX + 14}" y="18" font-family="${FONT}" font-size="8" font-weight="600" fill="${daylightColor}">${daylightText}</text></g>`
    : '';
  const mapX = sunEnabled ? badgeX + badgeWidth + 8 : (visibleLabel ? labelX + visibleLabel.length * 6.6 + 8 : x + 8);
  const map = mapEnabled
    ? locationMap(mapX, latitude, longitude, coordinatesProvided, {
      water: mapWater, land: mapLand, grid: mapGrid, markerColor: mapMarkerColor, markerSize: mapMarkerSize,
    })
    : '';
  const mapWidth = 96;
  const contentWidth = mapEnabled
    ? mapX + mapWidth + 2
    : (sunEnabled ? badgeX + badgeWidth + 2 : (visibleLabel ? labelX + visibleLabel.length * 6.6 + 2 : x + 2));

  const height = mapEnabled ? 38 : 30;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.max(width, contentWidth)}" height="${height}" viewBox="0 0 ${Math.max(width, contentWidth)} ${height}" role="img" aria-label="${escapeXml(title)}"><title>${escapeXml(title)}</title><defs><clipPath id="flagCorners"><rect width="18" height="12" rx="1.5"/></clipPath></defs><g transform="translate(1 9)">${flagMarkup}</g><g font-family="${FONT}" font-size="18" font-weight="600">${parts.join('')}</g>${visibleLabel ? `<text x="${labelX}" y="19.5" font-family="${FONT}" font-size="12" fill="${colors.label}">${escapeXml(visibleLabel)}</text>` : ''}${badge}${map}</svg>`;
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

  if (url.pathname === '/clock.svg' || url.pathname === '/clock.php') {
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
