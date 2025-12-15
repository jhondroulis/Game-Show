# Quick Start Guide

Get your Family Feud game running in 3 minutes!

## Step 1: Install & Run (1 min)

```bash
npm install
npm run dev
```

Open the URL shown (usually `http://localhost:5173`)

## Step 2: Add Sounds (30 seconds)

Place these 3 sound files in `public/sounds/`:
- `ding.mp3`
- `buzzer.mp3`
- `applause.mp3`

(If you don't have them yet, the game will work without sounds)

## Step 3: Create Questions (1 min)

Open Excel/Sheets and create a file with these columns:

```
questionId | questionText | answerText | points | aliases
Q1         | Name something people do when stuck | Ask teammate | 35 | ask for help
Q1         | Name something people do when stuck | Google it | 25 | search
```

Save as `.xlsx` file.

## Step 4: Play! (30 seconds)

1. Click **📁 Choose Excel File** at the bottom
2. Select your Excel file → **Load Questions**
3. Edit team names if desired
4. Pick a question from dropdown
5. Start playing!

## Game Flow Cheat Sheet

**During Play:**
- Player says answer → Host types it → Submit
- ✅ Correct = reveal + points
- ❌ Wrong = strike (X appears)
- After 3 strikes = other team can steal

**After Round:**
- Click **Next Round** or **End Game**

**Controls:**
- Hide/Show controls button (bottom right)
- Full screen: Press F11
- Zoom: Cmd/Ctrl + Plus

That's it! Enjoy your game! 🎉

