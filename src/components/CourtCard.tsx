import React from 'react';
import type { Court } from '../types';
import {
  getCourtBackgroundClass,
  getCourtTextClass,
  getNetColorClass,
  getNetColorBgClass,
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
  netColorDropdownOpen: number | null;
  onNetColorChange: (courtIndex: number, newColor: string) => void;
  onNetColorDropdownToggle: (courtIndex: number) => void;
  onReportGame: (courtIndex: number) => void;
  onClearTeams: (courtIndex: number) => void;
  onFillFromQueue: (courtIndex: number) => void;
  teamQueueLength: number;
}

export const CourtCard: React.FC<CourtCardProps> = ({
  court,
  courtIndex,
  netColorDropdownOpen,
  onNetColorChange,
  onNetColorDropdownToggle,
  onReportGame,
  onClearTeams,
  onFillFromQueue,
  teamQueueLength
}) => {
  return (
    <div className={`rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${getCourtBackgroundClass(court.netColor)}`}>
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
        <div className="mt-2 text-sm font-medium relative">
          <div className="flex items-center justify-center">
            <span className={`${getCourtTextClass(court.netColor)}`}>Net Color:</span>
            <span className={`ml-1 ${getNetColorClass(court.netColor)}`}>
              {court.netColor.charAt(0).toUpperCase() + court.netColor.slice(1)}
            </span>
            <button
              onClick={() => onNetColorDropdownToggle(netColorDropdownOpen === courtIndex ? -1 : courtIndex)}
              className="ml-1 inline-flex items-center justify-center w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
          
          {/* Net Color Dropdown */}
          {netColorDropdownOpen === courtIndex && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
              {['red', 'blue', 'green', 'yellow'].map((color) => (
                <button
                  key={color}
                  onClick={() => onNetColorChange(courtIndex, color)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    court.netColor === color ? getNetColorBgClass(color) : ''
                  }`}
                >
                  <span className={getNetColorClass(color)}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          )}
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
      <div className="text-center space-y-2">
        {court.team1.name !== "No Team" && court.team2.name !== "No Team" && (
                      <button
              onClick={() => onReportGame(courtIndex)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm shadow-md w-full"
            >
              Finish Game
            </button>
        )}
        {court.team1.name === "No Team" && court.team2.name === "No Team" && teamQueueLength >= 2 && (
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