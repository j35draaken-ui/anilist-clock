const PLACES = [
  ['Algeria', 'Algiers', 'Africa/Algiers', 'dz'],
  ['Angola', 'Luanda', 'Africa/Luanda', 'ao'],
  ['Argentina', 'Buenos Aires', 'America/Argentina/Buenos_Aires', 'ar'],
  ['Australia', 'Adelaide', 'Australia/Adelaide', 'au'],
  ['Australia', 'Brisbane', 'Australia/Brisbane', 'au'],
  ['Australia', 'Perth', 'Australia/Perth', 'au'],
  ['Australia', 'Sydney', 'Australia/Sydney', 'au'],
  ['Austria', 'Vienna', 'Europe/Vienna', 'at'],
  ['Bangladesh', 'Dhaka', 'Asia/Dhaka', 'bd'],
  ['Belgium', 'Brussels', 'Europe/Brussels', 'be'],
  ['Belarus', 'Minsk', 'Europe/Minsk', 'by'],
  ['Bolivia', 'La Paz', 'America/La_Paz', 'bo'],
  ['Brazil', 'Manaus', 'America/Manaus', 'br'],
  ['Bulgaria', 'Sofia', 'Europe/Sofia', 'bg'],
  ['Brazil', 'Rio de Janeiro', 'America/Sao_Paulo', 'br'],
  ['Cambodia', 'Phnom Penh', 'Asia/Phnom_Penh', 'kh'],
  ['Canada', 'Edmonton', 'America/Edmonton', 'ca'],
  ['Canada', 'Halifax', 'America/Halifax', 'ca'],
  ['Canada', 'Montreal', 'America/Toronto', 'ca'],
  ['Canada', 'St. John’s', 'America/St_Johns', 'ca'],
  ['Canada', 'Vancouver', 'America/Vancouver', 'ca'],
  ['Chile', 'Santiago', 'America/Santiago', 'cl'],
  ['China', 'Shanghai', 'Asia/Shanghai', 'cn'],
  ['Colombia', 'Bogotá', 'America/Bogota', 'co'],
  ['Costa Rica', 'San José', 'America/Costa_Rica', 'cr'],
  ['Croatia', 'Zagreb', 'Europe/Zagreb', 'hr'],
  ['Cuba', 'Havana', 'America/Havana', 'cu'],
  ['Czechia', 'Prague', 'Europe/Prague', 'cz'],
  ['Denmark', 'Copenhagen', 'Europe/Copenhagen', 'dk'],
  ['Ecuador', 'Guayaquil', 'America/Guayaquil', 'ec'],
  ['Egypt', 'Cairo', 'Africa/Cairo', 'eg'],
  ['El Salvador', 'San Salvador', 'America/El_Salvador', 'sv'],
  ['Estonia', 'Tallinn', 'Europe/Tallinn', 'ee'],
  ['Ethiopia', 'Addis Ababa', 'Africa/Addis_Ababa', 'et'],
  ['Finland', 'Helsinki', 'Europe/Helsinki', 'fi'],
  ['France', 'Paris', 'Europe/Paris', 'fr'],
  ['Germany', 'Berlin', 'Europe/Berlin', 'de'],
  ['Ghana', 'Accra', 'Africa/Accra', 'gh'],
  ['Greece', 'Athens', 'Europe/Athens', 'gr'],
  ['Guatemala', 'Guatemala City', 'America/Guatemala', 'gt'],
  ['Honduras', 'Tegucigalpa', 'America/Tegucigalpa', 'hn'],
  ['Hong Kong', 'Hong Kong', 'Asia/Hong_Kong', 'hk'],
  ['Hungary', 'Budapest', 'Europe/Budapest', 'hu'],
  ['Iceland', 'Reykjavík', 'Atlantic/Reykjavik', 'is'],
  ['India', 'Kolkata', 'Asia/Kolkata', 'in'],
  ['Indonesia', 'Jakarta', 'Asia/Jakarta', 'id'],
  ['Indonesia', 'Makassar', 'Asia/Makassar', 'id'],
  ['Indonesia', 'Jayapura', 'Asia/Jayapura', 'id'],
  ['Ireland', 'Dublin', 'Europe/Dublin', 'ie'],
  ['Iran', 'Tehran', 'Asia/Tehran', 'ir'],
  ['Iraq', 'Baghdad', 'Asia/Baghdad', 'iq'],
  ['Israel', 'Jerusalem', 'Asia/Jerusalem', 'il'],
  ['Italy', 'Rome', 'Europe/Rome', 'it'],
  ['Jamaica', 'Kingston', 'America/Jamaica', 'jm'],
  ['Japan', 'Tokyo', 'Asia/Tokyo', 'jp'],
  ['Kenya', 'Nairobi', 'Africa/Nairobi', 'ke'],
  ['Kazakhstan', 'Almaty', 'Asia/Almaty', 'kz'],
  ['Kuwait', 'Kuwait City', 'Asia/Kuwait', 'kw'],
  ['Lebanon', 'Beirut', 'Asia/Beirut', 'lb'],
  ['Malaysia', 'Kuala Lumpur', 'Asia/Kuala_Lumpur', 'my'],
  ['Mexico', 'Mexico City', 'America/Mexico_City', 'mx'],
  ['Mexico', 'Tijuana', 'America/Tijuana', 'mx'],
  ['Morocco', 'Casablanca', 'Africa/Casablanca', 'ma'],
  ['Madagascar', 'Antananarivo', 'Indian/Antananarivo', 'mg'],
  ['Mongolia', 'Ulaanbaatar', 'Asia/Ulaanbaatar', 'mn'],
  ['Myanmar', 'Yangon', 'Asia/Yangon', 'mm'],
  ['Nepal', 'Kathmandu', 'Asia/Kathmandu', 'np'],
  ['Netherlands', 'Amsterdam', 'Europe/Amsterdam', 'nl'],
  ['New Zealand', 'Auckland', 'Pacific/Auckland', 'nz'],
  ['Nigeria', 'Lagos', 'Africa/Lagos', 'ng'],
  ['Norway', 'Oslo', 'Europe/Oslo', 'no'],
  ['Panama', 'Panama City', 'America/Panama', 'pa'],
  ['Pakistan', 'Karachi', 'Asia/Karachi', 'pk'],
  ['Paraguay', 'Asunción', 'America/Asuncion', 'py'],
  ['Peru', 'Lima', 'America/Lima', 'pe'],
  ['Philippines', 'Manila', 'Asia/Manila', 'ph'],
  ['Poland', 'Warsaw', 'Europe/Warsaw', 'pl'],
  ['Portugal', 'Lisbon', 'Europe/Lisbon', 'pt'],
  ['Romania', 'Bucharest', 'Europe/Bucharest', 'ro'],
  ['Qatar', 'Doha', 'Asia/Qatar', 'qa'],
  ['Russia', 'Kaliningrad', 'Europe/Kaliningrad', 'ru'],
  ['Russia', 'Moscow', 'Europe/Moscow', 'ru'],
  ['Russia', 'Vladivostok', 'Asia/Vladivostok', 'ru'],
  ['Saudi Arabia', 'Riyadh', 'Asia/Riyadh', 'sa'],
  ['Serbia', 'Belgrade', 'Europe/Belgrade', 'rs'],
  ['Singapore', 'Singapore', 'Asia/Singapore', 'sg'],
  ['Slovakia', 'Bratislava', 'Europe/Bratislava', 'sk'],
  ['Slovenia', 'Ljubljana', 'Europe/Ljubljana', 'si'],
  ['South Africa', 'Johannesburg', 'Africa/Johannesburg', 'za'],
  ['South Korea', 'Seoul', 'Asia/Seoul', 'kr'],
  ['Spain', 'Madrid', 'Europe/Madrid', 'es'],
  ['Sri Lanka', 'Colombo', 'Asia/Colombo', 'lk'],
  ['Sweden', 'Stockholm', 'Europe/Stockholm', 'se'],
  ['Switzerland', 'Zurich', 'Europe/Zurich', 'ch'],
  ['Sudan', 'Khartoum', 'Africa/Khartoum', 'sd'],
  ['Syria', 'Damascus', 'Asia/Damascus', 'sy'],
  ['Taiwan', 'Taipei', 'Asia/Taipei', 'tw'],
  ['Thailand', 'Bangkok', 'Asia/Bangkok', 'th'],
  ['Turkey', 'Istanbul', 'Europe/Istanbul', 'tr'],
  ['Tunisia', 'Tunis', 'Africa/Tunis', 'tn'],
  ['Ukraine', 'Kyiv', 'Europe/Kyiv', 'ua'],
  ['Uganda', 'Kampala', 'Africa/Kampala', 'ug'],
  ['United Arab Emirates', 'Dubai', 'Asia/Dubai', 'ae'],
  ['United Kingdom', 'London', 'Europe/London', 'gb'],
  ['United States', 'Anchorage', 'America/Anchorage', 'us'],
  ['United States', 'Chicago', 'America/Chicago', 'us'],
  ['United States', 'Denver', 'America/Denver', 'us'],
  ['United States', 'Honolulu', 'Pacific/Honolulu', 'us'],
  ['United States', 'Los Angeles', 'America/Los_Angeles', 'us'],
  ['United States', 'New York', 'America/New_York', 'us'],
  ['United States', 'Phoenix', 'America/Phoenix', 'us'],
  ['Uruguay', 'Montevideo', 'America/Montevideo', 'uy'],
  ['Uzbekistan', 'Tashkent', 'Asia/Tashkent', 'uz'],
  ['Vietnam', 'Ho Chi Minh City', 'Asia/Ho_Chi_Minh', 'vn'],
  ['Zambia', 'Lusaka', 'Africa/Lusaka', 'zm'],
  ['Zimbabwe', 'Harare', 'Africa/Harare', 'zw'],
];

