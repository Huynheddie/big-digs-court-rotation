import React from 'react';

interface NavbarProps {
  currentPage: 'courts' | 'teams';
  onPageChange: (page: 'courts' | 'teams') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          {/* Navigation Links */}
          <div className="flex space-x-8">
            <button
              onClick={() => onPageChange('courts')}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 relative ${
                currentPage === 'courts'
                  ? 'text-blue-800'
                  : 'text-blue-700 hover:text-blue-900'
              }`}
            >
              🏐 Courts
              {currentPage === 'courts' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-800"></div>
              )}
            </button>
            <button
              onClick={() => onPageChange('teams')}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 relative ${
                currentPage === 'teams'
                  ? 'text-blue-800'
                  : 'text-blue-700 hover:text-blue-900'
              }`}
            >
              👥 Teams
              {currentPage === 'teams' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-800"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 