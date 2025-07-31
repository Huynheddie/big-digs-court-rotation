import React, { useState } from 'react';
import { GameTracker } from './GameTracker';
import type { GameEvent, Court, Team } from '../types';

interface SidebarProps {
  gameEvents: GameEvent[];
  onResetToEvent: (eventId: string) => void;
  onToggle?: (isExpanded: boolean) => void;
  currentState?: {
    teams: Court[];
    registeredTeams: Team[];
    teamQueue: Team[];
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  gameEvents,
  onResetToEvent,
  onToggle,
  currentState
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = () => {
    const newExpandedState = !isExpanded;
    console.log('Sidebar toggle clicked, new state:', newExpandedState);
    setIsExpanded(newExpandedState);
    onToggle?.(newExpandedState);
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-orange-300 via-orange-200 to-orange-100 border-r border-orange-300 transition-all duration-300 ease-in-out flex-shrink-0 shadow-lg z-50 pointer-events-auto ${
        isExpanded ? 'w-80' : 'w-16'
      }`}
    >
      {/* Header/Toggle Button */}
      <div className={`h-16 flex items-center border-b border-orange-300 ${!isExpanded ? 'pb-8' : ''}`}>
        <div className="flex items-center w-full h-full">
          {isExpanded ? (
            <div className="flex items-center justify-between w-full px-4 h-full">
              <div className="flex items-center space-x-2 text-orange-900">
                <span className="font-semibold text-sm">📊 Game Tracker</span>
                <span className="text-xs bg-orange-600/20 px-2 py-1 rounded-full text-orange-800">
                  {gameEvents.length}
                </span>
              </div>
              <button
                onClick={handleToggle}
                className="text-orange-800 hover:bg-orange-600/20 p-1 rounded transition-colors duration-200"
                title="Collapse sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 pt-16 w-full px-2">
              <span className="text-xs text-orange-800 font-medium text-center">📊 Tracker</span>
              <button
                onClick={handleToggle}
                className="text-orange-800 hover:bg-orange-600/20 p-1 rounded transition-colors duration-200 mt-2"
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
        <GameTracker gameEvents={gameEvents} onResetToEvent={onResetToEvent} currentState={currentState} />
      </div>

      {/* Collapsed State Indicator */}
      {!isExpanded && gameEvents.length > 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 bg-orange-600/60 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
}; 