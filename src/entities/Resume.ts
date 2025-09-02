export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

export interface OtherSection {
  id: string;
  title: string;
  items: string[];
}

export interface Resume {
  personal_info: PersonalInfo;
  work_experience: WorkExperience[];
  education: Education[];
  other: OtherSection[];
}

export interface AmericanizedResume extends Resume {
  // Additional fields for the transformed resume
  summary?: string;
  skills?: string[];
}

export type ResumeSection = "personal_info" | "work_experience" | "education" | "other";

export interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "processing" | "completed" | "error";
}
