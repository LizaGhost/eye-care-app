import { app, BrowserWindow, Menu, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";
import Store from "electron-store";
import log from "electron-log";
import { Scheduler } from "./scheduler";
import { AppConfig, DEFAULT_CONFIG } from "../shared/config";

// Configure logging
log.catchErrors();
log.info("=== Eye Care App Started ===");

let mainWindow: BrowserWindow | null = null;
let reminderWindow: BrowserWindow | null = null;
let workoutWindow: BrowserWindow | null = null;
let scheduler: Scheduler | null = null;

const store = new Store<AppConfig>({
  defaults: DEFAULT_CONFIG,
});

const isDev = process.env.NODE_ENV === "development";

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const mainUrl = isDev
    ? "http://localhost:3000/index.html"
    : `file://${path.join(__dirname, "../../public/index.html")}`;

  mainWindow.loadURL(mainUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createReminderWindow(): void {
  if (reminderWindow !== null) {
    reminderWindow.focus();
    return;
  }

  reminderWindow = new BrowserWindow({
    width: 600,
    height: 400,
    alwaysOnTop: true,
    frame: false,
    skipTaskbar: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const reminderUrl = isDev
    ? "http://localhost:3000/reminder.html"
    : `file://${path.join(__dirname, "../../public/reminder.html")}`;

  reminderWindow.loadURL(reminderUrl);

  if (isDev) {
    reminderWindow.webContents.openDevTools();
  }

  reminderWindow.on("closed", () => {
    reminderWindow = null;
  });
}

function createWorkoutWindow(): void {
  if (workoutWindow !== null) {
    return;
  }

  workoutWindow = new BrowserWindow({
    width: 800,
    height: 600,
    alwaysOnTop: true,
    frame: false,
    skipTaskbar: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const workoutUrl = isDev
    ? "http://localhost:3000/workout.html"
    : `file://${path.join(__dirname, "../../public/workout.html")}`;

  workoutWindow.loadURL(workoutUrl);

  if (isDev) {
    workoutWindow.webContents.openDevTools();
  }

  workoutWindow.on("closed", () => {
    workoutWindow = null;
  });
}

function showReminder(): void {
  log.info("Showing reminder window");
  createReminderWindow();
}

function startWorkout(): void {
  log.info("Starting workout");
  if (reminderWindow) {
    reminderWindow.close();
    reminderWindow = null;
  }
  createWorkoutWindow();
}

function closeWorkout(): void {
  log.info("Closing workout window");
  if (workoutWindow) {
    workoutWindow.close();
    workoutWindow = null;
  }
}

function initializeScheduler(): void {
  try {
    const config = store.store;
    scheduler = new Scheduler(config, showReminder);
    scheduler.start();
    log.info("Scheduler initialized with interval:", config.intervalMinutes, "minutes");
  } catch (error) {
    log.error("Failed to initialize scheduler:", error);
  }
}

app.on("ready", () => {
  log.info("App ready, creating main window");
  createMainWindow();
  initializeScheduler();
});

app.on("window-all-closed", () => {
  log.info("All windows closed");
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// IPC Handlers
ipcMain.on("start-workout", () => {
  startWorkout();
});

ipcMain.on("close-workout", () => {
  closeWorkout();
});

ipcMain.on("close-reminder", () => {
  if (reminderWindow) {
    reminderWindow.close();
    reminderWindow = null;
  }
});

ipcMain.handle("get-config", () => {
  return store.store;
});

ipcMain.on("update-config", (event, newConfig: Partial<AppConfig>) => {
  store.set(newConfig);
  log.info("Config updated:", newConfig);
  
  // Restart scheduler if interval changed
  if (newConfig.intervalMinutes && scheduler) {
    scheduler.stop();
    initializeScheduler();
  }
  
  if (mainWindow) {
    mainWindow.webContents.send("config-updated", store.store);
  }
});

// Create application menu
const createMenu = (): void => {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          label: "Exit",
          accelerator: "CmdOrCtrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About",
          click: () => {
            log.info("About clicked");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

app.whenReady().then(() => {
  createMenu();
  log.info("Application menu created");
});

// Cleanup on app quit
app.on("before-quit", () => {
  if (scheduler) {
    scheduler.stop();
  }
  log.info("=== Eye Care App Closed ===");
});
