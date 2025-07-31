import React, { useState } from 'react';
import { GameTracker } from './GameTracker';
import type { GameEvent } from '../types';

interface SidebarProps {
  gameEvents: GameEvent[];
  onToggle?: (isExpanded: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ gameEvents, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onToggle?.(newExpandedState);
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400 border-r border-blue-300 transition-all duration-300 ease-in-out flex-shrink-0 shadow-lg z-20 ${
        isExpanded ? 'w-80' : 'w-16'
      }`}
    >
      {/* Header/Toggle Button */}
      <div className="h-16 flex items-center justify-center border-b border-blue-300">
        <div className="flex items-center justify-center w-full h-full">
          {isExpanded ? (
            <div className="flex items-center justify-between w-full px-4">
              <div className="flex items-center space-x-2 text-white">
                <span className="text-lg">📊</span>
                <span className="font-semibold text-sm">Game Tracker</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white">
                  {gameEvents.length}
                </span>
              </div>
              <button
                onClick={handleToggle}
                className="text-white hover:bg-white/20 p-1 rounded transition-colors duration-200"
                title="Collapse sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-1">
              <span className="text-xs text-white/90 font-medium">Tracker</span>
              {gameEvents.length > 0 && (
                <span className="text-xs bg-white/20 text-white px-1.5 py-0.5 rounded-full">
                  {gameEvents.length}
                </span>
              )}
              <button
                onClick={handleToggle}
                className="text-white hover:bg-white/20 p-1 rounded transition-colors duration-200 mt-2"
                title="Expand sidebar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`transition-opacity duration-300 h-[calc(100vh-4rem)] ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <GameTracker gameEvents={gameEvents} />
      </div>

      {/* Collapsed State Indicator */}
      {!isExpanded && gameEvents.length > 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
}; 