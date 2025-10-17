"use client";

import { useState, useMemo } from "react";
import { AmericanizedResume } from "../../entities/Resume";
import SectionEditor from "./SectionEditor";
import PDFExportButton from "./PDFExportButton";
import WordExportButton from "./WordExportButton";
import { getCompactFontSizing, FontSizingConfig } from "../../utils/fontSizing";

interface ResumeEditorProps {
  resume: AmericanizedResume;
  onResumeUpdate: (resume: AmericanizedResume) => void;
}

export default function ResumeEditor({
  resume,
  onResumeUpdate,
}: ResumeEditorProps) {
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "personal_info",
    "summary",
    "education",
    "work_experience",
    "skills",
    "other",
  ]);

  // Calculate optimal font sizing for PDF export (not for editor display)
  const pdfFontConfig: FontSizingConfig = useMemo(() => {
    const config = getCompactFontSizing(resume);
    console.log("📄 PDF Font Config:", config);
    console.log("📊 Resume stats:", {
      workExperience: resume.work_experience?.length || 0,
      totalBullets:
        resume.work_experience?.reduce(
          (acc, exp) => acc + (exp.bullets?.length || 0),
          0
        ) || 0,
      education: resume.education?.length || 0,
      skills: resume.skills?.length || 0,
      otherSections: resume.other?.length || 0,
    });
    return config;
  }, [resume]);

  // Editor display font config (comfortable, readable size)
  const editorFontConfig: FontSizingConfig = {
    headerFontSize: 16,
    bodyFontSize: 14,
    bulletFontSize: 13,
    lineHeight: 18,
    sectionSpacing: 12,
    bulletSpacing: 4,
  };

  // Ensure all required arrays exist with default empty arrays
  const safeResume = {
    personal_info: resume?.personal_info || {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
    },
    professional_summary: resume?.summary || "",
    work_experience: resume?.work_experience || [],
    education: resume?.education || [],
    technical_skills: resume?.skills || [],
    other: resume?.other || [],
  };

  const handleSectionUpdate = (sectionType: string, data: any) => {
    const updatedResume = {
      ...safeResume,
      [sectionType]: data,
    };
    onResumeUpdate(updatedResume);
  };

  const handleSectionDelete = (sectionType: string, index: number) => {
    const updatedResume = { ...safeResume };
    if (sectionType === "work_experience") {
      updatedResume.work_experience = updatedResume.work_experience.filter(
        (_, i) => i !== index
      );
    } else if (sectionType === "education") {
      updatedResume.education = updatedResume.education.filter(
        (_, i) => i !== index
      );
    } else if (sectionType === "other") {
      updatedResume.other = updatedResume.other.filter((_, i) => i !== index);
    }
    onResumeUpdate(updatedResume);
  };

  const toggleSectionOrder = () => {
    const newOrder = [...sectionOrder];
    const educationIndex = newOrder.indexOf("education");
    const experienceIndex = newOrder.indexOf("work_experience");

    if (educationIndex !== -1 && experienceIndex !== -1) {
      [newOrder[educationIndex], newOrder[experienceIndex]] = [
        newOrder[experienceIndex],
        newOrder[educationIndex],
      ];
      setSectionOrder(newOrder);
    }
  };

  const renderSection = (sectionType: string) => {
    switch (sectionType) {
      case "summary":
        return (
          <div key="summary" className="relative">
            <SectionEditor
              type="summary"
              data={safeResume.professional_summary}
              onUpdate={(data) =>
                handleSectionUpdate("professional_summary", data)
              }
              fontConfig={editorFontConfig}
            />
          </div>
        );
      case "work_experience":
        return safeResume.work_experience.map(
          (experience: any, index: number) => (
            <div key={`work-${index}`} className="relative">
              <SectionEditor
                type="work_experience"
                data={experience}
                onUpdate={(data) => {
                  const updatedExperience = [...safeResume.work_experience];
                  updatedExperience[index] = data;
                  handleSectionUpdate("work_experience", updatedExperience);
                }}
                onDelete={() => handleSectionDelete("work_experience", index)}
                fontConfig={editorFontConfig}
              />
            </div>
          )
        );
      case "education":
        return safeResume.education.map((edu: any, index: number) => (
          <div key={`edu-${index}`} className="relative">
            <SectionEditor
              type="education"
              data={edu}
              onUpdate={(data) => {
                const updatedEducation = [...safeResume.education];
                updatedEducation[index] = data;
                handleSectionUpdate("education", updatedEducation);
              }}
              onDelete={() => handleSectionDelete("education", index)}
              fontConfig={editorFontConfig}
            />
          </div>
        ));
      case "skills":
        return (
          <div key="skills" className="relative">
            <div className="mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
                Additional Information
              </h3>
              <div className="pl-4">
                <SectionEditor
                  type="skills"
                  data={safeResume.technical_skills}
                  onUpdate={(data) => handleSectionUpdate("technical_skills", data)}
                  fontConfig={editorFontConfig}
                />
              </div>
            </div>
          </div>
        );
      case "other":
        return (
          <div key="other" className="relative">
            <div className="pl-4">
              {safeResume.other.map((other: any, index: number) => (
                <div key={`other-${index}`} className="relative">
                  <SectionEditor
                    type="other"
                    data={other}
                    onUpdate={(data) => {
                      const updatedOther = [...safeResume.other];
                      updatedOther[index] = data;
                      handleSectionUpdate("other", updatedOther);
                    }}
                    onDelete={() => handleSectionDelete("other", index)}
                    fontConfig={editorFontConfig}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6 max-w-4xl mx-auto">
        {/* Header with controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Resume Editor</h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <div className="flex space-x-2">
              <button
                onClick={toggleSectionOrder}
                className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium ${
                  sectionOrder[2] === "education"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <span className="hidden sm:inline">Education First</span>
                <span className="sm:hidden">Edu First</span>
              </button>
              <button
                onClick={toggleSectionOrder}
                className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium ${
                  sectionOrder[2] === "work_experience"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <span className="hidden sm:inline">Experience First</span>
                <span className="sm:hidden">Exp First</span>
              </button>
            </div>
            <div className="flex space-x-2">
              <WordExportButton resume={resume} />
              <PDFExportButton resume={resume} fontConfig={pdfFontConfig} />
            </div>
          </div>
        </div>

        {/* Resume content - comfortable size for editing */}
        <div className="space-y-3">
          {/* Personal Info - comfortable header */}
          <div className="relative">
            <SectionEditor
              type="personal_info"
              data={safeResume.personal_info}
              onUpdate={(data) => handleSectionUpdate("personal_info", data)}
              fontConfig={editorFontConfig}
            />
          </div>

          {/* Render sections in order */}
          {sectionOrder
            .slice(1)
            .map((sectionType) => renderSection(sectionType))}
        </div>
      </div>
    </div>
  );
}
