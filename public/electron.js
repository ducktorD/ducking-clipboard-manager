const { app, BrowserWindow, Tray, screen, dialog } = require('electron');
let path = require('path');
const isDev = require("electron-is-dev");

// if I would like vibrancy/blur effect for window:
// https://www.npmjs.com/package/@hxkuc/electron-vibrancy

let win = undefined;
let trayIcon = undefined;
let browserWindowHidden = true;

function createWindow() {
	win = new BrowserWindow({
      height: 400,
		width: isDev ? 550 : 350,
      minHeight: 250,
      minWidth: 275,
      maxHeight: 600,
      maxWidth: 600,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
         contextIsolation: false,
         webSecurity: false,
         devTools: isDev ? true : false,
      },
      transparent: true,
      frame: false,
      hasShadow: false,
      movable: false,
      alwaysOnTop: true,
      fullscreenable: false,
   });

   // if (isDev) {
   //    win.webContents.openDevTools();
   // }

   win.hide();
   win.setVisibleOnAllWorkspaces(true);

   win.loadURL(
      isDev
         ? "http://localhost:3005"
         : `file:///${__dirname}/../build/index.html`
   );

   trayIcon = isDev 
   ? new Tray(`${path.join(__dirname, "../public/images/icon@1x.png")}`)
   : new Tray(`${path.join(__dirname, "../build/images/icon@1x.png")}`);

   // distinction between dev and prod in tray
   if (isDev) {
      trayIcon.setTitle('Dev');
   }
   trayIcon.setToolTip('Ducking Clipboard Manager');

   // treating app showing and hiding on clicking trayIcon
   trayIcon.on('click', () => {
      if (browserWindowHidden) {
         win.setPosition(trayIcon.getBounds().x, 0);
         win.show();
      } else {
         win.hide();
      }
      browserWindowHidden = !browserWindowHidden;
   });

   // close the window if you click out of the app
   win.on('blur', () => {
      win.hide();
      browserWindowHidden = true;
   });
}

app.whenReady().then(() => {
   try {
      createWindow();
   } catch (err) {
      dialog.showErrorBox('Window creating error!', err.message);
   }

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});