import React, { useState } from 'react';
import { useGame } from '../../context/useGame';
import { matchAnswer } from '../../utils/matchAnswer';
import { QuestionSelect } from './QuestionSelect';
import { AnswerInput } from './AnswerInput';
import './HostControls.css';

export function HostControls() {
  const { state, dispatch, getCurrentQuestion } = useGame();
  const [collapsed, setCollapsed] = useState(false);
  const currentQuestion = getCurrentQuestion();

  const handleQuestionSelect = (questionId) => {
    if (questionId) {
      dispatch({ type: 'SELECT_QUESTION', payload: questionId });
    }
  };

  const handleAnswerSubmit = (input) => {
    if (!currentQuestion) return;

    // Find unrevealed answers
    const unrevealedAnswers = currentQuestion.answers.filter(
      a => !state.revealedAnswerIds.has(a.id)
    );

    const match = matchAnswer(input, unrevealedAnswers);

    if (match) {
      // Correct answer
      dispatch({ 
        type: 'REVEAL_ANSWER', 
        payload: { answerId: match.id, points: match.points } 
      });
    } else {
      // Wrong answer - add strike
      dispatch({ type: 'ADD_STRIKE' });
    }
  };

  const handleRevealAll = () => {
    dispatch({ type: 'REVEAL_ALL' });
  };

  const handleAwardPot = (team) => {
    dispatch({ type: 'AWARD_POT', payload: team });
  };

  const handleNextRound = () => {
    dispatch({ type: 'NEXT_ROUND' });
  };

  const handleGameOver = () => {
    dispatch({ type: 'GAME_OVER' });
  };

  const handleNewGame = () => {
    if (window.confirm('Start a new game? This will reset all scores.')) {
      dispatch({ type: 'NEW_GAME' });
    }
  };

  if (collapsed) {
    return (
      <div className="host-controls collapsed">
        <div className="controls-header">
          <h3 className="controls-title">🎮 Host Controls</h3>
          <button className="toggle-button" onClick={() => setCollapsed(false)}>
            Show Controls
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="host-controls">
      <div className="controls-header">
        <h3 className="controls-title">🎮 Host Controls</h3>
        <button className="toggle-button" onClick={() => setCollapsed(true)}>
          Hide Controls
        </button>
      </div>

      <div className="controls-content">
        <div className="control-row first-control-row">
          <QuestionSelect
            questions={state.questions}
            currentQuestionId={state.currentQuestionId}
            onSelect={handleQuestionSelect}
            disabled={state.phase === 'playing' || state.phase === 'steal'}
          />
          {state.phase === 'setup' && (
            <div className="tiny-hint">
              Next round starts:&nbsp;
              <strong>{state.teamNames[state.roundStartingTeam]}</strong>
            </div>
          )}
        </div>

        {(state.phase === 'playing' || state.phase === 'steal') && currentQuestion && (
          <React.Fragment>
            <div className="control-row answer-input-row">
              <AnswerInput
                answers={currentQuestion.answers}
                revealedAnswerIds={state.revealedAnswerIds}
                onSubmit={handleAnswerSubmit}
                disabled={false}
              />
            </div>

            <div className="control-row action-buttons-row">
              <button 
                className="control-button"
                onClick={handleRevealAll}
              >
                Reveal All
              </button>

              {state.phase === 'steal' && (
                <React.Fragment>
                  <button 
                    className={`control-button team-${state.stealOriginTeam.toLowerCase()}`}
                    onClick={() => handleAwardPot(state.stealOriginTeam)}
                  >
                    Award to {state.teamNames[state.stealOriginTeam]} (Steal Failed)
                  </button>
                  <button 
                    className={`control-button team-${state.activeTeam.toLowerCase()}`}
                    onClick={() => handleAwardPot(state.activeTeam)}
                  >
                    Award to {state.teamNames[state.activeTeam]} (Steal Success)
                  </button>
                </React.Fragment>
              )}

              {state.phase === 'playing' && (
                <React.Fragment>
                  <button 
                    className={`control-button team-${state.activeTeam.toLowerCase()}`}
                    onClick={() => handleAwardPot(state.activeTeam)}
                  >
                    Award Pot to {state.teamNames[state.activeTeam]}
                  </button>
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        )}

        {state.phase === 'roundResult' && (
          <div className="control-row">
            <button 
              className="control-button success"
              onClick={handleNextRound}
            >
              Next Round
            </button>
            <button 
              className="control-button danger"
              onClick={handleGameOver}
            >
              End Game
            </button>
          </div>
        )}

        <div className="control-row">
          <button 
            className="control-button danger"
            onClick={handleNewGame}
          >
            New Game (Reset All)
          </button>
        </div>
      </div>
    </div>
  );
}

