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
    <div className={`card ${className}`}>
      {/* Header */}
      <button
        onClick={handleToggle}
        className="w-full flex justify-between items-center p-6 transition-all duration-200 hover:bg-gray-50/50 rounded-t-2xl"
        aria-expanded={isOpen}
        aria-controls="accordion-content"
      >
        <h2 className={`text-heading-3 font-bold ${titleClassName}`}>
          {title}
        </h2>
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Divider - only show when accordion is open */}
      {isOpen && (
        <div className="border-t border-gray-200 mx-6"></div>
      )}
      
      {/* Content */}
      <div 
        id="accordion-content"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}; 