const PLACE_COORDINATES = {
  'Accra': [5.60, -0.19], 'Addis Ababa': [9.03, 38.74], 'Adelaide': [-34.93, 138.60],
  'Algiers': [36.75, 3.04], 'Almaty': [43.24, 76.95], 'Antananarivo': [-18.88, 47.51],
  'Amsterdam': [52.37, 4.90], 'Anchorage': [61.22, -149.90], 'Athens': [37.98, 23.73],
  'Asunción': [-25.26, -57.58], 'Auckland': [-36.85, 174.76], 'Baghdad': [33.31, 44.36],
  'Bangkok': [13.76, 100.50], 'Beirut': [33.89, 35.50], 'Beijing': [39.90, 116.41],
  'Belgrade': [44.79, 20.45], 'Berlin': [52.52, 13.41], 'Bratislava': [48.15, 17.11],
  'Bogotá': [4.71, -74.07], 'Brisbane': [-27.47, 153.03], 'Brussels': [50.85, 4.35],
  'Bucharest': [44.43, 26.10], 'Budapest': [47.50, 19.04], 'Buenos Aires': [-34.60, -58.38],
  'Cairo': [30.04, 31.24], 'Casablanca': [33.57, -7.59], 'Chicago': [41.88, -87.63],
  'Colombo': [6.93, 79.86], 'Copenhagen': [55.68, 12.57], 'Damascus': [33.51, 36.28],
  'Denver': [39.74, -104.99], 'Dhaka': [23.81, 90.41], 'Doha': [25.29, 51.53],
  'Dublin': [53.35, -6.26], 'Dubai': [25.20, 55.27], 'Edmonton': [53.55, -113.49],
  'Guatemala City': [14.63, -90.51], 'Guayaquil': [-2.17, -79.92], 'Halifax': [44.65, -63.58],
  'Harare': [-17.83, 31.03], 'Havana': [23.11, -82.37], 'Helsinki': [60.17, 24.94],
  'Ho Chi Minh City': [10.82, 106.63], 'Hong Kong': [22.32, 114.17],
  'Honolulu': [21.31, -157.86], 'Istanbul': [41.01, 28.98], 'Jakarta': [-6.21, 106.85],
  'Jayapura': [-2.53, 140.72], 'Jerusalem': [31.77, 35.21], 'Johannesburg': [-26.20, 28.04],
  'Kaliningrad': [54.71, 20.51], 'Kampala': [0.35, 32.58], 'Karachi': [24.86, 67.01],
  'Kathmandu': [27.72, 85.32], 'Khartoum': [15.50, 32.56], 'Kingston': [17.97, -76.79],
  'Kolkata': [22.57, 88.36], 'Kuala Lumpur': [3.14, 101.69], 'Kuwait City': [29.38, 47.98],
  'Kyiv': [50.45, 30.52], 'La Paz': [-16.49, -68.12], 'Lagos': [6.52, 3.38],
  'Lima': [-12.05, -77.04], 'Ljubljana': [46.06, 14.51], 'Lisbon': [38.72, -9.14],
  'London': [51.51, -0.13], 'Luanda': [-8.84, 13.29], 'Lusaka': [-15.39, 28.32],
  'Los Angeles': [34.05, -118.24], 'Madrid': [40.42, -3.70], 'Manila': [14.60, 120.98],
  'Makassar': [-5.15, 119.43], 'Manaus': [-3.12, -60.02], 'Melbourne': [-37.81, 144.96],
  'Mexico City': [19.43, -99.13], 'Minsk': [53.90, 27.57], 'Montevideo': [-34.90, -56.16],
  'Montreal': [45.50, -73.57], 'Moscow': [55.76, 37.62], 'Mumbai': [19.08, 72.88],
  'Nairobi': [-1.29, 36.82], 'New York': [40.71, -74.01], 'Oslo': [59.91, 10.75],
  'Panama City': [8.98, -79.52], 'Paris': [48.86, 2.35], 'Perth': [-31.95, 115.86],
  'Phnom Penh': [11.56, 104.93], 'Phoenix': [33.45, -112.07],
  'Prague': [50.08, 14.44], 'Reykjavík': [64.15, -21.94], 'Rio de Janeiro': [-22.91, -43.17],
  'Riyadh': [24.71, 46.68], 'Rome': [41.90, 12.50], 'San Francisco': [37.77, -122.42],
  'San José': [9.93, -84.09], 'San Salvador': [13.69, -89.22], 'Santiago': [-33.45, -70.67],
  'Seoul': [37.57, 126.98], 'Shanghai': [31.23, 121.47], 'Singapore': [1.35, 103.82],
  'Sofia': [42.70, 23.32], 'St. John’s': [47.56, -52.71],
  'Stockholm': [59.33, 18.07], 'Sydney': [-33.87, 151.21], 'Taipei': [25.03, 121.57],
  'Tallinn': [59.44, 24.75], 'Tashkent': [41.30, 69.24], 'Tegucigalpa': [14.07, -87.19],
  'Tehran': [35.69, 51.39], 'Tijuana': [32.51, -117.04], 'Tokyo': [35.68, 139.69],
  'Toronto': [43.65, -79.38], 'Tunis': [36.81, 10.18], 'Ulaanbaatar': [47.92, 106.92],
  'Vancouver': [49.28, -123.12], 'Vienna': [48.21, 16.37], 'Vladivostok': [43.12, 131.89],
  'Warsaw': [52.23, 21.01], 'Washington': [38.91, -77.04], 'Yangon': [16.87, 96.20],
  'Zagreb': [45.82, 15.98], 'Zurich': [47.38, 8.54],
};

