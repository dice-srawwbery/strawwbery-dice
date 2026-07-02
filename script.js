const diceContainer = document.querySelector('.dice-grid');
const rollButton = document.getElementById('rollButton');
const countryPopover = document.getElementById('countryPopover');
const countryBtn = document.querySelector('.country-btn');
const countryCode = countryBtn.querySelector('.country-code');
const soundToggle = document.getElementById('soundToggle');
const spinToggle = document.getElementById('spinToggle');
const soundPanel = document.querySelector('.sound-panel');
const melodyButtons = document.querySelectorAll('.sound-option');
const possibleColorsLabel = document.getElementById('possibleColorsLabel');
const soundStatus = document.querySelector('.sound-status');
const statusText = document.querySelector('.status-text');
const settingsToggle = document.getElementById('settingsToggle');
const settingsPopover = document.getElementById('settingsPopover');
const diceCountButtons = document.querySelectorAll('.settings-option[data-count]');
const themeButtons = document.querySelectorAll('.settings-option[data-theme]');
const spinButtons = document.querySelectorAll('.settings-option[data-spin]');
const availableThemes = {
  blue: '#0d6bff',
  green: '#23b85f',
  yellow: '#ffd60a',
  orange: '#ff7d1d',
  gold: '#f9c74f',
  silver: '#c9d3de',
  red: '#ff3b3b',
  rainbow: ['#ff5462', '#ffcd41', '#58d1ff', '#9d6bff'],
  sunset: ['#ff6b6b', '#ffb86b', '#ffeb7f', '#ff8a5b'],
  ocean: ['#2f8fff', '#44d8ff', '#74f1ff', '#376bad'],
  midnight: ['#0b1432', '#181f4f', '#2b336d', '#0b0f1d'],
};
let diceEls = [];
let rollTimeouts = [];
let soundEnabled = false;
let spinEnabled = true;
let selectedMelody = 'garden';
let selectedSpin = 'spin1';
let selectedDiceCount = 4;
let selectedTheme = 'rainbow';

let audioContext;
let melodyTimeoutId = null;
let melodyNoteIndex = 0;
const melodySets = {
  garden: [
    { freq: 330, duration: 420 },
    { freq: 392, duration: 420 },
    { freq: 440, duration: 520 },
    { freq: 523, duration: 520 },
    { freq: 494, duration: 360 },
    { freq: 440, duration: 360 },
    { freq: 392, duration: 520 },
    { freq: 330, duration: 520 },
    { freq: 349, duration: 420 },
    { freq: 392, duration: 420 },
    { freq: 440, duration: 520 },
    { freq: 392, duration: 420 },
    { freq: 349, duration: 420 },
    { freq: 330, duration: 520 },
    { freq: 294, duration: 520 },
    { freq: 262, duration: 760 },
  ],
  soft: [
    { freq: 294, duration: 620 },
    { freq: 330, duration: 620 },
    { freq: 349, duration: 620 },
    { freq: 330, duration: 620 },
    { freq: 294, duration: 620 },
    { freq: 262, duration: 760 },
    { freq: 294, duration: 620 },
    { freq: 330, duration: 760 },
  ],
  calm: [
    { freq: 440, duration: 720 },
    { freq: 392, duration: 720 },
    { freq: 349, duration: 760 },
    { freq: 330, duration: 760 },
    { freq: 294, duration: 760 },
    { freq: 262, duration: 880 },
  ],
};

const melodyProfiles = {
  garden: { type: 'triangle', gainMax: 0.095, filterFreq: 1200, q: 6 },
  soft: { type: 'sine', gainMax: 0.075, filterFreq: 1000, q: 4 },
  calm: { type: 'triangle', gainMax: 0.065, filterFreq: 900, q: 3 },
};

