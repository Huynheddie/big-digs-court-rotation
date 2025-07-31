import React from 'react';
import type { GameEvent } from '../types';

interface GameTrackerProps {
  gameEvents: GameEvent[];
}

export const GameTracker: React.FC<GameTrackerProps> = ({ gameEvents }) => {
  const getEventIcon = (type: GameEvent['type']) => {
    switch (type) {
      case 'court_cleared':
        return '🧹';
      case 'teams_added':
        return '🏐';
      case 'game_reported':
        return '📊';
      case 'team_deleted':
        return '🗑️';
      case 'team_added':
        return '➕';
      default:
        return '📝';
    }
  };

  const getEventColor = (type: GameEvent['type']) => {
    switch (type) {
      case 'court_cleared':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'teams_added':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'game_reported':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'team_deleted':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'team_added':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  const getConciseDescription = (event: GameEvent) => {
    switch (event.type) {
      case 'court_cleared':
        return `Court ${event.courtNumber} cleared`;
      case 'teams_added':
        return `${event.teams?.[0]?.name} vs ${event.teams?.[1]?.name} on Court ${event.courtNumber}`;
      case 'game_reported':
        return `${event.teams?.[0]?.name} vs ${event.teams?.[1]?.name} - ${event.score}`;
      case 'team_deleted':
        return `Team "${event.description.split('"')[1]}" deleted`;
      case 'team_added':
        return `Team "${event.description.split('"')[1]}" added`;
      default:
        return event.description;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {gameEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-sm">No events yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {gameEvents.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border ${getEventColor(event.type)} transition-all duration-200 hover:shadow-sm`}
              >
                <div className="flex items-start space-x-2">
                  <div className="text-lg flex-shrink-0">
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-tight">
                      {getConciseDescription(event)}
                    </p>
                  </div>
                  <div className="text-xs opacity-75 flex-shrink-0">
                    {formatTimestamp(event.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 