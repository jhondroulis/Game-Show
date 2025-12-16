import { createContext } from 'react';

/**
 * @typedef {Object} Answer
 * @property {string} id
 * @property {string} text
 * @property {number} points
 * @property {string[]} aliases
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} text
 * @property {Answer[]} answers
 */

/**
 * @typedef {'setup' | 'playing' | 'steal' | 'roundResult' | 'gameOver'} Phase
 */

/**
 * @typedef {'A' | 'B'} Team
 */

/**
 * @typedef {Object} GameState
 * @property {Phase} phase
 * @property {Question[]} questions
 * @property {string|null} currentQuestionId
 * @property {Team} activeTeam
 * @property {{A: number, B: number}} teamTotals
 * @property {{A: string, B: string}} teamNames
 * @property {number} roundPot
 * @property {number} roundStrikes
 * @property {Set<string>} revealedAnswerIds
 * @property {Team|null} stealOriginTeam
 */

/**
 * @typedef {Object} GameContextType
 * @property {GameState} state
 * @property {function} dispatch
 * @property {function(): Question|undefined} getCurrentQuestion
 * @property {function(): number} getUnrevealedAnswers
 */

export const GameContext = createContext(undefined);

