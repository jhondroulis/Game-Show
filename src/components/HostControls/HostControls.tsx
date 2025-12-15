import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { matchAnswer } from '../../utils/matchAnswer';
import { ExcelUpload } from './ExcelUpload';
import { QuestionSelect } from './QuestionSelect';
import { AnswerInput } from './AnswerInput';
import './HostControls.css';

export function HostControls() {
  const { state, dispatch, getCurrentQuestion } = useGame();
  const [collapsed, setCollapsed] = useState(false);
  const currentQuestion = getCurrentQuestion();

  const handleQuestionsLoaded = (questions: any[]) => {
    dispatch({ type: 'LOAD_QUESTIONS', payload: questions });
  };

  const handleQuestionSelect = (questionId: string) => {
    if (questionId) {
      dispatch({ type: 'SELECT_QUESTION', payload: questionId });
    }
  };

  const handleAnswerSubmit = (input: string) => {
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

  const handleAwardPot = (team: 'A' | 'B') => {
    dispatch({ type: 'AWARD_POT', payload: team });
  };

  const handleNextRound = () => {
    dispatch({ type: 'NEXT_ROUND' });
  };

  const handleGameOver = () => {
    dispatch({ type: 'GAME_OVER' });
  };

  const handleNewGame = () => {
    if (confirm('Start a new game? This will reset all scores.')) {
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
          <ExcelUpload onQuestionsLoaded={handleQuestionsLoaded} />
          
          <QuestionSelect
            questions={state.questions}
            currentQuestionId={state.currentQuestionId}
            onSelect={handleQuestionSelect}
            disabled={state.phase === 'playing' || state.phase === 'steal'}
          />
        </div>

        {(state.phase === 'playing' || state.phase === 'steal') && currentQuestion && (
          <>
            <div className="control-row answer-input-row">
              <AnswerInput
                answers={currentQuestion.answers}
                revealedAnswerIds={state.revealedAnswerIds}
                onSubmit={handleAnswerSubmit}
                disabled={false}
              />
            </div>

            <div className="control-row">
              <button 
                className="control-button"
                onClick={handleRevealAll}
              >
                Reveal All
              </button>

              {state.phase === 'steal' && (
                <>
                  <button 
                    className="control-button success"
                    onClick={() => handleAwardPot(state.activeTeam)}
                  >
                    Award to {state.teamNames[state.activeTeam]} (Steal Success)
                  </button>
                  <button 
                    className="control-button"
                    onClick={() => handleAwardPot(state.stealOriginTeam!)}
                  >
                    Award to {state.teamNames[state.stealOriginTeam!]} (Steal Failed)
                  </button>
                </>
              )}

              {state.phase === 'playing' && (
                <>
                  <button 
                    className="control-button success"
                    onClick={() => handleAwardPot(state.activeTeam)}
                  >
                    Award Pot to {state.teamNames[state.activeTeam]}
                  </button>
                </>
              )}
            </div>
          </>
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

