import { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Board } from './components/Board/Board';
import { GameOver } from './components/GameOver/GameOver';
import { HostControls } from './components/HostControls/HostControls';
import { useSound } from './hooks/useSound';
import './App.css';

function GameContent() {
  const { state } = useGame();
  const { play } = useSound();

  // Sound effects based on phase changes
  useEffect(() => {
    if (state.phase === 'roundResult') {
      play('applause');
    }
  }, [state.phase, play]);

  // Sound effect for strikes
  useEffect(() => {
    if (state.roundStrikes > 0 && state.phase === 'playing') {
      play('buzzer');
    }
  }, [state.roundStrikes, state.phase, play]);

  // Sound effect for reveals
  useEffect(() => {
    const revealCount = state.revealedAnswerIds.size;
    if (revealCount > 0 && state.phase !== 'roundResult') {
      play('ding');
    }
  }, [state.revealedAnswerIds.size, state.phase, play]);

  if (state.phase === 'gameOver') {
    return (
      <>
        <GameOver />
        <HostControls />
      </>
    );
  }

  return (
    <>
      <Board />
      <HostControls />
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
