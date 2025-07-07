import React, { useState, useMemo } from 'react';
import type { FiveWhys, ComplexityScore, FiveWhysStep } from '../types';
import { getComplexityScore } from '../services/geminiService';
import Card from './Card';
import Loader from './Loader';
import BrainIcon from './icons/BrainIcon';
import TargetIcon from './icons/TargetIcon';

interface ProblemComplexityScorerProps {
  fiveWhysData: FiveWhys | null;
}

const ScoreMeter = ({ score, max = 5 }: { score: number; max?: number }) => (
  <div className="w-full bg-gray-700 rounded-full h-2.5">
    <div
      className="bg-cyan-400 h-2.5 rounded-full"
      style={{ width: `${(score / max) * 100}%` }}
    />
  </div>
);

const ProblemComplexityScorer: React.FC<ProblemComplexityScorerProps> = ({ fiveWhysData }) => {
  const [scores, setScores] = useState<ComplexityScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeComplexity = async () => {
    if (!fiveWhysData) return;

    setIsLoading(true);
    setError(null);
    setScores(null);
    try {
      const analysisText = fiveWhysData.steps.map((step: FiveWhysStep) => `Q: ${step.question}\nA: ${step.answer}`).join('\n\n');
      const result = await getComplexityScore(analysisText);
      setScores(result);
    } catch (err) {
      setError('An error occurred while analyzing the complexity. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const { totalScore, complexityLevel, complexityDescription } = useMemo(() => {
    if (!scores) return { totalScore: 0, complexityLevel: '', complexityDescription: '' };

    const total = scores.causeAmbiguity.score + scores.interconnections.score + scores.businessImpact.score;
    let level = '';
    let description = '';

    if (total <= 6) {
      level = 'Low Complexity';
      description = "The problem appears to be well-defined and isolated. It can likely be resolved with targeted, swift actions by a small, dedicated team.";
    } else if (total <= 10) {
      level = 'Medium Complexity';
      description = "The problem involves multiple processes or teams and has a moderate business impact. A cross-functional team is needed to manage dependencies and implement a coordinated solution.";
    } else {
      level = 'High Complexity';
      description = "This is a systemic issue with significant business impact and unclear causes. It requires a structured approach, a formal roadmap, and strong executive sponsorship to ensure success.";
    }
    return { totalScore: total, complexityLevel: level, complexityDescription: description };
  }, [scores]);

  if (!fiveWhysData) return null;

  return (
    <div className="mt-8 animate-fade-in-up">
      <Card
        title="Problem Complexity Score"
        icon={<BrainIcon />}
        headerAction={
          !scores && !isLoading ? (
            <button onClick={handleAnalyzeComplexity} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              Analyze Complexity
            </button>
          ) : undefined
        }
      >
        {isLoading && <div className="flex justify-center items-center h-48"><Loader /></div>}
        {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
        
        {scores && (
          <div className="space-y-8 p-2">
            {/* Score Summary */}
            <div className="text-center bg-gray-800 p-6 rounded-xl">
              <p className="text-gray-400 font-semibold">Total Complexity Score</p>
              <p className="text-6xl font-bold text-white my-2">{totalScore}</p>
              <p className={`font-semibold text-2xl ${
                totalScore <= 6 ? 'text-green-400' : totalScore <= 10 ? 'text-yellow-400' : 'text-red-400'
              }`}>{complexityLevel}</p>
              <p className="text-gray-300 mt-3 max-w-2xl mx-auto">{complexityDescription}</p>
            </div>

            {/* Score Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white">Cause Ambiguity</h4>
                <p className="text-sm text-gray-400 mb-2">{scores.causeAmbiguity.reasoning}</p>
                <ScoreMeter score={scores.causeAmbiguity.score} />
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white">Interconnections</h4>
                <p className="text-sm text-gray-400 mb-2">{scores.interconnections.reasoning}</p>
                <ScoreMeter score={scores.interconnections.score} />
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white">Business Impact</h4>
                <p className="text-sm text-gray-400 mb-2">{scores.businessImpact.reasoning}</p>
                <ScoreMeter score={scores.businessImpact.score} />
              </div>
            </div>
            
            {/* Strategic Recommendations */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center"><TargetIcon className="mr-2" /> Strategic Recommendations</h3>
                <ul className="space-y-3">
                  {scores.strategicRecommendations.map((rec, index) => (
                    <li key={index} className="bg-gray-800 p-4 rounded-lg flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center mr-4 mt-1">
                        <span className="text-cyan-400 font-bold">✓</span>
                      </div>
                      <p className="text-gray-300">{rec}</p>
                    </li>
                  ))}
                </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProblemComplexityScorer; 