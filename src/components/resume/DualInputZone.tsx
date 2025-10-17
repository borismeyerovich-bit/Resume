"use client";

import { useState } from "react";
import FileUploadZone from "./FileUploadZone";

interface DualInputZoneProps {
  onFileSelect: (file: File) => void;
  onTextSubmit: (text: string) => void;
  isProcessing: boolean;
}

export default function DualInputZone({
  onFileSelect,
  onTextSubmit,
  isProcessing,
}: DualInputZoneProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Upload Your Resume</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-4 sm:mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-md font-medium transition-all duration-200 text-sm sm:text-base ${
            activeTab === 'upload'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          disabled={isProcessing}
        >
          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="hidden sm:inline">Upload File</span>
            <span className="sm:hidden">Upload</span>
            <span className="hidden sm:inline text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Recommended</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-md font-medium transition-all duration-200 text-sm sm:text-base ${
            activeTab === 'text'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          disabled={isProcessing}
        >
          <div className="flex items-center justify-center space-x-1 sm:space-x-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="hidden sm:inline">Paste Text</span>
            <span className="sm:hidden">Paste</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px] sm:min-h-[400px]">
        {activeTab === 'upload' ? (
          <div>
            <FileUploadZone onFileSelect={onFileSelect} isProcessing={isProcessing} />
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-sm font-semibold text-green-800 mb-2">🎯 Why Upload is Better:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• <strong>Fast & Reliable:</strong> Direct text extraction in seconds</li>
                <li>• <strong>Better dates:</strong> Preserves original date formats without corruption</li>
                <li>• <strong>Accurate emails:</strong> No character reversal from RTL text</li>
                <li>• <strong>Multiple formats:</strong> PDF, DOC, DOCX, and images all supported</li>
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-white">
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Paste Your Resume Text</h3>
                <p className="text-gray-600 text-sm">Copy and paste your resume content here as a backup option.</p>
              </div>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const text = formData.get("resume-text") as string;
                  if (text.trim()) {
                    onTextSubmit(text.trim());
                  }
                }}
                className="space-y-4"
              >
                <textarea
                  name="resume-text"
                  placeholder="Paste your resume content here... (any language, any format)"
                  className="w-full h-60 sm:h-80 px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 text-sm sm:text-base leading-relaxed transition-colors duration-200"
                  disabled={isProcessing}
                  required
                />
                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Transform Resume</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-sm font-semibold text-amber-800 mb-2">💡 For Best Results:</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• <strong>If PDF upload fails:</strong> Use this text option as backup</li>
                <li>• <strong>Copy carefully:</strong> Select all text from your PDF viewer</li>
                <li>• <strong>Check formatting:</strong> Ensure emails and dates look correct</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 