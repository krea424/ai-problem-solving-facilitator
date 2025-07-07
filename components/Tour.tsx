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
  const [tooltipPosition, setTooltipPosition] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });

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

    // Add a small delay to ensure elements are rendered
    const timer = setTimeout(() => {
      const step = steps[currentStep];
      let element: HTMLElement | null = null;
      
      if (step.target === 'body') {
        element = document.body;
      } else {
        element = document.querySelector(step.target) as HTMLElement;
      }

      setTargetElement(element);

      // Calculate position
      if (element && element !== document.body) {
        const rect = element.getBoundingClientRect();
        const placement = step.placement || 'bottom';
        
        let top: string;
        let left: string;
        let transform: string;

        switch (placement) {
          case 'top':
            top = `${rect.top - 20}px`;
            left = `${rect.left + rect.width / 2}px`;
            transform = 'translate(-50%, -100%)';
            break;
          case 'bottom':
            top = `${rect.bottom + 20}px`;
            left = `${rect.left + rect.width / 2}px`;
            transform = 'translate(-50%, 0)';
            break;
          case 'left':
            top = `${rect.top + rect.height / 2}px`;
            left = `${rect.left - 20}px`;
            transform = 'translate(-100%, -50%)';
            break;
          case 'right':
            top = `${rect.top + rect.height / 2}px`;
            left = `${rect.right + 20}px`;
            transform = 'translate(0, -50%)';
            break;
          default: // center
            top = '50%';
            left = '50%';
            transform = 'translate(-50%, -50%)';
        }

        setTooltipPosition({ top, left, transform });
      } else {
        // Fallback to center for body or missing elements
        setTooltipPosition({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
      }
    }, 100);

    return () => clearTimeout(timer);
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
        className="fixed z-50 bg-white rounded-lg shadow-2xl p-6 max-w-sm border border-gray-200"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: tooltipPosition.transform,
        }}
      >
        <div className="text-sm text-gray-600 mb-4">
          Step {currentStep + 1} of {steps.length}
        </div>
        
        <p className="text-gray-800 mb-4 leading-relaxed">
          {step.content}
        </p>
        
        <div className="flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Skip Tour
          </button>
          
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Tour; 