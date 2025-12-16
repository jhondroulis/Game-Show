import type { Question } from '../types';

const storageKey = 'familyFeud.questions.v1' as const;

type PersistedQuestions = {
  schemaVersion: 1;
  savedAtIso: string;
  questions: Question[];
};

export function saveQuestionsToStorage(questions: Question[]) {
  try {
    const payload: PersistedQuestions = {
      schemaVersion: 1,
      savedAtIso: new Date().toISOString(),
      questions,
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function loadQuestionsFromStorage(): Question[] | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PersistedQuestions>;
    if (parsed.schemaVersion !== 1) return null;
    if (!Array.isArray(parsed.questions)) return null;

    return parsed.questions as Question[];
  } catch {
    return null;
  }
}

export function clearQuestionsStorage() {
  localStorage.removeItem(storageKey);
}
