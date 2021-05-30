const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')

const server = require('./src/app')

const appIcon = __dirname + '/src/views/assets/bibliotech.ico'

function createWindow () {
  
  // criar a tela principal da aplicação
  const win = new BrowserWindow({
    width: 600,
    height: 300,
    icon: appIcon,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true,
    maximizable: false,
    resizable: false,
    fullscreenable: false
  })

  // mensagem de confirmação ao fechar a aplicação
  win.on('close', (event) => {
    const choice = require('electron').dialog.showMessageBoxSync(
      win,{
        type: 'warning',
        buttons: ['Yes', 'No'],
        title: ' Atenção!',
        message: 'Fechar o Servidor Bibliotech?'
      }
    );
    if (choice > 0) event.preventDefault();
  })

  // ao minimizar, esconder a aplicação na bandeja
  win.on('minimize', (event) => {
    event.preventDefault()
    win.hide()
    event.returnValue = false;
  })

  // criar menu de contexto, que será exibido no tray icon
  let contextMenu = Menu.buildFromTemplate([
    {
      label: 'Exibir', click:  () => {
        win.show();
      }
    },
    {
      label: 'Fechar', click:  () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  // criar do tray icon
  const tray = new Tray(appIcon);
  tray.setToolTip('Servidor Bibliotech');
  tray.setContextMenu(contextMenu);

  win.loadFile('src/views/index.html');

  // vincular o menu ao clique no botão direito sobre o tray icon 
  tray.on('right-click', () => {
    tray.popUpContextMenu();
  })

  // abrir a aplicação ao clicar sobre o tray icon
  tray.on('click', () => {
    win.show();
  });
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