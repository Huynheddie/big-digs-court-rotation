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
    id: '3-court-competitive',
    name: '3 Court Competitive',
    description: '2 Challenger Courts + 1 Kings Court'
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
            {rotationSystems.map((system) => (
              <button
                key={system.id}
                onClick={() => handleSystemSelect(system.id)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                  currentSystem === system.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{system.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{system.description}</div>
                  </div>
                  {currentSystem === system.id && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 