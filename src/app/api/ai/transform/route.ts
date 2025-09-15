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

    // Input validation
    if (typeof resume !== 'object' || !resume.personal_info) {
      return NextResponse.json({ error: 'Invalid resume format' }, { status: 400 });
    }

    // Size limit check (prevent extremely large payloads)
    const resumeString = JSON.stringify(resume);
    if (resumeString.length > 50000) { // ~50KB limit
      return NextResponse.json({ error: 'Resume data too large' }, { status: 413 });
    }

    console.log('🇺🇸 Transforming resume to American style using OpenAI GPT...');
    // Note: Not logging resume content for privacy

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4-turbo', // ✅ Updated to GPT-4 Turbo
      messages: [
        {
          role: 'system',
          content: `You are an expert resume transformer. Your task is to convert resume content—possibly in non-English languages like Hebrew or Spanish—into a **polished, professional, one-page American-style resume**, structured as valid JSON.

---

📌 OBJECTIVES:
- Fit content to **ONE A4 page** using compact formatting (adjust font/spacing, do NOT cut content).
- Include **Work Experience**, **Education**, and a combined **Additional Information** section.
- Ensure **EVERY bullet point includes a number, metric, or quantifiable impact** (fictional but realistic if missing).
- Translate all content to **professional American English**.
- Output must match the provided JSON schema.

---

🧠 TRANSLATION RULES:
- If input contains Hebrew or RTL text:
  - Translate to professional English with full fidelity.
  - Fix **date ranges from RTL → LTR** (e.g., "2018–2016" → "2016–2018").
  - Translate place names: "בת ים" → "Bat Yam, Israel"
  - Translate job titles, fields of study, company names. Add brief clarifying context where helpful:
    - Example: "Israir" → "Israir (Israeli Airline)"
- Preserve full meaning — **no summaries or omissions**.

---

📅 DATE HANDLING:
- Respect original format:
  - If month/year present → use MM/YYYY
  - If only year → use YYYY
- Use **original order** (correct RTL if Hebrew)
- ✅ Do NOT fabricate or guess dates.
- ❌ If start or end date is missing → leave empty string (e.g., "")

---

📌 STRUCTURE:

1. **Work Experience**
   - Reverse chronological order
   - Company, Position, Location, Dates
   - 2–5 bullets per job (concise, action-based, with metrics)

2. **Education**
   - Institution, Degree, Field, Location, Graduation Year
   - Use range (2013–2016) only if present in original

3. **Additional Information**
   - Combine Skills, Certifications, Languages, Awards, Projects, Military Service
   - Each item must include a **number** or **duration**
   - Use descriptive labels like "Skills", "Languages", etc.

---

🎯 BULLET POINT RULES:
- Max 3 lines each (not words)
- Start with action verbs (Managed, Improved, Built, Reduced, etc.)
- Every bullet must include a number or quantifiable result
  - If missing: infer a realistic metric (e.g., "~10%", "5+", "$50K+")
- Examples:
  - ❌ "Handled customer service requests"
  - ✅ "Handled 100+ customer service requests with 95% satisfaction"

---

📦 OUTPUT FORMAT (MUST BE VALID JSON):

interface AmericanizedResume {
  personal_info: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  work_experience: {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;  // "MM/YYYY", "YYYY", or ""
    endDate: string;    // "MM/YYYY", "YYYY", "Present", or ""
    current: boolean;
    bullets: string[];  // Each with a number/metric, max 3 lines
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field?: string;
    location: string;
    graduationDate: string;  // "YYYY" or ""
  }[];
  other: {
    id: string;
    title: string;  // e.g., "Skills", "Languages", "Certifications"
    items: string[]; // All with numbers, durations, or impact
  }[];
}

---

🚨 REMINDERS:
- Do NOT fabricate dates or institutions.
- Do NOT summarize content or drop bullets.
- Do NOT hallucinate content unless clearly missing (e.g., metrics).
- Translate fully and preserve structure.
- Output valid JSON only — no markdown or prose outside the JSON.

---

💡 Example:
❌ "Managed budget"  
✅ "Managed $10M annual budget across 3 departments with 15% cost reduction"

Now, please return only the transformed resume in JSON format.`
        },
        {
          role: 'user',
          content: JSON.stringify(resume)
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Slightly higher for better translation creativity while maintaining structure
      max_tokens: 4000, // Keep the same token limit
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
