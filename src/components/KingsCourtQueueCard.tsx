import React from 'react';
import type { Team } from '../types';

interface KingsCourtQueueCardProps {
  teamQueue?: Team[];
  onAddToQueue: () => void;
  onRemoveFromQueue: (index: number) => void;
}

export const KingsCourtQueueCard: React.FC<KingsCourtQueueCardProps> = ({
  teamQueue,
  onAddToQueue,
  onRemoveFromQueue
}) => {
  // Defensive check for undefined teamQueue
  if (!teamQueue) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl shadow-soft p-4">
        <div className="text-center py-8 text-amber-600">
          <div className="text-3xl mb-3">👑</div>
          <h4 className="text-heading-5 text-amber-800 mb-1">Loading...</h4>
          <p className="text-caption">Please wait while the queue loads.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl shadow-soft">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-3">
        <div>
          <h3 className="text-heading-3 text-amber-900 font-bold">
            Kings Court Queue
          </h3>
          <p className="text-caption text-amber-700">
            {teamQueue.length} team{teamQueue.length !== 1 ? 's' : ''} waiting
          </p>
        </div>
        <button
          onClick={onAddToQueue}
          className="btn-primary text-xs flex items-center shadow-md bg-amber-600 hover:bg-amber-700 border-amber-600"
          aria-label="Add team to Kings Court queue"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Team
        </button>
      </div>
      
      {/* Divider */}
      <div className="border-t border-amber-200 mx-4"></div>
      
      {/* Content */}
      <div className="px-4 pb-4">
        <div className="max-h-[400px] overflow-y-auto">
          {teamQueue.length === 0 ? (
            <div className="text-center py-8 text-amber-600">
              <div className="text-3xl mb-3">👑</div>
              <h4 className="text-heading-5 text-amber-800 mb-1">No teams in queue</h4>
              <p className="text-caption">Add teams to challenge the Kings Court!</p>
            </div>
          ) : (
            <div className="space-y-3 pt-3">
              {teamQueue.map((team, index) => (
                <div key={`${team.name}-${index}`} className="bg-white rounded-xl shadow-medium border-2 border-amber-300 relative group p-4">
                  <button
                    onClick={() => onRemoveFromQueue(index)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-error-600 text-lg font-bold leading-none"
                    title="Remove from Kings Court queue"
                    aria-label={`Remove ${team.name} from Kings Court queue`}
                  >
                    ×
                  </button>
                  <h4 className="text-heading-5 text-amber-900 mb-3 text-center pr-6 break-words">
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
      </div>
    </div>
  );
}; 