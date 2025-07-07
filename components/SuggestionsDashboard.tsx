import React from 'react';
import type { AIResponse, Framework } from '../types';
import Card from './Card';
import GridIcon from './icons/GridIcon';
import BrainIcon from './icons/BrainIcon';
import TargetIcon from './icons/TargetIcon';

interface SuggestionsDashboardProps {
  aiResponse: AIResponse;
  activeFramework: string | null;
  isGuidanceLoading: boolean;
  onFrameworkSelect: (frameworkName: string) => void;
}

const SuggestionsDashboard: React.FC<SuggestionsDashboardProps> = ({
  aiResponse,
  activeFramework,
  isGuidanceLoading,
  onFrameworkSelect,
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Problem Analysis & Goals */}
        <div className="lg:col-span-2">
          <Card title="Strategic Analysis" icon={<BrainIcon />} className="h-full bg-gray-50 border-gray-200">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Problem Analysis</h4>
                <p className="text-gray-700">{aiResponse.problemAnalysis}</p>
              </div>
              <hr />
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Strategic Goals</h4>
                <ul className="space-y-3">
                  {aiResponse.strategicGoals?.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <TargetIcon className="w-5 h-5 text-blue-600 mr-3 mt-1 shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Suggested Frameworks */}
        <div className="lg:col-span-1">
          <Card title="Select Framework" icon={<GridIcon />} className="h-full">
            <div className="flex flex-col space-y-3">
              {aiResponse.recommendedFrameworks?.map((framework: Framework) => {
                const isActive = framework.name === activeFramework;
                return (
                  <button
                    key={framework.id}
                    onClick={() => onFrameworkSelect(framework.name)}
                    disabled={isGuidanceLoading}
                    className={`
                      text-left py-3 px-4 rounded-lg font-semibold shadow-md 
                      flex items-center justify-between transition-all duration-300 transform
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500
                      disabled:cursor-wait disabled:opacity-50
                      ${isActive
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-105 shadow-xl'
                        : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 hover:shadow-lg hover:-translate-y-1'
                      }
                      ${activeFramework && !isActive ? 'opacity-60 hover:opacity-100' : ''}
                    `}
                  >
                    <div className="flex-1">
                      <p className="font-bold">{framework.name}</p>
                      <p className="text-sm font-normal mt-1 opacity-80">{framework.description}</p>
                    </div>
                    {isActive && (
                      <span className="ml-2 transition-opacity duration-300">
                        {isGuidanceLoading ? '...' : '✓'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsDashboard; 