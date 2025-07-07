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

  const calculateOptimalPosition = (element: HTMLElement, placement: string) => {
    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = 320; // Approximate tooltip width
    const tooltipHeight = 200; // Approximate tooltip height
    const margin = 20;

    let top: string;
    let left: string;
    let transform: string;

    // For body or center placement, always center
    if (element === document.body || placement === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    // Try the preferred placement first
    switch (placement) {
      case 'top':
        if (rect.top > tooltipHeight + margin) {
          top = `${rect.top - margin}px`;
          left = `${rect.left + rect.width / 2}px`;
          transform = 'translate(-50%, -100%)';
        } else {
          // Fallback to bottom
          top = `${rect.bottom + margin}px`;
          left = `${rect.left + rect.width / 2}px`;
          transform = 'translate(-50%, 0)';
        }
        break;
      
      case 'bottom':
        if (rect.bottom + tooltipHeight + margin < viewportHeight) {
          top = `${rect.bottom + margin}px`;
          left = `${rect.left + rect.width / 2}px`;
          transform = 'translate(-50%, 0)';
        } else {
          // Fallback to top
          top = `${rect.top - margin}px`;
          left = `${rect.left + rect.width / 2}px`;
          transform = 'translate(-50%, -100%)';
        }
        break;
      
      case 'left':
        if (rect.left > tooltipWidth + margin) {
          top = `${rect.top + rect.height / 2}px`;
          left = `${rect.left - margin}px`;
          transform = 'translate(-100%, -50%)';
        } else {
          // Fallback to right
          top = `${rect.top + rect.height / 2}px`;
          left = `${rect.right + margin}px`;
          transform = 'translate(0, -50%)';
        }
        break;
      
      case 'right':
        if (rect.right + tooltipWidth + margin < viewportWidth) {
          top = `${rect.top + rect.height / 2}px`;
          left = `${rect.right + margin}px`;
          transform = 'translate(0, -50%)';
        } else {
          // Fallback to left
          top = `${rect.top + rect.height / 2}px`;
          left = `${rect.left - margin}px`;
          transform = 'translate(-100%, -50%)';
        }
        break;
      
      default:
        // Smart positioning based on element location
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        if (centerY < viewportHeight / 2) {
          // Element in top half, place tooltip below
          top = `${rect.bottom + margin}px`;
          left = `${centerX}px`;
          transform = 'translate(-50%, 0)';
        } else {
          // Element in bottom half, place tooltip above
          top = `${rect.top - margin}px`;
          left = `${centerX}px`;
          transform = 'translate(-50%, -100%)';
        }
    }

    // Ensure tooltip stays within viewport bounds
    const tooltipLeft = parseFloat(left);
    const tooltipTop = parseFloat(top);
    
    if (tooltipLeft < margin) {
      left = `${margin}px`;
      transform = transform.replace('translate(-50%', 'translate(0%');
    } else if (tooltipLeft + tooltipWidth > viewportWidth - margin) {
      left = `${viewportWidth - tooltipWidth - margin}px`;
      transform = transform.replace('translate(-50%', 'translate(0%');
    }
    
    if (tooltipTop < margin) {
      top = `${margin}px`;
      transform = transform.replace('translate(0, -50%)', 'translate(0, 0)').replace('translate(-50%, -100%)', 'translate(-50%, 0)');
    } else if (tooltipTop + tooltipHeight > viewportHeight - margin) {
      top = `${viewportHeight - tooltipHeight - margin}px`;
      transform = transform.replace('translate(0, -50%)', 'translate(0, -100%)').replace('translate(-50%, 0)', 'translate(-50%, -100%)');
    }

    return { top, left, transform };
  };

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

      if (element) {
        const placement = step.placement || 'bottom';
        const position = calculateOptimalPosition(element, placement);
        setTooltipPosition(position);
      } else {
        // Fallback to center for missing elements
        setTooltipPosition({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
      }
    }, 150);

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