import type { Answer } from '../../types';
import './AnswerSlot.css';

interface AnswerSlotProps {
  answer: Answer;
  revealed: boolean;
}

export function AnswerSlot({ answer, revealed }: AnswerSlotProps) {
  return (
    <div className={`answer-slot ${revealed ? 'revealed' : ''}`}>
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
