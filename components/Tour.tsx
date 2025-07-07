import React from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';

interface TourProps {
  run: boolean;
  steps: Step[];
  handleJoyrideCallback: (data: CallBackProps) => void;
}

const Tour: React.FC<TourProps> = ({ run, steps, handleJoyrideCallback }) => {
  return (
    <Joyride
      run={run}
      steps={steps}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          arrowColor: '#ffffff',
          backgroundColor: '#ffffff',
          primaryColor: '#007bff',
          textColor: '#333333',
          zIndex: 1000,
        },
        buttonClose: {
          color: '#555555',
        },
        buttonNext: {
            backgroundColor: '#005fcc',
        },
        buttonBack: {
            color: '#555555',
        }
      }}
    />
  );
};

export default Tour; 