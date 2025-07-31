import React from 'react';
import type { FormData } from '../../types';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface AddTeamModalProps {
  isOpen: boolean;
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const AddTeamModal: React.FC<AddTeamModalProps> = ({
  isOpen,
  formData,
  onInputChange,
  onSubmit,
  onCancel
}) => {
  useEscapeKey(onCancel, isOpen);

  if (!isOpen) return null;

  const isTeamNameValid = formData.teamName.length <= 50;
  const teamNameCharCount = formData.teamName.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Team</h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Team Name */}
          <div>
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
              Team Name
            </label>
            <input
              type="text"
              id="teamName"
              name="teamName"
              value={formData.teamName}
              onChange={onInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !isTeamNameValid ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter team name"
              maxLength={50}
            />
            <div className="flex justify-between items-center mt-1">
              <span className={`text-xs ${!isTeamNameValid ? 'text-red-500' : 'text-gray-500'}`}>
                {!isTeamNameValid ? 'Team name must be 50 characters or less' : `${teamNameCharCount}/50 characters`}
              </span>
            </div>
          </div>

          {/* Player 1 */}
          <div>
            <label htmlFor="player1" className="block text-sm font-medium text-gray-700 mb-1">
              Player 1
            </label>
            <input
              type="text"
              id="player1"
              name="player1"
              value={formData.player1}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter player name"
            />
          </div>

          {/* Player 2 */}
          <div>
            <label htmlFor="player2" className="block text-sm font-medium text-gray-700 mb-1">
              Player 2
            </label>
            <input
              type="text"
              id="player2"
              name="player2"
              value={formData.player2}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter player name"
            />
          </div>

          {/* Player 3 */}
          <div>
            <label htmlFor="player3" className="block text-sm font-medium text-gray-700 mb-1">
              Player 3
            </label>
            <input
              type="text"
              id="player3"
              name="player3"
              value={formData.player3}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter player name"
            />
          </div>

          {/* Player 4 */}
          <div>
            <label htmlFor="player4" className="block text-sm font-medium text-gray-700 mb-1">
              Player 4
            </label>
            <input
              type="text"
              id="player4"
              name="player4"
              value={formData.player4}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter player name"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isTeamNameValid || !formData.teamName.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 