import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Resume } from '@/entities/Resume';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to clean AI response (remove markdown, etc.)
function cleanAIResponse(text: string): string {
  // Remove markdown code blocks (```json ... ```)
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    return jsonMatch[1];
  }
  // If no markdown block, try to clean up common AI conversational text
  const cleanedText = text
    .replace(/^(Here's the JSON|```json|```|```json\n|```\n)/gm, '') // Remove common prefixes/suffixes
    .trim();
  return cleanedText;
}

export async function POST(request: NextRequest) {
  try {
    const { resumeText } = await request.json();

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
    }

    // Input validation
    if (typeof resumeText !== 'string') {
      return NextResponse.json({ error: 'Resume text must be a string' }, { status: 400 });
    }

    // Size limit check (prevent extremely large text)
    if (resumeText.length > 100000) { // ~100KB limit
      return NextResponse.json({ error: 'Resume text too large' }, { status: 413 });
    }

    // Basic content validation
    if (resumeText.trim().length < 50) {
      return NextResponse.json({ error: 'Resume text too short' }, { status: 400 });
    }

    console.log('🤖 Extracting resume data using OpenAI GPT...');
    console.log('📏 Full text length:', resumeText.length);
    // Note: Not logging resume content for privacy

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // ✅ Changed from gpt-4-turbo to gpt-4o-mini
      messages: [
        {
          role: 'system',
          content: `Expert resume parser specializing in Hebrew-to-English resume extraction.

CRITICAL INSTRUCTIONS:
1. **NAME TRANSLATION**: If resume is in Hebrew, translate the person's name to English:
   - "אסף מגן" → "Asaf Magen"
   - "דוד כהן" → "David Cohen"
   - Extract the ENGLISH version of Hebrew names, not Hebrew letters
2. **EMAIL PRESERVATION IS CRITICAL**: Extract email addresses EXACTLY as written:
   - Look for patterns like "user@domain.com" 
   - NEVER reverse or reorder characters in emails
   - Example: If you see "2asafmagen@gmail.com" in RTL text, extract as "asafmagen2@gmail.com"
   - Email addresses follow LTR order regardless of text direction
3. **DATE HANDLING**: 
   - Translate Hebrew date words: "היום" → "Present", "נוכחי" → "Present"
   - Keep numbers exactly as written: "2018 – היום" → "2018" and "Present"
   - Preserve original date format but translate Hebrew words
4. **HEBREW CONTENT**: Keep Hebrew in company names, positions, and bullet points (will be translated later)
5. **ACHIEVEMENTS**: Look for numbers, percentages, metrics, team sizes, project scopes.
6. The output MUST be a valid JSON object, and nothing else.

The JSON schema should be:
interface PersonalInfo {
  name: string; // Translate Hebrew names to English (e.g., "אסף מגן" → "Asaf Magen")
  email: string; // MUST preserve email EXACTLY as written (correct RTL reversal)
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string; // Keep numbers, translate Hebrew words: "2018 – היום" → "2018" 
  endDate: string; // Keep numbers, translate Hebrew words: "היום" → "Present"
  current: boolean;
  bullets: string[]; // Focus on achievements with numbers/metrics
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  location: string;
  graduationDate: string; // Extract EXACTLY as written in original
  gpa?: string;
}

interface OtherSection {
  id: string;
  title: string;
  items: string[];
}

interface Resume {
  personal_info: PersonalInfo;
  work_experience: WorkExperience[];
  education: Education[];
  other: OtherSection[];
}

**ACHIEVEMENT EXTRACTION PRIORITY:**
- Look for numbers: %, $, people count, time periods, quantities
- Examples: "Increased sales by 25%", "Managed team of 8", "Reduced costs by $50K"
- If you see vague statements like "improved efficiency", look for context clues
- Extract ALL bullet points but prioritize ones with measurable results

**CRITICAL FIELD PRESERVATION:**
- Email addresses: Correct RTL reversal, preserve actual email format
- Phone numbers: Extract EXACTLY as written
- Dates: Translate Hebrew words, preserve numbers
- Names: Translate Hebrew names to English equivalents

If a field is not present, use an empty string or empty array. Generate unique 'id's for each entry.

For 'other' sections, group related items under a title (e.g., "Skills", "Awards", "Certifications").`
        },
        {
          role: 'user',
          content: resumeText,
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 2000, // ✅ Reduced from 4000 to 2000
    });

    const responseText = chatCompletion.choices[0].message?.content || '';
    console.log('📥 Received response from OpenAI');
    console.log('📄 AI response preview:', responseText.substring(0, 200), '...');

    let extractedData: Resume;
    try {
      const cleanedResponse = cleanAIResponse(responseText);
      extractedData = JSON.parse(cleanedResponse);
      console.log('✅ Successfully parsed resume data');
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', responseText);
      throw new Error('Invalid JSON response from AI');
    }

    // Ensure all required arrays exist
    extractedData.work_experience = extractedData.work_experience || [];
    extractedData.education = extractedData.education || [];
    extractedData.other = extractedData.other || [];

    return NextResponse.json({ resumeData: extractedData });
  } catch (error: any) {
    console.error('❌ Error extracting resume data:', error);
    return NextResponse.json(
      { error: `Failed to extract resume data: ${error.message}` },
      { status: 500 }
    );
  }
}
