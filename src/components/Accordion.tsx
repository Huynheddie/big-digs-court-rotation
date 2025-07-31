import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
  titleClassName?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  isOpen: controlledIsOpen,
  onToggle,
  className = '',
  titleClassName = ''
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  
  const handleToggle = () => {
    const newIsOpen = !isOpen;
    if (onToggle) {
      onToggle(newIsOpen);
    } else {
      setInternalIsOpen(newIsOpen);
    }
  };

  return (
    <div className={`rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <button
        onClick={handleToggle}
        className="w-full flex justify-between items-center p-6 transition-colors duration-200 hover:bg-opacity-90"
      >
        <h2 className={`text-2xl font-bold ${titleClassName}`}>
          {title}
        </h2>
        <svg
          className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Divider - only show when accordion is open */}
      {isOpen && (
        <div className="border-t-2 border-gray-300 mx-6"></div>
      )}
      
      {/* Content */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}; 