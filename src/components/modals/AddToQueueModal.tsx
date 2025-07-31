import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Team } from '../../types';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface AddToQueueModalProps {
  isOpen: boolean;
  availableTeams: Team[];
  selectedTeams: number[];
  onToggleTeamSelection: (teamIndex: number) => void;
  onSelectAllTeams: () => void;
  onAddSelectedTeams: () => void;
  onCancel: () => void;
  setSelectedTeams: (teams: number[]) => void;
}

export const AddToQueueModal: React.FC<AddToQueueModalProps> = ({
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

  useEffect(() => {
    console.log('=== MODAL STATE DEBUG ===');
    console.log('Current selectedTeams:', selectedTeams);
    console.log('SelectedTeams length:', selectedTeams.length);
    console.log('Available teams length:', availableTeams.length);
    console.log('Available teams:', availableTeams.map(t => t.name));
    console.log('========================');
  }, [selectedTeams, availableTeams]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 pr-8"
        onClick={onCancel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-2xl p-8 max-w-6xl w-full mx-auto max-h-[95vh] flex flex-col shadow-large"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 35,
            duration: 0.25
          }}
        >
        <h2 id="modal-title" className="text-heading-2 text-primary-900 mb-6 text-center">
          Add Teams to Queue
        </h2>
        
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              console.log('Select All clicked, setting all teams directly');
              console.log('Available teams count:', availableTeams.length);
              console.log('Available teams:', availableTeams.map(t => t.name));
              // Create indices for all available teams
              const allIndices = Array.from({ length: availableTeams.length }, (_, i) => i);
              console.log('Setting indices:', allIndices);
              setSelectedTeams(allIndices);
            }}
            disabled={availableTeams.length === 0}
            className={`bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 text-sm flex items-center shadow-md ${
              availableTeams.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Select All
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-6">
          {availableTeams.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">🏐</div>
              <p className="text-body-small">No teams available to add</p>
              <p className="text-caption mt-2">All teams are either on courts or in the queue</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 py-4">
              {availableTeams.map((team, index) => {
                const isSelected = selectedTeams.includes(index);
                console.log(`Team ${team.name} (index ${index}): selected = ${isSelected}, selectedTeams length: ${selectedTeams.length}, selectedTeams contents:`, selectedTeams);
                console.log(`Rendering team card for ${team.name} with isSelected = ${isSelected}`);
                return (
                  <motion.div 
                    key={team.name} 
                    className={`bg-white rounded-2xl p-6 cursor-pointer shadow-medium ${
                      isSelected
                        ? 'border-4 border-primary-700 bg-primary-100 shadow-large ring-4 ring-primary-300' 
                        : 'border-2 border-gray-300'
                    }`}
                    style={{
                      border: isSelected ? '4px solid #1d4ed8' : '2px solid #d1d5db',
                      backgroundColor: isSelected ? '#dbeafe' : 'white',
                      boxShadow: isSelected ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 25,
                      delay: index * 0.1
                    }}
                    onClick={() => {
                      console.log(`Clicked on team ${team.name} (index ${index})`);
                      onToggleTeamSelection(index);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${team.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggleTeamSelection(index);
                      }
                    }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-heading-4 text-gray-900 text-center break-words flex-1">
                        {team.name}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {team.players.map((player, playerIndex) => (
                        <div key={playerIndex} className="flex items-center justify-between p-4 bg-gray-100/80 rounded-xl border border-gray-300">
                          <span className="text-gray-800 font-medium text-sm flex-1 mr-4 min-w-0">
                            <span className="block truncate" title={player}>{player}</span>
                          </span>
                          <span className="text-xs text-gray-700 bg-gray-300 px-3 py-1 rounded-lg font-medium flex-shrink-0">
                            P{playerIndex + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-body-small text-primary-700 font-medium">
            {selectedTeams.length} team{selectedTeams.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors duration-200 shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={onAddSelectedTeams}
              disabled={selectedTeams.length === 0}
              className={`bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 shadow-md ${
                selectedTeams.length === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              Add {selectedTeams.length} Team{selectedTeams.length !== 1 ? 's' : ''} to Queue
            </button>
          </div>
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 