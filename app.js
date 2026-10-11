const PRESETS = {
  'Europe/Berlin': { flag: 'de', label: 'Berlin', name: 'Berlin / Europe' },
  'Europe/London': { flag: 'gb', label: 'London', name: 'London / Europe' },
  'Europe/Paris': { flag: 'fr', label: 'Paris', name: 'Paris / Europe' },
  'Europe/Stockholm': { flag: 'se', label: 'Stockholm', name: 'Stockholm / Europe' },
  'Europe/Madrid': { flag: 'es', label: 'Madrid', name: 'Madrid / Europe' },
  'Europe/Rome': { flag: 'it', label: 'Rome', name: 'Rome / Europe' },
  'Europe/Warsaw': { flag: 'pl', label: 'Warsaw', name: 'Warsaw / Europe' },
  'America/New_York': { flag: 'us', label: 'New York', name: 'New York / America' },
  'America/Los_Angeles': { flag: 'us', label: 'Los Angeles', name: 'Los Angeles / America' },
  'America/Toronto': { flag: 'ca', label: 'Toronto', name: 'Toronto / America' },
  'America/Sao_Paulo': { flag: 'br', label: 'São Paulo', name: 'São Paulo / America' },
  'America/Mexico_City': { flag: 'mx', label: 'Mexico City', name: 'Mexico City / America' },
  'Africa/Lagos': { flag: 'ng', label: 'Lagos', name: 'Lagos / Africa' },
  'Asia/Kolkata': { flag: 'in', label: 'New Delhi', name: 'New Delhi / Asia' },
  'Asia/Bangkok': { flag: 'th', label: 'Bangkok', name: 'Bangkok / Asia' },
  'Asia/Jakarta': { flag: 'id', label: 'Jakarta', name: 'Jakarta / Asia' },
  'Asia/Tokyo': { flag: 'jp', label: 'Tokyo', name: 'Tokyo / Asia' },
  'Asia/Seoul': { flag: 'kr', label: 'Seoul', name: 'Seoul / Asia' },
  'Asia/Manila': { flag: 'ph', label: 'Manila', name: 'Manila / Asia' },
  'Australia/Sydney': { flag: 'au', label: 'Sydney', name: 'Sydney / Australia' },
};

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
const presetSelect = $('region-select');
const preview = $('clock-preview');
const directUrl = $('direct-url');
const bioSnippet = $('bio-snippet');
const warning = $('config-warning');
const toast = $('toast');

function timezoneIsValid(timeZone) {
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}

function getPresetName(timeZone) {
  return PRESETS[timeZone]?.name || 'Custom timezone';
}

function applyQueryState() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('tz')) state.tz = params.get('tz') || state.tz;
  if (params.has('flag')) state.flag = (params.get('flag') || '').toLowerCase();
  if (params.has('label')) state.label = params.get('label') || '';
  if (params.has('theme')) state.theme = params.get('theme') === 'light' ? 'light' : 'dark';
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
  presetSelect.value = PRESETS[state.tz] ? state.tz : 'custom';
  document.querySelectorAll('.theme-choice').forEach((button) => {
    const active = button.dataset.theme === state.theme;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function renderWarning() {
  const messages = [];
  if (!timezoneIsValid(state.tz)) messages.push('That timezone is not recognized. The image will render a friendly UTC fallback — check capitalization, for example Europe/Berlin.');
  if (state.flag && !/^[a-z]{2}(?:-[a-z]{3})?$/.test(state.flag)) messages.push('That flag code is not in the expected format. Use two lowercase letters such as de or jp; the image will use a neutral marker until it is fixed.');
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
  const snippet = `~~~img(${imageUrl})~~~`;
  preview.src = imageUrl;
  preview.alt = `Animated ${state.label || getPresetName(state.tz)} clock preview`;
  directUrl.textContent = imageUrl;
  bioSnippet.textContent = snippet;
  $('preview-region').textContent = state.label ? `${state.label} / ${state.tz}` : getPresetName(state.tz);
  $('preview-status').textContent = state.theme === 'light' ? 'paper theme · every second' : 'ink theme · every second';
  renderWarning();
  updateStudioUrl();
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

presetSelect.addEventListener('change', () => {
  if (presetSelect.value === 'custom') {
    timezoneInput.focus();
    return;
  }
  const preset = PRESETS[presetSelect.value];
  state.tz = presetSelect.value;
  state.flag = preset.flag;
  if (!state.label || Object.values(PRESETS).some((item) => item.label === state.label)) state.label = preset.label;
  render();
});

timezoneInput.addEventListener('input', () => { state.tz = timezoneInput.value.trim(); render(); });
flagInput.addEventListener('input', () => { state.flag = flagInput.value.trim().toLowerCase(); render(); });
labelInput.addEventListener('input', () => { state.label = labelInput.value.slice(0, 28); render(); });
document.querySelectorAll('.theme-choice').forEach((button) => button.addEventListener('click', () => { state.theme = button.dataset.theme; render(); }));
document.querySelectorAll('[data-copy-target]').forEach((button) => button.addEventListener('click', () => copyText($(button.dataset.copyTarget).textContent, button)));

applyQueryState();
render();
