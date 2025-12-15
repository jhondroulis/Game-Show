import { useState } from 'react';
import type { Answer } from '../../types';
import { findPotentialMatches } from '../../utils/matchAnswer';

interface AnswerInputProps {
  answers: Answer[];
  revealedAnswerIds: Set<string>;
  onSubmit: (input: string) => void;
  disabled?: boolean;
}

export function AnswerInput({ 
  answers, 
  revealedAnswerIds,
  onSubmit, 
  disabled 
}: AnswerInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Answer[]>([]);

  const handleInputChange = (value: string) => {
    setInput(value);
    
    if (value.trim()) {
      const matches = findPotentialMatches(value, answers).filter(
        a => !revealedAnswerIds.has(a.id)
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (answer: Answer) => {
    onSubmit(answer.text);
    setInput('');
    setSuggestions([]);
  };

  return (
    <div className="control-group" style={{ position: 'relative' }}>
      <label className="control-label">Enter Answer</label>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          className="control-input"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Type answer..."
          disabled={disabled}
          autoComplete="off"
        />
        <button 
          type="submit" 
          className="control-button"
          disabled={disabled || !input.trim()}
        >
          Submit
        </button>
      </form>
      
      {suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#1e293b',
          border: '1px solid #475569',
          borderRadius: '6px',
          marginTop: '5px',
          zIndex: 100,
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {suggestions.map((answer) => (
            <div
              key={answer.id}
              onClick={() => handleSuggestionClick(answer)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #334155',
                color: '#cbd5e1',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {answer.text} ({answer.points} pts)
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

