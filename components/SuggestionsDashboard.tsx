import React from 'react';
import type { AIResponse } from '../types';
import Card from './Card';
import GridIcon from './icons/GridIcon';
import BrainIcon from './icons/BrainIcon';
import TargetIcon from './icons/TargetIcon';

interface SuggestionsDashboardProps {
  aiResponse: AIResponse;
  activeFramework: string | null;
  isGuidanceLoading: boolean;
  onFrameworkSelect: (framework: string) => void;
}

const SuggestionsDashboard: React.FC<SuggestionsDashboardProps> = ({
  aiResponse,
  activeFramework,
  isGuidanceLoading,
  onFrameworkSelect,
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Master Strategy */}
        <div className="lg:col-span-2">
          <Card title="Master Strategy" icon={<BrainIcon />} className="h-full bg-gray-50 border-gray-200">
            <ul className="space-y-4">
              {aiResponse.masterStrategy.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">&#10140;</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Suggested Frameworks */}
        <div className="lg:col-span-1">
          <Card title="Select Framework" icon={<GridIcon />} className="h-full">
            <div className="flex flex-col space-y-3">
              {aiResponse.suggestedFrameworks.map((framework) => {
                const isActive = framework === activeFramework;
                return (
                  <button
                    key={framework}
                    onClick={() => onFrameworkSelect(framework)}
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
                    <span>{framework}</span>
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
        
        {/* Final Goal */}
        <div className="lg:col-span-2">
           <div className="h-full bg-slate-800 rounded-xl shadow-lg border border-slate-700 flex flex-col p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <div className="flex items-center mb-4">
                <div className="mr-3 text-blue-400">
                  <TargetIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">Final Goal</h3>
              </div>
              <div className="flex-grow flex flex-col justify-center text-center">
                <p className="text-3xl lg:text-4xl text-white font-bold tracking-tight leading-tight">
                  {aiResponse.finalGoal}
                </p>
                <p className="text-sm text-slate-400 mt-4 max-w-md mx-auto">
                  This is the ultimate, measurable objective your strategy aims to achieve.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsDashboard; 