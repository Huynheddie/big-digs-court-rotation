import React, { useState, useEffect } from 'react';
import type { Court, Team } from '../../types';
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
} from '../../utils/colorUtils';

interface CourtDetailsModalProps {
  isOpen: boolean;
  court: Court | null;
  courtIndex: number | null;
  teamQueue: Team[];
  teams: Court[]; // Add teams array to check used colors
  onClose: () => void;
  onNetColorChange: (courtIndex: number, newColor: string) => void;
  onTeamChange: (courtIndex: number, teamPosition: 'team1' | 'team2', team: Team | null) => void;
}

export const CourtDetailsModal: React.FC<CourtDetailsModalProps> = ({
  isOpen,
  court,
  courtIndex,
  teamQueue,
  teams,
  onClose,
  onNetColorChange,
  onTeamChange
}) => {
  const [selectedTeam1, setSelectedTeam1] = useState<string>('');
  const [selectedTeam2, setSelectedTeam2] = useState<string>('');

  // Initialize selected teams when modal opens
  React.useEffect(() => {
    if (court) {
      setSelectedTeam1(court.team1.name !== "No Team" ? court.team1.name : '');
      setSelectedTeam2(court.team2.name !== "No Team" ? court.team2.name : '');
    }
  }, [court]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !court || courtIndex === null) {
    return null;
  }

  // Get teams available for Team 1 selection (queue + Team 1, excluding Team 2)
  const availableTeamsForTeam1 = [
    ...teamQueue,
    ...(court.team1.name !== "No Team" ? [court.team1] : [])
  ].filter(team => team.name !== court.team2.name);

  // Get teams available for Team 2 selection (queue + Team 2, excluding Team 1)
  const availableTeamsForTeam2 = [
    ...teamQueue,
    ...(court.team2.name !== "No Team" ? [court.team2] : [])
  ].filter(team => team.name !== court.team1.name);

  // Get used net colors from other courts
  const usedNetColors = teams
    .filter((c) => teams.indexOf(c) !== courtIndex) // Exclude current court
    .map(c => c.netColor);

  const handleTeam1Change = (teamName: string) => {
    setSelectedTeam1(teamName);
    const selectedTeam = availableTeamsForTeam1.find(team => team.name === teamName) || null;
    onTeamChange(courtIndex, 'team1', selectedTeam);
  };

  const handleTeam2Change = (teamName: string) => {
    setSelectedTeam2(teamName);
    const selectedTeam = availableTeamsForTeam2.find(team => team.name === teamName) || null;
    onTeamChange(courtIndex, 'team2', selectedTeam);
  };

  const handleRemoveTeam1 = () => {
    setSelectedTeam1('');
    onTeamChange(courtIndex, 'team1', null);
  };

  const handleRemoveTeam2 = () => {
    setSelectedTeam2('');
    onTeamChange(courtIndex, 'team2', null);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${getCourtBackgroundClass(court.netColor)}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <h2 className={`text-2xl font-bold ${getCourtTextClass(court.netColor)}`}>
              {court.court}
            </h2>
            {court.court === "Kings Court" && (
              <span className="text-2xl ml-2">👑</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Net Color Section */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${getCourtTextClass(court.netColor)}`}>
              Net Color
            </h3>
            <div className="flex flex-wrap gap-2">
              {['red', 'blue', 'green', 'yellow'].map((color) => {
                const isUsed = usedNetColors.includes(color);
                const isCurrentColor = court.netColor === color;
                const isDisabled = isUsed && !isCurrentColor;
                
                return (
                  <button
                    key={color}
                    onClick={() => !isDisabled && onNetColorChange(courtIndex, color)}
                    disabled={isDisabled}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                      isCurrentColor
                        ? `${getNetColorBgClass(color)} border-gray-400`
                        : isDisabled
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'
                        : 'bg-white border-gray-300 hover:border-gray-400 hover:scale-105'
                    }`}
                    title={isDisabled ? `Color ${color} is already in use by another court` : `Select ${color} net color`}
                  >
                    <span className={isDisabled ? 'text-gray-500' : getNetColorClass(color)}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Teams Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Team 1 */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${getTeam1ColorClass(court.netColor)}`}>
                Team 1
              </h3>
              
              {/* Team Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Select Team (Disabled)
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedTeam1}
                    onChange={(e) => handleTeam1Change(e.target.value)}
                    disabled
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    <option value="">Choose a team...</option>
                    {availableTeamsForTeam1.map((team) => (
                      <option key={team.name} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {court.team1.name !== "No Team" && (
                    <button
                      onClick={handleRemoveTeam1}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Current Team Display */}
              {court.team1.name !== "No Team" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h4 className={`font-semibold mb-3 text-center ${getTeam1ColorClass(court.netColor)}`}>
                    {court.team1.name}
                  </h4>
                  <div className="space-y-2">
                    {court.team1.players.map((player, index) => (
                      <div key={index} className={`flex items-center justify-between p-2 bg-gray-50 rounded border ${getTeam1BorderClass(court.netColor)} hover:bg-gray-100 transition-colors duration-200`}>
                        <span className="text-gray-700 font-medium text-sm">{player}</span>
                        <span className={`text-xs px-2 py-1 rounded ${getTeam1AccentClass(court.netColor)}`}>
                          P{index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Team 2 */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${getTeam2ColorClass(court.netColor)}`}>
                Team 2
              </h3>
              
              {/* Team Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Select Team (Disabled)
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedTeam2}
                    onChange={(e) => handleTeam2Change(e.target.value)}
                    disabled
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    <option value="">Choose a team...</option>
                    {availableTeamsForTeam2.map((team) => (
                      <option key={team.name} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {court.team2.name !== "No Team" && (
                    <button
                      onClick={handleRemoveTeam2}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Current Team Display */}
              {court.team2.name !== "No Team" && (
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow duration-200">
                  <h4 className={`font-semibold mb-3 text-center ${getTeam2ColorClass(court.netColor)}`}>
                    {court.team2.name}
                  </h4>
                  <div className="space-y-2">
                    {court.team2.players.map((player, index) => (
                      <div key={index} className={`flex items-center justify-between p-2 bg-gray-50 rounded border ${getTeam2BorderClass(court.netColor)} hover:bg-gray-100 transition-colors duration-200`}>
                        <span className="text-gray-700 font-medium text-sm">{player}</span>
                        <span className={`text-xs px-2 py-1 rounded ${getTeam2AccentClass(court.netColor)}`}>
                          P{index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Available Teams Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <h4 className="font-semibold text-gray-700 mb-2">Available Teams</h4>
            <div className="text-sm text-gray-600">
              <p>Teams in Queue: {teamQueue.length}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}; 