const DEFAULT_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
const DEFAULT_PLACE = PLACES.find((place) => place[2] === DEFAULT_TIME_ZONE);
const state = {
  tz: DEFAULT_TIME_ZONE,
  flag: DEFAULT_PLACE?.[3] || '',
  label: DEFAULT_PLACE?.[1] || DEFAULT_TIME_ZONE.split('/').pop().replaceAll('_', ' '),
  theme: 'dark',
  sun: true,
  dot: '#2bd576',
  daycolor: '#f2c94c',
  nightcolor: '#83aaff',
  lat: String(PLACE_COORDINATES[DEFAULT_PLACE?.[1]]?.[0] ?? ''),
  lon: String(PLACE_COORDINATES[DEFAULT_PLACE?.[1]]?.[1] ?? ''),
  map: true,
  mapwater: '#10242c',
  mapland: '#31545a',
  mapgrid: '#557279',
  mapmarker: '#2bd576',
  mapdot: '4',
};
let customLabel = false;

const $ = (id) => document.getElementById(id);
const timezoneInput = $('timezone-input');
const flagInput = $('flag-input');
const labelInput = $('label-input');
const latitudeInput = $('latitude-input');
const longitudeInput = $('longitude-input');
const sunEnabledInput = $('sun-enabled');
const dotColorInput = $('dot-color');
const dayColorInput = $('day-color');
const nightColorInput = $('night-color');
const mapEnabledInput = $('map-enabled');
const mapWaterInput = $('map-water');
const mapLandInput = $('map-land');
const mapGridInput = $('map-grid');
const mapMarkerColorInput = $('map-marker-color');
const mapMarkerSizeInput = $('map-marker-size');
const mapMarkerSizeValue = $('map-marker-size-value');
const placeSearch = $('place-search');
const placeOptions = $('place-options');
const placeHint = $('place-hint');
const preview = $('clock-preview');
const directUrl = $('direct-url');
const bioSnippet = $('bio-snippet');
const warning = $('config-warning');
const toast = $('toast');
const locationButton = $('use-location');
const locationStatus = $('location-status');
const deviceTimeZoneStatus = $('device-timezone-status');
let visiblePlaces = [];
let activePlaceIndex = -1;
let flagMode = 'auto';

