import { createContext } from 'react';
import type { Dispatch } from 'react';
import type { GameAction, GameState, Question } from '../types';

export interface GameContextType {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  getCurrentQuestion: () => Question | undefined;
  getUnrevealedAnswers: () => number;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

