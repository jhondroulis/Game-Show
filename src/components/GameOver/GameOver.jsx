import React from 'react';
import { useGame } from '../../context/useGame';
import './GameOver.css';

export function GameOver() {
  const { state, dispatch } = useGame();

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
  };

  const teamAScore = state.teamTotals.A;
  const teamBScore = state.teamTotals.B;
  const winner = teamAScore > teamBScore ? 'A' : teamBScore > teamAScore ? 'B' : null;

  return (
    <div className="game-over-container">
      <div className="game-over-card">
        <h1 className="game-over-title">🎉 Game Over! 🎉</h1>

        {winner && (
          <div className="winner-banner">
            <p className="winner-text">
              🏆 {state.teamNames[winner]} Wins! 🏆
            </p>
          </div>
        )}

        {!winner && (
          <div className="winner-banner">
            <p className="winner-text">
              🤝 It&apos;s a Tie! 🤝
            </p>
          </div>
        )}

        <div className="final-scores">
          <div className={`final-score-team ${winner === 'A' ? 'winner' : ''}`}>
            <p className="final-score-name">{state.teamNames.A}</p>
            <p className="final-score-value">{teamAScore}</p>
          </div>

          <div className={`final-score-team ${winner === 'B' ? 'winner' : ''}`}>
            <p className="final-score-name">{state.teamNames.B}</p>
            <p className="final-score-value">{teamBScore}</p>
          </div>
        </div>

        <div className="game-over-actions">
          <button className="game-over-button" onClick={handleNewGame}>
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}

