import { useState, useRef } from 'react';
import { parseExcelFile } from '../../utils/excelParser';
import type { Question } from '../../types';

interface ExcelUploadProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}

export function ExcelUpload({ onQuestionsLoaded }: ExcelUploadProps) {
  const [preview, setPreview] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setPreview(null);

    const result = await parseExcelFile(file);

    if (!result.success) {
      setError(result.error || 'Failed to parse file');
      return;
    }

    if (result.questions && result.preview) {
      console.log('[ExcelUpload] Parsed questions:', result.questions.length, result.questions.map(q => q.id));
      console.log('[ExcelUpload] Preview questions:', result.preview.questionCount, result.preview.questions);
      setPendingQuestions(result.questions);
      setPreview(result.preview);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        />
        <label htmlFor="excel-upload" className="file-button">
          📁 Choose Excel File
        </label>
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
                preview.questions.map((q: any) => (
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
              <button className="control-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="control-button success" onClick={handleConfirm}>
                Load Questions
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

