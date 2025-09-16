
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  isHighlighted?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, isHighlighted = false, className = '' }) => {
  const baseClasses = 'bg-white p-6 rounded-xl shadow-md border';
  const highlightClasses = isHighlighted ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200';

  return (
    <div className={`${baseClasses} ${highlightClasses} ${className}`}>
      {children}
    </div>
  );
};