function timezoneIsValid(timeZone) {
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}

function placeLabel(place) {
  return `${place[1]} · ${place[0]}`;
}

function friendlyTimeZone(timeZone) {
  return new Intl.DateTimeFormat(navigator.language, {
    timeZone,
    timeZoneName: 'long',
  }).formatToParts(new Date()).find((part) => part.type === 'timeZoneName')?.value || 'Local time';
}

function getPlace(timeZone) {
  return PLACES.find((place) => place[2] === timeZone);
}

function getPresetName(timeZone) {
  const place = getPlace(timeZone);
  return place ? `${place[1]} / ${place[0]}` : 'Custom timezone';
}

function applyQueryState() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('tz')) {
    state.tz = params.get('tz') || state.tz;
    state.lat = '';
    state.lon = '';
  }
  const place = getPlace(state.tz);
  if (params.has('tz') && place) {
    const coordinates = PLACE_COORDINATES[place[1]];
    state.lat = coordinates ? String(coordinates[0]) : '';
    state.lon = coordinates ? String(coordinates[1]) : '';
  }
  if (params.has('flag')) {
    state.flag = (params.get('flag') || '').toLowerCase();
    flagMode = 'manual';
  } else if (place) {
    state.flag = place[3];
    flagMode = 'auto';
  } else if (params.has('tz')) {
    state.flag = '';
    flagMode = 'auto';
  }
  if (params.has('label')) {
    state.label = params.get('label') || '';
    const automaticLabel = place?.[1] || state.tz.split('/').pop().replaceAll('_', ' ');
    customLabel = params.get('labelauto') !== '1' && state.label !== automaticLabel;
  }
  if (params.has('theme')) state.theme = params.get('theme') === 'light' ? 'light' : 'dark';
  if (params.has('sun')) state.sun = params.get('sun') !== '0';
  if (params.has('lat') || params.has('lon')) {
    state.lat = params.get('lat') || '';
    state.lon = params.get('lon') || '';
  }
  if (/^#[0-9a-f]{6}$/i.test(params.get('dot') || '')) state.dot = params.get('dot');
  if (/^#[0-9a-f]{6}$/i.test(params.get('daycolor') || '')) state.daycolor = params.get('daycolor');
  if (/^#[0-9a-f]{6}$/i.test(params.get('nightcolor') || '')) state.nightcolor = params.get('nightcolor');
  if (params.has('map')) state.map = params.get('map') !== '0';
  if (/^#[0-9a-f]{6}$/i.test(params.get('mapwater') || '')) state.mapwater = params.get('mapwater');
  if (/^#[0-9a-f]{6}$/i.test(params.get('mapland') || '')) state.mapland = params.get('mapland');
  if (/^#[0-9a-f]{6}$/i.test(params.get('mapgrid') || '')) state.mapgrid = params.get('mapgrid');
  if (/^#[0-9a-f]{6}$/i.test(params.get('mapmarker') || '')) state.mapmarker = params.get('mapmarker');
  if (/^[2-7]$/.test(params.get('mapdot') || '')) state.mapdot = params.get('mapdot');
  if (!params.has('label')) {
    if (place) state.label = place[1];
    else if (params.has('tz')) state.label = state.tz.split('/').pop().replaceAll('_', ' ');
  }
  placeSearch.value = place ? placeLabel(place) : '';
  if (!place) document.querySelector('.advanced-options').open = true;
}

function makeImageUrl() {
  const params = new URLSearchParams();
  params.set('tz', state.tz || 'UTC');
  if (state.flag) params.set('flag', state.flag);
  if (state.label) params.set('label', state.label);
  if (!customLabel) params.set('labelauto', '1');
  params.set('theme', state.theme);
  if (!state.sun) params.set('sun', '0');
  if (coordinatesAreValid()) {
    params.set('lat', state.lat);
    params.set('lon', state.lon);
  }
  params.set('dot', state.dot);
  params.set('daycolor', state.daycolor);
  params.set('nightcolor', state.nightcolor);
  params.set('map', state.map ? '1' : '0');
  params.set('mapwater', state.mapwater);
  params.set('mapland', state.mapland);
  params.set('mapgrid', state.mapgrid);
  params.set('mapmarker', state.mapmarker);
  params.set('mapdot', state.mapdot);
  return `${window.location.origin}/clock.php?${params.toString()}`;
}

function coordinatesAreValid() {
  const latitude = Number(state.lat);
  const longitude = Number(state.lon);
  return state.lat !== '' && state.lon !== ''
    && /^-?(?:\d+\.?\d*|\.\d+)$/.test(state.lat)
    && /^-?(?:\d+\.?\d*|\.\d+)$/.test(state.lon)
    && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90
    && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
}

function syncControls() {
  timezoneInput.value = state.tz;
  flagInput.value = state.flag;
  labelInput.value = state.label;
  latitudeInput.value = state.lat;
  longitudeInput.value = state.lon;
  sunEnabledInput.checked = state.sun;
  dotColorInput.value = state.dot;
  dayColorInput.value = state.daycolor;
  nightColorInput.value = state.nightcolor;
  mapEnabledInput.checked = state.map;
  mapWaterInput.value = state.mapwater;
  mapLandInput.value = state.mapland;
  mapGridInput.value = state.mapgrid;
  mapMarkerColorInput.value = state.mapmarker;
  mapMarkerSizeInput.value = state.mapdot;
  mapMarkerSizeValue.value = state.mapdot;
  mapMarkerSizeValue.textContent = state.mapdot;
  document.querySelectorAll('.theme-choice').forEach((button) => {
    const active = button.dataset.theme === state.theme;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function renderWarning() {
  const messages = [];
  if (!timezoneIsValid(state.tz)) messages.push('That time zone is not recognized. The image will use UTC instead — check capitalization, for example Europe/Berlin.');
  if (state.flag && !/^[a-z]{2}(?:-[a-z]{3})?$/.test(state.flag)) messages.push('That flag code is not in the expected format. The image will use a neutral marker until it is fixed.');
  const hasAnyCoordinate = state.lat !== '' || state.lon !== '';
  if (hasAnyCoordinate && !coordinatesAreValid()) messages.push('Enter both coordinates within latitude −90 to 90 and longitude −180 to 180, or clear both fields.');
  warning.textContent = messages.join(' ');
  warning.hidden = messages.length === 0;
}

function updateStudioUrl() {
  const params = new URLSearchParams();
  params.set('tz', state.tz || 'UTC');
  if (state.flag) params.set('flag', state.flag);
  if (state.label) params.set('label', state.label);
  if (!customLabel) params.set('labelauto', '1');
  params.set('theme', state.theme);
  if (!state.sun) params.set('sun', '0');
  if (coordinatesAreValid()) {
    params.set('lat', state.lat);
    params.set('lon', state.lon);
  }
  params.set('dot', state.dot);
  params.set('daycolor', state.daycolor);
  params.set('nightcolor', state.nightcolor);
  params.set('map', state.map ? '1' : '0');
  params.set('mapwater', state.mapwater);
  params.set('mapland', state.mapland);
  params.set('mapgrid', state.mapgrid);
  params.set('mapmarker', state.mapmarker);
  params.set('mapdot', state.mapdot);
  window.history.replaceState(null, '', `/?${params.toString()}`);
}

function render() {
  syncControls();
  const imageUrl = makeImageUrl();
  preview.src = imageUrl;
  preview.alt = `Animated ${state.label || getPresetName(state.tz)} clock preview`;
  directUrl.textContent = imageUrl;
  bioSnippet.textContent = `~~~img(${imageUrl})~~~`;
  $('preview-region').textContent = state.label ? `${state.label} / ${state.tz}` : getPresetName(state.tz);
  const mapStatus = state.map ? (coordinatesAreValid() ? 'map on' : 'map needs coordinates') : 'map off';
  $('preview-status').textContent = `${state.theme === 'light' ? 'paper' : 'ink'} theme · ${state.sun ? (coordinatesAreValid() ? 'solar daylight' : 'estimated daylight') : 'daylight hidden'} · ${mapStatus}`;
  renderWarning();
  updateStudioUrl();
}

function renderPlaceOptions(searchTerm) {
  const search = searchTerm.trim().toLocaleLowerCase();
  visiblePlaces = search
    ? PLACES.filter((place) => `${place[0]} ${place[1]}`.toLocaleLowerCase().includes(search)).slice(0, 8)
    : [];
  activePlaceIndex = -1;
  placeOptions.replaceChildren();
  placeSearch.removeAttribute('aria-activedescendant');
  for (const [index, place] of visiblePlaces.entries()) {
    const option = document.createElement('button');
    option.type = 'button';
    option.id = `place-option-${index}`;
    option.className = 'place-option';
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', 'false');
    const name = document.createElement('span');
    name.textContent = placeLabel(place);
    const timeZoneName = document.createElement('small');
    timeZoneName.textContent = friendlyTimeZone(place[2]);
    option.append(name, timeZoneName);
    option.addEventListener('click', () => choosePlace(place));
    placeOptions.append(option);
  }
  const isOpen = visiblePlaces.length > 0;
  placeOptions.hidden = !isOpen;
  placeSearch.setAttribute('aria-expanded', String(isOpen));
  placeHint.textContent = search && !isOpen
    ? 'No matches found. Try another spelling or open Advanced settings.'
    : 'Search by country or city, then pick the matching time zone.';
}

function choosePlace(place) {
  state.tz = place[2];
  state.flag = place[3];
  const coordinates = PLACE_COORDINATES[place[1]];
  state.lat = coordinates ? String(coordinates[0]) : '';
  state.lon = coordinates ? String(coordinates[1]) : '';
  flagMode = 'auto';
  if (!customLabel) state.label = place[1];
  placeSearch.value = placeLabel(place);
  renderPlaceOptions('');
  render();
}

function useDeviceTimeZone() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (typeof timeZone !== 'string' || !timezoneIsValid(timeZone)) {
    deviceTimeZoneStatus.textContent = 'This browser did not provide a recognized time zone. Search for your country or city instead.';
    return;
  }

  const place = getPlace(timeZone);
  document.querySelector('.advanced-options').open = !place;
  state.tz = timeZone;
  const coordinates = place && PLACE_COORDINATES[place[1]];
  state.lat = coordinates ? String(coordinates[0]) : '';
  state.lon = coordinates ? String(coordinates[1]) : '';
  if (place) {
    state.flag = place[3];
    flagMode = 'auto';
    if (!customLabel) state.label = place[1];
    placeSearch.value = placeLabel(place);
  } else {
    if (flagMode === 'auto') state.flag = '';
    placeSearch.value = '';
  }
  renderPlaceOptions('');
  render();
  deviceTimeZoneStatus.textContent = place
    ? `Using this device's time zone: ${timeZone}.`
    : `Using this device's time zone: ${timeZone}. Search for a city to add its flag.`;
}

function setLocationStatus(message, isError = false) {
  locationStatus.textContent = message;
  locationStatus.classList.toggle('location-error', isError);
}

async function lookupLocation(latitude, longitude) {
  const coordinates = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude) });
  const [timeZoneResponse, placeResponse] = await Promise.all([
    fetch(`https://timeapi.io/api/TimeZone/coordinate?${coordinates}`),
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${coordinates}&localityLanguage=en`),
  ]);
  if (!timeZoneResponse.ok || !placeResponse.ok) {
    throw new Error('The location lookup services are unavailable. Use the offline time-zone button or search for a city.');
  }

  let timeZoneResult;
  let placeResult;
  try {
    [timeZoneResult, placeResult] = await Promise.all([timeZoneResponse.json(), placeResponse.json()]);
  } catch {
    throw new Error('The location lookup services returned unreadable data. Use the offline time-zone button or search for a city.');
  }

  const timeZone = timeZoneResult?.timeZone;
  const countryCode = placeResult?.countryCode;
  if (!timezoneIsValid(timeZone) || !/^[a-z]{2}$/i.test(countryCode || '')) {
    throw new Error('We could not match that location. Use the offline time-zone button or search for a city.');
  }

  const countryName = placeResult.countryName || new Intl.DisplayNames([navigator.language], { type: 'region' }).of(countryCode);
  const locality = placeResult.city || placeResult.locality || placeResult.principalSubdivision;
  state.tz = timeZone;
  state.flag = countryCode.toLowerCase();
  state.lat = (Math.round(latitude * 10) / 10).toFixed(1);
  state.lon = (Math.round(longitude * 10) / 10).toFixed(1);
  flagMode = 'auto';
  if (locality) {
    state.label = locality.slice(0, 28);
    customLabel = false;
  }
  placeSearch.value = locality ? `${locality} · ${countryName}` : countryName;
  renderPlaceOptions('');
  render();
}

function useCurrentLocation() {
  if (!window.isSecureContext) {
    setLocationStatus('GPS lookup requires HTTPS. Use the offline time-zone button or search for a city instead.', true);
    return;
  }
  if (!navigator.geolocation) {
    setLocationStatus('Location is unavailable in this browser. Use the offline time-zone button or search for a city.', true);
    return;
  }

  locationButton.disabled = true;
  setLocationStatus('Waiting for location permission…');
  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    setLocationStatus('Looking up your time zone and country…');
    try {
      await lookupLocation(coords.latitude, coords.longitude);
      setLocationStatus('Location found. You can change it any time by searching above.');
    } catch (error) {
      const message = error instanceof TypeError
        ? 'Could not reach the location lookup services. Use the offline time-zone button or search for a city.'
        : error instanceof Error
          ? error.message
          : 'Could not look up this location. Use the offline time-zone button or search for a city.';
      setLocationStatus(
        message,
        true,
      );
    } finally {
      locationButton.disabled = false;
    }
  }, (error) => {
    const messages = {
      1: 'Location permission was not granted. Use the offline time-zone button or search for a city.',
      2: 'Your location could not be determined. Try again or search for a city.',
      3: 'The location request timed out. Try again or search for a city.',
    };
    setLocationStatus(messages[error.code] || 'Could not get your location. Search for a city instead.', true);
    locationButton.disabled = false;
  }, { enableHighAccuracy: false, maximumAge: 60000, timeout: 15000 });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.focus();
    helper.select();
    document.execCommand('copy');
    helper.remove();
  }
  const original = button.textContent;
  button.textContent = 'Copied';
  button.classList.add('copied');
  showToast('Copied to clipboard — ready for AniList.');
  window.setTimeout(() => { button.textContent = original; button.classList.remove('copied'); }, 1800);
}

placeSearch.addEventListener('input', () => renderPlaceOptions(placeSearch.value));
placeSearch.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown' && visiblePlaces.length) {
    event.preventDefault();
    activePlaceIndex = (activePlaceIndex + 1) % visiblePlaces.length;
  } else if (event.key === 'ArrowUp' && visiblePlaces.length) {
    event.preventDefault();
    activePlaceIndex = (activePlaceIndex - 1 + visiblePlaces.length) % visiblePlaces.length;
  } else if (event.key === 'Enter' && activePlaceIndex >= 0) {
    event.preventDefault();
    choosePlace(visiblePlaces[activePlaceIndex]);
    return;
  } else if (event.key === 'Escape') {
    renderPlaceOptions('');
  } else {
    return;
  }
  [...placeOptions.children].forEach((option, index) => {
    const active = index === activePlaceIndex;
    option.setAttribute('aria-selected', String(active));
    if (active) {
      placeSearch.setAttribute('aria-activedescendant', option.id);
      option.scrollIntoView({ block: 'nearest' });
    }
  });
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.place-search-wrap')) renderPlaceOptions('');
});

timezoneInput.addEventListener('input', () => {
  state.tz = timezoneInput.value.trim();
  const place = getPlace(state.tz);
  const coordinates = place && PLACE_COORDINATES[place[1]];
  state.lat = coordinates ? String(coordinates[0]) : '';
  state.lon = coordinates ? String(coordinates[1]) : '';
  if (!customLabel) state.label = place?.[1] || state.tz.split('/').pop().replaceAll('_', ' ');
  if (place) {
    state.flag = place[3];
    flagMode = 'auto';
    placeSearch.value = placeLabel(place);
  } else {
    if (flagMode === 'auto') state.flag = '';
    placeSearch.value = '';
  }
  render();
});
flagInput.addEventListener('input', () => {
  state.flag = flagInput.value.trim().toLowerCase();
  flagMode = 'manual';
  render();
});
labelInput.addEventListener('input', () => { state.label = labelInput.value.slice(0, 28); customLabel = true; render(); });
latitudeInput.addEventListener('input', () => { state.lat = latitudeInput.value.trim(); render(); });
longitudeInput.addEventListener('input', () => { state.lon = longitudeInput.value.trim(); render(); });
sunEnabledInput.addEventListener('change', () => { state.sun = sunEnabledInput.checked; render(); });
dotColorInput.addEventListener('input', () => { state.dot = dotColorInput.value; render(); });
dayColorInput.addEventListener('input', () => { state.daycolor = dayColorInput.value; render(); });
nightColorInput.addEventListener('input', () => { state.nightcolor = nightColorInput.value; render(); });
mapEnabledInput.addEventListener('change', () => { state.map = mapEnabledInput.checked; render(); });
mapWaterInput.addEventListener('input', () => { state.mapwater = mapWaterInput.value; render(); });
mapLandInput.addEventListener('input', () => { state.mapland = mapLandInput.value; render(); });
mapGridInput.addEventListener('input', () => { state.mapgrid = mapGridInput.value; render(); });
mapMarkerColorInput.addEventListener('input', () => { state.mapmarker = mapMarkerColorInput.value; render(); });
mapMarkerSizeInput.addEventListener('input', () => { state.mapdot = mapMarkerSizeInput.value; render(); });
document.querySelectorAll('.theme-choice').forEach((button) => button.addEventListener('click', () => { state.theme = button.dataset.theme; render(); }));
document.querySelectorAll('[data-copy-target]').forEach((button) => button.addEventListener('click', () => copyText($(button.dataset.copyTarget).textContent, button)));
locationButton.addEventListener('click', useCurrentLocation);
document.querySelector('#use-device-timezone').addEventListener('click', useDeviceTimeZone);

applyQueryState();
render();
