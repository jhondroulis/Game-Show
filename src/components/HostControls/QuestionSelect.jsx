import React from 'react';
import PropTypes from 'prop-types';

export function QuestionSelect({ 
  questions, 
  currentQuestionId, 
  onSelect,
  disabled 
}) {
  const noQuestions = questions.length === 0;

  return (
    <div className="control-group">
      <label className="control-label">Select Question ({questions.length} available)</label>
      <select
        className="control-select"
        value={currentQuestionId || ''}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled || noQuestions}
      >
        <option value="">-- Choose a question --</option>
        {questions.map((q) => (
          <option key={q.id} value={q.id}>
            {q.id}: {q.text}
          </option>
        ))}
      </select>
      {noQuestions && (
        <div className="info-message">Upload an Excel file to populate questions.</div>
      )}
    </div>
  );
}

QuestionSelect.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
  currentQuestionId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

QuestionSelect.defaultProps = {
  currentQuestionId: null,
  disabled: false,
};

