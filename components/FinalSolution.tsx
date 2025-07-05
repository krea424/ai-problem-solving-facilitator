import React from 'react';
import type { FinalSolution as FinalSolutionType } from '../types';
import Card from './Card';

interface FinalSolutionProps {
  solution: FinalSolutionType;
}

const FinalSolution: React.FC<FinalSolutionProps> = ({ solution }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <Card title={solution.title} className="bg-gray-800/50 border border-purple-500/30">
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-200 mb-2">Executive Summary</h4>
            <p className="text-gray-300 italic border-l-4 border-gray-600 pl-4">{solution.summary}</p>
          </div>
          <hr className="border-gray-700"/>
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-4">Actionable Recommendations</h4>
            <div className="space-y-4">
              {solution.recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
                  <h5 className="font-bold text-white mb-2">
                    <span className="text-purple-300 mr-2">&#9670;</span>
                    {rec.title}
                  </h5>
                  <p className="text-gray-300 pl-6">{rec.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinalSolution;
