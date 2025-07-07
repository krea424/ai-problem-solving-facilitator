import React from 'react';

interface InputQualityMeterProps {
  text: string;
  wordGoal?: number;
}

const InputQualityMeter: React.FC<InputQualityMeterProps> = ({ text, wordGoal = 50 }) => {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const progress = Math.min((wordCount / wordGoal) * 100, 100);

  let qualityLabel = 'Needs more detail';
  let qualityColor = 'bg-red-400';

  if (progress > 30) {
    qualityLabel = 'Good';
    qualityColor = 'bg-yellow-400';
  }
  if (progress > 60) {
    qualityLabel = 'Sufficient';
    qualityColor = 'bg-green-400';
  }
   if (progress === 100) {
    qualityLabel = 'Excellent';
    qualityColor = 'bg-green-600';
  }

  return (
    <div className="w-full mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-gray-500">{qualityLabel}</span>
        <span className="text-xs text-gray-400">{wordCount} / {wordGoal} words</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${qualityColor}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default InputQualityMeter; 