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
  expandEventId?: string;
  onExpandEventIdCleared?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  gameEvents,
  onResetToEvent,
  onToggle,
  currentState,
  expandEventId,
  onExpandEventIdCleared
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onToggle?.(newExpandedState);
  };

  // Effect to expand sidebar when expandEventId is provided
  React.useEffect(() => {
    if (expandEventId && !isExpanded) {
      setIsExpanded(true);
      onToggle?.(true);
    }
  }, [expandEventId, isExpanded, onToggle]);

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-secondary-300 via-secondary-200 to-secondary-100 border-r border-secondary-300 transition-all duration-300 ease-in-out flex-shrink-0 shadow-large z-20 ${
        isExpanded ? 'w-80' : 'w-16'
      } ${!isExpanded ? 'cursor-pointer' : ''}`}
      role="complementary"
      aria-label="Game tracker sidebar"
      onClick={!isExpanded ? handleToggle : undefined}
    >
      {/* Header/Toggle Button */}
      <div className={`h-16 flex items-center ${!isExpanded ? 'pb-8' : ''} bg-secondary-400/30 border-b-2 border-secondary-400/50 shadow-sm`}>
        <div className="flex items-center w-full h-full">
          {isExpanded ? (
            <div className="flex items-center justify-between w-full px-4 h-full">
              <div className="flex items-center space-x-3 text-secondary-900">
                <span className="font-semibold text-body">📊 Game Tracker</span>
                <span className="text-xs bg-secondary-600/20 px-3 py-1 rounded-full text-secondary-800 font-medium">
                  {gameEvents.length}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
                className="text-secondary-800 hover:bg-secondary-600/20 p-2 rounded-lg transition-colors duration-200"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3 pt-20 w-full px-4">
              <span className="text-xs text-secondary-800 font-medium text-center">📊 Tracker</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
                className="text-secondary-800 hover:bg-secondary-600/20 p-2 rounded-lg transition-colors duration-200"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`transition-opacity duration-300 h-[calc(100vh-4rem)] ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'} pt-2`}>
        <GameTracker gameEvents={gameEvents} onResetToEvent={onResetToEvent} currentState={currentState} expandEventId={expandEventId} onExpandEventIdCleared={onExpandEventIdCleared} />
      </div>

      {/* Collapsed State Indicator */}
      {!isExpanded && gameEvents.length > 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 bg-secondary-600/60 rounded-full animate-pulse" aria-hidden="true"></div>
        </div>
      )}
    </aside>
  );
}; 