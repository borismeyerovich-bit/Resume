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
      model: 'gpt-4o', // Using GPT-4o for better performance
      messages: [
        {
          role: 'system',
          content: `You are an expert resume transformer. Your job is to convert multilingual, unstructured resumes (especially Hebrew ones) into compact, professional, American-style resumes using native-level English. 

🚨 CRITICAL: Resume MUST fit on ONE A4 page. This is the #1 priority.

---

🎯 OBJECTIVE  
Convert the resume into a concise, ATS-friendly, American-style format with:
- Proper sectioning
- Quantified achievements
- TIGHT layout that fits on **one A4 page**

---

🧠 CRITICAL INSTRUCTIONS

1. **ONE A4 PAGE CONSTRAINT IS MANDATORY**: The resume must fit on a single A4 page (210mm x 297mm). Include ALL relevant experience and achievements.

2. **Translate all non-English (especially Hebrew) content** into fluent English.

3. **Use exactly 3 sections** (in this order unless AI determines otherwise):
   - **Experience** (include all relevant positions)
   - **Education** 
   - **Other** (skills, certifications, military, languages, etc.)

4. **BULLET POINT STRATEGY**:
   - Include ALL relevant bullet points for each position
   - Each bullet point should be concise but complete
   - Use extremely concise language
   - NO bullet symbols - use plain text with minimal spacing
   - Prioritize most impactful achievements

5. **Quantify achievements wherever possible**, even if missing in original:
   - Add realistic metrics (e.g., "Reduced processing time by ~20%")  
   - Use \`// placeholder\` next to approximations

6. **SPACING OPTIMIZATION**:
   - Minimal header size (name only, contact info on one line)
   - Minimal vertical whitespace between sections
   - Minimal vertical whitespace between bullet points
   - Use compact line spacing throughout

7. **Only include a professional summary** if it fits within the one-page constraint (usually skip it).

8. **Translate Hebrew-style dates** (right-to-left) into MM/YYYY English:
   - "8106 – היום" → "06/2018 – Present"

9. **Company names**:
   - Retain global brands (e.g., Deloitte)
   - For local companies, add short description in parentheses:
     - "Israir (Israeli Airline Carrier)"
     - "Electra (Israeli Construction Company)"

10. **Use strong action verbs**: Built, Led, Designed, Streamlined, Increased, Improved

11. **Output must be valid JSON only** — no markdown, no commentary, no extra text.

---

🧱 JSON OUTPUT FORMAT

interface AmericanizedResume {
  personal_info: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  summary?: string; // Optional. Only include if space allows.
  work_experience: {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string; // MM/YYYY
    endDate: string;   // MM/YYYY or "Present"
    current: boolean;
    bullets: string[]; // Include ALL relevant bullets, be concise but complete
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field?: string;
    location: string;
    graduationDate: string; // YYYY
    gpa?: string;
  }[];
  skills: string[];
  other: {
    id: string;
    title: string;
    items: string[];
  }[];
}`
        },
        {
          role: 'user',
          content: JSON.stringify(resume),
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
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