const spinProfiles = {
  spin1: { type: 'triangle', start: 720, end: 520, gain: 0.12, filterFreq: 1400, q: 6, duration: 0.18 },
  spin2: { type: 'sine', start: 600, end: 380, gain: 0.1, filterFreq: 1200, q: 4, duration: 0.2 },
  spin3: { type: 'square', start: 560, end: 420, gain: 0.095, filterFreq: 1100, q: 5, duration: 0.18 },
  spin4: { type: 'triangle', start: 500, end: 460, gain: 0.08, filterFreq: 1000, q: 3, duration: 0.22 },
  spin5: { type: 'sine', start: 660, end: 520, gain: 0.1, filterFreq: 1300, q: 4, duration: 0.2 },
};

const possibleColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

const modele = [
  ["red","yellow","blue","purple"],
  ["green","orange","red","blue"],
  ["yellow","yellow","purple","green"],
  ["blue","red","orange","purple"],
  ["purple","purple","green","yellow"],
  ["red","green","blue","orange"],
  ["orange","yellow","yellow","blue"],
  ["green","blue","purple","red"],
  ["red","red","blue","green"],
  ["yellow","orange","purple","red"],
  ["blue","green","orange","yellow"],
  ["purple","red","red","blue"],
  ["green","green","orange","purple"],
  ["orange","blue","yellow","red"],
  ["red","yellow","green","purple"],
  ["blue","blue","blue","orange"],
  ["purple","green","yellow","red"],
  ["orange","red","blue","green"],
  ["yellow","purple","orange","blue"],
  ["green","red","yellow","orange"],
  ["red","orange","purple","green"],
  ["blue","yellow","red","purple"],
  ["purple","blue","green","orange"],
  ["orange","orange","red","yellow"],
  ["green","yellow","blue","red"],
  ["red","purple","green","blue"],
  ["yellow","green","orange","purple"],
  ["blue","orange","yellow","red"],
  ["purple","red","blue","green"],
  ["green","green","red","orange"],
  ["orange","purple","yellow","blue"],
  ["red","yellow","purple","green"],
  ["blue","green","red","orange"],
  ["yellow","yellow","blue","purple"],
  ["purple","orange","green","red"],
  ["green","red","orange","blue"],
  ["red","blue","yellow","green"],
  ["orange","orange","purple","red"],
  ["blue","purple","green","yellow"],
  ["yellow","red","blue","orange"],
  ["green","orange","yellow","purple"],
  ["purple","purple","red","green"],
  ["red","green","orange","yellow"],
  ["blue","yellow","purple","red"],
  ["orange","green","blue","purple"],
  ["yellow","red","green","blue"],
  ["purple","orange","red","yellow"],
  ["green","blue","orange","red"],
  ["red","red","red","purple"],
  ["blue","yellow","green","orange"]];
let modeleIndex = 0;

const translations = {
  EN: {
    sound: 'Classic sound',
    win: 'Win',
    lose: 'Lose',
    settings: 'Settings',
    language: 'Language',
    subtitle: '{count} color dice · secure random rolls',
    roll: 'Roll',
    possible: 'Possible colors',
  },
  RO: {
    sound: 'Sunet clasic',
    win: 'Câștig',
    lose: 'Pierdere',
    settings: 'Setări',
    language: 'Limba',
    subtitle: '4 zaruri colorate · rulări sigure',
    roll: 'Rulează',
    possible: 'Culori posibile',
  },
  FR: {
    sound: 'Son classique',
    win: 'Victoire',
    lose: 'Défaite',
    settings: 'Paramètres',
    language: 'Langue',
    subtitle: '4 dés colorés · lancers sécurisés',
    roll: 'Lancer',
    possible: 'Couleurs possibles',
  },
  DE: {
    sound: 'Klassischer Ton',
    win: 'Gewinn',
    lose: 'Verlust',
    settings: 'Einstellungen',
    language: 'Sprache',
    subtitle: '4 farbige Würfel · sichere Würfe',
    roll: 'Würfeln',
    possible: 'Mögliche Farben',
  },
  ES: {
    sound: 'Sonido clásico',
    win: 'Victoria',
    lose: 'Derrota',
    settings: 'Ajustes',
    language: 'Idioma',
    subtitle: '4 dados de colores · tiradas seguras',
    roll: 'Tirar',
    possible: 'Colores posibles',
  },
  IT: {
    sound: 'Suono classico',
    win: 'Vittoria',
    lose: 'Sconfitta',
    settings: 'Impostazioni',
    language: 'Lingua',
    subtitle: '4 dadi colorati · tiri sicuri',
    roll: 'Lancia',
    possible: 'Colori possibili',
  },
  PT: {
    sound: 'Som clássico',
    win: 'Vitória',
    lose: 'Derrota',
    settings: 'Configurações',
    language: 'Idioma',
    subtitle: '4 dados coloridos · rolagens seguras',
    roll: 'Rolar',
    possible: 'Cores possíveis',
  },
  JP: {
    sound: 'クラシックサウンド',
    win: '勝ち',
    lose: '負け',
    settings: '設定',
    language: '言語',
    subtitle: '4 色のサイコロ · 安全なロール',
    roll: 'ロール',
    possible: '使用可能な色',
  },
};

