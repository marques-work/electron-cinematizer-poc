import { app, screen, ipcMain } from "electron";
import WindowManager from "window-manager";

const wm = new WindowManager();

const CTRL = "control-window";
const RNDR = "renderer-window";

function ensureWindows() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const w = Math.round(width / 2);
  const h = Math.round(height / 2);

  if (!wm.has(CTRL)) {
    wm.create(CTRL, "views/control.html", {
      x: 0, y: height - h, width: w, height: h,
    });
  }

  if (!wm.has(RNDR)) {
    wm.create(RNDR, "views/renderer.html", {
      x: w, y: 0, width: Math.round(width / 2), height: Math.round(height / 2),
    });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", ensureWindows);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (!wm.has(CTRL) || !wm.has(RNDR)) {
    ensureWindows();
  }
});

ipcMain.on("render.scene", (_, arg) => {
  ensureWindows(); // in case the renderer window was closed...
  log(`Update scene to: ${arg}`);
  wm.get(RNDR).webContents.send("update.scene", arg);
});

function log(...msg) {
  if (!app.isPackaged) {
    console.log("[DEBUG]", ...msg); // eslint-disable-line no-console
  }
}
