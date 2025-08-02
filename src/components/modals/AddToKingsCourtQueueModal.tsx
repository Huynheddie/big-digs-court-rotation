import React from 'react';
import type { Team } from '../../types';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface AddToKingsCourtQueueModalProps {
  isOpen: boolean;
  availableTeams: Team[];
  selectedTeams: number[];
  onToggleTeamSelection: (teamIndex: number) => void;
  onSelectAllTeams: () => void;
  onAddSelectedTeams: () => void;
  onCancel: () => void;
  setSelectedTeams: (teams: number[]) => void;
}

export const AddToKingsCourtQueueModal: React.FC<AddToKingsCourtQueueModalProps> = ({
  isOpen,
  availableTeams,
  selectedTeams,
  onToggleTeamSelection,
  onSelectAllTeams,
  onAddSelectedTeams,
  onCancel,
  setSelectedTeams
}) => {
  useEscapeKey(onCancel, isOpen);

  if (!isOpen) return null;

  const handleSelectAll = () => {
    onSelectAllTeams();
  };

  const handleClearSelection = () => {
    setSelectedTeams([]);
  };

  const handleAddTeams = () => {
    onAddSelectedTeams();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6 w-full max-w-2xl mx-auto shadow-large max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-heading-2 text-amber-900">
            Add Teams to Kings Court Queue
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-body text-amber-800">
            Select teams to add to the Kings Court queue. These teams will be available to challenge the Kings Court.
          </p>
        </div>

        {/* Selection Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleSelectAll}
            className="btn-secondary text-sm bg-amber-600 hover:bg-amber-700 border-amber-600 text-white"
          >
            Select All Available
          </button>
          <button
            onClick={handleClearSelection}
            className="btn-secondary text-sm"
          >
            Clear Selection
          </button>
        </div>

        {/* Teams List */}
        <div className="mb-6">
          <h3 className="text-heading-4 text-amber-900 mb-4">
            Available Teams ({availableTeams.length})
          </h3>
          
          {availableTeams.length === 0 ? (
            <div className="text-center py-12 text-amber-600">
              <div className="text-4xl mb-4">👑</div>
              <p className="text-body-small">No teams available for Kings Court queue</p>
              <p className="text-caption text-amber-700 mt-2">
                All teams are either on courts or in queues
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {availableTeams.map((team, index) => (
                <div
                  key={`${team.name}-${index}`}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedTeams.includes(index)
                      ? 'bg-amber-200 border-amber-400 shadow-medium'
                      : 'bg-white border-amber-200 hover:border-amber-300 hover:shadow-soft'
                  }`}
                  onClick={() => onToggleTeamSelection(index)}
                >
                  {/* Selection Indicator */}
                  <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedTeams.includes(index)
                      ? 'bg-amber-600 border-amber-600'
                      : 'border-amber-300'
                  }`}>
                    {selectedTeams.includes(index) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  {/* Team Info */}
                  <h4 className="text-heading-5 text-amber-900 mb-3 pr-8 break-words">
                    {team.name}
                  </h4>
                  <div className="space-y-2">
                    {team.players.map((player, playerIndex) => (
                      <div key={playerIndex} className="flex items-center justify-between p-2 bg-amber-100/80 rounded-lg border border-amber-300">
                        <span className="text-amber-900 font-medium text-xs truncate mr-2">{player}</span>
                        <span className="text-xs text-amber-800 bg-amber-300 px-2 py-1 rounded-md font-medium flex-shrink-0">
                          P{playerIndex + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-amber-200">
          <button
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleAddTeams}
            disabled={selectedTeams.length === 0}
            className="btn-primary flex-1 bg-amber-600 hover:bg-amber-700 border-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add {selectedTeams.length} Team{selectedTeams.length !== 1 ? 's' : ''} to Kings Court Queue
          </button>
        </div>
      </div>
    </div>
  );
}; 