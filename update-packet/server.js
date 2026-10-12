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
  '.jpg': 'image/jpeg',
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

function solarPosition(timestamp) {
  const julianDate = timestamp / 86400 + 2440587.5;
  const century = (julianDate - 2451545) / 36525;
  const meanLongitude = ((280.46646 + century * (36000.76983 + 0.0003032 * century)) % 360 + 360) % 360;
  const meanAnomaly = ((357.52911 + century * (35999.05029 - 0.0001537 * century)) % 360) * Math.PI / 180;
  const equationOfCenter = (1.914602 - century * (0.004817 + 0.000014 * century)) * Math.sin(meanAnomaly)
    + (0.019993 - 0.000101 * century) * Math.sin(2 * meanAnomaly)
    + 0.000289 * Math.sin(3 * meanAnomaly);
  const omega = (125.04 - 1934.136 * century) * Math.PI / 180;
  const lambda = (meanLongitude + equationOfCenter - 0.00569 - 0.00478 * Math.sin(omega)) * Math.PI / 180;
  const obliquity = (23.439291 - 0.0130042 * century + 0.00256 * Math.cos(omega)) * Math.PI / 180;
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(lambda)) * 180 / Math.PI;
  const meanLongitudeRadians = meanLongitude * Math.PI / 180;
  const eccentricity = 0.016708634 - century * (0.000042037 + 0.0000001267 * century);
  const y = Math.tan(obliquity / 2) ** 2;
  const equationOfTime = 4 * (180 / Math.PI) * (
    y * Math.sin(2 * meanLongitudeRadians)
    - 2 * eccentricity * Math.sin(meanAnomaly)
    + 4 * eccentricity * y * Math.sin(meanAnomaly) * Math.cos(2 * meanLongitudeRadians)
    - 0.5 * y * y * Math.sin(4 * meanLongitudeRadians)
    - 1.25 * eccentricity * eccentricity * Math.sin(2 * meanAnomaly)
  );
  const date = new Date(timestamp * 1000);
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const subsolarLongitude = ((180 - 15 * utcHours - equationOfTime / 4 + 180) % 360 + 360) % 360 - 180;
  return { declination, subsolarLongitude };
}

function twilightPaths(timestamp, width = 480, height = 240) {
  const { declination, subsolarLongitude } = solarPosition(timestamp);
  const declinationRadians = declination * Math.PI / 180;
  const sinDeclination = Math.sin(declinationRadians);
  const cosDeclination = Math.cos(declinationRadians);
  const twilightThresholds = [0, -6, -12, -18].map((angle) => Math.sin(angle * Math.PI / 180));
  const paths = ['', '', '', ''];
  const xStep = 4;
  const yStep = 2;

  for (let x = 0; x < width; x += xStep) {
    const longitude = -180 + ((x + xStep / 2) * 360 / width);
    const hourAngle = (longitude - subsolarLongitude) * Math.PI / 180;
    const cosHourAngle = Math.cos(hourAngle);
    let currentState = -1;
    let runStart = 0;

    for (let y = 0; y <= height; y += yStep) {
      let state = -1;
      if (y < height) {
        const latitude = (90 - ((y + yStep / 2) * 180 / height)) * Math.PI / 180;
        const solarAltitude = Math.sin(latitude) * sinDeclination
          + Math.cos(latitude) * cosDeclination * cosHourAngle;
        state = solarAltitude >= twilightThresholds[0] ? 0
          : solarAltitude >= twilightThresholds[1] ? 1
            : solarAltitude >= twilightThresholds[2] ? 2
              : solarAltitude >= twilightThresholds[3] ? 3 : 4;
      }

      if (state !== currentState) {
        if (currentState > 0) {
          const runHeight = y - runStart;
          paths[currentState - 1] += `M${x} ${runStart}h${xStep}v${runHeight}h-${xStep}z`;
        }
        currentState = state;
        runStart = y;
      }
    }
  }
  return { paths, ...solarPosition(timestamp) };
}

