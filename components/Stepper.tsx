import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                    transition-all duration-300
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-300' : ''}
                    ${!isCompleted && !isActive ? 'bg-gray-300 text-gray-600' : ''}
                  `}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <p className={`
                  mt-2 text-sm text-center font-semibold
                  ${isActive ? 'text-blue-600' : 'text-gray-500'}
                `}>
                  {step}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-1 mx-4
                  ${stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-300'}
                `}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper; 