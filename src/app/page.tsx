"use client";

import { useState, useEffect } from "react";
import { AmericanizedResume } from "../entities/Resume";
import ResumeEditor from "../components/resume/ResumeEditor";

// Very minimal resume (for testing maximum font scaling UP)
const MINIMAL_MOCK_RESUME: AmericanizedResume = {
  personal_info: {
    name: "Alex Johnson",
    email: "alex@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
  },
  summary: "",
  work_experience: [
    {
      id: "1",
      company: "Google",
      position: "Senior Software Engineer",
      location: "Mountain View, CA",
      startDate: "01/2022",
      endDate: "Present",
      current: true,
      bullets: [
        "Led development of core search features",
        "Managed team of 8 engineers",
        "Improved system performance by 40%",
      ],
    },
  ],
  education: [
    {
      id: "1",
      institution: "MIT",
      degree: "BS Computer Science",
      field: "",
      location: "Cambridge, MA",
      graduationDate: "2021",
    },
  ],
  skills: ["Python", "Go", "Kubernetes"],
  other: [],
};

// Simple resume with minimal content (for testing font scaling UP)
const SIMPLE_MOCK_RESUME: AmericanizedResume = {
  personal_info: {
    name: "Jane Doe",
    email: "jane.doe@email.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
  },
  summary:
    "Software engineer with 3 years of experience building web applications.",
  work_experience: [
    {
      id: "1",
      company: "Tech Startup",
      position: "Software Engineer",
      location: "New York, NY",
      startDate: "01/2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Developed features for React-based web application",
        "Collaborated with team of 5 engineers",
        "Improved application performance by 30%",
      ],
    },
    {
      id: "2",
      company: "Web Agency",
      position: "Junior Developer",
      location: "New York, NY",
      startDate: "06/2020",
      endDate: "12/2020",
      current: false,
      bullets: [
        "Built responsive websites for clients",
        "Learned modern web development practices",
      ],
    },
  ],
  education: [
    {
      id: "1",
      institution: "State University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "New York, NY",
      graduationDate: "2020",
    },
  ],
  skills: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
  other: [],
};

