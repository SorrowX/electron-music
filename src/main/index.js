import { app, BrowserWindow } from 'electron'
import electron from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 560,
    width: 800,
    maxHeight: 560,
    maxWidth: 800,
    useContentSize: true,
    frame: false,
    show: false,
    resizable: false,
    transparent: true
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const ipc = electron.ipcMain
//最小化
ipc.on('window-min', () => {
    mainWindow.minimize()
})
//最大化
ipc.on('window-max', () => {
    if(mainWindow.isMaximized()) {
          mainWindow.restore()
    }else{
          mainWindow.maximize()
    }
})
// 关闭
ipc.on('window-close', () => {
    mainWindow.close()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
