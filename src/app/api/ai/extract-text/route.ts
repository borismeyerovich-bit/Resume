import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('📄 Extracting text from file:', file.name);
    console.log('📊 File type:', file.type);
    console.log('📏 File size:', (file.size / 1024).toFixed(2), 'KB');

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type;
    let extractedText = '';

    if (fileType === 'application/pdf') {
      console.log('📄 Processing PDF file...');
      
      try {
        // Try to extract text from PDF
        const pdfText = await extractTextFromPDF(buffer);
        
        if (pdfText && pdfText.trim().length > 0) {
          extractedText = pdfText;
          console.log('✅ PDF text extraction successful');
          console.log('📄 Extracted text preview:', extractedText.substring(0, 300));
        } else {
          console.log('⚠️ No readable text found in PDF');
          return NextResponse.json({ 
            error: 'No readable text could be extracted from the PDF. Please try converting to text format or use the text input option.',
            requiresManualInput: true,
            fileName: file.name
          }, { status: 400 });
        }
      } catch (pdfError) {
        console.error('❌ PDF processing failed:', pdfError);
        return NextResponse.json({ 
          error: 'PDF processing failed. Please try converting to text format or use the text input option.',
          requiresManualInput: true,
          fileName: file.name
        }, { status: 400 });
      }
    } else if (fileType.includes('wordprocessingml') || fileType === 'application/msword') {
      console.log('📝 Processing Word document...');
      try {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
        console.log('✅ Word parsing successful');
        console.log('📄 Extracted text preview:', extractedText.substring(0, 300));
      } catch (wordError) {
        console.error('❌ Word parsing failed:', wordError);
        return NextResponse.json({ 
          error: 'Word document parsing failed. Please try converting to text format.',
          requiresManualInput: true,
          fileName: file.name
        }, { status: 400 });
      }
    } else if (fileType.startsWith('image/')) {
      console.log('🖼️ Processing image with OCR...');
      try {
        const Tesseract = await import('tesseract.js');
        const { data: { text } } = await Tesseract.recognize(file);
        extractedText = text;
        console.log('✅ OCR successful');
        console.log('📄 Extracted text preview:', extractedText.substring(0, 300));
      } catch (ocrError) {
        console.error('❌ OCR failed:', ocrError);
        return NextResponse.json({ 
          error: 'Image OCR failed. Please try converting to text format.',
          requiresManualInput: true,
          fileName: file.name
        }, { status: 400 });
      }
    } else {
      return NextResponse.json({ 
        error: 'Unsupported file type. Please use PDF, Word, or image files.',
        requiresManualInput: true,
        fileName: file.name
      }, { status: 400 });
    }

    console.log('✅ Text extraction completed');
    console.log('📏 Extracted text length:', extractedText.length, 'characters');
    console.log('📄 Extracted text preview:', extractedText.substring(0, 200));
    
    if (extractedText.trim().length === 0) {
      console.warn('⚠️ No text extracted from file');
      return NextResponse.json({ 
        error: 'No text could be extracted from the file. Please try a different format.',
        requiresManualInput: true,
        fileName: file.name
      }, { status: 400 });
    }

    return NextResponse.json({ text: extractedText });
  } catch (error: any) {
    console.error('❌ Error extracting text from file:', error);
    return NextResponse.json(
      { error: `Failed to extract text: ${error.message}` },
      { status: 500 }
    );
  }
}

// Simple PDF text extraction function
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Convert buffer to string and look for readable text patterns
    const bufferString = buffer.toString('utf8');
    
    // Look for common text patterns in PDFs
    const textMatches = bufferString.match(/[A-Za-z\u0590-\u05FF\u0400-\u04FF\s]{10,}/g);
    
    if (textMatches && textMatches.length > 0) {
      // Join the matches and clean up
      const extractedText = textMatches
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Check if we got meaningful text (not just PDF metadata)
      if (extractedText.length > 50 && !extractedText.includes('PDF') && !extractedText.includes('endobj')) {
        return extractedText;
      }
    }
    
    // If no readable text found, return empty string
    return '';
  } catch (error) {
    console.error('Error in PDF text extraction:', error);
    return '';
  }
}
