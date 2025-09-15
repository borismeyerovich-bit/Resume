import { AmericanizedResume } from '../entities/Resume';

// A4 page dimensions in pixels (at 96 DPI)
const A4_WIDTH_PX = 794; // 210mm
const A4_HEIGHT_PX = 1123; // 297mm

// Print margins (in pixels)
const PRINT_MARGIN_TOP = 20;
const PRINT_MARGIN_BOTTOM = 20;
const PRINT_MARGIN_HORIZONTAL = 30;
const USABLE_HEIGHT = A4_HEIGHT_PX - PRINT_MARGIN_TOP - PRINT_MARGIN_BOTTOM;
const USABLE_WIDTH = A4_WIDTH_PX - (PRINT_MARGIN_HORIZONTAL * 2);

// Font size ranges
const MIN_FONT_SIZE = 8; // Absolute minimum readable font size
const MAX_BODY_FONT_SIZE = 16; // Maximum body font size for very sparse resumes
const MAX_HEADER_SIZE = 22; // Maximum header font size
const BASE_FONT_SIZE = 11; // Base font size
const OPTIMAL_FILL_PERCENTAGE = 0.88; // Try to fill 88% of the page (more conservative)

// Line height multipliers
const LINE_HEIGHT_MULTIPLIER = 1.15; // Tighter line height
const SECTION_SPACING = 8; // pixels between sections
const BULLET_SPACING = 1; // pixels between bullets

export interface FontSizingConfig {
  headerFontSize: number;
  bodyFontSize: number;
  bulletFontSize: number;
  lineHeight: number;
  sectionSpacing: number;
  bulletSpacing: number;
}

/**
 * Calculate the total content metrics for better sizing estimation
 */
interface ContentMetrics {
  totalCharacters: number;
  bulletCount: number;
  sectionCount: number;
  workExperienceCount: number;
  educationCount: number;
}

function calculateContentMetrics(resume: AmericanizedResume): ContentMetrics {
  let totalCharacters = 0;
  let bulletCount = 0;
  let sectionCount = 0;
  let workExperienceCount = 0;
  let educationCount = 0;
  
  // Personal info (header)
  if (resume.personal_info) {
    totalCharacters += (resume.personal_info.name?.length || 0) + 50; // Header takes space
    totalCharacters += (resume.personal_info.email?.length || 0);
    totalCharacters += (resume.personal_info.phone?.length || 0);
    totalCharacters += (resume.personal_info.location?.length || 0);
    totalCharacters += (resume.personal_info.linkedin?.length || 0);
  }
  
  // Summary
  if (resume.summary) {
    totalCharacters += resume.summary.length;
    sectionCount++;
  }
  
  // Work experience
  if (resume.work_experience && resume.work_experience.length > 0) {
    sectionCount++;
    workExperienceCount = resume.work_experience.length;
    resume.work_experience.forEach(exp => {
      totalCharacters += (exp.position?.length || 0) + 20; // Title formatting
      totalCharacters += (exp.company?.length || 0) + 10;
      totalCharacters += (exp.location?.length || 0);
      totalCharacters += 20; // Date formatting
      
      if (exp.bullets) {
        bulletCount += exp.bullets.length;
        exp.bullets.forEach(bullet => {
          totalCharacters += bullet.length + 5; // Bullet point symbol
        });
      }
    });
  }
  
  // Education
  if (resume.education && resume.education.length > 0) {
    sectionCount++;
    educationCount = resume.education.length;
    resume.education.forEach(edu => {
      totalCharacters += (edu.degree?.length || 0) + 15;
      totalCharacters += (edu.institution?.length || 0) + 10;
      totalCharacters += (edu.field?.length || 0);
      totalCharacters += (edu.location?.length || 0);
      totalCharacters += 15; // Date formatting
      if (edu.gpa) totalCharacters += edu.gpa.length + 5;
    });
  }
  
  // Skills
  if (resume.skills && resume.skills.length > 0) {
    sectionCount++;
    totalCharacters += resume.skills.join(', ').length + 20;
  }
  
  // Other sections
  if (resume.other && resume.other.length > 0) {
    resume.other.forEach(other => {
      sectionCount++;
      totalCharacters += (other.title?.length || 0) + 15;
      if (other.items) {
        bulletCount += other.items.length;
        other.items.forEach(item => {
          totalCharacters += item.length + 5;
        });
      }
    });
  }
  
  return {
    totalCharacters,
    bulletCount,
    sectionCount,
    workExperienceCount,
    educationCount
  };
}

