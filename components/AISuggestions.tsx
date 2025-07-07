import React from 'react';
import type { AISuggestedSolution } from '../types';
import Card from './Card';
import LightBulbIcon from './icons/LightBulbIcon';
import TargetIcon from './icons/TargetIcon';
import InfoIcon from './icons/InfoIcon';

interface AISuggestionsProps {
  suggestions: AISuggestedSolution[];
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ suggestions }) => {
  return (
    <div className="mt-12 w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">AI-Driven Strategic Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {suggestions.map((suggestion, index) => (
                <Card key={index} title={suggestion.solutionTitle} icon={<LightBulbIcon />} className="flex flex-col">
                    <div className="flex-grow space-y-4">
                        <p className="text-gray-600">{suggestion.solutionDescription}</p>
                        
                        <div className="bg-gray-100 p-3 rounded-md">
                            <h5 className="font-bold text-gray-700 flex items-center mb-1"><TargetIcon className="mr-2" /> KPI</h5>
                            <p className="text-sm text-gray-600"><strong>{suggestion.kpi.metric}:</strong> {suggestion.kpi.target}</p>
                        </div>

                        <div className="bg-red-100 p-3 rounded-md">
                            <h5 className="font-bold text-red-700 flex items-center mb-1"><InfoIcon className="mr-2" /> Alert</h5>
                            <p className="text-sm text-red-600"><strong>{suggestion.alert.risk}:</strong> {suggestion.alert.mitigation}</p>
                        </div>
                    </div>
                    <div className="mt-6 border-t border-gray-200 pt-4">
                        <blockquote className="text-center italic text-gray-500">
                            "{suggestion.quote.text}"
                            <footer className="mt-2 text-sm font-semibold">— {suggestion.quote.author}</footer>
                        </blockquote>
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
};

export default AISuggestions; 