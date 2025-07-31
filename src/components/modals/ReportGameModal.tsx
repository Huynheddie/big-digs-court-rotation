import React from 'react';
import type { GameScoreData } from '../../types';

interface ReportGameModalProps {
  isOpen: boolean;
  gameScoreData: GameScoreData;
  onScoreInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  team1Name: string;
  team2Name: string;
}

export const ReportGameModal: React.FC<ReportGameModalProps> = ({
  isOpen,
  gameScoreData,
  onScoreInputChange,
  onSubmit,
  onCancel,
  team1Name,
  team2Name
}) => {
  if (!isOpen) return null;

  const isValidScore = (score: string) => {
    const num = parseInt(score);
    return !isNaN(num) && num >= 0 && num <= 50;
  };

  const isFormValid = isValidScore(gameScoreData.team1Score) && isValidScore(gameScoreData.team2Score);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Report Game Score
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Team 1 Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {team1Name} Score
              </label>
              <input
                type="number"
                name="team1Score"
                value={gameScoreData.team1Score}
                onChange={onScoreInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  gameScoreData.team1Score && !isValidScore(gameScoreData.team1Score)
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                max="50"
                required
              />
              {gameScoreData.team1Score && !isValidScore(gameScoreData.team1Score) && (
                <p className="text-red-500 text-xs mt-1">Score must be 0-50</p>
              )}
            </div>

            {/* Team 2 Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {team2Name} Score
              </label>
              <input
                type="number"
                name="team2Score"
                value={gameScoreData.team2Score}
                onChange={onScoreInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  gameScoreData.team2Score && !isValidScore(gameScoreData.team2Score)
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                max="50"
                required
              />
              {gameScoreData.team2Score && !isValidScore(gameScoreData.team2Score) && (
                <p className="text-red-500 text-xs mt-1">Score must be 0-50</p>
              )}
            </div>
          </div>

          {/* Final Score Display */}
          {isFormValid && (
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">Final Score:</p>
              <p className="text-lg font-bold text-gray-800">
                {team1Name} {gameScoreData.team1Score} - {gameScoreData.team2Score} {team2Name}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Report Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 