/**
 * Estimate the height in pixels that the resume content will occupy
 */
function estimateContentHeight(resume: AmericanizedResume, config: FontSizingConfig): number {
  let totalHeight = 0;
  
  // More accurate character-per-line calculation based on font size
  // Times New Roman has ~0.5 width/height ratio
  const charsPerLine = Math.floor((A4_WIDTH_PX - 60) / (config.bodyFontSize * 0.5));
  const bulletCharsPerLine = Math.floor((A4_WIDTH_PX - 70) / (config.bulletFontSize * 0.5));
  
  // Header section (name, contact info)
  totalHeight += 20; // Name line with larger font
  totalHeight += config.bodyFontSize + 2; // Contact info line
  totalHeight += 8; // Border and padding
  
  // Summary section
  if (resume.summary && resume.summary.length > 0) {
    totalHeight += config.sectionSpacing;
    totalHeight += config.bodyFontSize + 2; // Section title
    const summaryLines = Math.ceil(resume.summary.length / charsPerLine);
    totalHeight += summaryLines * config.lineHeight;
  }
  
  // Work Experience section
  if (resume.work_experience && resume.work_experience.length > 0) {
    totalHeight += config.sectionSpacing;
    totalHeight += config.bodyFontSize + 2; // Section title
    
    resume.work_experience.forEach((exp, index) => {
      if (index > 0) totalHeight += config.sectionSpacing * 0.7; // Space between jobs
      
      totalHeight += config.bodyFontSize + 1; // Position line
      totalHeight += config.bodyFontSize; // Company + location line
      
      if (exp.bullets && exp.bullets.length > 0) {
        totalHeight += 2; // Small gap before bullets
        exp.bullets.forEach(bullet => {
          const bulletLines = Math.ceil((bullet.length + 3) / bulletCharsPerLine); // +3 for bullet symbol
          totalHeight += bulletLines * config.lineHeight * 0.9 + config.bulletSpacing;
        });
      }
    });
  }
  
  // Education section
  if (resume.education && resume.education.length > 0) {
    totalHeight += config.sectionSpacing;
    totalHeight += config.bodyFontSize + 2; // Section title
    
    resume.education.forEach((edu, index) => {
      if (index > 0) totalHeight += config.sectionSpacing * 0.5;
      
      totalHeight += config.bodyFontSize + 1; // Degree line
      totalHeight += config.bodyFontSize; // Institution + location line
      if (edu.gpa) totalHeight += config.bodyFontSize - 1; // GPA line
    });
  }
  
  // Skills section
  if (resume.skills && resume.skills.length > 0) {
    totalHeight += config.sectionSpacing;
    totalHeight += config.bodyFontSize + 2; // Section title
    const skillsText = resume.skills.join(' • ');
    const skillsLines = Math.ceil(skillsText.length / charsPerLine);
    totalHeight += skillsLines * config.lineHeight * 0.9;
  }
  
  // Other sections
  if (resume.other && resume.other.length > 0) {
    resume.other.forEach(section => {
      totalHeight += config.sectionSpacing;
      totalHeight += config.bodyFontSize + 2; // Section title
      
      if (section.items && section.items.length > 0) {
        section.items.forEach(item => {
          const itemLines = Math.ceil((item.length + 3) / bulletCharsPerLine);
          totalHeight += itemLines * config.lineHeight * 0.9 + config.bulletSpacing;
        });
      }
    });
  }
  
  // Add watermark space and bottom margin
  totalHeight += 15;
  
  console.log('📐 Estimated height:', totalHeight, 'px / Max:', USABLE_HEIGHT, 'px');
  
  return totalHeight;
}

