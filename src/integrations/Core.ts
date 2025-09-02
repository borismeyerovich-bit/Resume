import { Resume, AmericanizedResume } from "../entities/Resume";
import { aiService } from "../services/aiService";

// Updated Core integration using real AI service
export async function UploadFile(file: File): Promise<string> {
  // For now, we'll return a mock file ID
  // In a real implementation, you might upload to cloud storage
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }, 1000);
  });
}

export async function ExtractDataFromUploadedFile(fileId: string): Promise<Resume> {
  // This would typically:
  // 1. Retrieve the file from storage using fileId
  // 2. Extract text from the file
  // 3. Use AI to parse the text into structured data
  
  // For now, we'll simulate this process
  const mockFile = new File(['mock content'], 'resume.pdf', { type: 'application/pdf' });
  const extractedText = await aiService.extractTextFromFile(mockFile);
  const structuredData = await aiService.extractResumeData(extractedText);
  
  return structuredData;
}

export async function InvokeLLM(resume: Resume): Promise<AmericanizedResume> {
  // Use AI service to transform resume to American style
  return await aiService.transformToAmericanStyle(resume);
}

// Utility function to generate unique IDs
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Direct file processing (bypasses file upload step) - NOW USES REAL TEXT EXTRACTION
export async function ProcessResumeFile(file: File): Promise<AmericanizedResume> {
  try {
    console.log('🔄 Processing resume file:', file.name);
    
    // Extract text from file - NOW REAL!
    const extractedText = await aiService.extractTextFromFile(file);
    
    // Parse into structured data
    const structuredData = await aiService.extractResumeData(extractedText);
    
    // Transform to American style
    const americanizedResume = await aiService.transformToAmericanStyle(structuredData);
    
    return americanizedResume;
  } catch (error) {
    console.error('Error processing resume file:', error);
    throw new Error('Failed to process resume file');
  }
}
