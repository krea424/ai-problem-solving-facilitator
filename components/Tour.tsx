import React, { useState, useEffect } from 'react';

interface TourStep {
  target: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TourProps {
  run: boolean;
  steps: TourStep[];
  handleJoyrideCallback: (data: { status: string }) => void;
}

const Tour: React.FC<TourProps> = ({ run, steps, handleJoyrideCallback }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!run) {
      setCurrentStep(0);
      setTargetElement(null);
      return;
    }

    if (currentStep >= steps.length) {
      handleJoyrideCallback({ status: 'finished' });
      return;
    }

    const step = steps[currentStep];
    const element = step.target === 'body' ? document.body : document.querySelector(step.target);
    setTargetElement(element as HTMLElement);
  }, [run, currentStep, steps, handleJoyrideCallback]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleJoyrideCallback({ status: 'finished' });
    }
  };

  const handleSkip = () => {
    handleJoyrideCallback({ status: 'skipped' });
  };

  if (!run || currentStep >= steps.length) {
    return null;
  }

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleSkip}
      />
      
      {/* Tour Tooltip */}
      <div 
        className="fixed z-50 bg-white rounded-lg shadow-2xl p-6 max-w-sm"
        style={{
          top: targetElement ? targetElement.offsetTop + targetElement.offsetHeight + 10 : '50%',
          left: targetElement ? targetElement.offsetLeft : '50%',
          transform: targetElement ? 'translateX(-50%)' : 'translate(-50%, -50%)',
        }}
      >
        <div className="text-sm text-gray-600 mb-4">
          Step {currentStep + 1} of {steps.length}
        </div>
        
        <p className="text-gray-800 mb-4">
          {step.content}
        </p>
        
        <div className="flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Skip Tour
          </button>
          
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Tour; 