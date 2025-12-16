# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React 19 + TypeScript game show application that replicates the Family Feud experience for team-building events. The app is host-controlled, runs on a single screen, and manages question state, team scores, strikes, and answer reveals through a centralized game context.

## Quick Start Commands

```bash
npm install               # Install dependencies (Node 20+ required)
npm run dev             # Start Vite dev server (http://localhost:5173)
npm run build           # TypeScript check + Vite build
npm run lint            # ESLint check
npm run preview         # Preview production build locally
```

## Architecture Overview

### State Management: GameContext (src/context/GameContext.tsx)

The game uses a single centralized reducer pattern. All game state flows through `GameContext` using `useReducer`. Key state properties:

- **phase**: Current game stage (`setup` → `playing` → `steal`/`roundResult` → `gameOver`)
- **questions**: Array of parsed Question objects (loaded from Excel)
- **currentQuestionId**: Active question ID
- **activeTeam**: Which team is currently answering (`A` or `B`)
- **teamTotals**: Cumulative scores for each team
- **roundPot**: Points accumulated in current round (awarded when round ends)
- **roundStrikes**: Strike count for current round (3 strikes = steal phase)
- **revealedAnswerIds**: Set of answer IDs shown on the board
- **stealOriginTeam**: Team that had 3 strikes (the stealing team is the other)

**Key Actions:**
- `SELECT_QUESTION`: Resets round state, moves to `playing` phase
- `REVEAL_ANSWER`: Adds points to roundPot, marks answer as revealed
- `ADD_STRIKE`: Increments strikes; automatically switches to `steal` phase at 3 strikes
- `REVEAL_ALL`: Shows all unrevealed answers, ends round
- `AWARD_POT`: Adds roundPot to team total, moves to `roundResult`
- `NEXT_ROUND`: Resets for new question, returns to `setup` phase

### Data Flow

1. **Excel Upload** → `ExcelUpload` component → `parseExcelFile()` → dispatch `LOAD_QUESTIONS`
2. **Question Selection** → `QuestionSelect` dropdown → dispatch `SELECT_QUESTION`
3. **Answer Submission** → `AnswerInput` component → `matchAnswer()` → dispatch `REVEAL_ANSWER` or `ADD_STRIKE`
4. **Board Display** → `Board` component reads state and renders answers/scores in real-time
5. **Sound Effects** → App.tsx watches `phase` and `revealedAnswerIds` size, triggers `useSound().play()`

### Component Structure

```
src/
├── App.tsx                          # Main app, splash screen + game stage logic
├── context/GameContext.tsx          # State reducer & context provider
├── components/
│   ├── Board/
│   │   ├── Board.tsx               # Main game board layout
│   │   ├── AnswerSlot.tsx          # Individual answer card with flip animation
│   │   ├── ScorePanel.tsx          # Team scores & round pot display
│   │   ├── StrikeIndicator.tsx     # X marks for strikes
│   │   └── RoundPot.tsx            # Round pot display
│   ├── HostControls/
│   │   ├── HostControls.tsx        # Control panel container
│   │   ├── ExcelUpload.tsx         # File input & parse logic
│   │   ├── QuestionSelect.tsx      # Dropdown for question selection
│   │   └── AnswerInput.tsx         # Text input + match logic
│   ├── GameOver/GameOver.tsx       # Final scores & winner
│   └── SplashScreen/SplashScreen.tsx # Intro with video + transition
├── utils/
│   ├── excelParser.ts              # XLSX parsing to Question objects
│   ├── matchAnswer.ts              # Answer matching logic (exact + partial)
│   └── questionsStorage.ts         # LocalStorage for questions
├── hooks/useSound.ts               # Audio caching & playback
└── types.ts                        # All TypeScript interfaces
```

### Answer Matching Algorithm (utils/matchAnswer.ts)

1. **Exact Match**: Normalized input == normalized answer text or alias
2. **Partial Match**: Input contains answer or answer contains input (normalized)
3. Returns first match or null

Normalization: lowercase, trim, collapse multiple spaces. Aliases from Excel are pre-normalized to lowercase when parsing.

## Key Patterns & Conventions

### Game Phase Flow

The `phase` state drives all UI rendering:
- `setup`: Show question dropdown & team name editor
- `playing`: Accept answers, show strikes
- `steal`: Other team tries to answer
- `roundResult`: All answers revealed, award pot
- `gameOver`: Final scores screen

Each phase has its own action that advances the flow (e.g., `ADD_STRIKE` auto-advances to `steal` at 3).

### Excel Data Structure

Required columns: `questionId`, `questionText`, `answerText`, `points`, `aliases` (optional)
- Multiple rows with same `questionId` = multiple answers for one question
- Answers are sorted by points (descending) after parsing
- Validation happens in `validateRows()` before conversion

### Sound Triggering

App.tsx watches state changes and triggers sounds:
- `revealedAnswerIds.size` increases → `ding`
- `roundStrikes` increases in `playing` phase → `buzzer`
- `phase` changes to `roundResult` → `applause`

### Team Switching

- Active team determined by answer result (correct = same team or steal team, wrong = strike)
- `activeTeam` resets to `A` on `NEXT_ROUND`
- Team A always starts each round

## Common Development Tasks

### Adding a New Game Control Button

1. Create component in `src/components/HostControls/` (e.g., `NewButton.tsx`)
2. Import and add to `HostControls.tsx`
3. Dispatch appropriate action via `useGame().dispatch()`
4. Example: Wrong answer button → `dispatch({ type: 'ADD_STRIKE' })`

### Modifying Answer Matching Logic

Edit `src/utils/matchAnswer.ts`. Two-pass approach: exact → partial. Update either pass to change behavior.

### Adjusting Animations/Styling

- Answer card flip: `src/components/Board/AnswerSlot.tsx` (CSS keyframes in `.css` files)
- Splash screen transition: `src/App.tsx` uses 900ms timeout + `appVisible` class
- All component styles are co-located (e.g., `Board.tsx` → `Board.css`)

### Adding New Sounds

1. Place audio file in `public/sounds/` (e.g., `chime.mp3`)
2. Add to `SOUND_FILES` in `src/hooks/useSound.ts`
3. Call `play('chime')` from anywhere using `useSound()`

## Testing & Debugging

- **Excel parsing**: Check browser console for `[excelParser]` logs (question count, unique IDs, preview)
- **Excel upload errors**: Shown in UI alert; check console for row-level validation failures
- **Missing sounds**: Browser console warns if audio files fail to load
- **State issues**: Install React DevTools to inspect GameContext reducer state

## Important Notes

- Node.js 20+ enforced via `package.json` engines field
- Questions persist in localStorage (via `questionsStorage.ts`) between page reloads during a session
- Team names are preserved across "New Game" but not "New Game" after all rounds end (both reset)
- Board is TV-optimized; use browser zoom or F11 fullscreen on smaller displays
- Steal phase: only the opposing team can answer (UI should disable input for original team)

## Dependencies

- **React 19**: UI framework with hooks
- **TypeScript ~5.9**: Type safety
- **Vite 7**: Build tool and dev server
- **xlsx 0.18**: Excel file parsing
- **ESLint 9**: Code linting with React plugin
