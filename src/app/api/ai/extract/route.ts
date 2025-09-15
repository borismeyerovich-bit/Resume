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

    console.log('🤖 Extracting resume data using OpenAI GPT...');
    console.log('📄 Resume text preview:', resumeText.substring(0, 200), '...');
    console.log('📏 Full text length:', resumeText.length);

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // ✅ Changed from gpt-4-turbo to gpt-4o-mini
      messages: [
        {
          role: 'system',
          content: `Expert resume parser. Extract structured data from resume text.

CRITICAL INSTRUCTIONS:
1. The resume might be in Hebrew. Extract the ACTUAL NAME from the text, not Hebrew letters or symbols.
2. **EMAIL PRESERVATION IS CRITICAL**: Extract email addresses EXACTLY as written, regardless of language direction.
   - Example: "asafmagen2@gmail.com" should remain "asafmagen2@gmail.com" (NOT "2asafmagen@gmail.com")
   - Do NOT reorder characters or numbers in email addresses
   - Email addresses are language-agnostic and must be preserved character-for-character
4. Preserve all original text, including Hebrew, in the extracted fields.
5. **PRIORITIZE ACHIEVEMENTS OVER DUTIES** - Look for numbers, percentages, metrics, team sizes, project scopes.
6. Extract dates EXACTLY as they appear in the original text.
7. **FOCUS ON QUANTIFIABLE RESULTS**: revenue increases, cost savings, team sizes, project timelines, customer numbers.
8. The output MUST be a valid JSON object, and nothing else.

The JSON schema should be:
interface PersonalInfo {
  name: string; // Extract the actual person's name, not Hebrew letters
  email: string; // MUST preserve email EXACTLY as written (no character reordering)
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
  startDate: string; // Extract EXACTLY as written in original
  endDate: string; // Extract EXACTLY as written in original
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
- Email addresses: Extract EXACTLY as written (no character reordering)
- Phone numbers: Extract EXACTLY as written
- Dates: Extract EXACTLY as written in original text
- Names: Extract actual person's name, not Hebrew letters

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
