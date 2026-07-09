import { contextBridge, ipcRenderer } from "electron";
import { AppConfig } from "../shared/config";

const api = {
  startWorkout: () => ipcRenderer.send("start-workout"),
  closeWorkout: () => ipcRenderer.send("close-workout"),
  closeReminder: () => ipcRenderer.send("close-reminder"),
  getConfig: (): Promise<AppConfig> => ipcRenderer.invoke("get-config"),
  updateConfig: (config: Partial<AppConfig>) => ipcRenderer.send("update-config", config),
  onConfigUpdated: (callback: (config: AppConfig) => void) => {
    ipcRenderer.on("config-updated", (event, config) => callback(config));
  },
};

contextBridge.exposeInMainWorld("electronAPI", api);

export type ElectronAPI = typeof api;
