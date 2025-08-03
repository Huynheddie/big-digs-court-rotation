import React from 'react';
import { motion } from 'framer-motion';

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
          <div className="flex space-x-1 bg-gray-100/50 backdrop-blur-sm rounded-xl p-1 relative border border-gray-200/50">
            {/* Animated Background */}
            <motion.div
              className="absolute inset-0 bg-white/80 rounded-lg shadow-soft"
              layoutId="navbar-background"
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 30 
              }}
              style={{
                left: currentPage === 'courts' ? '0%' : '50%',
                width: '50%'
              }}
            />
            
            <button
              onClick={() => onPageChange('courts')}
              className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              aria-label="View courts page"
              aria-current={currentPage === 'courts' ? 'page' : undefined}
            >
              <span className={`flex items-center transition-colors duration-200 ${
                currentPage === 'courts' ? 'text-primary-700' : 'text-gray-600 hover:text-gray-900'
              }`}>
                <span className="mr-2" role="img" aria-hidden="true">🏐</span>
                Courts
              </span>
            </button>
            <button
              onClick={() => onPageChange('teams')}
              className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              aria-label="View teams page"
              aria-current={currentPage === 'teams' ? 'page' : undefined}
            >
              <span className={`flex items-center transition-colors duration-200 ${
                currentPage === 'teams' ? 'text-primary-700' : 'text-gray-600 hover:text-gray-900'
              }`}>
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