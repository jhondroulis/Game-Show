import { useState, useRef } from 'react';
import { parseExcelFile } from '../../utils/excelParser';
import type { Question } from '../../types';

interface ExcelUploadProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}

type QuestionsPreview = {
  questionCount: number;
  answerCount: number;
  questions: Array<{ id: string; text: string; answerCount: number }>;
};

export function ExcelUpload({ onQuestionsLoaded }: ExcelUploadProps) {
  const [preview, setPreview] = useState<QuestionsPreview | null>(null);
  const [error, setError] = useState<string>('');
  const [isParsing, setIsParsing] = useState(false);
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setPreview(null);
    setIsParsing(true);

    try {
      const result = await parseExcelFile(file);

      if (!result.success) {
        setError(result.error || 'Failed to parse file');
        return;
      }

      if (result.questions && result.preview) {
        setPendingQuestions(result.questions);
        setPreview(result.preview);
      }
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirm = () => {
    onQuestionsLoaded(pendingQuestions);
    setPreview(null);
    setPendingQuestions([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setPendingQuestions([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileButtonClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    if (isParsing) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <>
      <div className="control-group">
        <label className="control-label">Upload Questions</label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="file-input"
          id="excel-upload"
          disabled={isParsing}
        />
        <label
          htmlFor="excel-upload"
          className={`file-button${isParsing ? ' file-button--disabled' : ''}`}
          aria-disabled={isParsing}
          onClick={handleFileButtonClick}
        >
          {isParsing ? 'Parsing…' : '📁 Choose Excel File'}
        </label>
        {isParsing && <div className="info-message">Reading and validating spreadsheet…</div>}
        {error && <div className="error-message">{error}</div>}
      </div>

      {preview && (
        <div className="preview-modal" onClick={handleCancel}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="preview-title">Preview Questions</h3>
            
            <div className="preview-stats">
              <p className="preview-stat">
                <strong>{preview.questionCount}</strong> questions loaded
              </p>
              <p className="preview-stat">
                <strong>{preview.answerCount}</strong> total answers
              </p>
              <p className="preview-stat">
                Showing <strong>{preview.questions.length}</strong> questions in preview
              </p>
            </div>

            <div className="preview-questions">
              {preview.questions.length > 0 ? (
                preview.questions.map((q) => (
                  <div key={q.id} className="preview-question">
                    <strong>{q.id}:</strong> {q.text} ({q.answerCount} answers)
                  </div>
                ))
              ) : (
                <div className="preview-question">No questions found</div>
              )}
              {preview.questionCount !== preview.questions.length && (
                <div className="preview-question" style={{ color: '#fca5a5', fontStyle: 'italic' }}>
                  Note: Showing {preview.questions.length} of {preview.questionCount} questions
                </div>
              )}
            </div>

            <div className="preview-actions">
              <button className="control-button" onClick={handleCancel} disabled={isParsing}>
                Cancel
              </button>
              <button className="control-button success" onClick={handleConfirm} disabled={isParsing}>
                Load Questions
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
