import React, { useState } from 'react';
import type { GameEvent } from '../types';

interface GameTrackerProps {
  gameEvents: GameEvent[];
}

export const GameTracker: React.FC<GameTrackerProps> = ({ gameEvents }) => {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const getEventIcon = (type: GameEvent['type']) => {
    switch (type) {
      case 'court_cleared':
        return '❌';
      case 'teams_added':
        return '🏐';
      case 'game_reported':
        return '📊';
      case 'team_deleted':
        return '🗑️';
      case 'team_added':
        return '➕';
      case 'teams_queued':
        return '⏳';
      default:
        return '📝';
    }
  };

  const getNetColorClasses = (netColor?: string) => {
    switch (netColor) {
      case 'red':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'blue':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'green':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
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

  const formatTimestampWithSeconds = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  const getConciseDescription = (event: GameEvent) => {
    switch (event.type) {
      case 'court_cleared':
        return `${event.courtNumber} cleared`;
      case 'teams_added':
        return `${event.teams?.[0]?.name} vs ${event.teams?.[1]?.name}`;
      case 'game_reported':
        return `${event.teams?.[0]?.name} vs ${event.teams?.[1]?.name} - ${event.score}`;
      case 'team_deleted':
        return `Team "${event.description.split('"')[1]}" deleted`;
      case 'team_added':
        return `Team "${event.description.split('"')[1]}" added`;
      case 'teams_queued':
        return `${event.teams?.map(team => team.name).join(', ')} added to queue`;
      default:
        return event.description;
    }
  };

  const getDetailedDescription = (event: GameEvent) => {
    switch (event.type) {
      case 'court_cleared':
        return `${event.courtNumber} was cleared.`;
      case 'teams_added':
        return `Two new teams were added to ${event.courtNumber}.`;
      case 'game_reported':
        return `A game on ${event.courtNumber} has been completed.`;
      case 'team_deleted':
        const teamName = event.description.split('"')[1];
        return `Team "${teamName}" has been permanently removed from the system.`;
      case 'team_added':
        const newTeamName = event.description.split('"')[1];
        return `A new team "${newTeamName}" has been registered in the system.`;
      case 'teams_queued':
        return `Teams were added to the waiting queue.`;
      default:
        return event.description;
    }
  };

  const toggleEvent = (eventId: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {gameEvents.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-sm">No events yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {gameEvents.map((event) => {
              const isExpanded = expandedEvents.has(event.id);
              return (
                <div
                  key={event.id}
                  className={`rounded-lg border transition-all duration-200 ${getNetColorClasses(event.netColor)}`}
                >
                  {/* Event Header - Clickable */}
                  <button
                    onClick={() => toggleEvent(event.id)}
                    className="w-full p-3 text-left hover:bg-opacity-80 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="text-lg flex-shrink-0">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium leading-tight break-words">
                          {getConciseDescription(event)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs opacity-75 flex-shrink-0">
                          {formatTimestamp(event.timestamp)}
                        </div>
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-current border-opacity-20">
                      <div className="pt-3 space-y-3">
                        {/* Detailed Description */}
                        <div>
                          <p className="text-xs leading-relaxed opacity-90 break-words">
                            {getDetailedDescription(event)}
                          </p>
                        </div>

                        {/* Teams Information */}
                        {event.teams && event.teams.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold mb-2 opacity-80">Teams Involved:</h4>
                            <div className="space-y-2">
                              {event.teams.map((team, index) => (
                                <div key={index} className="bg-white/20 rounded p-2">
                                  <p className="text-xs font-medium break-words">{team.name}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Score Information */}
                        {event.score && (
                          <div>
                            <h4 className="text-xs font-semibold mb-1 opacity-80">Final Score:</h4>
                            <p className="text-xs font-bold bg-white/30 px-2 py-1 rounded inline-block">
                              {event.score}
                            </p>
                          </div>
                        )}

                        {/* Court Information */}
                        {event.courtNumber && (
                          <div>
                            <h4 className="text-xs font-semibold mb-1 opacity-80">Court:</h4>
                            <p className="text-xs bg-white/30 px-2 py-1 rounded inline-block">
                              Court {event.courtNumber}
                            </p>
                          </div>
                        )}

                        {/* Time */}
                        <div>
                          <h4 className="text-xs font-semibold mb-1 opacity-80">Time:</h4>
                          <p className="text-xs opacity-75">
                            {formatTimestampWithSeconds(event.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}; 