import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { GameState, GameAction, Question } from '../types';

// Initial state
const initialState: GameState = {
  phase: 'setup',
  questions: [],
  currentQuestionId: null,
  activeTeam: 'A',
  teamTotals: { A: 0, B: 0 },
  teamNames: { A: 'Team A', B: 'Team B' },
  roundPot: 0,
  roundStrikes: 0,
  revealedAnswerIds: new Set(),
  stealOriginTeam: null,
};

// Reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'LOAD_QUESTIONS':
      return {
        ...state,
        questions: action.payload,
        phase: state.questions.length > 0 ? 'setup' : state.phase,
      };

    case 'SET_TEAM_NAME':
      return {
        ...state,
        teamNames: {
          ...state.teamNames,
          [action.payload.team]: action.payload.name,
        },
      };

    case 'SELECT_QUESTION':
      return {
        ...state,
        currentQuestionId: action.payload,
        phase: 'playing',
        roundPot: 0,
        roundStrikes: 0,
        revealedAnswerIds: new Set(),
        stealOriginTeam: null,
      };

    case 'REVEAL_ANSWER':
      return {
        ...state,
        revealedAnswerIds: new Set([...state.revealedAnswerIds, action.payload.answerId]),
        roundPot: state.roundPot + action.payload.points,
      };

    case 'ADD_STRIKE':
      const newStrikes = state.roundStrikes + 1;
      if (newStrikes >= 3) {
        // Switch to steal phase
        return {
          ...state,
          roundStrikes: newStrikes,
          phase: 'steal',
          stealOriginTeam: state.activeTeam,
          activeTeam: state.activeTeam === 'A' ? 'B' : 'A',
        };
      }
      return {
        ...state,
        roundStrikes: newStrikes,
      };

    case 'SWITCH_TO_STEAL':
      // Manual switch to steal (if needed)
      return {
        ...state,
        phase: 'steal',
        stealOriginTeam: state.activeTeam,
        activeTeam: state.activeTeam === 'A' ? 'B' : 'A',
      };

    case 'REVEAL_ALL':
      // Reveal all unrevealed answers
      const currentQuestion = state.questions.find(q => q.id === state.currentQuestionId);
      if (!currentQuestion) return state;
      
      const allAnswerIds = new Set(currentQuestion.answers.map(a => a.id));
      return {
        ...state,
        revealedAnswerIds: allAnswerIds,
        phase: 'roundResult',
      };

    case 'AWARD_POT':
      const winner = action.payload;
      return {
        ...state,
        teamTotals: {
          ...state.teamTotals,
          [winner]: state.teamTotals[winner] + state.roundPot,
        },
        phase: 'roundResult',
      };

    case 'NEXT_ROUND':
      return {
        ...state,
        phase: 'setup',
        currentQuestionId: null,
        roundPot: 0,
        roundStrikes: 0,
        revealedAnswerIds: new Set(),
        stealOriginTeam: null,
        activeTeam: 'A', // Reset to team A for next round
      };

    case 'GAME_OVER':
      return {
        ...state,
        phase: 'gameOver',
      };

    case 'NEW_GAME':
      return {
        ...initialState,
        questions: state.questions, // Keep loaded questions
        teamNames: state.teamNames, // Keep team names
      };

    default:
      return state;
  }
}

// Context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  getCurrentQuestion: () => Question | undefined;
  getUnrevealedAnswers: () => number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const getCurrentQuestion = () => {
    return state.questions.find(q => q.id === state.currentQuestionId);
  };

  const getUnrevealedAnswers = () => {
    const question = getCurrentQuestion();
    if (!question) return 0;
    return question.answers.length - state.revealedAnswerIds.size;
  };

  const value = {
    state,
    dispatch,
    getCurrentQuestion,
    getUnrevealedAnswers,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Custom hook
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

