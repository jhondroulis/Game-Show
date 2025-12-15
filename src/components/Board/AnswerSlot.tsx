import { useState, useEffect } from 'react';
import type { Answer } from '../../types';
import './AnswerSlot.css';

interface AnswerSlotProps {
  answer: Answer;
  revealed: boolean;
}

export function AnswerSlot({ answer, revealed }: AnswerSlotProps) {
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (revealed && !isRevealing) {
      setIsRevealing(true);
      const timer = setTimeout(() => setIsRevealing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [revealed, isRevealing]);

  return (
    <div className={`answer-slot ${revealed ? 'revealed' : ''} ${isRevealing ? 'revealing' : ''}`}>
      <div className="slot-content">
        {revealed ? (
          <div className="slot-text">{answer.text}</div>
        ) : (
          <div className="slot-hidden" />
        )}
      </div>
      {revealed && <div className="slot-points">{String(answer.points).padStart(2, '0')}</div>}
    </div>
  );
}

