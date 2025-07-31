import React from 'react';

interface NavbarProps {
  currentPage: 'courts' | 'teams';
  onPageChange: (page: 'courts' | 'teams') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-transparent backdrop-blur-md border border-gray-200/50 shadow-large rounded-2xl" role="navigation" aria-label="Main navigation" style={{ outline: 'none' }}>
      <div className="px-6 py-3">
        <div className="flex justify-center items-center">
          {/* Navigation Links */}
          <div className="flex space-x-1 bg-transparent rounded-xl p-1">
            <button
              onClick={() => onPageChange('courts')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                currentPage === 'courts'
                  ? 'bg-white/20 text-primary-700 shadow-soft'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/20'
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
                  ? 'bg-white/20 text-primary-700 shadow-soft'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/20'
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
        </div>
      </div>
    </nav>
  );
}; 