import { Resume, AmericanizedResume } from '../entities/Resume';

class AIService {
  async extractResumeData(resumeText: string): Promise<Resume> {
    console.log('🤖 Extracting resume data using AI...');
    console.log('📄 Input text length:', resumeText.length);
    console.log('📄 Input text preview:', resumeText.substring(0, 200) + '...');

    try {
      const response = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) {
        throw new Error(`AI extraction failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ AI extraction completed');
      console.log('📄 Extracted data:', result);
      return result;
    } catch (error) {
      console.error('❌ Error extracting resume data:', error);
      throw error;
    }
  }

  async transformToAmericanStyle(resume: Resume): Promise<AmericanizedResume> {
    console.log('🇺🇸 Transforming resume to American style...');
    console.log('📄 Input resume:', resume);

    try {
      const response = await fetch('/api/ai/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume }),
      });

      if (!response.ok) {
        throw new Error(`AI transformation failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ AI transformation completed');
      console.log('📄 Transformed resume:', result);
      return result;
    } catch (error) {
      console.error('❌ Error transforming resume:', error);
      throw error;
    }
  }

  async extractTextFromFile(file: File): Promise<string> {
    console.log('📄 Extracting text from file:', file.name);
    console.log('📊 File type:', file.type);
    console.log('📏 File size:', (file.size / 1024).toFixed(2), 'KB');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/ai/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Text extraction failed: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Text extraction completed');
      console.log('📏 Extracted text length:', result.text.length, 'characters');
      console.log('📄 Extracted text preview:', result.text.substring(0, 300) + '...');
      return result.text;
    } catch (error) {
      console.error('❌ Error extracting text from file:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
