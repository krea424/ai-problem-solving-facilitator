import React from 'react';
import { Framework, IndustryVertical } from '../types';

interface FrameworkVisualizerProps {
  framework: Framework;
  selectedIndustry: IndustryVertical;
  onStepComplete: (stepIndex: number) => void;
}

export const FrameworkVisualizer: React.FC<FrameworkVisualizerProps> = ({
  framework,
  selectedIndustry,
  onStepComplete,
}) => {
  const industryGuidance = framework.industryGuidance?.[selectedIndustry];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in-up">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{framework.name}</h3>
        <p className="text-gray-600">{framework.description}</p>
        {industryGuidance && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h4 className="font-semibold text-blue-800 mb-2">Industry-Specific Guidance</h4>
            <p className="text-blue-700">{industryGuidance}</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {framework.steps.map((step, index) => (
          <div
            key={index}
            className="relative flex items-start p-4 border border-gray-200 rounded-md hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold mr-4">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-gray-800">{step}</p>
              {framework.templates?.[`step${index + 1}`] && (
                <button
                  className="mt-2 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  onClick={() => onStepComplete(index)}
                >
                  Use Template
                </button>
              )}
            </div>
            <div className="absolute top-4 right-4">
              <button
                className="text-green-600 hover:text-green-700"
                onClick={() => onStepComplete(index)}
              >
                ✓ Mark Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 