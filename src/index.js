const
  { app, BrowserWindow, Menu, nativeTheme, ipcMain, Notification } = require('electron'),
  path = require('path'),
  isMac = process.platform === 'darwin',
  darkBackgroundColor = '#3c3c3c',
  lightBackgroundColor = '#ffffff',
  iconPath = __dirname + '/source/images/icons/scs.png';

let
  notify = {
    auth: {
      error: null,
      saved: null,
      empty: null
    }
  },
  auth = {
    name: null,
    pass: null
  }

app.commandLine.appendSwitch('ignore-certificate-errors');
app.dock.setIcon(iconPath);

const init = () => {
  notify = {
    auth: {
      error: new Notification({ title: "Важно!", body: "В случае, если вы видите ошибку 401, тогда вам необходимо ввести данные аутентификации, делается это на начальной странице" }),
      saved: new Notification({ title: "Успешно!", body: "Данные аутентификации сохранены" }),
      empty: new Notification({ title: "Ошибка!", body: "Введите информацию в поля относящиеся к аутентификации" })
    }
  };

  const mainWindow = new BrowserWindow({
    minWidth: 300,
    minHeight: 450,
    width: 600,
    height: 450,
    webPreferences: {
      devTools: true,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, "preload.js")
    },
    frame: true,
    backgroundColor: nativeTheme.shouldUseDarkColors
      ? darkBackgroundColor
      : lightBackgroundColor
  });

  mainWindow.setIcon(iconPath);
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  Menu.setApplicationMenu(Menu.buildFromTemplate(
    [
      ...(isMac ? [{
        label: app.name,
        submenu: [
          { type: 'separator' },
          { role: 'hide', label: 'Скрыть' },
          { role: 'unhide', label: 'Показать' },
          { type: 'separator' },
          { role: 'quit', label: 'Закрыть' }
        ]
      }] : []),
      {
        label: "Активность",
        submenu: [
          { label: "Вернуть", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Повторить", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Вырезать", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Скопировать", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Вставить", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Выбрать все", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
      },
      {
        label: 'Открыть',
        submenu: [
          {
            label: 'Сайт (#1)',
            click: () => {
              BrowserWindow.getFocusedWindow().loadURL('https://localhost:10100');
              BrowserWindow.getFocusedWindow().setTitle("Сайт (#1)");
            }
          },
          {
            label: 'Редактор (#1)',
            click: () => {
              BrowserWindow.getFocusedWindow().loadURL('https://localhost:10101');
              BrowserWindow.getFocusedWindow().setTitle("Редактор (#1)");
            }
          },
          {
            label: 'СУБД (#1)',
            click: () => {
              BrowserWindow.getFocusedWindow().loadURL('https://localhost:10102');
              BrowserWindow.getFocusedWindow().setTitle("СУБД (#1)");
            }
          },
          { type: 'separator' },
          {
            label: 'Сайт (#2)',
            click: () => {
              BrowserWindow.getFocusedWindow().loadURL('https://localhost:10200');
              BrowserWindow.getFocusedWindow().setTitle("Сайт (#2)");
            }
          },
          {
            label: 'Редактор (#2)',
            click: () => {
              BrowserWindow.getFocusedWindow().loadURL('https://localhost:10201');
              BrowserWindow.getFocusedWindow().setTitle("Редактор (#2)");
            }
          },
          {
            label: 'СУБД (#2)',
            click: () => {
              BrowserWindow.getFocusedWindow().loadURL('https://localhost:10202');
              BrowserWindow.getFocusedWindow().setTitle("СУБД (#2)");
            }
          },
          { type: 'separator' },
          {
            label: 'Сброс',
            click: () => BrowserWindow.getFocusedWindow().loadFile(path.join(__dirname, 'index.html'))
          }
        ]
      },
      {
        label: 'Страница',
        submenu: [
          { role: 'reload', label: 'Обновить' },
          { role: 'toggleDevTools', accelerator: "F12", label: 'Режим разработчика' },
          { type: 'separator' },
          { role: 'resetZoom', label: 'Масштабирование 0' },
          { role: 'zoomIn', label: 'Масштабирование +' },
          { role: 'zoomOut', label: 'Масштабирование -' },
          { type: 'separator' },
          { role: 'togglefullscreen', label: 'Изменить размер' }
        ]
      },
      {
        label: 'Окно',
        submenu: [
          { label: 'Новое', click: init },
          { role: 'zoom', label: 'Размер' },
          { type: 'separator' },
          { role: 'minimize', label: 'Скрыть' },
          { role: 'close', label: 'Закрыть' }
        ]
      }
    ]
  ));

  nativeTheme.on('updated', () => {
    app.dock.setIcon(iconPath);
    mainWindow.setBackgroundColor(nativeTheme.shouldUseDarkColors
      ? darkBackgroundColor
      : lightBackgroundColor);
  });
};

app.on('ready', init);

app.on('window-all-closed', 
  () => {
    if (process.platform !== 'darwin')
      app.quit();
  });

app.on('login', 
  (event, webContents, request, authInfo, callback) => {
    notify.auth.error.show();
    event.preventDefault();

    callback(auth.name, auth.pass);
  });

ipcMain.handle('auth-save', 
  (event, credentials) => {
    auth = credentials;

    notify.auth.saved.show();
  });

ipcMain.handle('auth-empty', 
  () => notify.auth.empty.show());

ipcMain.handle('auth-get', 
  () => auth);
