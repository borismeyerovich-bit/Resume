"use client";

import { useState } from 'react';

interface TextInputZoneProps {
  onTextSubmit: (text: string) => void;
  isProcessing: boolean;
}

export default function TextInputZone({ onTextSubmit, isProcessing }: TextInputZoneProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onTextSubmit(text.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Paste Your Resume Text
          </h2>
          <p className="text-gray-600">
            Copy and paste your resume content below to transform it into American style
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="resume-text" className="block text-sm font-medium text-gray-700 mb-2">
              Resume Content
            </label>
            <textarea
              id="resume-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your resume content here... (Hebrew or English)"
              className="w-full h-96 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={isProcessing}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!text.trim() || isProcessing}
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
  );
}
