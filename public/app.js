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

const state = {
  tz: 'Europe/Berlin',
  flag: 'de',
  label: '',
  theme: 'dark',
};

const $ = (id) => document.getElementById(id);
const timezoneInput = $('timezone-input');
const flagInput = $('flag-input');
const labelInput = $('label-input');
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
let visiblePlaces = [];
let activePlaceIndex = -1;

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
  if (params.has('tz')) state.tz = params.get('tz') || state.tz;
  if (params.has('flag')) state.flag = (params.get('flag') || '').toLowerCase();
  if (params.has('label')) state.label = params.get('label') || '';
  if (params.has('theme')) state.theme = params.get('theme') === 'light' ? 'light' : 'dark';
  const place = getPlace(state.tz);
  placeSearch.value = place ? placeLabel(place) : '';
  if (!place) document.querySelector('.advanced-options').open = true;
}

function makeImageUrl() {
  const params = new URLSearchParams();
  params.set('tz', state.tz || 'UTC');
  if (state.flag) params.set('flag', state.flag);
  if (state.label) params.set('label', state.label);
  params.set('theme', state.theme);
  return `${window.location.origin}/clock.svg?${params.toString()}`;
}

function syncControls() {
  timezoneInput.value = state.tz;
  flagInput.value = state.flag;
  labelInput.value = state.label;
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
  warning.textContent = messages.join(' ');
  warning.hidden = messages.length === 0;
}

function updateStudioUrl() {
  const params = new URLSearchParams();
  params.set('tz', state.tz || 'UTC');
  if (state.flag) params.set('flag', state.flag);
  if (state.label) params.set('label', state.label);
  params.set('theme', state.theme);
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
  $('preview-status').textContent = state.theme === 'light' ? 'paper theme · every second' : 'ink theme · every second';
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
  if (!state.label || PLACES.some((item) => item[1] === state.label)) state.label = place[1];
  placeSearch.value = placeLabel(place);
  renderPlaceOptions('');
  render();
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
  if (!timeZoneResponse.ok || !placeResponse.ok) throw new Error('The location lookup service is unavailable. Try searching for your country or city instead.');

  let timeZoneResult;
  let placeResult;
  try {
    [timeZoneResult, placeResult] = await Promise.all([
      timeZoneResponse.json(),
      placeResponse.json(),
    ]);
  } catch {
    throw new Error('The location lookup services returned unreadable data. Search for your country or city instead.');
  }
  const timeZone = timeZoneResult?.timeZone;
  const countryCode = placeResult?.countryCode;
  if (!timezoneIsValid(timeZone) || !/^[a-z]{2}$/i.test(countryCode || '')) {
    throw new Error('We could not match that location to a time zone and country. Try searching for your country or city instead.');
  }

  const countryName = placeResult.countryName || new Intl.DisplayNames([navigator.language], { type: 'region' }).of(countryCode);
  const locality = placeResult.city || placeResult.locality || placeResult.principalSubdivision;
  state.tz = timeZone;
  state.flag = countryCode.toLowerCase();
  if (locality) state.label = locality.slice(0, 28);
  placeSearch.value = locality ? `${locality} · ${countryName}` : countryName;
  renderPlaceOptions('');
  render();
}

function useCurrentLocation() {
  if (!window.isSecureContext) {
    setLocationStatus('Location lookup requires a secure connection (HTTPS). Search for your country or city instead.', true);
    return;
  }
  if (!navigator.geolocation) {
    setLocationStatus('Location is not available in this browser. Search for your country or city instead.', true);
    return;
  }
  locationButton.disabled = true;
  setLocationStatus('Waiting for location permission…');
  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    setLocationStatus('Finding your time zone and country…');
    try {
      await lookupLocation(coords.latitude, coords.longitude);
      setLocationStatus('Location found. You can change it any time by searching above.');
    } catch (error) {
      let message = 'Could not look up this location. Search for your country or city instead.';
      if (error instanceof TypeError) message = 'Could not reach the location lookup services. Search for your country or city instead.';
      else if (error instanceof Error) message = error.message || message;
      setLocationStatus(message, true);
    } finally {
      locationButton.disabled = false;
    }
  }, (error) => {
    const messages = {
      1: 'Location permission was not granted. You can search for your country or city instead.',
      2: 'Your location could not be determined. Try searching for your country or city instead.',
      3: 'The location request timed out. Try again or search for your country or city.',
    };
    setLocationStatus(messages[error.code] || 'Could not get your location. Search for your country or city instead.', true);
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
  placeSearch.value = '';
  render();
});
flagInput.addEventListener('input', () => { state.flag = flagInput.value.trim().toLowerCase(); render(); });
labelInput.addEventListener('input', () => { state.label = labelInput.value.slice(0, 28); render(); });
document.querySelectorAll('.theme-choice').forEach((button) => button.addEventListener('click', () => { state.theme = button.dataset.theme; render(); }));
document.querySelectorAll('[data-copy-target]').forEach((button) => button.addEventListener('click', () => copyText($(button.dataset.copyTarget).textContent, button)));
locationButton.addEventListener('click', useCurrentLocation);

applyQueryState();
render();
