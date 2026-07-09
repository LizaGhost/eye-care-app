import { AppConfig } from "../shared/config";

declare global {
  interface Window {
    electronAPI: {
      startWorkout: () => void;
      closeWorkout: () => void;
      closeReminder: () => void;
      getConfig: () => Promise<AppConfig>;
      updateConfig: (config: Partial<AppConfig>) => void;
      onConfigUpdated: (callback: (config: AppConfig) => void) => void;
    };
  }
}

let config: AppConfig | null = null;

async function loadConfig(): Promise<void> {
  try {
    config = await window.electronAPI.getConfig();
    renderSettings();
  } catch (error) {
    console.error("Failed to load config:", error);
  }
}

function renderSettings(): void {
  if (!config) return;

  const intervalInput = document.getElementById("interval-input") as HTMLInputElement;
  const autoStartCheckbox = document.getElementById("autostart-checkbox") as HTMLInputElement;

  if (intervalInput) {
    intervalInput.value = String(config.intervalMinutes);
  }
  if (autoStartCheckbox) {
    autoStartCheckbox.checked = config.autoStartEnabled;
  }
}

function setupEventListeners(): void {
  const intervalInput = document.getElementById("interval-input") as HTMLInputElement;
  const autoStartCheckbox = document.getElementById("autostart-checkbox") as HTMLInputElement;
  const saveButton = document.getElementById("save-button") as HTMLButtonElement;

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const newInterval = parseInt(intervalInput.value, 10);
      const newAutoStart = autoStartCheckbox.checked;

      if (newInterval > 0) {
        window.electronAPI.updateConfig({
          intervalMinutes: newInterval,
          autoStartEnabled: newAutoStart,
        });
        alert("Settings saved! Interval updated.");
      } else {
        alert("Please enter a valid interval in minutes.");
      }
    });
  }

  window.electronAPI.onConfigUpdated((updatedConfig) => {
    config = updatedConfig;
    renderSettings();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadConfig();
  setupEventListeners();
});
