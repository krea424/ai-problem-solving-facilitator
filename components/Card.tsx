
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', icon }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center mb-4">
        {icon && <div className="mr-3 text-gray-500">{icon}</div>}
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <div className="text-gray-600">
        {children}
      </div>
    </div>
  );
};

export default Card;
