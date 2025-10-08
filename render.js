const { ipcRenderer } = require('electron');
const path = require('path');

const player = document.getElementById('player');
const playBtn = document.getElementById('play');
const title = document.querySelector('h1');
const stopBtn = document.getElementById('stop');
const progress = document.getElementById('progress');
const cover = document.getElementById('cover');

// --- VALORES INICIALES ---
progress.value = 0;
const defaultCover = `file://${path.join(__dirname, 'default-cover.png')}`;
cover.src = defaultCover;

// --- BOTÓN PLAY/PAUSE ---
playBtn.addEventListener('click', () => {
  if (!player.src) return; // si no hay canción cargada, no hacer nada

  if (player.paused) {
    player.play();
    playBtn.textContent = 'Pause';
  } else {
    player.pause();
    playBtn.textContent = 'Play';
  }
});

// --- BOTÓN STOP ---
stopBtn.addEventListener('click', () => {
  player.pause();
  player.currentTime = 0;
  playBtn.textContent = 'Play';
  progress.value = 0;
});

// --- ACTUALIZAR BARRA DE PROGRESO ---
player.addEventListener('timeupdate', () => {
  if (player.duration > 0) {
    progress.value = (player.currentTime / player.duration) * 100;
  }
});

// --- CONTROLAR MANUALMENTE LA POSICIÓN ---
progress.addEventListener('input', () => {
  if (player.duration > 0) {
    const newTime = (progress.value / 100) * player.duration;
    player.currentTime = newTime;
  }
});

// --- CUANDO SE SELECCIONA UN ARCHIVO ---
ipcRenderer.on('audio-selected', (event, data) => {
  const { filePath, coverDataUrl } = data;

  // Normalizar ruta
  const normalizedPath = filePath.replace(/\\/g, '/');
  player.src = `file:///${normalizedPath}`;

  // Mostrar nombre del archivo
  const nombre = path.basename(filePath);
  title.textContent = `🎵 ${nombre}`;

  // Mostrar portada (si existe)
  if (coverDataUrl) {
    cover.src = coverDataUrl;
  } else {
    cover.src = defaultCover;
  }

  // Reproducir automáticamente
  player.load();
  player.play();
  playBtn.textContent = 'Pause';
});
