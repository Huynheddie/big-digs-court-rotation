import React, { useState } from 'react';
import { GameTracker } from './GameTracker';
import type { GameEvent } from '../types';

interface SidebarProps {
  gameEvents: GameEvent[];
}

export const Sidebar: React.FC<SidebarProps> = ({ gameEvents }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-gradient-to-b from-purple-50 to-pink-100 border-r border-purple-200 transition-all duration-300 ease-in-out z-10 cursor-pointer ${
        isExpanded ? 'w-80' : 'w-16'
      }`}
      onClick={handleToggle}
    >
      {/* Header/Toggle Button */}
      <div className="h-16 flex items-center justify-center border-b border-purple-200">
        <div className="flex items-center justify-center w-full h-full transition-colors duration-200 hover:bg-purple-100">
          {isExpanded ? (
            <div className="flex items-center space-x-2 text-purple-700">
              <span className="text-lg">📊</span>
              <span className="font-semibold text-sm">Game Tracker</span>
              <span className="text-xs bg-purple-200 px-2 py-1 rounded-full">
                {gameEvents.length}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-1">
              <span className="text-xl">📊</span>
              <span className="text-xs text-purple-600 font-medium">Tracker</span>
              {gameEvents.length > 0 && (
                <span className="text-xs bg-purple-200 text-purple-700 px-1.5 py-0.5 rounded-full">
                  {gameEvents.length}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <GameTracker gameEvents={gameEvents} />
      </div>

      {/* Collapsed State Indicator */}
      {!isExpanded && gameEvents.length > 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
}; 