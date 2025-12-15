import type { Question } from '../../types';

interface QuestionSelectProps {
  questions: Question[];
  currentQuestionId: string | null;
  onSelect: (questionId: string) => void;
  disabled?: boolean;
}

export function QuestionSelect({ 
  questions, 
  currentQuestionId, 
  onSelect,
  disabled 
}: QuestionSelectProps) {
  // Debug: Log questions count
  console.log('[QuestionSelect] Total questions:', questions.length, questions.map(q => q.id));
  
  return (
    <div className="control-group">
      <label className="control-label">Select Question ({questions.length} available)</label>
      <select
        className="control-select"
        value={currentQuestionId || ''}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled || questions.length === 0}
      >
        <option value="">-- Choose a question --</option>
        {questions.map((q) => (
          <option key={q.id} value={q.id}>
            {q.id}: {q.text}
          </option>
        ))}
      </select>
    </div>
  );
}

