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
        <html>
        <head>
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
            .header {
              text-align: center;
              margin-bottom: ${fontConfig.sectionSpacing}px;
              border-bottom: 1px solid #333;
              padding-bottom: ${fontConfig.sectionSpacing / 2}px;
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
            
            <div class="watermark">Created by ResumeBuild | Font: ${fontConfig.bodyFontSize}px</div>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then print
      setTimeout(() => {
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