function locationMap(x, latitude, longitude, coordinatesProvided, markerColor, markerSize, nightStrength, mapData, now) {
  const frameSeconds = 600;
  const frameCount = 18;
  const duration = frameSeconds * frameCount;
  const start = Math.floor(now.getTime() / (frameSeconds * 1000)) * frameSeconds;
  const frames = Array.from({ length: frameCount }, (_, index) => twilightPaths(start + index * frameSeconds));
  const opacities = [105, 85, 60, 30].map((alpha) => Math.min(0.9, ((127 - alpha) / 127) * nightStrength));
  const shading = frames[0].paths.map((path, index) => {
    const pathValues = frames.map((frame) => frame.paths[index]).join(';');
    return `<path d="${frames[0].paths[index]}" fill="#000008" fill-opacity="${opacities[index].toFixed(3)}"><animate attributeName="d" values="${pathValues}" dur="${duration}s" calcMode="discrete" repeatCount="indefinite"/></path>`;
  }).join('');
  const sunX = frames.map(({ subsolarLongitude }) => ((subsolarLongitude + 180) / 360) * 479);
  const sunY = frames.map(({ declination }) => ((90 - declination) / 180) * 239);
  const sun = `<g aria-label="Moving sun marker"><circle cx="${sunX[0].toFixed(2)}" cy="${sunY[0].toFixed(2)}" r="6.5" fill="none" stroke="#ffffff" stroke-width="1.5"><animate attributeName="cx" values="${sunX.map((value) => value.toFixed(2)).join(';')}" dur="${duration}s" calcMode="discrete" repeatCount="indefinite"/><animate attributeName="cy" values="${sunY.map((value) => value.toFixed(2)).join(';')}" dur="${duration}s" calcMode="discrete" repeatCount="indefinite"/></circle><circle cx="${sunX[0].toFixed(2)}" cy="${sunY[0].toFixed(2)}" r="3.5" fill="#ffcd32"><animate attributeName="cx" values="${sunX.map((value) => value.toFixed(2)).join(';')}" dur="${duration}s" calcMode="discrete" repeatCount="indefinite"/><animate attributeName="cy" values="${sunY.map((value) => value.toFixed(2)).join(';')}" dur="${duration}s" calcMode="discrete" repeatCount="indefinite"/></circle></g>`;
  const markerX = coordinatesProvided ? Math.max(5, Math.min(475, ((longitude + 180) / 360) * 479)) : null;
  const markerY = coordinatesProvided ? Math.max(5, Math.min(235, ((90 - latitude) / 180) * 239)) : null;
  const marker = coordinatesProvided
    ? `<circle cx="${markerX.toFixed(2)}" cy="${markerY.toFixed(2)}" r="${markerSize + 4}" fill="${markerColor}" fill-opacity=".3"/><circle cx="${markerX.toFixed(2)}" cy="${markerY.toFixed(2)}" r="${markerSize}" fill="${markerColor}" stroke="#ffffff" stroke-width="2"/>`
    : '';
  const utcLabels = frames.map((_, index) => {
    const stamp = start + index * frameSeconds;
    const text = `UTC ${new Date(stamp * 1000).toISOString().slice(11, 16)}`;
    const opacitiesForFrame = Array.from({ length: frameCount }, (_, frameIndex) => frameIndex === index ? '1' : '0').join(';');
    return `<text x="465" y="18" text-anchor="end" font-family="sans-serif" font-size="10" fill="#ffffff" opacity="0">${text}<animate attributeName="opacity" values="${opacitiesForFrame}" dur="${duration}s" calcMode="discrete" repeatCount="indefinite"/></text>`;
  }).join('');
  const svg = `<svg x="${x}" y="0" width="240" height="120" viewBox="0 0 480 240" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="mapClip"><rect width="480" height="240" rx="6"/></clipPath></defs><g clip-path="url(#mapClip)"><image width="480" height="240" href="data:image/jpeg;base64,${mapData}"/>${shading}${sun}${marker}<rect x="405" y="5" width="70" height="18" rx="3" fill="#000000" fill-opacity=".45"/>${utcLabels}</g></svg>`;
  return svg;
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

function meridiem(x, secondsOfDay, color) {
  const animation = `attributeName="opacity" calcMode="discrete" dur="86400s" begin="-${secondsOfDay}s" repeatCount="indefinite"`;
  return `<text x="${x + 3}" y="19" font-size="8" fill="${color}">AM<animate ${animation} values="1;0"/></text><text x="${x + 3}" y="19" font-size="8" fill="${color}">PM<animate ${animation} values="0;1"/></text>`;
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
  const secondsColor = normalizeColor(url.searchParams.get('secondscolor'), colors.seconds);
  const hourFormat = url.searchParams.get('format') === '12' ? '12' : '24';
  const mapEnabled = url.searchParams.get('map') !== '0';
  const mapMarkerColor = normalizeColor(url.searchParams.get('mapmarker'), '#5ae682');
  const rawMapMarkerSize = Number(url.searchParams.get('mapdot'));
  const mapMarkerSize = Number.isInteger(rawMapMarkerSize) && rawMapMarkerSize >= 3 && rawMapMarkerSize <= 12 ? rawMapMarkerSize : 6;
  const rawMapNightStrength = Number(url.searchParams.get('mapnight'));
  const mapNightStrength = Number.isFinite(rawMapNightStrength) && rawMapNightStrength >= 0.6 && rawMapNightStrength <= 1.4
    ? rawMapNightStrength
    : 1;
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
  const hours = Array.from({ length: hourFormat === '12' ? 12 : 24 }, (_, index) => String(hourFormat === '12' ? index + 1 : index).padStart(2, '0'));
  const secondsOfDay = time.h * 3600 + time.m * 60 + time.s;
  const hoursOffset = (hourFormat === '12' ? time.h % 12 : time.h) * 3600 + time.m * 60 + time.s;
  const parts = [];
  let x = flagMarkup ? 26 : 1;

  parts.push(strip(x, hours.map((value) => value[0]), 3600, hoursOffset, colors.digits)); x += 11;
  parts.push(strip(x, hours.map((value) => value[1]), 3600, hoursOffset, colors.digits)); x += 11;
  parts.push(colon(x, colors.colon)); x += 6;
  parts.push(strip(x, d6, 600, time.m * 60 + time.s, colors.digits)); x += 11;
  parts.push(strip(x, d10, 60, (time.m % 10) * 60 + time.s, colors.digits)); x += 11;
  parts.push(colon(x, colors.colon)); x += 6;
  parts.push(strip(x, d6, 10, time.s, secondsColor)); x += 11;
  parts.push(strip(x, d10, 1, time.s % 10, secondsColor)); x += 11;
  if (hourFormat === '12') {
    parts.push(meridiem(x, secondsOfDay, colors.label));
    x += 20;
  }

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
  const title = `${timeZone} clock${visibleLabel ? ` — ${visibleLabel}` : ''}${daylightDescription}${mapEnabled ? ' with animated day/night map' : ''}`;
  const badge = sunEnabled
    ? `<g aria-label="${daylightText}${coordinatesProvided ? ', solar-calculated' : ', estimated from local time'}"><rect x="${badgeX}" y="5" width="${badgeWidth}" height="20" rx="10" fill="${daylightColor}" fill-opacity=".16"/><circle cx="${badgeX + 8}" cy="15" r="2.5" fill="${dotColor}"/><text x="${badgeX + 14}" y="18" font-family="${FONT}" font-size="8" font-weight="600" fill="${daylightColor}">${daylightText}</text></g>`
    : '';
  const mapX = Math.max(width, sunEnabled ? badgeX + badgeWidth + 2 : 0) + 10;
  const mapData = mapEnabled ? (await fs.readFile(path.join(PUBLIC_DIR, 'world.jpg'))).toString('base64') : '';
  const map = mapEnabled
    ? locationMap(mapX, latitude, longitude, coordinatesProvided, mapMarkerColor, mapMarkerSize, mapNightStrength, mapData, now)
    : '';
  const outputWidth = mapEnabled ? mapX + 242 : width;
  const height = mapEnabled ? 120 : 30;
  const clockTransform = mapEnabled ? 'translate(0 49)' : 'translate(0 0)';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${outputWidth}" height="${height}" viewBox="0 0 ${outputWidth} ${height}" role="img" aria-label="${escapeXml(title)}"><title>${escapeXml(title)}</title><defs><clipPath id="flagCorners"><rect width="18" height="12" rx="1.5"/></clipPath></defs><g transform="${clockTransform}"><g transform="translate(1 9)">${flagMarkup}</g><g font-family="${FONT}" font-size="18" font-weight="600">${parts.join('')}</g>${visibleLabel ? `<text x="${labelX}" y="19.5" font-family="${FONT}" font-size="12" fill="${colors.label}">${escapeXml(visibleLabel)}</text>` : ''}${badge}</g>${map}</svg>`;
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
