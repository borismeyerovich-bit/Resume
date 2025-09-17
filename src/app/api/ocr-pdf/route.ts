import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('🖼️ OCR: Processing file:', file.name);
    
    // Use Tesseract OCR directly - this should work for any PDF, even image-based ones
    try {
      const Tesseract = await import('tesseract.js');
      
      console.log('🔍 Starting OCR recognition...');
      const { data: { text } } = await Tesseract.recognize(file, 'eng+heb', {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`🔍 OCR progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      
      if (text && text.trim().length > 20) {
        const cleanedText = text
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .replace(/\s+/g, ' ')
          .trim();
        
        console.log('✅ OCR successful, extracted', cleanedText.length, 'characters');
        
        return NextResponse.json({
          success: true,
          text: cleanedText,
          length: cleanedText.length,
          preview: cleanedText.substring(0, 500),
          method: 'OCR'
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'OCR found no readable text',
          method: 'OCR'
        }, { status: 400 });
      }
      
    } catch (ocrError: any) {
      console.error('❌ OCR failed:', ocrError);
      return NextResponse.json({
        success: false,
        error: `OCR failed: ${ocrError.message}`,
        method: 'OCR'
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ OCR endpoint error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 