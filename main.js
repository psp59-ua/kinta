const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');

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
      label: 'Archivo', // Asegúrate de que se muestre "Archivo" y no "File"
      submenu: [
        {
          label: 'Abrir canción...',
          accelerator: 'Ctrl+O', // atajo útil
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog(win, {
              title: 'Seleccionar archivo de audio',
              buttonLabel: 'Abrir',
              filters: [
                { name: 'Archivos de audio', extensions: ['mp3', 'wav', 'ogg'] },
              ],
              properties: ['openFile'],
            });

            if (!canceled && filePaths.length > 0) {
              win.webContents.send('audio-selected', filePaths[0]);
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
    // Opcional: menú de ayuda
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de...',
          click: () => {
            dialog.showMessageBox(win, {
              type: 'info',
              title: 'Reproductor',
              message: 'Reproductor de audio hecho con Electron 🎵',
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
