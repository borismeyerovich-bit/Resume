"use client";

import { useState } from "react";
import { AmericanizedResume } from "../../entities/Resume";
import { FontSizingConfig } from "../../utils/fontSizing";

interface PDFExportButtonProps {
  resume: AmericanizedResume;
  fontConfig: FontSizingConfig;
}

export default function PDFExportButton({ resume, fontConfig }: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    // Simple date formatting - can be enhanced
    return dateStr;
  };

  const generatePDF = async () => {
    setIsExporting(true);
    
    // Log the font config being used
    console.log('🖨️ Generating PDF with font config:', fontConfig);
    
    try {
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to generate PDF');
        return;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Resume - ${resume.personal_info.name}</title>
          <style>
            @page {
              size: A4;
              margin: 10mm 15mm;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            html {
              height: 297mm;
              width: 210mm;
              margin: 0;
              padding: 0;
            }
            
            body {
              font-family: 'Times New Roman', serif;
              line-height: ${fontConfig.lineHeight}px !important;
              margin: 0;
              padding: 0;
              color: #000;
              width: 210mm;
              height: 297mm;
              font-size: ${fontConfig.bodyFontSize}px !important;
              overflow: hidden;
              page-break-after: avoid;
              page-break-before: avoid;
            }
            
            /* Ensure no extra titles or headers appear */
            @page {
              margin: 0;
            }
            
            /* Hide any browser-added content */
            @media print {
              body::before,
              body::after {
                display: none !important;
                content: none !important;
              }
            }
            
            /* Completely prevent any extra titles or headers */
            .resume-container::before,
            .resume-container::after,
            .header::before,
            .header::after {
              display: none !important;
              content: none !important;
            }
            
            .resume-container {
              padding: 8px 12px;
              height: 297mm;
              width: 210mm;
              display: flex;
              flex-direction: column;
              overflow: hidden;
              position: relative;
            }
            
            .content-area {
              flex: 1;
              overflow: hidden;
              max-height: calc(297mm - 30px);
            }
            
            /* Ensure only the intended header content shows */
            .header {
              text-align: center;
              margin-bottom: ${fontConfig.sectionSpacing}px;
              border-bottom: 1px solid #333;
              padding-bottom: ${fontConfig.sectionSpacing / 2}px;
              position: relative;
            }
            
            /* Remove any pseudo-elements that might add content */
            .header::before,
            .header::after {
              display: none !important;
              content: none !important;
            }
            
            /* Ensure header contains only the intended content */
            .header > *:not(.name):not(.contact) {
              display: none !important;
            }
            
            /* Additional safety: hide any element that might contain unwanted text */
            .header *:not(.name):not(.contact) {
              display: none !important;
            }
            
            /* Hide any text nodes that might contain unwanted content */
            .header {
              font-size: ${fontConfig.bodyFontSize}px !important;
            }
            
            /* Ensure no extra spacing or content */
            .header > * {
              margin: 0;
              padding: 0;
            }
            
            /* Restore bullet points - ensure they're visible */
            .bullets {
              margin-top: 2px;
              padding-left: 0;
              list-style: none;
              display: block !important;
            }
            
            .bullets li {
              margin-bottom: ${fontConfig.bulletSpacing}px;
              font-size: ${fontConfig.bulletFontSize}px !important;
              line-height: ${fontConfig.lineHeight}px !important;
              padding-left: 10px;
              position: relative;
              display: list-item !important;
            }
            
            .bullets li:before {
              content: "•";
              position: absolute;
              left: 0;
              display: inline !important;
            }
            
            .name {
              font-size: ${fontConfig.headerFontSize + 6}px !important;
              font-weight: bold;
              margin-bottom: 4px;
              letter-spacing: 0.5px;
            }
            .contact {
              font-size: ${fontConfig.bodyFontSize - 0.5}px !important;
              color: #444;
            }
            .section {
              margin-bottom: ${fontConfig.sectionSpacing}px;
            }
            .section-title {
              font-size: ${fontConfig.bodyFontSize + 0.5}px !important;
              font-weight: bold;
              margin-bottom: ${fontConfig.sectionSpacing / 2}px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 1px;
              text-transform: uppercase;
            }
            .work-item, .education-item {
              margin-bottom: ${fontConfig.sectionSpacing * 0.7}px;
            }
            .job-title {
              font-weight: bold;
              font-size: ${fontConfig.bodyFontSize}px !important;
              margin-bottom: 1px;
            }
            .company {
              font-weight: bold;
              color: #222;
              font-size: ${fontConfig.bodyFontSize}px !important;
              display: inline;
            }
            .dates {
              font-style: italic;
              color: #555;
              float: right;
              font-size: ${fontConfig.bodyFontSize - 0.5}px !important;
            }
            .location {
              color: #555;
              font-size: ${fontConfig.bodyFontSize - 0.5}px !important;
              display: inline;
              margin-left: 5px;
            }
            .bullets {
              margin-top: 2px;
              padding-left: 0;
              list-style: none;
            }
            .bullets li {
              margin-bottom: ${fontConfig.bulletSpacing}px;
              font-size: ${fontConfig.bulletFontSize}px !important;
              line-height: ${fontConfig.lineHeight}px !important;
              padding-left: 10px;
              position: relative;
            }
            .bullets li:before {
              content: "•";
              position: absolute;
              left: 0;
            }
            .summary {
              font-style: italic;
              margin-bottom: ${fontConfig.sectionSpacing}px;
              font-size: ${fontConfig.bodyFontSize - 0.5}px !important;
              line-height: ${fontConfig.lineHeight}px !important;
            }
            .skills {
              font-size: ${fontConfig.bulletFontSize}px !important;
              line-height: ${fontConfig.lineHeight}px !important;
            }
            
            .subsection {
              margin-bottom: ${fontConfig.sectionSpacing / 2}px;
            }
            
            .subsection-title {
              font-weight: bold;
              font-size: ${fontConfig.bodyFontSize}px !important;
              margin-bottom: 4px;
              color: #333;
            }
            .watermark {
              position: absolute;
              bottom: 5px;
              right: 10px;
              color: #ccc;
              font-size: 8px;
              opacity: 0.6;
            }
            @media print {
              @page {
                size: A4;
                margin: 10mm;
              }
              
              /* Prevent browser default headers/footers */
              @page {
                margin: 10mm;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              
              /* Hide any browser-added content */
              body::before,
              body::after {
                display: none !important;
                content: none !important;
              }
              
              /* Prevent browser default print headers */
              @page :first {
                margin-top: 0 !important;
              }
              
              /* Force hide any extra content */
              *::before,
              *::after {
                content: none !important;
              }
              
              body { 
                margin: 0; 
                padding: 0;
                width: 100%;
                height: 100%;
              }
              .resume-container {
                padding: 0;
              }
              .watermark { 
                position: fixed;
                bottom: 10mm;
                right: 15mm;
              }
              .section {
                page-break-inside: avoid;
              }
              .work-item, .education-item {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            <div class="header">
              <div class="name">${resume.personal_info.name}</div>
              <div class="contact">
                ${resume.personal_info.email} | ${resume.personal_info.phone} | ${resume.personal_info.location}
                ${resume.personal_info.linkedin ? ` | ${resume.personal_info.linkedin}` : ''}
              </div>
              <!-- Debug: Font ${fontConfig.bodyFontSize}px -->
            </div>
            
            <div class="content-area">

          ${resume.summary ? `
            <div class="section">
              <div class="section-title">Professional Summary</div>
              <div class="summary">${resume.summary}</div>
            </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Work Experience</div>
            ${resume.work_experience.map(work => `
              <div class="work-item">
                <div>
                  <span class="dates">${formatDate(work.startDate)} - ${work.current ? 'Present' : formatDate(work.endDate)}</span>
                  <div class="job-title">${work.position}</div>
                </div>
                <div>
                  <span class="company">${work.company}</span>
                  <span class="location">${work.location}</span>
                </div>
                <ul class="bullets">
                  ${work.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <div class="section-title">Education</div>
            ${resume.education.map(edu => `
              <div class="education-item">
                <div>
                  <span class="dates">${formatDate(edu.graduationDate)}</span>
                  <div class="job-title">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
                </div>
                <div>
                  <span class="company">${edu.institution}</span>
                  <span class="location">${edu.location}</span>
                </div>
                ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
              </div>
            `).join('')}
          </div>

          ${(resume.skills && resume.skills.length > 0) || (resume.other && resume.other.length > 0) ? `
            <div class="section">
              <div class="section-title">Additional Information</div>
              
              ${resume.skills && resume.skills.length > 0 ? `
                <div class="subsection">
                  <div class="subsection-title">Skills</div>
                  <div class="skills">${resume.skills.join(' • ')}</div>
                </div>
              ` : ''}
              
              ${resume.other.map(other => `
                <div class="subsection">
                  <div class="subsection-title">${other.title}</div>
                  <ul class="bullets">
                    ${other.items.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          ` : ''}

            </div>
            
            <div class="watermark">Font: ${fontConfig.bodyFontSize}px</div>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then clean up and print
      setTimeout(() => {
        // Actively remove any unwanted content that might have appeared
        try {
          const header = printWindow.document.querySelector('.header');
          if (header) {
            // Remove any text nodes that aren't the name or contact
            const walker = printWindow.document.createTreeWalker(
              header,
              NodeFilter.SHOW_TEXT
            );
            
            let node;
            while (node = walker.nextNode()) {
              const text = node.textContent?.trim();
              if (text && !text.includes(resume.personal_info.name) && 
                  !text.includes(resume.personal_info.email) &&
                  !text.includes(resume.personal_info.phone) &&
                  !text.includes(resume.personal_info.location)) {
                // This might be unwanted content, remove the parent element if it's not name or contact
                const parent = node.parentElement;
                if (parent && !parent.classList.contains('name') && !parent.classList.contains('contact')) {
                  parent.remove();
                }
              }
            }
          }
        } catch (error) {
          console.log('Cleanup error (non-critical):', error);
        }
        
        printWindow.print();
        printWindow.close();
      }, 500);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isExporting}
      className={`
        px-6 py-2 rounded-md font-medium transition-colors
        ${isExporting 
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
          : 'bg-green-600 text-white hover:bg-green-700'
        }
      `}
    >
      {isExporting ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Generating PDF...</span>
        </div>
      ) : (
        'Export PDF'
      )}
    </button>
  );
}
