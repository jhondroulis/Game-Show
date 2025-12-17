import * as XLSX from 'xlsx';

const MAX_EXCEL_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Parse an Excel file and convert it to Question objects
 * @param {File} file
 * @returns {Promise<{success: boolean, questions?: Array, error?: string, preview?: Object}>}
 */
export async function parseExcelFile(file) {
  try {
    if (file.size > MAX_EXCEL_BYTES) {
      return {
        success: false,
        error: `File is too large (${Math.ceil(file.size / (1024 * 1024))}MB). Please upload a file under ${Math.ceil(
          MAX_EXCEL_BYTES / (1024 * 1024)
        )}MB.`,
      };
    }

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    
    // Get first sheet
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return { success: false, error: 'No sheets found in Excel file' };
    }
    
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    if (jsonData.length === 0) {
      return { success: false, error: 'Excel file is empty' };
    }
    
    // Validate and parse
    const validationResult = validateRows(jsonData);
    if (!validationResult.success) {
      return validationResult;
    }
    
    const questions = convertToQuestions(jsonData);
    const preview = generatePreview(questions);
    
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
 * @param {Array} rows
 * @returns {{success: boolean, error?: string}}
 */
function validateRows(rows) {
  const requiredColumns = ['questionId', 'questionText', 'answerText', 'points'];
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Check required columns
    for (const col of requiredColumns) {
      if (!(col in row) || row[col] === undefined || row[col] === null) {
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
 * @param {Array} rows
 * @returns {Array}
 */
function convertToQuestions(rows) {
  const questionsMap = new Map();
  
  for (const row of rows) {
    const questionId = row.questionId.toString().trim();
    const questionText = row.questionText.toString().trim();
    const answerText = row.answerText.toString().trim();
    const points = row.points;
    
    // Parse aliases (comma-separated, normalize to lowercase)
    const aliases = [];
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
    
    const question = questionsMap.get(questionId);
    
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
 * @param {Array} questions
 * @returns {Object}
 */
function generatePreview(questions) {
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