// Super dense resume with 6 jobs (for testing extreme font scaling DOWN)
const SUPER_DENSE_RESUME: AmericanizedResume = {
  personal_info: {
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 555-5555",
    location: "Seattle, WA",
    linkedin: "linkedin.com/in/sarahchen",
  },
  summary:
    "Accomplished full-stack engineer with 12+ years building enterprise-scale applications across multiple industries. Expert in cloud architecture, team leadership, and agile development methodologies.",
  work_experience: [
    {
      id: "1",
      company: "Amazon Web Services",
      position: "Principal Software Engineer",
      location: "Seattle, WA",
      startDate: "03/2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Led architecture design for distributed systems serving 50M+ requests daily",
        "Managed cross-functional team of 12 engineers across 3 time zones",
        "Implemented cost optimization strategies reducing infrastructure spend by $2M annually",
        "Designed fault-tolerant microservices architecture with 99.99% uptime SLA",
        "Established engineering best practices adopted across 5 product teams",
        "Mentored 15+ senior engineers and conducted 100+ technical interviews",
      ],
    },
    {
      id: "2",
      company: "Microsoft Corporation",
      position: "Senior Software Development Engineer",
      location: "Redmond, WA",
      startDate: "08/2018",
      endDate: "02/2021",
      current: false,
      bullets: [
        "Built real-time collaboration features for Microsoft Teams used by 250M+ users",
        "Optimized video conferencing algorithms reducing bandwidth usage by 45%",
        "Led migration of legacy .NET services to modern cloud-native architecture",
        "Implemented machine learning models improving user engagement by 30%",
        "Collaborated with product managers to define technical roadmap",
        "Established code review processes improving code quality metrics by 60%",
      ],
    },
    {
      id: "3",
      company: "Uber Technologies",
      position: "Software Engineer II",
      location: "San Francisco, CA",
      startDate: "01/2016",
      endDate: "07/2018",
      current: false,
      bullets: [
        "Developed rider-driver matching algorithms processing 15M+ rides daily",
        "Built real-time pricing engine handling dynamic surge calculations",
        "Implemented fraud detection system reducing fraudulent transactions by 80%",
        "Optimized database performance handling 100TB+ of location data",
        "Created monitoring dashboards improving incident response time by 50%",
      ],
    },
    {
      id: "4",
      company: "Airbnb Inc.",
      position: "Software Engineer",
      location: "San Francisco, CA",
      startDate: "05/2014",
      endDate: "12/2015",
      current: false,
      bullets: [
        "Built search and discovery features for 4M+ property listings",
        "Implemented internationalization supporting 62 languages and currencies",
        "Developed host onboarding flow increasing conversion rate by 25%",
        "Created automated testing framework reducing QA cycle time by 40%",
        "Optimized image processing pipeline handling 500K+ photos daily",
      ],
    },
    {
      id: "5",
      company: "Twitter Inc.",
      position: "Junior Software Engineer",
      location: "San Francisco, CA",
      startDate: "08/2012",
      endDate: "04/2014",
      current: false,
      bullets: [
        "Developed timeline algorithms serving 300M+ daily active users",
        "Built content moderation tools processing 500M+ tweets daily",
        "Implemented real-time notifications system with sub-second latency",
        "Created analytics dashboard for internal business intelligence",
        "Contributed to open source projects with 10K+ stars on GitHub",
      ],
    },
    {
      id: "6",
      company: "Facebook (Meta)",
      position: "Software Engineering Intern",
      location: "Menlo Park, CA",
      startDate: "06/2011",
      endDate: "08/2011",
      current: false,
      bullets: [
        "Developed News Feed ranking algorithms improving user engagement",
        "Built internal tools for data analysis and performance monitoring",
        "Optimized mobile app performance reducing crash rate by 30%",
      ],
    },
  ],
  education: [
    {
      id: "1",
      institution: "Stanford University",
      degree: "Master of Science",
      field: "Computer Science",
      location: "Stanford, CA",
      graduationDate: "2012",
      gpa: "3.9",
    },
    {
      id: "2",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Electrical Engineering and Computer Science",
      location: "Berkeley, CA",
      graduationDate: "2010",
      gpa: "3.8",
    },
  ],
  skills: [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "Go",
    "Rust",
    "React",
    "Node.js",
    "Django",
    "Spring Boot",
    "AWS",
    "GCP",
    "Azure",
    "Docker",
    "Kubernetes",
    "Terraform",
    "PostgreSQL",
    "Redis",
    "Kafka",
    "Elasticsearch",
    "Machine Learning",
    "System Design",
    "Microservices",
    "DevOps",
    "Agile",
    "Leadership",
  ],
  other: [
    {
      id: "1",
      title: "Publications & Patents",
      items: [
        "Co-authored 'Scalable Distributed Systems' (ACM 2020) - 500+ citations",
        "Patent holder for 'Real-time Data Processing Architecture' (US Patent 10,234,567)",
        "Published 25+ technical articles on engineering blogs with 100K+ views",
      ],
    },
    {
      id: "2",
      title: "Speaking & Leadership",
      items: [
        "Keynote speaker at 8 major tech conferences including DockerCon and KubeCon",
        "Technical committee member for IEEE Software Engineering Standards",
        "Board advisor for 3 Y Combinator startups",
      ],
    },
    {
      id: "3",
      title: "Awards & Recognition",
      items: [
        "AWS Hero Award 2022 for contributions to cloud computing community",
        "Top 40 Under 40 Engineers - TechCrunch 2021",
        "Outstanding Graduate Award - Stanford CS Department",
      ],
    },
    {
      id: "4",
      title: "Languages & Certifications",
      items: [
        "English (Native), Mandarin (Fluent), Spanish (Conversational)",
        "AWS Solutions Architect Professional, Google Cloud Professional Architect",
        "Certified Kubernetes Administrator (CKA), Certified Scrum Master",
      ],
    },
  ],
};

