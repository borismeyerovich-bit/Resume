"use client";

import { ProcessingStep } from "../../entities/Resume";

interface ProcessingStepsProps {
  steps: ProcessingStep[];
}

export default function ProcessingSteps({ steps }: ProcessingStepsProps) {
  const getStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'processing':
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        );
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStepColor = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-6">
          Processing Your Resume
        </h3>
        
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-4">
            <div className={`flex-shrink-0 ${getStepColor(step.status)}`}>
              {getStepIcon(step.status)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-medium ${getStepColor(step.status)}`}>
                {step.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
