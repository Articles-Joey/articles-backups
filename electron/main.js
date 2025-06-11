import { app, BrowserWindow, Menu, Tray } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

let __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    icon: path.join(__dirname, 'icon.png'), // Set window icon
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('./index.html');

  // Intercept close and hide instead (minimize to tray)
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  // Create system tray icon
  tray = new Tray(path.join(__dirname, 'icon.png'));

  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        tray.destroy();
        app.quit();
      }
    }
  ]);

  tray.setToolTip('My Electron App');
  tray.setContextMenu(trayMenu);

  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // Quit the app when all windows are closed (except on macOS)
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});