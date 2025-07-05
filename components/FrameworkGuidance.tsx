import React from 'react';
import type { FrameworkGuidance as FrameworkGuidanceType, Answer } from '../types';
import Card from './Card';

interface FrameworkGuidanceProps {
  guidance: FrameworkGuidanceType;
  answers: Answer[];
  onAnswerChange: (index: number, value: string) => void;
  onGenerateSolution: (answers: Answer[]) => void;
  isLoading: boolean;
}

const FrameworkGuidance: React.FC<FrameworkGuidanceProps> = ({ guidance, answers, onAnswerChange, onGenerateSolution, isLoading }) => {
  const allQuestionsAnswered = answers.every(a => a.answer.trim() !== '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allQuestionsAnswered) {
      onGenerateSolution(answers);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
        <Card title={guidance.title} className="bg-white border-blue-500/30">
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <p className="text-gray-600 italic">{guidance.description}</p>
                    <hr className="border-gray-200"/>
                    
                    <div>
                        <h4 className="text-lg font-semibold text-blue-600 mb-4">Answer the Key Questions</h4>
                        <div className="space-y-4">
                            {answers.map((item, index) => (
                                <div key={index}>
                                    <label className="block text-gray-700 mb-2" htmlFor={`question-${index}`}>
                                        <span className="text-blue-600 mr-2">?</span>
                                        {item.question}
                                    </label>
                                    <textarea
                                        id={`question-${index}`}
                                        value={item.answer}
                                        onChange={(e) => onAnswerChange(index, e.target.value)}
                                        placeholder="Your analysis and data..."
                                        rows={3}
                                        className="w-full p-3 bg-white text-gray-700 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                                        aria-label={`Answer for: ${item.question}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                         <button
                            type="submit"
                            disabled={!allQuestionsAnswered || isLoading}
                            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:transform-none"
                        >
                            {isLoading ? 'Generating Solution...' : 'Generate Final Solution'}
                        </button>
                    </div>
                </div>
            </form>
        </Card>
    </div>
  );
};

export default FrameworkGuidance;
