import React, { useState } from 'react';
import PropTypes from 'prop-types';

export function AnswerInput({ onSubmit, disabled }) {
  const [input, setInput] = useState('');

  const handleInputChange = (value) => {
    setInput(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <div className="control-group answer-input-group" style={{ position: 'relative' }}>
      <label className="control-label">Enter Answer</label>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', width: '100%' }}>
        <input
          type="text"
          className="control-input"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Type answer..."
          disabled={disabled}
          autoComplete="off"
          style={{ flex: 1 }}
        />
        <button 
          type="submit" 
          className="control-button"
          disabled={disabled || !input.trim()}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

AnswerInput.propTypes = {
  answers: PropTypes.array,
  revealedAnswerIds: PropTypes.instanceOf(Set),
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

AnswerInput.defaultProps = {
  answers: [],
  revealedAnswerIds: new Set(),
  disabled: false,
};

