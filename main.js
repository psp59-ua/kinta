const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const mm = require('music-metadata');


function createWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // necesario para ipcRenderer sin preload
    },
  });

  win.loadFile('index.html');

  // 🔹 Menú personalizado
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Abrir canción...',
          accelerator: 'Ctrl+O',
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog(win, {
              title: 'Seleccionar archivo de audio',
              buttonLabel: 'Abrir',
              filters: [
                { name: 'Archivos de audio', extensions: ['mp3', 'wav', 'ogg', 'flac', 'm4a'] },
              ],
              properties: ['openFile'],
            });

            if (!canceled && filePaths.length > 0) {
              const filePath = filePaths[0];

              try {
                // 🔸 Leer metadatos con music-metadata
                const metadata = await mm.parseFile(filePath);
                let coverDataUrl = null;

                if (metadata.common.picture && metadata.common.picture.length > 0) {
                  const picture = metadata.common.picture[0];
                  const base64 = picture.data.toString('base64');
                  const mimeType = picture.format;
                  coverDataUrl = `data:${mimeType};base64,${base64}`;
                }

                // 🔸 Enviar ruta y carátula al render
                win.webContents.send('audio-selected', { filePath, coverDataUrl });
              } catch (err) {
                console.error('Error al leer metadatos:', err);
                // Enviar solo el archivo si no se puede leer metadatos
                win.webContents.send('audio-selected', { filePath, coverDataUrl: null });
              }
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Salir',
          role: 'quit',
          accelerator: 'Ctrl+Q',
        },
      ],
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de...',
          click: () => {
            dialog.showMessageBox(win, {
              type: 'info',
              title: 'Reproductor',
              message: '🎵 Reproductor de audio hecho con Electron',
              buttons: ['OK'],
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Iniciar la app
app.whenReady().then(createWindow);

// En macOS mantener la app viva si se cierra la ventana
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// En macOS mantener la app viva si se cierra la ventana
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});