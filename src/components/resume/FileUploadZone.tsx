"use client";

import { useState, useRef } from "react";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export default function FileUploadZone({ onFileSelect, isProcessing }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, DOCX, or image file.');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="text-4xl sm:text-6xl text-gray-400">📄</div>
          
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Upload Your Resume
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-2">
              Drag and drop your resume here, or click to browse
            </p>
            <p className="text-xs sm:text-sm text-gray-500 px-2">
              Supports PDF, DOC, DOCX, and image files (max 10MB)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleInputChange}
            className="hidden"
            disabled={isProcessing}
          />

          {isProcessing && (
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Processing...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
