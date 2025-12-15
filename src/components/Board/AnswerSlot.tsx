import { useState, useEffect } from 'react';
import type { Answer } from '../../types';
import './AnswerSlot.css';

interface AnswerSlotProps {
  number: number;
  answer: Answer;
  revealed: boolean;
}

export function AnswerSlot({ number, answer, revealed }: AnswerSlotProps) {
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
      <div className="slot-number">{number}</div>
      <div className="slot-content">
        {revealed ? (
          <>
            <div className="slot-text">{answer.text}</div>
          </>
        ) : (
          <div className="slot-hidden" />
        )}
      </div>
      {revealed && <div className="slot-points">{answer.points}</div>}
    </div>
  );
}

