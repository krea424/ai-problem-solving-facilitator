import React from 'react';
import { StakeholderAnalysis } from '../types';

interface StakeholderMatrixProps {
  stakeholders: StakeholderAnalysis[];
  onStakeholderUpdate: (updatedStakeholder: StakeholderAnalysis) => void;
}

export const StakeholderMatrix: React.FC<StakeholderMatrixProps> = ({
  stakeholders,
  onStakeholderUpdate,
}) => {
  const getQuadrant = (influence: number, interest: number): string => {
    if (influence >= 7 && interest >= 7) return 'Key Players';
    if (influence >= 7 && interest < 7) return 'Meet Their Needs';
    if (influence < 7 && interest >= 7) return 'Show Consideration';
    return 'Least Important';
  };

  const getEngagementColor = (engagement: StakeholderAnalysis['engagement']): string => {
    const colors = {
      Champion: 'bg-green-100 text-green-800',
      Supporter: 'bg-blue-100 text-blue-800',
      Neutral: 'bg-gray-100 text-gray-800',
      Critic: 'bg-yellow-100 text-yellow-800',
      Blocker: 'bg-red-100 text-red-800',
    };
    return colors[engagement];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in-up">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Stakeholder Analysis Matrix</h3>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        {['Key Players', 'Meet Their Needs', 'Show Consideration', 'Least Important'].map((quadrant) => (
          <div key={quadrant} className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-3">{quadrant}</h4>
            <div className="space-y-3">
              {stakeholders
                .filter((s) => getQuadrant(s.influence, s.interest) === quadrant)
                .map((stakeholder) => (
                  <div
                    key={stakeholder.stakeholderName}
                    className="p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{stakeholder.stakeholderName}</span>
                      <span className={`px-2 py-1 rounded-full text-sm ${getEngagementColor(stakeholder.engagement)}`}>
                        {stakeholder.engagement}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Influence: {stakeholder.influence}/10</div>
                      <div>Interest: {stakeholder.interest}/10</div>
                    </div>
                    <div className="mt-2">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Actions:</h5>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {stakeholder.actions.map((action, index) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="font-semibold text-gray-700 mb-3">Engagement Summary</h4>
        <div className="grid grid-cols-5 gap-4">
          {['Champion', 'Supporter', 'Neutral', 'Critic', 'Blocker'].map((type) => (
            <div key={type} className="text-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 ${getEngagementColor(type as StakeholderAnalysis['engagement'])}`}>
                {stakeholders.filter((s) => s.engagement === type).length}
              </div>
              <span className="text-sm text-gray-600">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 