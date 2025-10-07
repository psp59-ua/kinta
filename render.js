const { ipcRenderer } = require('electron');
const path = require('path');

const player = document.getElementById('player');
const playBtn = document.getElementById('play');
const title = document.querySelector('h1');

// Botón Play/Pause
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

// Cuando el main envía la ruta del archivo
ipcRenderer.on('audio-selected', (event, filePath) => {
  // 🔹 Normalizamos la ruta (por si hay barras invertidas en Windows)
  const normalizedPath = filePath.replace(/\\/g, '/');

  // 🔹 Asignamos correctamente el src
  player.src = `file:///${normalizedPath}`;

  // 🔹 Mostramos el nombre del archivo en el h1
  const nombre = path.basename(filePath);
  title.textContent = `🎵 ${nombre}`;

  // 🔹 Reproducimos automáticamente
  player.load();
  player.play();
  playBtn.textContent = 'Pause';
});