function getSubtitleText(lang) {
  return translations[lang]?.subtitle || translations.EN.subtitle;
}

function translate(lang) {
  const data = translations[lang] || translations.EN;
  document.querySelector('.settings-btn').innerHTML = `<span class="settings-emoji">⚙️</span> ${data.settings}`;
  rollButton.textContent = data.roll;
  possibleColorsLabel.textContent = data.possible;
  document.getElementById('subtitleText').textContent = getSubtitleText(lang).replace('{count}', selectedDiceCount);
}

function updateOnlineUsers() {
  if (!statusText) return;
  const users = Math.floor(Math.random() * 18) + 8; // 8-25 users
  statusText.textContent = `${users} online users`;
}

function getRandomAnimationDelay() {
  return Math.random() * 0.08 + 's';
}

function pickColors(count) {
  if (modeleIndex < modele.length) {
    const pattern = modele[modeleIndex];
    modeleIndex += 1;
    return pattern.slice(0, count);
  }
  return generateRandomModel(count);
}

function generateRandomModel(count) {
  const base = modele[Math.floor(Math.random() * modele.length)];
  const colors = base.slice(0, count).map((color) => color);
  const swapCount = Math.floor(Math.random() * 2) + 1;

  for (let i = 0; i < swapCount; i += 1) {
    const a = Math.floor(Math.random() * count);
    const b = Math.floor(Math.random() * count);
    [colors[a], colors[b]] = [colors[b], colors[a]];
  }

  if (Math.random() < 0.35) {
    const replaceIndex = Math.floor(Math.random() * count);
    const replacement = possibleColors[Math.floor(Math.random() * possibleColors.length)];
    colors[replaceIndex] = replacement;
  }

  return colors;
}

function renderDice(count) {
  diceContainer.style.setProperty('--dice-count', count);
  diceContainer.innerHTML = Array.from({ length: count })
    .map((_, index) => `<div class="dice-cell die-grey" id="die${index + 1}"></div>`)
    .join('');
  diceEls = Array.from(diceContainer.querySelectorAll('.dice-cell'));
}

function updateBackground(theme) {
  const value = availableThemes[theme] || availableThemes.blue;
  if (Array.isArray(value)) {
    document.body.style.background = `linear-gradient(135deg, ${value.join(', ')})`;
  } else {
    document.body.style.background = `linear-gradient(135deg, ${value} 0%, rgba(0,0,0,0.45) 100%)`;
  }
}

function playSound(type) {
  if (!soundEnabled) return;

  const ctx = createAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

  if (type === 'win') {
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.14);
  } else {
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.14);
  }

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.18);
}

