# ResumeTransformer MVP v1

**Product Requirements Document (PRD): ResumeTransformer (MVP v1)**

---

### 1. Product Summary

**Goal:** Build a web app that helps international candidates instantly convert their resume into a professional American-style format using AI, with editing and PDF export features.

**Target Audience:** International job seekers (non-native English speakers) applying for legal tech jobs in the U.S., with poorly formatted resumes.

**"Wow" Moment:** Uploading a resume and instantly seeing a clean, quantifiable, American-style resume.

**Monetization Goal:** Drive toward premium sign-up with soft paywall. Export/download is free with watermark, premium removes it + unlocks AI rewriting.

---

### 2. Core Features (v1 Scope)

#### 2.1 Upload & Extraction

* Accept resume file (PDF, DOC, or image)
* Extract structured data using AI into JSON schema

  * Sections: personal\_info, work\_experience, education, other

#### 2.2 Resume Transformation

* AI generates American-style resume

  * Uses quantifiable achievements
  * Active language ("led", "built", "grew")
  * Orders sections by impact (AI decides)
* Final result stored in `americanized_resume` JSON object

#### 2.3 Editable Resume UI

* Display transformed resume
* Allow editing of bullets, job titles, etc.
* Drag-and-drop reordering of sections
* Toggle between section order (Education first vs. Experience)
* Add/remove bullets manually
* Future: AI Rewriter per bullet (not in MVP)

#### 2.4 PDF Export

* Export editable resume as PDF
* Adds watermark: "Created by ResumeBuild"
* Future: Remove watermark if signed up or paid

#### 2.5 Responsive Design

* Mobile/tablet/desktop support
* Clean layout with readable typography

---

### 3. Out of Scope (for MVP)

* Login / Auth
* Stripe integration
* Saved resumes / account system
* .docx download
* Multiple versions per user
* Analytics

---

### 4. Tech Stack

* Framework: Next.js (App Router)
* Styling: Tailwind CSS
* Animation: Framer Motion
* PDF Export: `react-pdf` or html2pdf
* AI: Function to call `ExtractData` and `InvokeLLM`

---

### 5. Folder Structure (for Cursor)

```
app/
  page.tsx (main component)
components/
  resume/
    FileUploadZone.tsx
    ProcessingSteps.tsx
    ResumeEditor.tsx
    SectionEditor.tsx
    PDFExportButton.tsx
entities/
  Resume.ts
integrations/
  Core.ts (handles UploadFile, ExtractDataFromUploadedFile, InvokeLLM)
public/
  logo.png
utils/
  transform.ts (any formatting helpers)
```

---

### 6. Execution Steps in Cursor

1. **Create New Project**: `npx create-next-app@latest resumetransformer`
2. **Enable Tailwind CSS + Framer Motion**
3. **Create folders as per above**
4. **Paste the PRD in `README.md` in root folder**
5. **Start coding from `app/page.tsx`**

   * Begin with upload > then add AI transform > editor > export
6. **Use Base44-style AI calls in `integrations/Core.ts`**
7. **Preview app with `npm run dev`**

---

### 7. Stretch Goals (Post MVP)

* Stripe subscription with gated export
* Login and save versions
* AI Rewriter buttons
* Weekly resume insights
* LinkedIn optimization tips

---

### 8. Launch Plan

* Post MVP on LinkedIn with before/after examples
* Share with international communities (Israelis in Tech, OPT/H-1B groups, etc.)
* Add Google Search Console for SEO

---

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Status

✅ Project structure created
✅ Core components implemented
✅ Mock AI integration ready
✅ PDF export functionality
✅ Responsive design with Tailwind CSS

## Next Steps

1. Replace mock AI functions in `src/integrations/Core.ts` with actual Base44 API calls
2. Add Framer Motion animations
3. Implement drag-and-drop reordering
4. Add more sophisticated PDF generation
5. Deploy to production

