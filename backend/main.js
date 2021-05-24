const { app, BrowserWindow } = require('electron')
const path = require('path')

const server = require('./src/app')

function createWindow () {
  const win = new BrowserWindow({
    width: 600,
    height: 300,
    icon: __dirname + '/src/views/assets/bibliotech.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('src/views/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})