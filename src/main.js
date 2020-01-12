import path from "path";
import url from "url";
import { app } from "electron";
import WindowManager from "window-manager";

const wm = new WindowManager();

const CTRL = "control-window";
const RNDR = "renderer-window";

function toUrl(file) {
  const absurl = url.format({
    protocol: "file",
    slashes: true,
    pathname: path.resolve(app.getAppPath(), file),
  });

  return absurl;
}

function ensureWindows() {
  if (!wm.has(CTRL)) {
    wm.create(CTRL, toUrl("views/control.html"));
  }

  if (!wm.has(RNDR)) {
    wm.create(RNDR, toUrl("views/renderer.html"));
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
