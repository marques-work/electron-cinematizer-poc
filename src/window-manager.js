import { BrowserWindow } from "electron";

function openWin(url, opts = {}) {
  const win = new BrowserWindow({ show: false, ...opts });

  win.webContents.openDevTools();

  win.removeMenu();
  win.loadURL(url);

  win.once("ready-to-show", () => {
    win.show();
  });

  return win;
}

export default class WindowManager {
  #current = new Map();

  create(name, url, opts) {
    if (this.#current.has(name)) {
      this.close(name);
    }

    const win = openWin(url, opts);

    win.on("closed", () => {
      this.#current.delete(name);
    });

    this.#current.set(name, win);

    return win;
  }

  has(name) {
    return this.#current.has(name);
  }

  get(name) {
    return this.#current.get(name) || null;
  }

  close(name) {
    const win = this.get(name);

    if (win) {
      win.close();
    }

    this.#current.delete(name);
  }

  active() {
    return new Set(this.#current.keys());
  }
}
