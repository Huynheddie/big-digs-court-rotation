import React from 'react';
import type { Team } from '../../types';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface DeleteTeamModalProps {
  isOpen: boolean;
  teamToDelete: Team | null;
  isOnCourt: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

export const DeleteTeamModal: React.FC<DeleteTeamModalProps> = ({
  isOpen,
  teamToDelete,
  isOnCourt,
  onDelete,
  onCancel
}) => {
  useEscapeKey(onCancel, isOpen);

  if (!isOpen || !teamToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-red-50 to-pink-100 border border-red-200 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-red-900 mb-6 text-center">
          Delete Team
        </h2>

        <div className="mb-6 text-center">
          <p className="text-red-800 mb-2 font-medium">
            Are you sure you want to delete "{teamToDelete.name}"?
          </p>
          {isOnCourt ? (
            <div className="text-sm text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">
              <p className="font-medium mb-1">⚠️ Cannot delete team while they are playing</p>
              <p>Please complete the game first before deleting this team.</p>
            </div>
          ) : (
            <p className="text-sm text-red-600">
              This action cannot be undone. The team will be removed from all courts and the queue.
            </p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={isOnCourt}
            className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-md ${
              isOnCourt
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}; 