function playSpinSound() {
  if (!spinEnabled) return;
  const ctx = createAudioContext();
  if (!ctx) return;

  const profile = spinProfiles[selectedSpin] || spinProfiles.spin1;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = profile.type;
  osc.frequency.setValueAtTime(profile.start, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(profile.end, ctx.currentTime + profile.duration);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(profile.filterFreq, ctx.currentTime);
  filter.Q.setValueAtTime(profile.q, ctx.currentTime);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(profile.gain, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + profile.duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + profile.duration);
}

function createAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function stopBackgroundMusic() {
  if (!audioContext) return;
  clearTimeout(melodyTimeoutId);
  melodyTimeoutId = null;
}

function scheduleNextMelodyNote() {
  if (!soundEnabled) return;
  const ctx = createAudioContext();
  if (!ctx) return;

  const melodyNotes = melodySets[selectedMelody] || melodySets.garden;
  const profile = melodyProfiles[selectedMelody] || melodyProfiles.garden;
  const note = melodyNotes[melodyNoteIndex];
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = profile.type;
  osc.frequency.setValueAtTime(note.freq, ctx.currentTime);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(profile.filterFreq, ctx.currentTime);
  filter.Q.setValueAtTime(profile.q, ctx.currentTime);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(profile.gainMax, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.duration / 1000);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + note.duration / 1000);

  melodyNoteIndex = (melodyNoteIndex + 1) % melodyNotes.length;
  melodyTimeoutId = setTimeout(scheduleNextMelodyNote, note.duration);
}

function startBackgroundMusic() {
  if (!soundEnabled) return;
  if (!createAudioContext()) return;
  stopBackgroundMusic();
  scheduleNextMelodyNote();
}

function updateSoundButton() {
  const icon = soundEnabled ? '🔊' : '🔇';
  soundToggle.querySelector('.sound-emoji').textContent = icon;
  if (soundStatus) {
    soundStatus.textContent = soundEnabled
      ? selectedMelody.charAt(0).toUpperCase() + selectedMelody.slice(1)
      : 'Muted';
  }
  if (soundPanel) {
    soundPanel.classList.toggle('hidden', !soundEnabled);
  }
}

function updateDice() {
  rollTimeouts.forEach(clearTimeout);
  rollTimeouts = [];
  const chosen = pickColors(diceEls.length);

  diceEls.forEach((dieEl, index) => {
    dieEl.textContent = '';
    dieEl.className = `dice-cell die-grey`;
    dieEl.style.animationDelay = getRandomAnimationDelay();
    void dieEl.offsetWidth;
    dieEl.classList.add('spin');

    const timeoutId = setTimeout(() => {
      dieEl.className = `dice-cell ${chosen[index]}`;
      dieEl.style.animationDelay = '';
    }, 280);

    rollTimeouts.push(timeoutId);
  });

  playSpinSound();
}

rollButton.addEventListener('click', updateDice);

soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  updateSoundButton();
  if (soundEnabled) {
    startBackgroundMusic();
  } else {
    stopBackgroundMusic();
  }
});

spinToggle.addEventListener('click', () => {
  spinEnabled = !spinEnabled;
  spinToggle.classList.toggle('off', !spinEnabled);
  spinToggle.querySelector('.spin-state').textContent = spinEnabled ? 'ON' : 'OFF';
});

melodyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    melodyButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    selectedMelody = button.dataset.melody;
    melodyNoteIndex = 0;
    if (soundEnabled) {
      stopBackgroundMusic();
      startBackgroundMusic();
    }
  });
});

countryBtn.addEventListener('click', () => {
  countryPopover.classList.toggle('visible');
});

countryPopover.querySelectorAll('.country-option').forEach((button) => {
  button.addEventListener('click', () => {
    const lang = button.textContent;
    countryCode.textContent = lang;
    translate(lang);
    updateSoundButton();
    countryPopover.classList.remove('visible');
  });
});

settingsToggle.addEventListener('click', () => {
  settingsPopover.classList.toggle('visible');
});

diceCountButtons.forEach((button) => {
  button.addEventListener('click', () => {
    diceCountButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    selectedDiceCount = Number(button.dataset.count);
    renderDice(selectedDiceCount);
    translate(countryCode.textContent);
    updateDice();
  });
});

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    themeButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    selectedTheme = button.dataset.theme;
    updateBackground(selectedTheme);
  });
});

spinButtons.forEach((button) => {
  button.addEventListener('click', () => {
    spinButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    selectedSpin = button.dataset.spin;
  });
});

translate('EN');
renderDice(selectedDiceCount);
updateBackground(selectedTheme);
updateDice();
updateSoundButton();
updateOnlineUsers();
startBackgroundMusic();
