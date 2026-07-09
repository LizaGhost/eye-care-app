declare global {
  interface Window {
    electronAPI: {
      startWorkout: () => void;
      closeWorkout: () => void;
      closeReminder: () => void;
      getConfig: () => Promise<any>;
      updateConfig: (config: any) => void;
      onConfigUpdated: (callback: (config: any) => void) => void;
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button") as HTMLButtonElement;
  const closeButton = document.getElementById("close-button") as HTMLButtonElement;

  if (startButton) {
    startButton.addEventListener("click", () => {
      window.electronAPI.startWorkout();
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      window.electronAPI.closeReminder();
    });
  }
});

export {};
