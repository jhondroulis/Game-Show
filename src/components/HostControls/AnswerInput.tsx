import { useState } from 'react';

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

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
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

