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
            body {
              font-family: 'Times New Roman', serif;
              line-height: ${fontConfig.lineHeight}px;
              margin: 0;
              padding: 10px;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              font-size: ${fontConfig.bodyFontSize}px;
            }
            .header {
              text-align: center;
              margin-bottom: ${fontConfig.sectionSpacing}px;
              border-bottom: 1px solid #333;
              padding-bottom: 10px;
            }
            .name {
              font-size: ${fontConfig.headerFontSize}px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .contact {
              font-size: ${fontConfig.bodyFontSize}px;
              color: #666;
            }
            .section {
              margin-bottom: ${fontConfig.sectionSpacing}px;
            }
            .section-title {
              font-size: ${fontConfig.bodyFontSize}px;
              font-weight: bold;
              margin-bottom: 8px;
              border-bottom: 1px solid #ccc;
              padding-bottom: 2px;
            }
            .work-item, .education-item {
              margin-bottom: ${fontConfig.sectionSpacing}px;
            }
            .job-title {
              font-weight: bold;
              font-size: ${fontConfig.bodyFontSize}px;
            }
            .company {
              font-weight: bold;
              color: #333;
              font-size: ${fontConfig.bodyFontSize}px;
            }
            .dates {
              font-style: italic;
              color: #666;
              float: right;
              font-size: ${fontConfig.bodyFontSize}px;
            }
            .location {
              color: #666;
              font-size: ${fontConfig.bodyFontSize}px;
            }
            .bullets {
              margin-top: 5px;
              padding-left: 0;
              list-style: none;
            }
            .bullets li {
              margin-bottom: ${fontConfig.bulletSpacing}px;
              font-size: ${fontConfig.bulletFontSize}px;
              line-height: ${fontConfig.lineHeight}px;
            }
            .bullets li:before {
              content: "• ";
              margin-right: 5px;
            }
            .summary {
              font-style: italic;
              margin-bottom: ${fontConfig.sectionSpacing}px;
              font-size: ${fontConfig.bodyFontSize}px;
            }
            .skills {
              display: flex;
              flex-wrap: wrap;
              gap: 5px;
            }
            .skill-tag {
              background: #f0f0f0;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: ${fontConfig.bulletFontSize}px;
            }
            .watermark {
              position: fixed;
              bottom: 10px;
              right: 10px;
              color: #ccc;
              font-size: 10px;
              opacity: 0.7;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 5px;
              }
              .watermark { position: fixed; }
              .section {
                margin-bottom: ${fontConfig.sectionSpacing}px;
              }
              .work-item, .education-item {
                margin-bottom: ${fontConfig.sectionSpacing}px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="name">${resume.personal_info.name}</div>
            <div class="contact">
              ${resume.personal_info.email} | ${resume.personal_info.phone} | ${resume.personal_info.location}
              ${resume.personal_info.linkedin ? `<br>LinkedIn: ${resume.personal_info.linkedin}` : ''}
            </div>
          </div>

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
                <div class="job-title">
                  ${work.position}
                  <span class="dates">${formatDate(work.startDate)} - ${work.current ? 'Present' : formatDate(work.endDate)}</span>
                </div>
                <div class="company">${work.company}</div>
                <div class="location">${work.location}</div>
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
                <div class="job-title">
                  ${edu.degree} in ${edu.field}
                  <span class="dates">${formatDate(edu.graduationDate)}</span>
                </div>
                <div class="company">${edu.institution}</div>
                <div class="location">${edu.location}</div>
                ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
              </div>
            `).join('')}
          </div>

          ${resume.skills ? `
            <div class="section">
              <div class="section-title">Skills</div>
              <div class="skills">
                ${resume.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          ${resume.other.map(other => `
            <div class="section">
              <div class="section-title">${other.title}</div>
              <ul class="bullets">
                ${other.items.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>
          `).join('')}

          <div class="watermark">Created by ResumeBuild</div>
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
