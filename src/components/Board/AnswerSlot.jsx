import React from 'react';
import PropTypes from 'prop-types';
import './AnswerSlot.css';

export function AnswerSlot({ answer, revealed }) {
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

AnswerSlot.propTypes = {
  answer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    aliases: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  revealed: PropTypes.bool.isRequired,
};

