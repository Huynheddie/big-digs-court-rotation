import React from 'react';
import type { Court } from '../types';
import {
  getCourtBackgroundClass,
  getCourtTextClass,
  getTeam1ColorClass,
  getTeam1BorderClass,
  getTeam1AccentClass,
  getTeam2ColorClass,
  getTeam2BorderClass,
  getTeam2AccentClass
} from '../utils/colorUtils';

interface CourtCardProps {
  court: Court;
  courtIndex: number;
  onReportGame: (courtIndex: number) => void;
  onClearTeams: (courtIndex: number) => void;
  onFillFromQueue: (courtIndex: number) => void;
  onOpenCourtDetails: (courtIndex: number) => void;
  teamQueueLength: number;
}

export const CourtCard: React.FC<CourtCardProps> = ({
  court,
  courtIndex,
  onReportGame,
  onClearTeams,
  onFillFromQueue,
  onOpenCourtDetails,
  teamQueueLength
}) => {
  const isKingsCourt = court.court === "Kings Court";
  const hasBothTeams = court.team1.name !== "No Team" && court.team2.name !== "No Team";
  const hasOneTeam = (court.team1.name !== "No Team" && court.team2.name === "No Team") || 
                     (court.team1.name === "No Team" && court.team2.name !== "No Team");
  const canFillFromQueue = (court.team1.name === "No Team" && court.team2.name === "No Team" && teamQueueLength >= 2) || 
                          (isKingsCourt && hasOneTeam && teamQueueLength >= 1);

  return (
    <div 
      className={`card p-6 cursor-pointer group ${getCourtBackgroundClass(court.netColor)} min-h-[400px] w-full`}
      onClick={() => onOpenCourtDetails(courtIndex)}
      role="button"
      tabIndex={0}
      aria-label={`${court.court} - Click to edit court details`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenCourtDetails(courtIndex);
        }
      }}
    >
      {/* Court Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <h2 className={`text-heading-3 ${getCourtTextClass(court.netColor)}`}>
            {court.court}
          </h2>
          {isKingsCourt && (
            <span className="text-2xl ml-3 animate-bounce-gentle" role="img" aria-label="Crown for Kings Court">
              👑
            </span>
          )}
        </div>
        <div className="text-caption text-gray-500">
          Click to edit court details
        </div>
      </div>

      {/* Teams Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-1">
        {/* Team 1 - Left Side */}
        <div className="space-y-3">
          <h3 className={`text-heading-4 mb-3 text-center ${getTeam1ColorClass(court.netColor)} break-words`}>
            {court.team1.name}
          </h3>
          <div className="space-y-2">
            {court.team1.players.map((player, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 bg-white/90 backdrop-blur-sm rounded-xl border shadow-sm ${getTeam1BorderClass(court.netColor)} group-hover:shadow-md transition-shadow duration-200`}
              >
                <span className="text-body-small font-medium text-gray-700 truncate">{player}</span>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getTeam1AccentClass(court.netColor)}`}>
                  P{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team 2 - Right Side */}
        <div className="space-y-3">
          <h3 className={`text-heading-4 mb-3 text-center ${getTeam2ColorClass(court.netColor)} break-words`}>
            {court.team2.name}
          </h3>
          <div className="space-y-2">
            {court.team2.players.map((player, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 bg-white/90 backdrop-blur-sm rounded-xl border shadow-sm ${getTeam2BorderClass(court.netColor)} group-hover:shadow-md transition-shadow duration-200`}
              >
                <span className="text-body-small font-medium text-gray-700 truncate">{player}</span>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getTeam2AccentClass(court.netColor)}`}>
                  P{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-auto" onClick={(e) => e.stopPropagation()}>
        {hasBothTeams && (
          <button
            onClick={() => onReportGame(courtIndex)}
            className="btn-success w-full text-sm"
            aria-label={`Finish game between ${court.team1.name} and ${court.team2.name}`}
          >
            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Finish Game
          </button>
        )}
        
        {canFillFromQueue && (
          <button
            onClick={() => onFillFromQueue(courtIndex)}
            className="btn-primary w-full text-sm"
            aria-label={`Fill ${court.court} from queue`}
          >
            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Fill from Queue
          </button>
        )}
        
        {(court.team1.name !== "No Team" || court.team2.name !== "No Team") && (
          <button
            onClick={() => onClearTeams(courtIndex)}
            className="btn-error w-full text-sm"
            aria-label={`Clear teams from ${court.court}`}
          >
            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Teams
          </button>
        )}
      </div>
    </div>
  );
}; 