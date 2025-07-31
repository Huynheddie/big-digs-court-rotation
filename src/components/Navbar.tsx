import React from 'react';

interface NavbarProps {
  currentPage: 'courts' | 'teams';
  onPageChange: (page: 'courts' | 'teams') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-soft" role="navigation" aria-label="Main navigation" style={{ outline: 'none' }}>
      <div className="container-responsive">
        <div className="flex justify-center items-center h-16">
          {/* Navigation Links */}
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => onPageChange('courts')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                currentPage === 'courts'
                  ? 'bg-white text-primary-700 shadow-soft'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
              aria-label="View courts page"
              aria-current={currentPage === 'courts' ? 'page' : undefined}
            >
              <span className="flex items-center">
                <span className="mr-2" role="img" aria-hidden="true">🏐</span>
                Courts
              </span>
            </button>
            <button
              onClick={() => onPageChange('teams')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                currentPage === 'teams'
                  ? 'bg-white text-primary-700 shadow-soft'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
              aria-label="View teams page"
              aria-current={currentPage === 'teams' ? 'page' : undefined}
            >
              <span className="flex items-center">
                <span className="mr-2" role="img" aria-hidden="true">👥</span>
                Teams
              </span>
            </button>
          </div>

          {/* Right side - could be used for additional controls */}
          <div className="absolute right-4">
            <div className="text-caption text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}; 