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
            console.log('⚠️ No text found in PDF using fast extraction');
            return NextResponse.json({ 
              error: 'No readable text could be extracted from the PDF. This may be an image-based PDF, password-protected, or use a complex format. Please use the text input option by copy-pasting your resume content.',
              requiresManualInput: true,
              fileName: file.name,
              suggestion: 'Copy the text from your PDF and paste it in the "Paste Text" tab for best results.'
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

// PDF text extraction - try multiple approaches focusing on actual content
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  console.log('🔄 Trying PDF text extraction...');
  
  // First approach: Try pdf-parse library (most reliable for actual text content)
  try {
    console.log('📚 Trying pdf-parse library...');
    const pdfParse = await import('pdf-parse');
    const data = await pdfParse.default(buffer);
    
    if (data.text && data.text.trim().length > 50) {
      const cleanedText = data.text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Filter out obvious PDF metadata
      if (!cleanedText.includes('FontDescriptor') && 
          !cleanedText.includes('endobj') &&
          cleanedText.length < 50000) { // Reasonable text length
        console.log('✅ pdf-parse extraction successful');
        console.log('📄 Extracted length:', cleanedText.length);
        console.log('📄 First 300 chars:', cleanedText.substring(0, 300));
        return cleanedText;
      }
    }
  } catch (pdfParseError) {
    console.log('⚠️ pdf-parse failed, trying manual extraction...');
  }
  
  // Second approach: Manual extraction as fallback
  try {
    const extractedText = await manualPDFExtraction(buffer);
    if (extractedText && extractedText.trim().length > 20) {
      console.log('✅ Manual PDF extraction successful');
      console.log('📄 First 300 chars:', extractedText.substring(0, 300));
      return extractedText;
    }
  } catch (manualError) {
    console.error('❌ Manual extraction failed:', manualError);
  }
  
  console.log('❌ All PDF text extraction methods failed');
  return '';
}

// Simplified and more effective manual PDF text extraction
async function manualPDFExtraction(buffer: Buffer): Promise<string> {
  try {
    console.log('🔍 Manual PDF text extraction...');
    
    const bufferString = buffer.toString('binary');
    
    // Look for text in PDF streams - more focused approach
    const streamPattern = /stream\s+(.*?)\s+endstream/g;
    const streams = bufferString.match(streamPattern) || [];
    
    let extractedText = '';
    
    for (const stream of streams) {
      // Look for text operations in the stream
      const textOperations = [
        /Tj\s*\((.*?)\)/g,
        /TJ\s*\[(.*?)\]/g,
        /'\s*\((.*?)\)/g,
        /"\s*\((.*?)\)/g
      ];
      
      for (const operation of textOperations) {
        const matches = stream.match(operation);
        if (matches) {
          for (const match of matches) {
            // Extract text from parentheses
            const textMatch = match.match(/\((.*?)\)/);
            if (textMatch && textMatch[1]) {
              const text = textMatch[1]
                .replace(/\\[rnt]/g, ' ')
                .replace(/\\(.)/g, '$1') // Unescape characters
                .trim();
              
              // Only include meaningful text (not single characters or PDF commands)
              if (text.length > 1 && !text.match(/^[0-9\s\-\.]+$/)) {
                extractedText += text + ' ';
              }
            }
          }
        }
      }
    }
    
    // Also try direct pattern matching for Hebrew/English text
    const directTextPatterns = [
      // Hebrew text
      /[\u0590-\u05FF][\u0590-\u05FF\s\u0020-\u007E]{2,100}/g,
      // English words/sentences
      /[A-Za-z][A-Za-z\s]{3,100}/g,
      // Email addresses
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      // Phone numbers
      /\d{2,3}[-\s]?\d{3,4}[-\s]?\d{3,4}/g
    ];
    
    for (const pattern of directTextPatterns) {
      const matches = bufferString.match(pattern);
      if (matches) {
        for (const match of matches) {
          // Skip PDF metadata
          if (!match.includes('obj') && 
              !match.includes('endobj') && 
              !match.includes('FontDescriptor') &&
              !match.includes('Registry') &&
              match.length > 2) {
            extractedText += match + ' ';
          }
        }
      }
    }
    
    if (extractedText.trim().length > 20) {
      // Clean up the final text
      const cleanedText = extractedText
        .replace(/\s+/g, ' ')
        .replace(/([a-zA-Z])\s+([a-zA-Z])/g, '$1$2')
        .trim()
        .substring(0, 5000); // Reasonable limit
      
      console.log(`✅ Manual extraction found ${cleanedText.length} characters`);
      console.log('📄 Preview:', cleanedText.substring(0, 200));
      
      return cleanedText;
    }
    
    console.log('⚠️ No meaningful text found in manual extraction');
    return '';
  } catch (error) {
    console.error('❌ Manual PDF extraction failed:', error);
    return '';
  }
}