/**
 * Calculate optimal font sizes based on content to fit on single page
 */
export function calculateOptimalFontSizing(resume: AmericanizedResume): FontSizingConfig {
  const metrics = calculateContentMetrics(resume);
  
  // Start with reasonable defaults based on content volume
  let bodyFontSize = BASE_FONT_SIZE;
  
  // Aggressive scaling based on content metrics
  if (metrics.totalCharacters > 5000 || metrics.bulletCount > 25) {
    bodyFontSize = 7;
  } else if (metrics.totalCharacters > 4000 || metrics.bulletCount > 20) {
    bodyFontSize = 8;
  } else if (metrics.totalCharacters > 3000 || metrics.bulletCount > 15) {
    bodyFontSize = 9;
  } else if (metrics.totalCharacters > 2000 || metrics.bulletCount > 10) {
    bodyFontSize = 10;
  } else {
    bodyFontSize = 11;
  }
  
  // Very dense resumes need extreme compression
  if (metrics.workExperienceCount > 5) {
    bodyFontSize = Math.min(bodyFontSize, 8);
  }
  
  // Calculate related sizes
  const headerFontSize = Math.min(bodyFontSize + 2, MAX_HEADER_SIZE);
  const bulletFontSize = bodyFontSize - 0.5;
  const lineHeight = bodyFontSize * LINE_HEIGHT_MULTIPLIER;
  
  // Adjust spacing based on font size
  const sectionSpacing = Math.max(3, Math.floor(SECTION_SPACING * (bodyFontSize / BASE_FONT_SIZE)));
  const bulletSpacing = Math.max(0.5, BULLET_SPACING * (bodyFontSize / BASE_FONT_SIZE));
  
  return {
    headerFontSize: Math.round(headerFontSize * 10) / 10,
    bodyFontSize: Math.round(bodyFontSize * 10) / 10,
    bulletFontSize: Math.round(bulletFontSize * 10) / 10,
    lineHeight: Math.round(lineHeight * 10) / 10,
    sectionSpacing: Math.round(sectionSpacing),
    bulletSpacing: Math.round(bulletSpacing),
  };
}

/**
 * Get optimal font sizing that fills the entire page
 */
