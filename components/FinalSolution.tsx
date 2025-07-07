import React from 'react';
import type { FinalSolution as FinalSolutionType } from '../types';
import Card from './Card';

interface FinalSolutionProps {
  solution: FinalSolutionType;
}

const FinalSolution: React.FC<FinalSolutionProps> = ({ solution }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-8 bg-slate-800 text-white">
          <h2 className="text-3xl font-bold tracking-tight">{solution.title}</h2>
          <p className="mt-2 text-slate-300 max-w-2xl">{solution.summary}</p>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Actionable Roadmap</h3>
            <ol className="space-y-6">
              {solution.recommendations.map((rec, index) => (
                <li key={index} className="flex">
                  <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white font-bold rounded-full">
                      {index + 1}
                    </span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-lg font-bold text-gray-900">{rec.title}</h4>
                    <p className="mt-1 text-gray-600">{rec.details}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalSolution;
