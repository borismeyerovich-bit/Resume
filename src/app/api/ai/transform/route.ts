import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AmericanizedResume, Resume } from '@/entities/Resume';

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
    const { resume } = await request.json();

    if (!resume) {
      return NextResponse.json({ error: 'Resume data is required for transformation' }, { status: 400 });
    }

    console.log('🇺🇸 Transforming resume to American style using OpenAI GPT...');
    console.log('📄 Input resume:', resume);

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o', // Using GPT-4o for better performance and translation
      messages: [
        {
          role: 'system',
          content: `You are an expert resume transformer specializing in creating ONE-PAGE resumes with quantifiable achievements.

🚨 CRITICAL: You MUST produce a resume that fits on ONE A4 page (210mm x 297mm). This is NON-NEGOTIABLE.

---

🎯 YOUR MISSION
Transform the resume into a SINGLE-PAGE format with:
- Include ALL relevant experience and achievements
- Each bullet MUST include a number/metric/percentage
- Use ultra-compact, dense formatting
- NO professional summary (skip it to save space)
- **TRANSLATE ALL HEBREW TEXT TO PROFESSIONAL ENGLISH**

---

🧠 STRICT INSTRUCTIONS

1. **TRANSLATION REQUIREMENT (CRITICAL)**
   - Translate ALL Hebrew text to professional American English
   - Location: "בת ים" → "Bat Yam, Israel"
   - Education: "בוגר תואר ראשון" → "Bachelor's Degree"
   - Institution: "אוניברסיטה העברית" → "The Hebrew University"
   - Field: "כלכלה ומנהל עסקים" → "Economics and Business Administration"
   - Dates: "8106 – היום" → "06/2018 – Present"
   - Company names: Add English descriptions for local companies
   - **USE YOUR EXPERTISE IN HEBREW-ENGLISH TRANSLATION TO PROVIDE ACCURATE, PROFESSIONAL TRANSLATIONS**

2. **ONE PAGE ENFORCEMENT - USE FONT SIZING, NOT CONTENT CUTTING**
   - Keep ALL relevant content - do NOT cut jobs or bullets
   - Use ultra-compact formatting with minimal spacing
   - Dense layout with tight line spacing
   - Single-line headers and minimal whitespace

3. **QUANTIFIABLE ACHIEVEMENTS (REQUIRED)**
   - EVERY bullet point MUST include a number
   - Examples: "Increased sales by 25%", "Reduced costs by $50K", "Led team of 8 developers"
   - If no metrics exist, CREATE realistic ones like:
     * "Improved efficiency by ~15%"
     * "Managed team of ~5 people"
     * "Reduced processing time by ~20%"
     * "Increased customer satisfaction by ~25%"
     * "Delivered project worth ~$100K"
     * "Led team of ~8 developers"

4. **BULLET POINT RULES**
   - Include ALL relevant bullets for each position
   - Each bullet: 6-10 words maximum for density
   - Start with strong action verbs: Led, Built, Increased, Reduced, Managed, Delivered
   - Format: "Action + Result + Number"
   - Example: "Led team of 6 developers, delivered project 2 weeks early"

5. **SPACE OPTIMIZATION - DENSE FORMATTING**
   - Personal info: single line only
   - Job titles: one line
   - Company names: one line
   - Dates: MM/YYYY format
   - Minimal spacing between sections (2-3 lines max)
   - Minimal spacing between bullets (1 line max)

6. **CONTENT PRESERVATION - KEEP EVERYTHING**
   - Include ALL work experience positions
   - Include ALL education details
   - Include ALL relevant skills
   - Include ALL certifications, languages, military service
   - Use font sizing and spacing to fit everything

7. **ADDITIONAL INFORMATION STRUCTURE**
   - Each section (Projects, Awards, Languages, etc.) should be structured like a job
   - Use descriptive titles instead of generic ones:
     * "Projects & Open Source" instead of just "Projects"
     * "Awards & Recognition" instead of just "Awards"
     * "Languages & Certifications" instead of just "Languages"
   - Each section should have relevant bullet points with quantifiable achievements
   - Format: Title + Bullets (like work experience but for non-work activities)

---

📦 OUTPUT FORMAT
Return valid JSON only. The resume will be formatted with appropriate font sizing to fit on one page.

interface AmericanizedResume {
  personal_info: {
    name: string;
    email: string;
    phone: string;
    location: string; // MUST be in English (e.g., "Bat Yam, Israel")
    linkedin?: string;
    website?: string;
  };
  work_experience: {
    id: string;
    company: string; // MUST be in English
    position: string; // MUST be in English
    location: string; // MUST be in English
    startDate: string; // MM/YYYY format
    endDate: string; // MM/YYYY or "Present"
    current: boolean;
    bullets: string[]; // ALL relevant bullets with numbers, MUST be in English
  }[];
  education: {
    id: string;
    institution: string; // MUST be in English
    degree: string; // MUST be in English
    field?: string; // MUST be in English
    location: string; // MUST be in English
    graduationDate: string; // YYYY format
  }[];
  skills: string[]; // ALL relevant skills, MUST be in English
  other: {
    id: string;
    title: string; // Descriptive section title in English
    items: string[]; // Bullet points with quantifiable achievements in English
  }[];
}

REMEMBER: Keep ALL content, use dense formatting, and TRANSLATE ALL HEBREW TO ENGLISH. Font sizing will handle the one-page constraint.

**EXAMPLE ADDITIONAL INFORMATION STRUCTURE:**
Each section should have a descriptive title and bullet points with quantifiable achievements, just like work experience:

- "Projects & Open Source" with bullets like "Open source contributor with 500+ GitHub stars"
- "Awards & Recognition" with bullets like "Employee of the Year 2021 at Tech Corp Inc."
- "Languages & Certifications" with bullets like "English (Native), Spanish (Fluent)"

Structure each section like a mini-job with title + achievement bullets.`
        },
        {
          role: 'user',
          content: JSON.stringify(resume),
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Slightly higher for better translation creativity while maintaining structure
      max_tokens: 4000, // Increased token limit
    });

    const responseText = chatCompletion.choices[0].message?.content || '';
    console.log('📥 Received transformation response from OpenAI');
    console.log('📄 AI response preview:', responseText.substring(0, 200), '...');

    let americanizedResume: AmericanizedResume;
    try {
      const cleanedResponse = cleanAIResponse(responseText);
      americanizedResume = JSON.parse(cleanedResponse);
      console.log('✅ Successfully transformed resume data');
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', responseText);
      throw new Error('Invalid JSON response from AI');
    }

    // Ensure all required arrays exist
    americanizedResume.work_experience = americanizedResume.work_experience || [];
    americanizedResume.education = americanizedResume.education || [];
    americanizedResume.skills = americanizedResume.skills || [];
    americanizedResume.other = americanizedResume.other || [];

    return NextResponse.json({ americanizedResume });
  } catch (error: any) {
    console.error('❌ Error transforming resume:', error);
    return NextResponse.json(
      { error: `Failed to transform resume: ${error.message}` },
      { status: 500 }
    );
  }
}
