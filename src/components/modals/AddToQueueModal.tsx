import React from 'react';
import type { Team } from '../../types';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface AddToQueueModalProps {
  isOpen: boolean;
  availableTeams: Team[];
  selectedTeams: Set<number>;
  onToggleTeamSelection: (teamIndex: number) => void;
  onSelectAllTeams: () => void;
  onAddSelectedTeams: () => void;
  onCancel: () => void;
}

export const AddToQueueModal: React.FC<AddToQueueModalProps> = ({
  isOpen,
  availableTeams,
  selectedTeams,
  onToggleTeamSelection,
  onSelectAllTeams,
  onAddSelectedTeams,
  onCancel
}) => {
  useEscapeKey(onCancel, isOpen);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div 
        className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Add Teams to Queue
        </h2>
        
        <div className="flex justify-end mb-4">
          <button
            onClick={onSelectAllTeams}
            disabled={availableTeams.length === 0}
            className={`font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center shadow-md ${
              availableTeams.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Select All
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTeams.map((team, index) => (
              <div 
                key={team.name} 
                className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 border-2 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg ${
                  selectedTeams.has(index) 
                    ? 'border-blue-500 bg-blue-50/80' 
                    : 'border-blue-200 hover:border-blue-300'
                }`}
                onClick={() => onToggleTeamSelection(index)}
              >
                <h3 className="text-lg font-semibold text-blue-900 mb-3 text-center break-words">
                  {team.name}
                </h3>
                <div className="space-y-2">
                  {team.players.map((player, playerIndex) => (
                    <div key={playerIndex} className="flex items-center justify-between p-2 bg-blue-50/60 rounded border border-blue-200">
                      <span className="text-blue-800 font-medium text-sm">{player}</span>
                      <span className="text-xs text-blue-700 bg-blue-200 px-2 py-1 rounded">
                        P{playerIndex + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-blue-700 font-medium">
            {selectedTeams.size} team{selectedTeams.size !== 1 ? 's' : ''} selected
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors duration-200 shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={onAddSelectedTeams}
              disabled={selectedTeams.size === 0}
              className={`py-2 px-6 rounded-lg font-medium transition-colors duration-200 shadow-md ${
                selectedTeams.size === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Add {selectedTeams.size} Team{selectedTeams.size !== 1 ? 's' : ''} to Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 