# Family Feud Team Building Game

A single-page web application that replicates the Family Feud game show experience for team-building events.

## Features

- 🎮 Host-controlled gameplay on a shared screen
- 📊 Excel-based question management
- 🎯 Classic "3 strikes then steal" rules
- 🎵 Sound effects (ding, buzzer, applause)
- ✨ Animated answer reveals with flip effect
- 📺 TV-optimized display
- 🏆 Final score screen with winner announcement

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Sound Files

Place your sound effect files in `public/sounds/`:
- `ding.mp3` - Played when a correct answer is revealed
- `buzzer.mp3` - Played on wrong answers/strikes
- `applause.mp3` - Played at round/game completion

### 3. Prepare Questions

Create an Excel file (`.xlsx`) with the following columns:

| questionId | questionText | answerText | points | aliases |
|---|---|---|---:|---|
| Q1 | Name something people do when stuck at work | Ask a teammate | 35 | ping someone, ask for help |
| Q1 | Name something people do when stuck at work | Search the internet | 25 | google it, search |
| Q1 | Name something people do when stuck at work | Take a break | 15 | walk away, coffee |

**Column Descriptions:**
- `questionId` - Groups answers together (e.g., Q1, Q2)
- `questionText` - The survey question
- `answerText` - One accepted answer
- `points` - Points for this answer (number)
- `aliases` - Optional comma-separated synonyms

### 4. Run the Game

```bash
npm run dev
```

Then open the URL shown in your terminal (typically `http://localhost:5173`).

## How to Play

### Setup Phase
1. **Edit Team Names**: Click on "Team A" and "Team B" to customize names
2. **Upload Questions**: Click "📁 Choose Excel File" and select your Excel file
3. **Select Question**: Choose a question from the dropdown

### Playing Phase
1. Players answer verbally (no devices needed)
2. Host types the answer and clicks **Submit**
3. Correct answers reveal on the board with points
4. Wrong answers add strikes (X marks)
5. After **3 strikes**, the other team gets **one chance to steal**

### Steal Phase
- Stealing team gives one answer
- If correct: stealing team wins the round pot
- If wrong: original team wins the round pot

### Round Complete
- Host clicks **Next Round** to continue
- Or clicks **End Game** to show final scores

### Game Over
- Shows final scores with winner announcement
- Click **New Game** to reset and play again

## Host Controls

The host controls appear at the bottom of the screen and can be hidden/shown:

- **Choose Excel File** - Upload new questions
- **Select Question** - Pick a question to play
- **Enter Answer** - Type player's answer (shows suggestions)
- **Reveal All** - Show all remaining answers
- **Award Pot** - Manually award points to a team
- **Next Round** - Reset for the next question
- **End Game** - Show final scores
- **New Game** - Reset everything (keeps questions & team names)

## Tips for Best Experience

- **Display**: Connect laptop to a TV or projector for best visibility
- **Sound**: Make sure audio is enabled and volume is appropriate
- **Questions**: Prepare 5-10 questions for a 30-45 minute game
- **Answers**: Include 4-8 answers per question for good gameplay
- **Aliases**: Add common variations to avoid "wrong" correct answers

## Technology

- React 19 + TypeScript
- Vite
- xlsx (SheetJS) for Excel parsing
- HTML5 Audio API for sounds
- CSS animations

## Requirements

- Node.js 20 or newer (enforced via `package.json` engines field)
- npm 10+ recommended

## Enterprise Compatibility Notes

- Standalone Vite + React 19 app (no AEM/webpack tooling required).
- Scripts: `npm run dev` (local dev), `npm run build` (Vite build), `npm run lint` (ESLint).
- Dependencies are minimal (React, React DOM, xlsx); review via `npm audit` in your environment if required.
- Node 20+ enforced to align with enterprise runtime guidance.

## Customization

To adjust styling, edit the CSS files in:
- `src/components/Board/*.css` - Game board appearance
- `src/components/HostControls/*.css` - Control panel
- `src/components/GameOver/*.css` - Final screen

## Troubleshooting

**Sounds not playing?**
- Ensure sound files are in `public/sounds/` with exact names
- Check browser console for file loading errors
- Some browsers require user interaction before playing audio

**Excel file won't load?**
- Verify all required columns are present
- Check that `points` column contains numbers only
- Ensure `questionId` and `questionText` match for grouped answers

**Board looks small on TV?**
- Use browser zoom (Cmd/Ctrl + Plus)
- Press F11 for fullscreen mode
- Board is designed for 1080p+ displays

## License

Created for team-building events. Enjoy!
