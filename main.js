const {app, BrowserWindow} = require ('electron')
const config = require('./config');

function createWindow () {
   const win = new BrowserWindow ({
     width: 800,
     height: 600,
     titleBarStyle: "hidden",
     alwaysOnTop: true,
     webPreferences: {
       nodeIntegration: true
     }
   })

   win.loadURL(config.url)
   //win.webContents.openDevTools ()
}

app.whenReady().then(createWindow)

app.on ('window-all-closed', () => {
   if (process.platform !== 'darwin') {
     app. uit ()
   }
})

app.on ('activate', () => {
   if (BrowserWindow.etAllWindows().length === 0) {
     createWindow()
   }
})