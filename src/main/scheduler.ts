import schedule from "node-schedule";
import log from "electron-log";
import { AppConfig } from "../shared/config";

export class Scheduler {
  private job: schedule.Job | null = null;
  private config: AppConfig;
  private callback: () => void;
  private isWorkoutRunning: boolean = false;
  private isReminderShown: boolean = false;

  constructor(config: AppConfig, callback: () => void) {
    this.config = config;
    this.callback = callback;
  }

  public start(): void {
    try {
      const intervalMinutes = this.config.intervalMinutes;
      const cronExpression = `*/${intervalMinutes} * * * *`;
      
      log.info(`Starting scheduler with interval: ${intervalMinutes} minutes`);
      
      this.job = schedule.scheduleJob(cronExpression, () => {
        this.onInterval();
      });

      if (this.job) {
        log.info("Scheduler started successfully");
      }
    } catch (error) {
      log.error("Failed to start scheduler:", error);
    }
  }

  public stop(): void {
    if (this.job) {
      this.job.cancel();
      log.info("Scheduler stopped");
    }
  }

  private onInterval(): void {
    log.info("Scheduler interval triggered");
    
    // Only show reminder if neither workout is running nor reminder is already shown
    if (!this.isWorkoutRunning && !this.isReminderShown) {
      this.isReminderShown = true;
      this.callback();
      
      // Reset reminder flag after 5 seconds (in case user closes the window)
      setTimeout(() => {
        this.isReminderShown = false;
      }, 5000);
    }
  }

  public setWorkoutRunning(running: boolean): void {
    this.isWorkoutRunning = running;
  }

  public setReminderShown(shown: boolean): void {
    this.isReminderShown = shown;
  }
}
