var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var fs = __toESM(require("node:fs"));
const sqlite3 = require("sqlite3").verbose();
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
require("./menu");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
let db;
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // eslint-disable-next-line no-undef
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: true,
      nodeIntegration: true
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile("dist/index.html");
  }
  win.webContents.openDevTools();
};
app.whenReady().then(() => {
  createWindow();
  dbInit();
});
const dbInit = () => {
  const dbPath = path.join(__dirname, "data", "data.db");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Error opening database", err);
    } else {
      console.log("Database opened successfully");
    }
  });
  db.run("CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)", (err) => {
    if (err) {
      console.error("Error creating table", err);
    }
  });
};
ipcMain.handle("set-data", (event, key, value) => {
  return new Promise((resolve, reject) => {
    db.run("INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)", [key, value], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});
ipcMain.handle("get-data", (event, key) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT value FROM kv_store WHERE key = ?", [key], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row.value : null);
      }
    });
  });
});
