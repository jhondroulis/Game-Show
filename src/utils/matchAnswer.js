/**
 * Normalize a string for comparison
 * - Convert to lowercase
 * - Trim whitespace
 * - Remove extra spaces
 * @param {string} str
 * @returns {string}
 */
function normalizeString(str) {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Check if input matches an answer (including aliases)
 * Returns the matching answer or null
 * @param {string} input
 * @param {Array} answers
 * @returns {Object|null}
 */
export function matchAnswer(input, answers) {
  const normalized = normalizeString(input);
  
  if (!normalized) {
    return null;
  }
  
  // First pass: exact match on answer text or aliases
  for (const answer of answers) {
    const answerNormalized = normalizeString(answer.text);
    
    if (normalized === answerNormalized) {
      return answer;
    }
    
    // Check aliases
    for (const alias of answer.aliases) {
      if (normalized === normalizeString(alias)) {
        return answer;
      }
    }
  }
  
  // Second pass: partial match (input contains answer or answer contains input)
  for (const answer of answers) {
    const answerNormalized = normalizeString(answer.text);
    
    if (normalized.includes(answerNormalized) || answerNormalized.includes(normalized)) {
      return answer;
    }
    
    // Check aliases for partial match
    for (const alias of answer.aliases) {
      const aliasNormalized = normalizeString(alias);
      if (normalized.includes(aliasNormalized) || aliasNormalized.includes(normalized)) {
        return answer;
      }
    }
  }
  
  return null;
}

/**
 * Get all potential matches (for preview/suggestion)
 * @param {string} input
 * @param {Array} answers
 * @returns {Array}
 */
export function findPotentialMatches(input, answers) {
  const normalized = normalizeString(input);
  
  if (!normalized) {
    return [];
  }
  
  const matches = [];
  
  for (const answer of answers) {
    const answerNormalized = normalizeString(answer.text);
    
    // Check answer text
    if (
      normalized === answerNormalized ||
      normalized.includes(answerNormalized) ||
      answerNormalized.includes(normalized)
    ) {
      matches.push(answer);
      continue;
    }
    
    // Check aliases
    let aliasMatch = false;
    for (const alias of answer.aliases) {
      const aliasNormalized = normalizeString(alias);
      if (
        normalized === aliasNormalized ||
        normalized.includes(aliasNormalized) ||
        aliasNormalized.includes(normalized)
      ) {
        aliasMatch = true;
        break;
      }
    }
    
    if (aliasMatch) {
      matches.push(answer);
    }
  }
  
  return matches;
}



