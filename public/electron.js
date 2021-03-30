const { app, BrowserWindow, Tray, dialog } = require('electron');
let path = require('path');
const isDev = require("electron-is-dev");
const { electron } = require('process');

// https://www.npmjs.com/package/@hxkuc/electron-vibrancy

let win = undefined;
let trayIcon = undefined;
let browserWindowHidden = true;

function createWindow() {
	win = new BrowserWindow({
		width: 350,
		height: 400,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
         contextIsolation: false,
         webSecurity: false,
      },
      transparent: true,
      frame: false,
      hasShadow: false,
      movable: false,
   });

   win.loadURL(
      isDev
         ? "http://localhost:3000"
         : `file:///${__dirname}/../build/index.html`
   );

   // try {
   //    app.dock.setIcon('./public/images/app.ico');
   // } catch (err) {
   //    console.error('There was an error in loading app icon...', __dirname);
   //    console.error(err.message);
   // }
   
   win.hide();
   win.setFullScreenable(false);

   trayIcon = isDev 
      ? new Tray(`${path.join(__dirname, "../public/images/icon@1x.png")}`)
      : new Tray(`${path.join(__dirname, "../build/images/icon@1x.png")}`);

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

// app.dock.setIcon(isDev
//    ? path.join(__dirname, '../public/images/icon.png')
//    : path.join(__dirname, '../build/images/icon.png')
// );

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