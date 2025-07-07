
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', icon, headerAction }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className} relative`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {icon && <div className="mr-3 text-gray-500">{icon}</div>}
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        {headerAction && <div className="ml-4">{headerAction}</div>}
      </div>
      <div className="text-gray-600">
        {children}
      </div>
    </div>
  );
};

export default Card;
