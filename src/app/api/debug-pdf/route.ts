import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('🔍 DEBUG: Processing file:', file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Test pdf-parse directly
    let pdfParseResult = null;
    try {
      const pdfParse = await import('pdf-parse');
      const data = await pdfParse.default(buffer);
      pdfParseResult = {
        success: true,
        textLength: data.text?.length || 0,
        pageCount: data.numpages,
        preview: data.text?.substring(0, 1000) || '',
        hasText: !!(data.text && data.text.trim().length > 0)
      };
      console.log('📚 pdf-parse result:', pdfParseResult);
    } catch (error: any) {
      pdfParseResult = {
        success: false,
        error: error.message
      };
    }

    // Test manual extraction
    let manualResult = null;
    try {
      const bufferString = buffer.toString('binary');
      
      // Look for text in parentheses (most common PDF text format)
      const textInParens = bufferString.match(/\([^()]{5,200}\)/g) || [];
      const cleanTexts = textInParens
        .map(match => match.slice(1, -1))
        .filter(text => 
          text.length > 2 && 
          !text.includes('obj') && 
          !text.includes('endobj') &&
          !text.includes('FontDescriptor')
        )
        .slice(0, 50); // First 50 meaningful text pieces

      manualResult = {
        success: true,
        foundTexts: cleanTexts,
        count: cleanTexts.length,
        sample: cleanTexts.slice(0, 10)
      };
      console.log('🔧 Manual extraction sample:', cleanTexts.slice(0, 5));
    } catch (error: any) {
      manualResult = {
        success: false,
        error: error.message
      };
    }

    return NextResponse.json({
      file: {
        name: file.name,
        size: file.size,
        type: file.type
      },
      pdfParse: pdfParseResult,
      manual: manualResult,
      debug: true
    });

  } catch (error: any) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 