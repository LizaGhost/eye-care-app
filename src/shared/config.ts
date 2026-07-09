export interface AppConfig {
  intervalMinutes: number;
  workoutSeconds: number;
  autoStartEnabled: boolean;
}

export const DEFAULT_CONFIG: AppConfig = {
  intervalMinutes: 60,
  workoutSeconds: 300,
  autoStartEnabled: true,
};
