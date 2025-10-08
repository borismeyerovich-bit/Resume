"use client";

import { useState } from "react";
import { AmericanizedResume } from "../../entities/Resume";
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  UnderlineType,
  convertInchesToTwip
} from "docx";
import { saveAs } from "file-saver";

interface WordExportButtonProps {
  resume: AmericanizedResume;
}

export default function WordExportButton({ resume }: WordExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr;
  };

  const generateWordDocument = async () => {
    setIsExporting(true);
    
    try {
      const sections = [];

      // Header with name and contact info
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resume.personal_info.name,
              bold: true,
              size: 24, // 1.5x the bullet text size (16)
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 100,
          },
        })
      );

      const contactInfo = [
        resume.personal_info.email,
        resume.personal_info.phone,
        resume.personal_info.location,
        resume.personal_info.linkedin,
      ].filter(Boolean).join(" | ");

      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactInfo,
              size: 16, // Same as bullet text
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 200,
          },
        })
      );

      // Professional Summary
      if (resume.summary) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "PROFESSIONAL SUMMARY",
                bold: true,
                size: 16, // Same as bullet text
              }),
            ],
            spacing: {
              before: 200,
              after: 100,
            },
            border: {
              bottom: {
                color: "CCCCCC",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          })
        );

        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: resume.summary,
                size: 16, // Same as bullet text
              }),
            ],
            spacing: {
              after: 200,
            },
          })
        );
      }

      // Work Experience
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "WORK EXPERIENCE",
              bold: true,
              size: 16, // Same as bullet text
            }),
          ],
          spacing: {
            before: 200,
            after: 100,
          },
          border: {
            bottom: {
              color: "CCCCCC",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      resume.work_experience.forEach((work) => {
        // Position and Date
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: work.position,
                bold: true,
                size: 16, // Same as bullet text
              }),
              new TextRun({
                text: `\t\t${formatDate(work.startDate)} - ${work.current ? 'Present' : formatDate(work.endDate)}`,
                italics: true,
                size: 16, // Same as bullet text
              }),
            ],
            spacing: {
              before: 150,
              after: 50,
            },
          })
        );

        // Company and Location
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: work.company,
                bold: true,
                size: 16, // Same as bullet text
              }),
              new TextRun({
                text: ` | ${work.location}`,
                size: 16, // Same as bullet text
              }),
            ],
            spacing: {
              after: 50,
            },
          })
        );

        // Bullets
        work.bullets.forEach((bullet) => {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: bullet,
                  size: 16, // Base bullet text size
                }),
              ],
              bullet: {
                level: 0,
              },
              spacing: {
                after: 50,
              },
            })
          );
        });
      });

      // Education
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "EDUCATION",
              bold: true,
              size: 16, // Same as bullet text
            }),
          ],
          spacing: {
            before: 200,
            after: 100,
          },
          border: {
            bottom: {
              color: "CCCCCC",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      resume.education.forEach((edu) => {
        // Degree and Date
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`,
                bold: true,
                size: 16, // Same as bullet text
              }),
              new TextRun({
                text: `\t\t${formatDate(edu.graduationDate)}`,
                italics: true,
                size: 16, // Same as bullet text
              }),
            ],
            spacing: {
              before: 150,
              after: 50,
            },
          })
        );

        // Institution and Location
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.institution,
                bold: true,
                size: 16, // Same as bullet text
              }),
              new TextRun({
                text: ` | ${edu.location}`,
                size: 16, // Same as bullet text
              }),
            ],
            spacing: {
              after: edu.gpa ? 50 : 100,
            },
          })
        );

        // GPA if present
        if (edu.gpa) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `GPA: ${edu.gpa}`,
                  size: 16, // Same as bullet text
                }),
              ],
              spacing: {
                after: 100,
              },
            })
          );
        }
      });

      // Skills and Additional Information
      if ((resume.skills && resume.skills.length > 0) || (resume.other && resume.other.length > 0)) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "ADDITIONAL INFORMATION",
                bold: true,
                size: 16, // Same as bullet text
              }),
            ],
            spacing: {
              before: 200,
              after: 100,
            },
            border: {
              bottom: {
                color: "CCCCCC",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          })
        );

        if (resume.skills && resume.skills.length > 0) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Skills: ",
                  bold: true,
                  size: 16, // Same as bullet text
                }),
                new TextRun({
                  text: resume.skills.join(' • '),
                  size: 16, // Same as bullet text
                }),
              ],
              spacing: {
                after: 100,
              },
            })
          );
        }

        resume.other?.forEach((other) => {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: other.title,
                  bold: true,
                  size: 16, // Same as bullet text
                }),
              ],
              spacing: {
                before: 100,
                after: 50,
              },
            })
          );

          other.items.forEach((item) => {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: item,
                    size: 16, // Same as bullet text
                  }),
                ],
                bullet: {
                  level: 0,
                },
                spacing: {
                  after: 50,
                },
              })
            );
          });
        });
      }

      // Create the document
      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.5),
                right: convertInchesToTwip(0.75),
                bottom: convertInchesToTwip(0.5),
                left: convertInchesToTwip(0.75),
              },
            },
          },
          children: sections,
        }],
      });

      // Generate and save the document
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${resume.personal_info.name.replace(/\s+/g, '_')}_Resume.docx`);

      console.log('✅ Word document generated successfully');
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Error generating Word document. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={generateWordDocument}
      disabled={isExporting}
      className={`
        px-6 py-2 rounded-md font-medium transition-colors
        ${isExporting 
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
        }
      `}
    >
      {isExporting ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Generating Word...</span>
        </div>
      ) : (
        'Export Word'
      )}
    </button>
  );
}
