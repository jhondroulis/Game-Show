// Core data types for the Family Feud game

export interface Answer {
  id: string;          // generated: `${questionId}_${index}`
  text: string;
  points: number;
  aliases: string[];   // normalized lowercase synonyms
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];   // sorted by points descending
}

export type Phase = "setup" | "playing" | "steal" | "roundResult" | "gameOver";
export type Team = "A" | "B";

export interface GameState {
  phase: Phase;
  questions: Question[];
  currentQuestionId: string | null;
  activeTeam: Team;
  teamTotals: { A: number; B: number };
  teamNames: { A: string; B: string };
  roundPot: number;
  roundStrikes: number;
  revealedAnswerIds: Set<string>;
  stealOriginTeam: Team | null;  // team that had 3 strikes (other team steals)
}

// Action types for the reducer
export type GameAction =
  | { type: "LOAD_QUESTIONS"; payload: Question[] }
  | { type: "SET_TEAM_NAME"; payload: { team: Team; name: string } }
  | { type: "SELECT_QUESTION"; payload: string }
  | { type: "REVEAL_ANSWER"; payload: { answerId: string; points: number } }
  | { type: "ADD_STRIKE" }
  | { type: "REVEAL_ALL" }
  | { type: "AWARD_POT"; payload: Team }
  | { type: "NEXT_ROUND" }
  | { type: "GAME_OVER" }
  | { type: "NEW_GAME" }
  | { type: "SWITCH_TO_STEAL" };

// Excel row type (raw data from spreadsheet)
export interface ExcelRow {
  questionId: string;
  questionText: string;
  answerText: string;
  points: number;
  aliases?: string;
}

