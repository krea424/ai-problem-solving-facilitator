import React from 'react';

const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className="w-6 h-6"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H12m4.5 0H7.5m9 0h-4.5M12 3.75v10.5" 
    />
  </svg>
);

export default SaveIcon; 