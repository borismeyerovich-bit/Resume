"use client";

import { useState } from "react";
import { AmericanizedResume } from "../entities/Resume";
import ResumeEditor from "../components/resume/ResumeEditor";

export default function Home() {
  const [resume, setResume] = useState<AmericanizedResume | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTextSubmit = async (text: string) => {
    setIsProcessing(true);
    
    try {
      console.log('📝 Processing text:', text.substring(0, 100) + '...');
      
      // Call the AI extraction API directly
      const extractResponse = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
      });

      if (!extractResponse.ok) {
        throw new Error('AI extraction failed');
      }

      const extractedData = await extractResponse.json();
      console.log('✅ Extracted data:', extractedData);

      // Call the AI transformation API
      const transformResponse = await fetch('/api/ai/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: extractedData }),
      });

      if (!transformResponse.ok) {
        throw new Error('AI transformation failed');
      }

      const transformedData = await transformResponse.json();
      console.log('✅ Transformed data:', transformedData);

      setResume(transformedData.americanizedResume);
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error processing resume. Please try again.');
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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ResumeTransformer</h1>
                <p className="text-gray-600">Edit your transformed resume</p>
                <p className="text-sm text-gray-500">
                  Processed: {resume.personal_info?.name || 'Unknown'}
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
        
        <ResumeEditor 
          resume={resume}
          onResumeUpdate={handleResumeUpdate}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ResumeTransformer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your resume into a professional American-style format using AI
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Paste Your Resume Text
            </h2>
            <p className="text-gray-600">
              Copy and paste your resume content below to transform it into American style
            </p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const text = formData.get('resume-text') as string;
            if (text.trim()) {
              handleTextSubmit(text.trim());
            }
          }} className="space-y-6">
            <div>
              <label htmlFor="resume-text" className="block text-sm font-medium text-gray-700 mb-2">
                Resume Content
              </label>
              <textarea
                id="resume-text"
                name="resume-text"
                placeholder="Paste your resume content here... (Hebrew or English)"
                className="w-full h-96 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={isProcessing}
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isProcessing}
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {isProcessing ? 'Processing...' : 'Transform Resume'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Tips:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Copy the text from your PDF or Word document</li>
              <li>• Include all sections: personal info, work experience, education, skills</li>
              <li>• The AI will extract and transform the information automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
