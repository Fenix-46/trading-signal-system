const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL('http://127.0.0.1:3000');

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startBackend() {
  const backendDir = path.join(__dirname, '..', 'backend', 'dist', 'main');
  const backendExecutable = path.join(
    backendDir,
    process.platform === 'win32' ? 'main.exe' : 'main'
  );

  if (require('fs').existsSync(backendExecutable)) {
    backendProcess = spawn(backendExecutable, [], {
      cwd: backendDir
    });

    backendProcess.stdout.on('data', (data) => console.log(`[backend] ${data}`));
    backendProcess.stderr.on('data', (data) => console.error(`[backend] ${data}`));
    backendProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Backend exited with code ${code}`);
      }
    });
    return;
  }

  console.warn('Backend bundle not found. Falling back to Python backend.');
  backendProcess = spawn('python', ['-m', 'uvicorn', 'backend.main:app', '--host', '127.0.0.1', '--port', '8000'], {
    cwd: path.join(__dirname, '..')
  });

  backendProcess.stdout.on('data', (data) => console.log(`[backend] ${data}`));
  backendProcess.stderr.on('data', (data) => console.error(`[backend] ${data}`));
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
