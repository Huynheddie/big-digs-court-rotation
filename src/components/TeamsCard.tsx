import React from 'react';
import { motion } from 'framer-motion';
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
    <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 border border-secondary-200 rounded-2xl shadow-soft">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4">
        <h2 className="text-heading-2 text-secondary-900">
          Teams ({teams.length})
        </h2>
        <button
          onClick={onOpenModal}
          className="bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 text-sm flex items-center shadow-md"
          aria-label="Add new team"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Team
        </button>
      </div>
      
      {/* Divider */}
      <div className="border-t border-secondary-200 mx-6"></div>
      
      {/* Content */}
      <div className="px-6 pb-6">
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
          {teams.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-6">👥</div>
              <h3 className="text-heading-4 text-gray-700 mb-2">No teams yet</h3>
              <p className="text-body-small mb-6">Get started by adding your first team!</p>
              <button
                onClick={onOpenModal}
                className="bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 flex items-center shadow-md"
                aria-label="Add your first team"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Team
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 px-2">
              {teams.map((team, index) => (
                <motion.div 
                  key={team.name} 
                  onClick={() => onOpenTeamDetails(index)}
                  className="card-glass border-secondary-300 relative cursor-pointer group p-6"
                  whileHover={{ 
                    scale: 1.03,
                    y: -8,
                    transition: { 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      duration: 0.6
                    }
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${team.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onOpenTeamDetails(index);
                    }
                  }}
                >
                  <h3 className="text-heading-4 text-secondary-900 text-center mb-4 break-words">
                    {team.name}
                  </h3>
                  <div className="text-center mb-6 text-caption text-secondary-700">
                    Click to view team details
                  </div>
                  <div className="space-y-4">
                    {team.players.map((player, playerIndex) => (
                      <div key={playerIndex} className="flex items-center justify-between p-4 bg-secondary-50/60 rounded-xl border border-secondary-200 transition-all duration-800 ease-out">
                        <span className="text-body font-medium text-secondary-800 truncate mr-4">{player}</span>
                        <span className="text-xs text-secondary-700 bg-secondary-200 px-4 py-2 rounded-lg font-medium flex-shrink-0">
                          P{playerIndex + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="absolute inset-0 border-2 border-secondary-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-out pointer-events-none"></div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 