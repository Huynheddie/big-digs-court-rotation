import React from 'react';
import type { Team } from '../types';

interface TeamsCardProps {
  teams: Team[];
  onOpenModal: () => void;
  onOpenTeamDetails: (teamIndex: number) => void;
}

export const TeamsCard: React.FC<TeamsCardProps> = ({
  teams,
  onOpenModal,
  onOpenTeamDetails
}) => {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-100 border border-orange-200 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <h2 className="text-2xl font-bold text-orange-900">
          Teams ({teams.length})
        </h2>
        <button
          onClick={onOpenModal}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center shadow-md"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Team
        </button>
      </div>
      
      {/* Divider */}
      <div className="border-t-2 border-orange-200 mx-6"></div>
      
      {/* Content */}
      <div className="px-6 pb-6">
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team, index) => (
              <div 
                key={team.name} 
                onClick={() => onOpenTeamDetails(index)}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-orange-300 shadow-md hover:shadow-lg transition-all duration-200 relative cursor-pointer hover:scale-105"
              >
                <h3 className="text-lg font-semibold text-orange-900 text-center mb-2 break-words">
                  {team.name}
                </h3>
                <div className="text-center mb-3 text-sm text-orange-600">
                  Click to edit team details
                </div>
                <div className="space-y-2">
                  {team.players.map((player, playerIndex) => (
                    <div key={playerIndex} className="flex items-center justify-between p-2 bg-orange-50/60 rounded border border-orange-200">
                      <span className="text-orange-800 font-medium text-sm">{player}</span>
                      <span className="text-xs text-orange-700 bg-orange-200 px-2 py-1 rounded">
                        P{playerIndex + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 