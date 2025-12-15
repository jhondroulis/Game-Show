import { useGame } from '../../context/GameContext';
import { AnswerSlot } from './AnswerSlot';
import { ScorePanel } from './ScorePanel';
import { StrikeIndicator } from './StrikeIndicator';
import { RoundPot } from './RoundPot';
import './Board.css';

export function Board() {
  const { state, dispatch, getCurrentQuestion } = useGame();
  const currentQuestion = getCurrentQuestion();

  const handleTeamNameChange = (team: 'A' | 'B', name: string) => {
    dispatch({ type: 'SET_TEAM_NAME', payload: { team, name } });
  };

  if (!currentQuestion && state.phase !== 'setup') {
    return (
      <div className="board-container">
        <h2 style={{ color: '#fff', fontSize: '32px' }}>
          No question selected
        </h2>
      </div>
    );
  }

  return (
    <div className="board-container">
      <div className="board-main">
        <ScorePanel
          team="A"
          teamName={state.teamNames.A}
          score={state.teamTotals.A}
          isSetup={state.phase === 'setup'}
          onNameChange={(name) => handleTeamNameChange('A', name)}
        />

        <div className="board-center">
          {(state.phase === 'playing' || state.phase === 'steal' || state.phase === 'roundResult') && (
            <RoundPot value={state.roundPot} />
          )}

          {currentQuestion && (
            <div className="board-frame">
              <div className="question-header">
                <p className="question-header-text">
                  {currentQuestion.id}
                </p>
              </div>
              <div className="answer-grid">
                {currentQuestion.answers.map((answer) => (
                  <AnswerSlot
                    key={answer.id}
                    answer={answer}
                    revealed={state.revealedAnswerIds.has(answer.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {state.phase === 'playing' && state.roundStrikes > 0 && (
            <StrikeIndicator strikes={state.roundStrikes} />
          )}

          {state.phase === 'steal' && (
            <div style={{
              background: 'rgba(220, 38, 38, 0.2)',
              border: '2px solid #ef4444',
              borderRadius: '10px',
              padding: '15px 30px',
              marginTop: '20px'
            }}>
              <p style={{ 
                color: '#fff', 
                fontSize: '24px', 
                margin: 0,
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                🎯 STEAL OPPORTUNITY - {state.teamNames[state.activeTeam]}!
              </p>
            </div>
          )}

          {state.phase === 'roundResult' && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.2)',
              border: '2px solid #22c55e',
              borderRadius: '10px',
              padding: '15px 30px',
              marginTop: '20px'
            }}>
              <p style={{ 
                color: '#fff', 
                fontSize: '24px', 
                margin: 0,
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                Round Complete! Host: Click Next Round
              </p>
            </div>
          )}

          {state.phase === 'setup' && !currentQuestion && (
            <div style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '2px solid #3b82f6',
              borderRadius: '10px',
              padding: '30px',
              textAlign: 'center'
            }}>
              <p style={{ 
                color: '#fff', 
                fontSize: '28px', 
                margin: 0,
                fontWeight: 'bold'
              }}>
                Welcome to Family Feud!
              </p>
              <p style={{ 
                color: '#93c5fd', 
                fontSize: '18px', 
                marginTop: '10px'
              }}>
                Host: Upload questions and select one to begin
              </p>
            </div>
          )}
        </div>

        <ScorePanel
          team="B"
          teamName={state.teamNames.B}
          score={state.teamTotals.B}
          isSetup={state.phase === 'setup'}
          onNameChange={(name) => handleTeamNameChange('B', name)}
        />
      </div>
    </div>
  );
}