export function getCompactFontSizing(resume: AmericanizedResume): FontSizingConfig {
  const targetHeight = USABLE_HEIGHT * OPTIMAL_FILL_PERCENTAGE; // Target 95% of page height
  
  // Start with a reasonable base configuration
  let config: FontSizingConfig = {
    headerFontSize: 12,
    bodyFontSize: 11,
    bulletFontSize: 10.5,
    lineHeight: 13,
    sectionSpacing: 10,
    bulletSpacing: 2,
  };
  
  let estimatedHeight = estimateContentHeight(resume, config);
  let iterations = 0;
  const maxIterations = 30;
  
  console.log('📏 Target height:', targetHeight, 'px (95% of', USABLE_HEIGHT, 'px)');
  console.log('🎯 Initial height:', estimatedHeight, 'px with font:', config.bodyFontSize, 'px');
  
  // Binary search approach for better convergence
  let minFont = MIN_FONT_SIZE;
  let maxFont = MAX_BODY_FONT_SIZE;
  let bestConfig = { ...config };
  let bestDifference = Math.abs(estimatedHeight - targetHeight);
  
  while (iterations < maxIterations && Math.abs(estimatedHeight - targetHeight) > 30) {
    iterations++;
    
    if (estimatedHeight > targetHeight) {
      // Content is too tall, reduce font size
      maxFont = config.bodyFontSize;
      config.bodyFontSize = (minFont + config.bodyFontSize) / 2;
    } else {
      // Content is too short, increase font size
      minFont = config.bodyFontSize;
      config.bodyFontSize = (maxFont + config.bodyFontSize) / 2;
    }
    
    // Adjust related sizes proportionally
    config.headerFontSize = Math.min(MAX_HEADER_SIZE, config.bodyFontSize + 3);
    config.bulletFontSize = config.bodyFontSize - 0.5;
    config.lineHeight = config.bodyFontSize * 1.25; // Slightly more generous line height
    config.sectionSpacing = Math.max(6, Math.floor(config.bodyFontSize * 1.2)); // More section spacing
    config.bulletSpacing = Math.max(1, Math.floor(config.bodyFontSize * 0.2));
    
    // Recalculate height
    estimatedHeight = estimateContentHeight(resume, config);
    
    // Track best configuration (prioritize staying under the page limit)
    const currentDifference = Math.abs(estimatedHeight - targetHeight);
    if (estimatedHeight <= USABLE_HEIGHT && (currentDifference < bestDifference || bestConfig.bodyFontSize === config.bodyFontSize)) {
      bestConfig = { ...config };
      bestDifference = currentDifference;
    }
    
    console.log(`🔄 Iteration ${iterations}: Font ${config.bodyFontSize.toFixed(1)}px → Height ${estimatedHeight}px (target: ${targetHeight}px, max: ${USABLE_HEIGHT}px)`);
    
    // Stop if we're close enough
    if (Math.abs(maxFont - minFont) < 0.1) {
      break;
    }
  }
  
  // Safety check: If bestConfig still overflows, force it down
  let finalHeight = estimateContentHeight(resume, bestConfig);
  if (finalHeight > USABLE_HEIGHT) {
    console.log('⚠️ Content still overflows, applying emergency reduction');
    let emergencyIterations = 0;
    while (finalHeight > USABLE_HEIGHT && bestConfig.bodyFontSize > MIN_FONT_SIZE && emergencyIterations < 10) {
      bestConfig.bodyFontSize = Math.max(MIN_FONT_SIZE, bestConfig.bodyFontSize - 0.5);
      bestConfig.headerFontSize = Math.min(MAX_HEADER_SIZE, bestConfig.bodyFontSize + 2);
      bestConfig.bulletFontSize = bestConfig.bodyFontSize - 0.5;
      bestConfig.lineHeight = bestConfig.bodyFontSize * 1.1; // Tighter lines
      bestConfig.sectionSpacing = Math.max(3, bestConfig.sectionSpacing - 1);
      bestConfig.bulletSpacing = Math.max(0.5, bestConfig.bulletSpacing - 0.5);
      
      finalHeight = estimateContentHeight(resume, bestConfig);
      emergencyIterations++;
      console.log(`🚨 Emergency ${emergencyIterations}: Font ${bestConfig.bodyFontSize}px → Height ${finalHeight}px`);
    }
  }
  
  // Use the best configuration found, but ensure it fits
  config = bestConfig;
  finalHeight = estimateContentHeight(resume, config);
  
  // Round all values for cleaner CSS
  config = {
    headerFontSize: Math.round(config.headerFontSize * 10) / 10,
    bodyFontSize: Math.round(config.bodyFontSize * 10) / 10,
    bulletFontSize: Math.round(config.bulletFontSize * 10) / 10,
    lineHeight: Math.round(config.lineHeight * 10) / 10,
    sectionSpacing: Math.round(config.sectionSpacing),
    bulletSpacing: Math.round(config.bulletSpacing * 10) / 10,
  };
  
  finalHeight = estimateContentHeight(resume, config);
  const fillPercentage = (finalHeight / USABLE_HEIGHT * 100).toFixed(1);
  
  console.log('✅ Final config:', config);
  console.log(`📊 Page fill: ${fillPercentage}% (${finalHeight}px of ${USABLE_HEIGHT}px)`);
  
  // Final safety check - warn if still overflowing
  if (finalHeight > USABLE_HEIGHT) {
    console.error(`🚨 WARNING: Content still overflows by ${(finalHeight - USABLE_HEIGHT).toFixed(0)}px!`);
  }
  
  return config;
}
