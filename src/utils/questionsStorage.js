const storageKey = 'familyFeud.questions.v1';

/**
 * Save questions to localStorage
 * @param {Array} questions
 * @returns {boolean}
 */
export function saveQuestionsToStorage(questions) {
  try {
    const payload = {
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

/**
 * Load questions from localStorage
 * @returns {Array|null}
 */
export function loadQuestionsFromStorage() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== 1) return null;
    if (!Array.isArray(parsed.questions)) return null;

    return parsed.questions;
  } catch {
    return null;
  }
}

/**
 * Clear questions from localStorage
 */
export function clearQuestionsStorage() {
  localStorage.removeItem(storageKey);
}

