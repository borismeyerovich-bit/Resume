import { AmericanizedResume } from '../entities/Resume';

// A4 page dimensions in pixels (at 96 DPI)
const A4_WIDTH_PX = 794; // 210mm
const A4_HEIGHT_PX = 1123; // 297mm

// Font size ranges
const MIN_FONT_SIZE = 8; // Minimum readable font size
const MAX_FONT_SIZE = 12; // Maximum font size for headers
const BASE_FONT_SIZE = 10; // Base font size

// Line height multipliers
const LINE_HEIGHT_MULTIPLIER = 1.2;
const SECTION_SPACING = 8; // pixels between sections
const BULLET_SPACING = 2; // pixels between bullets

export interface FontSizingConfig {
  headerFontSize: number;
  bodyFontSize: number;
  bulletFontSize: number;
  lineHeight: number;
  sectionSpacing: number;
  bulletSpacing: number;
}

/**
 * Calculate the total content length of a resume
 */
function calculateContentLength(resume: AmericanizedResume): number {
  let totalLength = 0;
  
  // Personal info
  if (resume.personal_info) {
    totalLength += (resume.personal_info.name?.length || 0) * 2; // Header weight
    totalLength += (resume.personal_info.email?.length || 0);
    totalLength += (resume.personal_info.phone?.length || 0);
    totalLength += (resume.personal_info.location?.length || 0);
  }
  
  // Summary
  if (resume.summary) {
    totalLength += resume.summary.length * 1.5; // Summary weight
  }
  
  // Work experience
  if (resume.work_experience) {
    resume.work_experience.forEach(exp => {
      totalLength += (exp.position?.length || 0) * 1.5; // Position weight
      totalLength += (exp.company?.length || 0) * 1.2; // Company weight
      totalLength += (exp.startDate?.length || 0) + (exp.endDate?.length || 0);
      
      if (exp.bullets) {
        exp.bullets.forEach(bullet => {
          totalLength += bullet.length;
        });
      }
    });
  }
  
  // Education
  if (resume.education) {
    resume.education.forEach(edu => {
      totalLength += (edu.degree?.length || 0) * 1.5; // Degree weight
      totalLength += (edu.institution?.length || 0) * 1.2; // Institution weight
      totalLength += (edu.field?.length || 0);
      totalLength += (edu.graduationDate?.length || 0);
    });
  }
  
  // Skills
  if (resume.skills) {
    totalLength += resume.skills.join(', ').length;
  }
  
  // Other sections
  if (resume.other) {
    resume.other.forEach(other => {
      totalLength += (other.title?.length || 0) * 1.3; // Title weight
      if (other.items) {
        other.items.forEach(item => {
          totalLength += item.length;
        });
      }
    });
  }
  
  return totalLength;
}

/**
 * Calculate the number of lines the content will take
 */
function calculateLineCount(resume: AmericanizedResume, fontSize: number): number {
  const contentLength = calculateContentLength(resume);
  const avgCharsPerLine = Math.floor(A4_WIDTH_PX / (fontSize * 0.6)); // Rough character width estimation
  const totalLines = Math.ceil(contentLength / avgCharsPerLine);
  
  // Add extra lines for section spacing
  const sectionCount = 3; // Experience, Education, Other
  const extraLines = sectionCount * 2; // 2 lines per section for spacing
  
  return totalLines + extraLines;
}

/**
 * Calculate optimal font sizes based on content length
 */
export function calculateOptimalFontSizing(resume: AmericanizedResume): FontSizingConfig {
  const contentLength = calculateContentLength(resume);
  
  // Calculate base font size based on content length
  // More content = smaller font size
  let bodyFontSize = BASE_FONT_SIZE;
  
  if (contentLength > 2000) {
    bodyFontSize = Math.max(MIN_FONT_SIZE, BASE_FONT_SIZE - 2);
  } else if (contentLength > 1500) {
    bodyFontSize = Math.max(MIN_FONT_SIZE, BASE_FONT_SIZE - 1.5);
  } else if (contentLength > 1000) {
    bodyFontSize = Math.max(MIN_FONT_SIZE, BASE_FONT_SIZE - 1);
  } else if (contentLength > 500) {
    bodyFontSize = Math.max(MIN_FONT_SIZE, BASE_FONT_SIZE - 0.5);
  }
  
  // Calculate header font size (slightly larger than body)
  const headerFontSize = Math.min(MAX_FONT_SIZE, bodyFontSize + 1);
  
  // Calculate bullet font size (same as body or slightly smaller)
  const bulletFontSize = Math.max(MIN_FONT_SIZE, bodyFontSize - 0.5);
  
  // Calculate line height
  const lineHeight = bodyFontSize * LINE_HEIGHT_MULTIPLIER;
  
  // Calculate spacing based on font size
  const sectionSpacing = Math.max(4, SECTION_SPACING * (bodyFontSize / BASE_FONT_SIZE));
  const bulletSpacing = Math.max(1, BULLET_SPACING * (bodyFontSize / BASE_FONT_SIZE));
  
  return {
    headerFontSize: Math.round(headerFontSize * 10) / 10, // Round to 1 decimal
    bodyFontSize: Math.round(bodyFontSize * 10) / 10,
    bulletFontSize: Math.round(bulletFontSize * 10) / 10,
    lineHeight: Math.round(lineHeight * 10) / 10,
    sectionSpacing: Math.round(sectionSpacing),
    bulletSpacing: Math.round(bulletSpacing),
  };
}

/**
 * Check if content fits on A4 page with given font sizing
 */
export function doesContentFitOnPage(resume: AmericanizedResume, config: FontSizingConfig): boolean {
  const lineCount = calculateLineCount(resume, config.bodyFontSize);
  const totalHeight = lineCount * config.lineHeight;
  
  // Add some padding for margins
  const marginPadding = 40; // 20px top + 20px bottom
  
  return (totalHeight + marginPadding) <= A4_HEIGHT_PX;
}

/**
 * Get the most compact font sizing that still fits on page
 */
export function getCompactFontSizing(resume: AmericanizedResume): FontSizingConfig {
  let config = calculateOptimalFontSizing(resume);
  
  // If content doesn't fit, make it more compact
  while (!doesContentFitOnPage(resume, config) && config.bodyFontSize > MIN_FONT_SIZE) {
    config.bodyFontSize = Math.max(MIN_FONT_SIZE, config.bodyFontSize - 0.5);
    config.headerFontSize = Math.min(MAX_FONT_SIZE, config.bodyFontSize + 1);
    config.bulletFontSize = Math.max(MIN_FONT_SIZE, config.bodyFontSize - 0.5);
    config.lineHeight = config.bodyFontSize * LINE_HEIGHT_MULTIPLIER;
    config.sectionSpacing = Math.max(2, SECTION_SPACING * (config.bodyFontSize / BASE_FONT_SIZE));
    config.bulletSpacing = Math.max(1, BULLET_SPACING * (config.bodyFontSize / BASE_FONT_SIZE));
  }
  
  return config;
}
