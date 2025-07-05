import React from 'react';

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 10.5h.008v.008h-.008v-.008zM18.25 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zM12 21a.375.375 0 100-.75.375.375 0 000 .75z"
    />
     <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 3c-4.39 0-8 3.58-8 8s3.61 8 8 8c4.39 0 8-3.58 8-8s-3.61-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6c3.31 0 6 2.69 6 6s-2.69 6-6 6z"
    />
  </svg>
);

export default BrainIcon; 