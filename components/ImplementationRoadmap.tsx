import React from 'react';
import { ImplementationPlan, RiskAssessment } from '../types';

interface ImplementationRoadmapProps {
  plan: ImplementationPlan;
  onPhaseUpdate: (phaseIndex: number, updates: Partial<ImplementationPlan['phases'][0]>) => void;
}

export const ImplementationRoadmap: React.FC<ImplementationRoadmapProps> = ({
  plan,
  onPhaseUpdate,
}) => {
  const getRiskSeverity = (risk: RiskAssessment): string => {
    const score = risk.probability * risk.impact;
    if (score >= 20) return 'bg-red-100 text-red-800';
    if (score >= 12) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in-up">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Implementation Roadmap</h3>

      <div className="space-y-8">
        {plan.phases.map((phase, phaseIndex) => (
          <div key={phaseIndex} className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-gray-800">{phase.name}</h4>
              <span className="text-gray-600">{phase.duration}</span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Activities</h5>
                <ul className="space-y-2">
                  {phase.activities.map((activity, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm mr-2">
                        {index + 1}
                      </span>
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">Deliverables</h5>
                <ul className="space-y-2">
                  {phase.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="font-medium text-gray-700 mb-2">Key Stakeholders</h5>
              <div className="flex flex-wrap gap-2">
                {phase.stakeholders.map((stakeholder, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {stakeholder}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-700 mb-2">Risks</h5>
              <div className="space-y-3">
                {phase.risks.map((risk, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md ${getRiskSeverity(risk)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{risk.riskName}</span>
                      <span className="text-sm">
                        Score: {risk.probability * risk.impact}/25
                      </span>
                    </div>
                    <div className="text-sm">
                      <p><strong>Mitigation:</strong> {risk.mitigationStrategy}</p>
                      <p><strong>Contingency:</strong> {risk.contingencyPlan}</p>
                      <p><strong>Owner:</strong> {risk.owner}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <h4 className="font-semibold text-gray-700 mb-4">KPI Tracking</h4>
        <div className="grid grid-cols-3 gap-4">
          {plan.kpis.map((kpi, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-800 mb-2">{kpi.metric}</h5>
              <div className="text-sm text-gray-600">
                <p><strong>Target:</strong> {kpi.target}</p>
                <p><strong>Frequency:</strong> {kpi.frequency}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 