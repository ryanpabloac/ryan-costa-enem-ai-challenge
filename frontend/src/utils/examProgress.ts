export type ExamAnswerLetter = 'A' | 'B' | 'C' | 'D' | 'E';

export type ExamProgressAnswerMap = Record<number, ExamAnswerLetter>;

export interface ExamProgress {
  id: string;
  area: string;
  answers: ExamProgressAnswerMap;
  updatedAt: string;
}

const STORAGE_KEY = 'simula-enem-current-exam';

export function getStoredExamProgress(): ExamProgress | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as ExamProgress;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setStoredExamProgress(progress: ExamProgress): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function clearStoredExamProgress(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
