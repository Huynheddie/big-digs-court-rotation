import React, { useState } from 'react';
import type { GameEvent, Court, Team } from '../types';

interface GameTrackerProps {
  gameEvents: GameEvent[];
  onResetToEvent: (eventId: string) => void;
  currentState?: {
    teams: Court[];
    registeredTeams: Team[];
    teamQueue: Team[];
  };
}

export const GameTracker: React.FC<GameTrackerProps> = ({ gameEvents, onResetToEvent, currentState }) => {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const getEventIcon = (type: GameEvent['type']) => {
    switch (type) {
      case 'court_cleared':
        return '❌';
      case 'teams_added':
        return '👥';
      case 'game_reported':
        return '🏆';
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
        return `${event.courtNumber || 'Unknown Court'} cleared`;
      case 'teams_added':
        if (event.teams && event.teams.length === 1) {
          // Single team added (Kings Court scenario)
          const teamName = event.teams[0]?.name || 'Unknown Team';
          const courtName = event.courtNumber || 'Unknown Court';
          return `${teamName} joins ${courtName}`;
        } else {
          // Multiple teams added (Challenger Court scenario)
          const team1Name = event.teams?.[0]?.name || 'Unknown Team';
          const team2Name = event.teams?.[1]?.name || 'Unknown Team';
          return `${team1Name} vs ${team2Name}`;
        }
      case 'game_reported':
        if (event.winner && event.loser) {
          return `${event.winner.name} beat ${event.loser.name} ${event.score || ''}`;
        }
        const gameTeam1Name = event.teams?.[0]?.name || 'Unknown Team';
        const gameTeam2Name = event.teams?.[1]?.name || 'Unknown Team';
        return `${gameTeam1Name} vs ${gameTeam2Name} - ${event.score || 'No Score'}`;
      case 'team_deleted':
        const deletedTeamName = event.description.split('"')[1] || 'Unknown Team';
        return `Team "${deletedTeamName}" deleted`;
      case 'team_added':
        const addedTeamName = event.description.split('"')[1] || 'Unknown Team';
        return `Team "${addedTeamName}" added`;
      case 'teams_queued':
        const queuedTeamNames = event.teams?.map(team => team.name || 'Unknown Team').join(', ') || 'No teams';
        return `${queuedTeamNames} added to queue`;
      default:
        return event.description || 'Event occurred';
    }
  };

  const getDetailedDescription = (event: GameEvent) => {
    switch (event.type) {
      case 'court_cleared':
        return `${event.courtNumber || 'Unknown Court'} was cleared.`;
      case 'teams_added':
        if (event.teams && event.teams.length === 1) {
          // Single team added (Kings Court scenario)
          return event.description || `A team was added to ${event.courtNumber || 'a court'}.`;
        } else {
          // Multiple teams added (Challenger Court scenario)
          return `Two new teams were added to ${event.courtNumber || 'a court'}.`;
        }
      case 'game_reported':
        // Check if this is a Kings Court game and has winner/loser info
        if (event.courtNumber === 'Kings Court' && event.winner && event.loser) {
          // Check if the description indicates a second consecutive win
          if (event.description.includes('second consecutive game')) {
            return `<em>${event.winner.name}</em> wins their second consecutive game and must now leave the court.`;
          } else {
            return `<em>${event.winner.name}</em> stays on the court, <em>${event.loser.name}</em> leaves.`;
          }
        }
        return `A game on ${event.courtNumber || 'a court'} has been completed.`;
      case 'team_deleted':
        const teamName = event.description.split('"')[1] || 'Unknown Team';
        return `Team "${teamName}" has been permanently removed from the system.`;
      case 'team_added':
        const newTeamName = event.description.split('"')[1] || 'Unknown Team';
        return `A new team "${newTeamName}" has been registered in the system.`;
      case 'teams_queued':
        return `Teams were added to the waiting queue.`;
      default:
        return event.description || 'An event occurred in the system.';
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

  // Function to compare current state with event state
  const isStateSimilar = (eventState: { teams: Court[]; registeredTeams: Team[]; teamQueue: Team[] }) => {
    // Check if currentState is available
    if (!currentState) return false;
    
    // Compare teams (courts)
    if (eventState.teams.length !== currentState.teams.length) return false;
    for (let i = 0; i < eventState.teams.length; i++) {
      const eventCourt = eventState.teams[i];
      const currentCourt = currentState.teams[i];
      if (eventCourt.team1.name !== currentCourt.team1.name || 
          eventCourt.team2.name !== currentCourt.team2.name) {
        return false;
      }
    }

    // Compare registered teams
    if (eventState.registeredTeams.length !== currentState.registeredTeams.length) return false;
    for (let i = 0; i < eventState.registeredTeams.length; i++) {
      if (eventState.registeredTeams[i].name !== currentState.registeredTeams[i].name) {
        return false;
      }
    }

    // Compare team queue
    if (eventState.teamQueue.length !== currentState.teamQueue.length) return false;
    for (let i = 0; i < eventState.teamQueue.length; i++) {
      if (eventState.teamQueue[i].name !== currentState.teamQueue[i].name) {
        return false;
      }
    }

    return true;
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
                        {/* Winner/Loser Information */}
                        {event.winner && event.loser && (
                          <div>
                            <h4 className="text-xs font-semibold mb-2 opacity-80">Game Results:</h4>
                            <div className="space-y-2">
                              <div className="bg-green-600/80 rounded p-2 border border-green-400">
                                <p className="text-xs font-bold text-white">🏆 Winner: {event.winner.name}</p>
                              </div>
                              <div className="bg-red-600/80 rounded p-2 border border-red-400">
                                <p className="text-xs font-bold text-white">❌ Loser: {event.loser.name}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Detailed Description */}
                        <div>
                          <p 
                            className="text-xs leading-relaxed opacity-90 break-words"
                            dangerouslySetInnerHTML={{ __html: getDetailedDescription(event) }}
                          />
                        </div>

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
                              {event.courtNumber}
                            </p>
                          </div>
                        )}

                        {/* Time */}
                        <div>
                          <h4 className="text-xs font-semibold mb-1 opacity-80">Time:</h4>
                          <p className="text-xs opacity-75 bg-white/30 px-2 py-1 rounded inline-block">
                            {formatTimestampWithSeconds(event.timestamp)}
                          </p>
                        </div>

                        {/* Reset Button */}
                        <div className="pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Are you sure you want to reset the application state to this point? This will delete all events after this one and cannot be undone.')) {
                                onResetToEvent(event.id);
                              }
                            }}
                            disabled={event.stateSnapshot && isStateSimilar(event.stateSnapshot)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors duration-200 flex items-center justify-center space-x-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            title={event.stateSnapshot && isStateSimilar(event.stateSnapshot) ? "Current state is already similar to this point" : "Reset application state to this point in time"}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Reset to This Point</span>
                          </button>
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