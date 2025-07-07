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
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Master Strategy */}
        <div className="lg:col-span-1">
          <Card title="Master Strategy" icon={<BrainIcon />}>
            <ul className="space-y-3">
              {aiResponse.masterStrategy.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">&#8594;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Suggested Frameworks */}
        <div className="lg:col-span-1">
          <Card title="Suggested Frameworks" icon={<GridIcon />}>
            <p className="text-sm text-gray-500 mb-4">Select a framework to get a guided action plan.</p>
            <div className="flex flex-col space-y-3">
              {aiResponse.suggestedFrameworks.map((framework) => {
                const isActive = framework === activeFramework;
                return (
                  <button
                    key={framework}
                    onClick={() => onFrameworkSelect(framework)}
                    disabled={isGuidanceLoading}
                    className={`
                      text-left py-3 px-4 rounded-md font-semibold shadow-sm 
                      flex items-center justify-between transition-all duration-200 transform
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500
                      disabled:cursor-wait
                      ${isActive
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-105'
                        : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 hover:shadow-md hover:-translate-y-1'
                      }
                      ${activeFramework && !isActive ? 'opacity-70 hover:opacity-100' : ''}
                      ${isGuidanceLoading && !isActive ? 'opacity-50' : ''}
                    `}
                  >
                    <span>{framework}</span>
                    {isActive && (isGuidanceLoading ? <span>Loading...</span> : <span>&#10003;</span>)}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Final Goal */}
        <div className="lg:col-span-1">
           <Card title="Final Goal" icon={<TargetIcon />}>
              <p className="text-2xl text-green-600 font-bold">{aiResponse.finalGoal}</p>
               <p className="text-sm text-gray-500 mt-2">This is the ultimate objective your strategy aims to achieve.</p>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsDashboard; 