// Dense resume with lots of content (for testing font scaling DOWN)
const MOCK_RESUME: AmericanizedResume = {
  personal_info: {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johnsmith",
  },
  summary:
    "Experienced software engineer with 10+ years developing scalable web applications. Expert in React, Node.js, and cloud architectures. Led teams of 5-15 engineers delivering critical business solutions.",
  work_experience: [
    {
      id: "1",
      company: "Tech Corp Inc.",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "01/2020",
      endDate: "Present",
      current: true,
      bullets: [
        "Led development of microservices architecture serving 10M+ daily active users",
        "Reduced API response time by 60% through optimization and caching strategies",
        "Mentored 5 junior developers and conducted 50+ technical interviews",
        "Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes",
        "Architected real-time data processing system handling 100K events per second",
        "Collaborated with product team to define technical requirements and roadmap",
        "Established code review process improving code quality and knowledge sharing",
      ],
    },
    {
      id: "2",
      company: "StartupXYZ",
      position: "Full Stack Developer",
      location: "San Francisco, CA",
      startDate: "06/2017",
      endDate: "12/2019",
      current: false,
      bullets: [
        "Built React-based dashboard increasing customer engagement by 40%",
        "Developed RESTful APIs serving mobile and web applications",
        "Implemented automated testing reducing bugs in production by 70%",
        "Migrated legacy system to AWS cloud infrastructure saving $50K/year",
        "Integrated third-party payment systems processing $2M+ monthly",
        "Optimized database performance reducing query times by 80%",
      ],
    },
    {
      id: "3",
      company: "Digital Agency Co",
      position: "Junior Developer",
      location: "Austin, TX",
      startDate: "08/2015",
      endDate: "05/2017",
      current: false,
      bullets: [
        "Developed responsive websites for 20+ clients using modern web technologies",
        "Collaborated with design team to implement pixel-perfect UI components",
        "Optimized database queries improving application performance by 35%",
        "Maintained and updated client websites ensuring 99.9% uptime",
        "Implemented SEO best practices increasing organic traffic by 50%",
      ],
    },
    {
      id: "4",
      company: "Freelance",
      position: "Web Developer",
      location: "Remote",
      startDate: "01/2014",
      endDate: "07/2015",
      current: false,
      bullets: [
        "Delivered 15+ web projects for small businesses and startups",
        "Managed client relationships and project timelines independently",
        "Built e-commerce solutions generating $100K+ in sales",
        "Provided ongoing maintenance and support for client websites",
      ],
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Berkeley, CA",
      graduationDate: "2014",
      gpa: "3.8",
    },
    {
      id: "2",
      institution: "Online Certifications",
      degree: "Various Certificates",
      field: "Cloud Architecture, Machine Learning",
      location: "Online",
      graduationDate: "2020",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "GraphQL",
    "REST APIs",
    "Git",
    "CI/CD",
    "Agile",
    "TDD",
    "Microservices",
  ],
  other: [
    {
      id: "1",
      title: "Projects",
      items: [
        "Open source contributor to React ecosystem with 500+ GitHub stars",
        "Built personal finance tracking app with 10K+ downloads",
        "Created technical blog with 50+ articles on web development",
        "Developed Chrome extension for developer productivity used by 5K+ developers",
      ],
    },
    {
      id: "2",
      title: "Awards & Achievements",
      items: [
        "Employee of the Year 2021 at Tech Corp Inc.",
        "Hackathon Winner - SF Hacks 2019",
        "Dean's List - UC Berkeley (2012-2014)",
        "Technical Speaker at 3 conferences",
      ],
    },
    {
      id: "3",
      title: "Languages",
      items: [
        "English (Native)",
        "Spanish (Fluent)",
        "Mandarin (Conversational)",
      ],
    },
  ],
};

export default function Home() {
  const [resume, setResume] = useState<AmericanizedResume | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMockDropdown, setShowMockDropdown] = useState(false);

  const mockResumes = [
    {
      name: "Minimal (1 Job)",
      data: MINIMAL_MOCK_RESUME,
      color: "text-purple-600",
    },
    {
      name: "Simple (2 Jobs)",
      data: SIMPLE_MOCK_RESUME,
      color: "text-blue-600",
    },
    { name: "Dense (4 Jobs)", data: MOCK_RESUME, color: "text-green-600" },
    {
      name: "Extreme (6 Jobs)",
      data: SUPER_DENSE_RESUME,
      color: "text-red-600",
    },
  ];

  const loadMockResume = (mockData: AmericanizedResume, name: string) => {
    console.log(`🎯 Loading ${name} resume data`);
    setResume(mockData);
    setShowMockDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowMockDropdown(false);
    if (showMockDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showMockDropdown]);

  const handleTextSubmit = async (text: string) => {
    setIsProcessing(true);

    try {
      console.log("📝 Processing text:", text.substring(0, 100) + "...");

      // Call the AI extraction API directly
      const extractResponse = await fetch("/api/ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text }),
      });

      if (!extractResponse.ok) {
        throw new Error("AI extraction failed");
      }

      const extractedData = await extractResponse.json();
      console.log("✅ Extracted data:", extractedData);

      // Call the AI transformation API
      const transformResponse = await fetch("/api/ai/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: extractedData }),
      });

      if (!transformResponse.ok) {
        throw new Error("AI transformation failed");
      }

      const transformedData = await transformResponse.json();
      console.log("✅ Transformed data:", transformedData);

      setResume(transformedData.americanizedResume);
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Error processing resume. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResumeUpdate = (updatedResume: AmericanizedResume) => {
    setResume(updatedResume);
  };

  const resetApp = () => {
    setResume(null);
  };

  if (resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Sticky Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ResumeTransformer
                </h1>
                <p className="text-gray-600">Edit your transformed resume</p>
                <p className="text-sm text-gray-500">
                  Processed: {resume.personal_info?.name || "Unknown"}
                </p>
              </div>
              <button
                onClick={resetApp}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <ResumeEditor resume={resume} onResumeUpdate={handleResumeUpdate} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Section with Logo and Tagline */}
        <div className="text-center mb-12">
          {/* Logo */}
          <div className="flex justify-center items-center mb-6">
            <div className="flex items-center space-x-3">
              {/* Document Icon */}
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              {/* Logo Text */}
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-bold text-blue-600">Resume</span>
                <span className="text-4xl font-bold text-green-600">Transformer</span>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform any resume into a professional US-style format. Simply paste your resume content and get an optimized version instantly.
          </p>

          {/* Feature Highlights */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600 font-medium">Any Language</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600 font-medium">US Format</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600 font-medium">ATS Optimized</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600 font-medium">Instant Results</span>
            </div>
          </div>
        </div>

        {/* Main Input Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Input Header */}
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Original Resume</h2>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const text = formData.get("resume-text") as string;
              if (text.trim()) {
                handleTextSubmit(text.trim());
              }
            }}
            className="space-y-6"
          >
            <div>
              <textarea
                id="resume-text"
                name="resume-text"
                placeholder="Paste your resume content here... (any language, any format)"
                className="w-full h-96 px-6 py-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 text-base leading-relaxed transition-colors duration-200"
                disabled={isProcessing}
                required
              />
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full max-w-md px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Transform to US Format</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Tips Section */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pro Tips
            </h3>
            <ul className="text-blue-800 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Copy the text from your PDF or Word document
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Include all sections: personal info, work experience, education, skills
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                The AI will extract and transform the information automatically
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Supports Hebrew, Spanish, and other languages with perfect translation
              </li>
            </ul>
          </div>
        </div>

        {/* Mock Resume Section (Hidden by default, can be toggled) */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowMockDropdown(!showMockDropdown)}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Load Sample Resume
          </button>
          
          {showMockDropdown && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Choose a sample resume:</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {mockResumes.map((mock, index) => (
                  <button
                    key={index}
                    onClick={() => loadMockResume(mock.data, mock.name)}
                    className={`px-3 py-2 text-xs rounded-md border transition-colors ${mock.color}`}
                  >
                    {mock.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
