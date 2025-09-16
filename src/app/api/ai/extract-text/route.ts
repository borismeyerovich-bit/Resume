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

// Fast PDF text extraction - manual approach first, then simpler alternatives
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  console.log('🔄 Trying fast manual PDF text extraction...');
  
  // First try: Enhanced manual PDF text extraction (fast and reliable)
  try {
    const extractedText = await manualPDFExtraction(buffer);
    if (extractedText && extractedText.trim().length > 20) {
      console.log('✅ Manual PDF extraction successful');
      console.log('📄 First 500 chars:', extractedText.substring(0, 500));
      return extractedText;
    }
  } catch (manualError) {
    console.error('❌ Manual extraction failed:', manualError);
  }
  
  console.log('❌ PDF text extraction failed - file may be image-based or corrupted');
  return '';
}

// Enhanced manual PDF text extraction
async function manualPDFExtraction(buffer: Buffer): Promise<string> {
  try {
    console.log('🔍 Scanning PDF buffer for text content...');
    
    // Try multiple encodings to handle Hebrew text properly
    const encodings = ['utf8', 'binary', 'latin1'];
    let bestResult = '';
    
    for (const encoding of encodings) {
      try {
        const bufferString = buffer.toString(encoding as BufferEncoding);
        
        // Focus on actual text content, avoid PDF metadata
        const textPatterns = [
          // Text in parentheses (most reliable for actual content)
          /\(([^()]{2,200})\)/g,
          // Text with Hebrew characters
          /[\u0590-\u05FF][^<>/]{1,100}/g,
          // Email patterns
          /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
          // Phone patterns
          /\d{2,3}[-\s]?\d{3,4}[-\s]?\d{3,4}/g,
          // Date patterns
          /\d{4}[\s\-–]\d{4}|\d{4}[\s\-–]היום|\d{4}[\s\-–]Present/g
        ];
        
        let extractedText = '';
        let foundEmails = new Set();
        let foundPhones = new Set();
        let foundDates = new Set();
        
        for (const pattern of textPatterns) {
          const matches = bufferString.match(pattern);
          if (matches && matches.length > 0) {
            for (const match of matches) {
              // Clean up the match
              let cleanMatch = match
                .replace(/^\(|\)$/g, '') // Remove surrounding parentheses
                .replace(/\\[rnt]/g, ' ')
                .replace(/[<>{}]/g, ' ') // Remove XML/PDF markup
                .trim();
              
              // Skip PDF metadata patterns
              if (cleanMatch.includes('obj') || 
                  cleanMatch.includes('endobj') || 
                  cleanMatch.includes('FontDescriptor') ||
                  cleanMatch.includes('Registry') ||
                  cleanMatch.includes('Type/Font') ||
                  cleanMatch.includes('BaseFont') ||
                  cleanMatch.length < 3) {
                continue;
              }
              
              // Prioritize important content
              if (/@/.test(cleanMatch)) {
                foundEmails.add(cleanMatch);
              } else if (/\d{2,3}[-\s]?\d{3,4}[-\s]?\d{3,4}/.test(cleanMatch)) {
                foundPhones.add(cleanMatch);
              } else if (/\d{4}/.test(cleanMatch) && cleanMatch.length < 50) {
                foundDates.add(cleanMatch);
              } else if (cleanMatch.length > 2 && cleanMatch.length < 200) {
                extractedText += cleanMatch + ' ';
              }
            }
          }
        }
        
        // Add found contact info to the beginning
        let finalText = '';
        if (foundEmails.size > 0) {
          finalText += Array.from(foundEmails).join(' ') + ' ';
        }
        if (foundPhones.size > 0) {
          finalText += Array.from(foundPhones).join(' ') + ' ';
        }
        if (foundDates.size > 0) {
          finalText += Array.from(foundDates).join(' ') + ' ';
        }
        finalText += extractedText;
        
                 if (finalText.trim().length > bestResult.length) {
           bestResult = finalText.trim();
         }
      } catch (encodingError) {
        console.log(`⚠️ Encoding ${encoding} failed, trying next...`);
      }
    }
    
         if (bestResult.length > 20) {
       // Final cleanup and length limit
       let finalText = bestResult
         .replace(/\s+/g, ' ')
         .replace(/([a-zA-Z])\s+([a-zA-Z])/g, '$1$2') // Fix broken words
         .trim();
       
       // Limit to 10,000 characters to avoid 413 error
       if (finalText.length > 10000) {
         finalText = finalText.substring(0, 10000);
         console.log('⚠️ Text truncated to 10,000 characters to avoid size limits');
       }
       
       console.log(`✅ Extracted ${finalText.length} characters from PDF`);
       console.log('📄 Preview:', finalText.substring(0, 200));
       
       return finalText;
     }
    
    console.log('⚠️ No meaningful text found in PDF');
    return '';
  } catch (error) {
    console.error('❌ Manual PDF extraction failed:', error);
    return '';
  }
}
