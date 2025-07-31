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
  return (
    <div 
      className={`rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 min-w-[400px] ${getCourtBackgroundClass(court.netColor)}`}
      onClick={() => onOpenCourtDetails(courtIndex)}
    >
      {/* Court Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <h2 className={`text-2xl font-bold ${getCourtTextClass(court.netColor)}`}>
            {court.court}
          </h2>
          {court.court === "Kings Court" && (
            <span className="text-2xl ml-2">👑</span>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Click to edit court details
        </div>
      </div>

      {/* Teams Side by Side */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Team 1 - Left Side */}
        <div>
          <h3 className={`text-lg font-semibold mb-3 text-center ${getTeam1ColorClass(court.netColor)} break-words`}>
            {court.team1.name}
          </h3>
          <div className="space-y-2">
            {court.team1.players.map((player, index) => (
              <div key={index} className={`flex items-center justify-between p-2 bg-white/80 backdrop-blur-sm rounded-lg border shadow-sm ${getTeam1BorderClass(court.netColor)}`}>
                <span className="text-gray-700 font-medium text-sm">{player}</span>
                <span className={`text-xs px-2 py-1 rounded ${getTeam1AccentClass(court.netColor)}`}>
                  P{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team 2 - Right Side */}
        <div>
          <h3 className={`text-lg font-semibold mb-3 text-center ${getTeam2ColorClass(court.netColor)} break-words`}>
            {court.team2.name}
          </h3>
          <div className="space-y-2">
            {court.team2.players.map((player, index) => (
              <div key={index} className={`flex items-center justify-between p-2 bg-white/80 backdrop-blur-sm rounded-lg border shadow-sm ${getTeam2BorderClass(court.netColor)}`}>
                <span className="text-gray-700 font-medium text-sm">{player}</span>
                <span className={`text-xs px-2 py-1 rounded ${getTeam2AccentClass(court.netColor)}`}>
                  P{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-2" onClick={(e) => e.stopPropagation()}>
        {court.team1.name !== "No Team" && court.team2.name !== "No Team" && (
          <button
            onClick={() => onReportGame(courtIndex)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm shadow-md w-full"
          >
            Finish Game
          </button>
        )}
        {/* Fill from Queue - Show when both teams are empty, or when Kings Court has one team and queue has at least 1 team */}
        {((court.team1.name === "No Team" && court.team2.name === "No Team" && teamQueueLength >= 2) || 
          (court.court === "Kings Court" && 
           ((court.team1.name !== "No Team" && court.team2.name === "No Team") || 
            (court.team1.name === "No Team" && court.team2.name !== "No Team")) && 
           teamQueueLength >= 1)) && (
          <button
            onClick={() => onFillFromQueue(courtIndex)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm shadow-md w-full"
          >
            Fill from Queue
          </button>
        )}
        {(court.team1.name !== "No Team" || court.team2.name !== "No Team") && (
          <button
            onClick={() => onClearTeams(courtIndex)}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm shadow-md w-full"
          >
            Clear Teams
          </button>
        )}
      </div>
    </div>
  );
}; 