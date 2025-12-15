import * as XLSX from 'xlsx';
import type { Question, ExcelRow } from '../types';

interface ParseResult {
  success: boolean;
  questions?: Question[];
  error?: string;
  preview?: {
    questionCount: number;
    answerCount: number;
    questions: Array<{ id: string; text: string; answerCount: number }>;
  };
}

/**
 * Parse an Excel file and convert it to Question objects
 */
export async function parseExcelFile(file: File): Promise<ParseResult> {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    
    // Get first sheet
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return { success: false, error: 'No sheets found in Excel file' };
    }
    
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);
    
    if (jsonData.length === 0) {
      return { success: false, error: 'Excel file is empty' };
    }
    
    // Validate and parse
    const validationResult = validateRows(jsonData);
    if (!validationResult.success) {
      return validationResult;
    }
    
    const questions = convertToQuestions(jsonData);
    console.log('[excelParser] Total rows parsed:', jsonData.length);
    console.log('[excelParser] Unique questionIds found:', new Set(jsonData.map(r => r.questionId.toString().trim())).size);
    console.log('[excelParser] Questions created:', questions.length, questions.map(q => q.id));
    const preview = generatePreview(questions);
    console.log('[excelParser] Preview questions count:', preview.questionCount, 'Preview array length:', preview.questions.length);
    
    return {
      success: true,
      questions,
      preview
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Validate the Excel rows have required columns
 */
function validateRows(rows: ExcelRow[]): ParseResult {
  const requiredColumns = ['questionId', 'questionText', 'answerText', 'points'];
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Check required columns
    for (const col of requiredColumns) {
      if (!(col in row) || row[col as keyof ExcelRow] === undefined || row[col as keyof ExcelRow] === null) {
        return {
          success: false,
          error: `Row ${i + 2} is missing required column: ${col}`
        };
      }
    }
    
    // Validate points is a number
    if (typeof row.points !== 'number' || isNaN(row.points)) {
      return {
        success: false,
        error: `Row ${i + 2}: points must be a number, got "${row.points}"`
      };
    }
    
    // Validate non-empty strings
    if (!row.questionText.toString().trim()) {
      return {
        success: false,
        error: `Row ${i + 2}: questionText cannot be empty`
      };
    }
    
    if (!row.answerText.toString().trim()) {
      return {
        success: false,
        error: `Row ${i + 2}: answerText cannot be empty`
      };
    }
  }
  
  return { success: true };
}

/**
 * Convert Excel rows to Question objects
 */
function convertToQuestions(rows: ExcelRow[]): Question[] {
  const questionsMap = new Map<string, Question>();
  
  for (const row of rows) {
    const questionId = row.questionId.toString().trim();
    const questionText = row.questionText.toString().trim();
    const answerText = row.answerText.toString().trim();
    const points = row.points;
    
    // Parse aliases (comma-separated, normalize to lowercase)
    const aliases: string[] = [];
    if (row.aliases) {
      const aliasStr = row.aliases.toString().trim();
      if (aliasStr) {
        aliases.push(
          ...aliasStr.split(',').map(a => a.trim().toLowerCase()).filter(a => a)
        );
      }
    }
    
    // Get or create question
    if (!questionsMap.has(questionId)) {
      questionsMap.set(questionId, {
        id: questionId,
        text: questionText,
        answers: []
      });
    }
    
    const question = questionsMap.get(questionId)!;
    
    // Add answer
    const answerId = `${questionId}_${question.answers.length}`;
    question.answers.push({
      id: answerId,
      text: answerText,
      points,
      aliases
    });
  }
  
  // Sort answers by points (descending) and convert to array
  const questions = Array.from(questionsMap.values());
  questions.forEach(q => {
    q.answers.sort((a, b) => b.points - a.points);
  });
  
  return questions;
}

/**
 * Generate a preview summary of the parsed questions
 */
function generatePreview(questions: Question[]) {
  return {
    questionCount: questions.length,
    answerCount: questions.reduce((sum, q) => sum + q.answers.length, 0),
    questions: questions.map(q => ({
      id: q.id,
      text: q.text,
      answerCount: q.answers.length
    }))
  };
}

