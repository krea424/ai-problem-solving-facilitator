import React from 'react';

const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c1.431.923 3.043 1.521 4.92 1.521s3.489-.598 4.92-1.521zM12 3a7.5 7.5 0 00-7.5 7.5c0 3.364 2.12 6.22 5.163 7.218h4.674c3.043-.998 5.163-3.854 5.163-7.218A7.5 7.5 0 0012 3z" 
    />
  </svg>
);

export default LightBulbIcon; 