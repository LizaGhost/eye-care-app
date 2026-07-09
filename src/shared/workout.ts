export interface Exercise {
  id: number;
  name: string;
  instruction: string;
}

export const EXERCISES: Exercise[] = [
  {
    id: 1,
    name: "Моргание",
    instruction: "Часто поморгай 20–30 раз, без усилия. Затем 3 спокойных вдоха-выдоха."
  },
  {
    id: 2,
    name: "Пальминг",
    instruction: "Закрой глаза, прикрой ладонями без давления. Сохраняй темноту 40 секунд."
  },
  {
    id: 3,
    name: "Взгляд близко-дальше",
    instruction: "Посмотри на кончик пальца на расстоянии ~20–30 см, затем вдаль 5–10 секунд. Повтори 4–5 раз."
  },
  {
    id: 4,
    name: "Круги глазами",
    instruction: "Медленно нарисуй глазами круг по часовой стрелке, затем против. Без боли. 2 круга в каждую сторону."
  },
  {
    id: 5,
    name: "Вверх-вниз",
    instruction: "Медленно переведи взгляд вверх-вниз, фиксируя каждую позицию на 2 секунды. 10 повторов."
  },
  {
    id: 6,
    name: "Лево-право",
    instruction: "Медленно переведи взгляд влево-вправо, фиксируя каждую позицию на 2 секунды. 10 повторов."
  },
  {
    id: 7,
    name: "Фокус на точке",
    instruction: "Сфокусируйся на одной точке перед собой 20–30 секунд, затем переведи взгляд в сторону, расслабься."
  }
];

export function calculateExerciseDurations(totalSeconds: number): number[] {
  const exerciseCount = EXERCISES.length;
  const baseDuration = Math.floor(totalSeconds / exerciseCount);
  const remainder = totalSeconds % exerciseCount;
  
  const durations: number[] = [];
  for (let i = 0; i < exerciseCount; i++) {
    durations.push(baseDuration + (i < exerciseCount - remainder ? 1 : 0));
  }
  
  return durations;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function calculateProgress(
  currentExerciseIndex: number,
  secondsInCurrent: number,
  durations: number[]
): number {
  let totalPassed = 0;
  for (let i = 0; i < currentExerciseIndex; i++) {
    totalPassed += durations[i];
  }
  totalPassed += secondsInCurrent;
  
  const totalSeconds = durations.reduce((a, b) => a + b, 0);
  return Math.min(100, Math.round((totalPassed / totalSeconds) * 100));
}
