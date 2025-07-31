import React from 'react';
import type { FormData } from '../../types';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface EditTeamModalProps {
  isOpen: boolean;
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const EditTeamModal: React.FC<EditTeamModalProps> = ({
  isOpen,
  formData,
  onInputChange,
  onSubmit,
  onCancel
}) => {
  useEscapeKey(onCancel, isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-emerald-900 mb-6 text-center">
          Edit Team
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Team Name */}
          <div>
            <label htmlFor="editTeamName" className="block text-sm font-medium text-emerald-800 mb-2">
              Team Name
            </label>
            <input
              type="text"
              id="editTeamName"
              name="teamName"
              value={formData.teamName}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              placeholder="Enter team name"
              required
            />
          </div>

          {/* Player Fields */}
          {[1, 2, 3, 4].map((playerNum) => (
            <div key={playerNum}>
              <label htmlFor={`editPlayer${playerNum}`} className="block text-sm font-medium text-emerald-800 mb-2">
                Player #{playerNum}
              </label>
              <input
                type="text"
                id={`editPlayer${playerNum}`}
                name={`player${playerNum}`}
                value={formData[`player${playerNum}` as keyof FormData]}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                placeholder={`Enter player ${playerNum} name`}
                required
              />
            </div>
          ))}

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 