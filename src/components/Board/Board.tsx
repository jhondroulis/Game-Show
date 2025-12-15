import { useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { AnswerSlot } from './AnswerSlot';
import { ScorePanel } from './ScorePanel';
import { StrikeIndicator } from './StrikeIndicator';
import { RoundPot } from './RoundPot';
import './Board.css';

export function Board() {
  const { state, dispatch, getCurrentQuestion } = useGame();
  const currentQuestion = getCurrentQuestion();
  const containerRef = useRef<HTMLDivElement>(null);

  // #region agent log
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const beforeEl = window.getComputedStyle(container, '::before');
    const afterEl = window.getComputedStyle(container, '::after');
    const bgImage = beforeEl.backgroundImage;
    const bgSize = beforeEl.backgroundSize;
    const overlayBg = afterEl.background;
    const beforeZIndex = beforeEl.zIndex;
    const afterZIndex = afterEl.zIndex;
    const containerZIndex = window.getComputedStyle(container).zIndex;
    
    const logDataA = {location:'Board.tsx:useEffect',message:'CSS computed styles check',data:{bgImage,bgSize,overlayBg,beforeZIndex,afterZIndex,containerZIndex,containerExists:!!container},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'};
    console.log('[DEBUG A]', logDataA);
    fetch('http://127.0.0.1:7243/ingest/e022103b-c403-4c64-b9a5-0bf0f125201d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataA)}).catch(()=>{});
    
    // Test image load
    const img = new Image();
    img.onload = () => {
      const logDataB = {location:'Board.tsx:img.onload',message:'Image loaded successfully',data:{src:img.src,width:img.width,height:img.height},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
      console.log('[DEBUG B]', logDataB);
      fetch('http://127.0.0.1:7243/ingest/e022103b-c403-4c64-b9a5-0bf0f125201d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataB)}).catch(()=>{});
    };
    img.onerror = () => {
      const logDataB = {location:'Board.tsx:img.onerror',message:'Image failed to load',data:{src:img.src,error:'Failed to load image'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'};
      console.log('[DEBUG B]', logDataB);
      fetch('http://127.0.0.1:7243/ingest/e022103b-c403-4c64-b9a5-0bf0f125201d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataB)}).catch(()=>{});
    };
    img.src = '/family-feud-bg.png';
    
    // Check if pseudo-elements exist
    const testEl = document.createElement('div');
    testEl.className = 'board-container';
    document.body.appendChild(testEl);
    const testBefore = window.getComputedStyle(testEl, '::before');
    const testAfter = window.getComputedStyle(testEl, '::after');
    const beforeContent = testBefore.content;
    const afterContent = testAfter.content;
    document.body.removeChild(testEl);
    
    const logDataC = {location:'Board.tsx:pseudo-check',message:'Pseudo-element content check',data:{beforeContent,afterContent,hasBefore:beforeContent !== 'none',hasAfter:afterContent !== 'none'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'};
    console.log('[DEBUG C]', logDataC);
    fetch('http://127.0.0.1:7243/ingest/e022103b-c403-4c64-b9a5-0bf0f125201d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(logDataC)}).catch(()=>{});
  }, []);
  // #endregion

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
    <div className="board-container" ref={containerRef}>
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
                  {currentQuestion.text}
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

