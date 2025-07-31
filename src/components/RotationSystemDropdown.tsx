import React, { useState, useRef, useEffect } from 'react';

interface RotationSystem {
  id: string;
  name: string;
  description: string;
}

interface RotationSystemDropdownProps {
  currentSystem: string;
  onSystemChange: (systemId: string) => void;
}

const rotationSystems: RotationSystem[] = [
  {
    id: '3-court-4v4',
    name: '3 Court 4v4',
    description: '2 Challenger Courts + 1 Kings Court'
  },
  {
    id: '4-court-mixed',
    name: '4 Court Mixed',
    description: 'Coming Soon - 4 Courts with Mixed Formats'
  }
];

export const RotationSystemDropdown: React.FC<RotationSystemDropdownProps> = ({
  currentSystem,
  onSystemChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSystemData = rotationSystems.find(system => system.id === currentSystem);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSystemSelect = (systemId: string) => {
    onSystemChange(systemId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span>🏐</span>
        <span>{currentSystemData?.name || 'Select System'}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="py-1">
            {rotationSystems.map((system) => {
              const isDisabled = system.id === '4-court-mixed';
              const isSelected = currentSystem === system.id;
              
              return (
                <button
                  key={system.id}
                  onClick={() => !isDisabled && handleSystemSelect(system.id)}
                  disabled={isDisabled}
                  className={`w-full text-left px-4 py-3 transition-colors duration-150 ${
                    isDisabled 
                      ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                      : isSelected 
                        ? 'bg-blue-50 border-r-2 border-blue-500 hover:bg-blue-100' 
                        : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-sm font-medium ${isDisabled ? 'text-gray-500' : 'text-gray-900'}`}>
                        {system.name}
                        {isDisabled && <span className="ml-2 text-xs text-gray-400">(Coming Soon)</span>}
                      </div>
                      <div className={`text-xs mt-1 ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                        {system.description}
                      </div>
                    </div>
                    {isSelected && !isDisabled && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {isDisabled && (
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}; 