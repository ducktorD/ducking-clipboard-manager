const { app, BrowserWindow, Tray, screen, dialog } = require('electron');
const os = require('os');
let path = require('path');
const isDev = require('electron-is-dev');
const db = require('./db');

// if I would like vibrancy/blur effect for window:
// https://www.npmjs.com/package/@hxkuc/electron-vibrancy

let win = undefined;
let trayIcon = undefined;
let browserWindowHidden = true;

const platforms = {
   WINDOWS: 'WINDOWS',
   MAC: 'MAC',
   LINUX: 'LINUX',
}

const platformsNames = {
   win32: platforms.WINDOWS,
   darwin: platforms.MAC,
   linux: platforms.LINUX,
}

const currentPlatform = platformsNames[os.platform()];
console.log(currentPlatform);

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
      // frame: currentPlatform !== 'MAC',
      frame: false,
      hasShadow: false,
      movable: currentPlatform !== 'MAC',
      alwaysOnTop: currentPlatform === 'MAC',
      fullscreenable: false,
   });

   // if (isDev) {
   //    win.webContents.openDevTools();
   // }

   switch (currentPlatform) {
      case 'MAC': {

         win.hide();
         win.setVisibleOnAllWorkspaces(true);

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

         break;
      }
      case 'WINDOWS' || 'LINUX': {

         win.setTitle(`Ducking Clipboard Manager ${isDev ? '(Dev)' : ''}`);
         win.removeMenu();

         break;
      }
      default: {
         console.error('You are using an unsupported OS!');
         break;
      }
   }

   win.loadURL(
      isDev
         ? "http://localhost:3000"
         : `file:///${__dirname}/../build/index.html`
   );
}

app.whenReady().then(() => {
   const createTag = async (label) => {
      const tag = await db.tags.insert({label});
      return tag;
   }

   const getTags = async () => {
      const proxies = await db.tags.find({});
      return {proxies};
   }

   try {
      createTag('This is my frist test 3').then(() => {
         getTags().then(console.log);
      });
   } catch (err) {
      console.error(err.message);
   }

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