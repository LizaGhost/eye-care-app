import { EXERCISES, calculateExerciseDurations, formatTime, calculateProgress } from "../shared/workout";

declare global {
  interface Window {
    electronAPI: {
      closeWorkout: () => void;
    };
  }
}

interface WorkoutState {
  isRunning: boolean;
  startTime: number;
  durations: number[];
  currentExerciseIndex: number;
  isCompleted: boolean;
}

let workoutState: WorkoutState = {
  isRunning: false,
  startTime: 0,
  durations: calculateExerciseDurations(300),
  currentExerciseIndex: 0,
  isCompleted: false,
};

function getTotalDuration(): number {
  return workoutState.durations.reduce((a, b) => a + b, 0);
}

function getCurrentExerciseAndTime(): { exerciseIndex: number; secondsInCurrent: number } {
  const elapsed = Math.floor((Date.now() - workoutState.startTime) / 1000);
  let currentExerciseIndex = 0;
  let timeAccumulated = 0;

  for (let i = 0; i < workoutState.durations.length; i++) {
    if (elapsed < timeAccumulated + workoutState.durations[i]) {
      currentExerciseIndex = i;
      break;
    }
    timeAccumulated += workoutState.durations[i];
  }

  const secondsInCurrent = elapsed - timeAccumulated;
  return { exerciseIndex: currentExerciseIndex, secondsInCurrent };
}

function renderExercise(): void {
  const { exerciseIndex, secondsInCurrent } = getCurrentExerciseAndTime();
  const totalDuration = getTotalDuration();
  const elapsed = Math.floor((Date.now() - workoutState.startTime) / 1000);

  // Check if workout is complete
  if (elapsed >= totalDuration) {
    workoutState.isCompleted = true;
    renderCompletion();
    return;
  }

  workoutState.currentExerciseIndex = exerciseIndex;

  const exercise = EXERCISES[exerciseIndex];
  const exerciseDuration = workoutState.durations[exerciseIndex];
  const remainingInExercise = exerciseDuration - secondsInCurrent;

  // Update UI
  const exerciseNumber = document.getElementById("exercise-number");
  const exerciseName = document.getElementById("exercise-name");
  const exerciseInstruction = document.getElementById("exercise-instruction");
  const remainingTime = document.getElementById("remaining-time");
  const timerDisplay = document.getElementById("timer-display");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  if (exerciseNumber) exerciseNumber.textContent = `${exerciseIndex + 1}/${EXERCISES.length}`;
  if (exerciseName) exerciseName.textContent = exercise.name;
  if (exerciseInstruction) exerciseInstruction.textContent = exercise.instruction;
  if (remainingTime) remainingTime.textContent = `Осталось: ${formatTime(remainingInExercise)}`;
  if (timerDisplay) timerDisplay.textContent = formatTime(totalDuration - elapsed);

  const progress = calculateProgress(exerciseIndex, secondsInCurrent, workoutState.durations);
  if (progressBar) {
    (progressBar as HTMLElement).style.width = `${progress}%`;
  }
  if (progressText) progressText.textContent = `${progress}%`;
}

function renderCompletion(): void {
  const container = document.getElementById("workout-container");
  if (!container) return;

  container.innerHTML = `
    <div class="completion-screen">
      <h1>Разминка завершена!</h1>
      <p>Спасибо за заботу о здоровье ваших глаз 👀</p>
      <button id="close-button" class="close-btn">Закрыть</button>
    </div>
  `;

  const closeButton = document.getElementById("close-button");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      window.electronAPI.closeWorkout();
    });
  }
}

function startWorkout(): void {
  workoutState.isRunning = true;
  workoutState.startTime = Date.now();
  workoutState.durations = calculateExerciseDurations(300);

  const container = document.getElementById("workout-container");
  if (!container) return;

  container.innerHTML = `
    <div class="workout-header">
      <div class="timer" id="timer-display">5:00</div>
      <div class="progress-container">
        <div class="progress-bar" id="progress-bar"></div>
      </div>
      <div class="progress-text" id="progress-text">0%</div>
    </div>
    <div class="exercise-container">
      <div class="exercise-number" id="exercise-number">1/7</div>
      <h2 id="exercise-name">Упражнение</h2>
      <p id="exercise-instruction">Инструкция здесь</p>
      <div class="remaining" id="remaining-time">Осталось: 0:00</div>
    </div>
  `;

  const updateInterval = setInterval(() => {
    if (workoutState.isCompleted) {
      clearInterval(updateInterval);
      return;
    }
    renderExercise();
  }, 100);

  renderExercise();
}

document.addEventListener("DOMContentLoaded", () => {
  startWorkout();
});
