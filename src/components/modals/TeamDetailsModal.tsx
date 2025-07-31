import React, { useState } from 'react';
import type { Team, GameEvent } from '../../types';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface TeamDetailsModalProps {
  isOpen: boolean;
  team: Team | null;
  gameEvents: GameEvent[];
  onClose: () => void;
  onEdit: (teamIndex: number) => void;
  onDelete: (teamIndex: number) => void;
  teamIndex: number | null;
}

export const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({
  isOpen,
  team,
  gameEvents,
  onClose,
  onDelete,
  teamIndex
}) => {
  useEscapeKey(onClose, isOpen);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    teamName: '',
    player1: '',
    player2: '',
    player3: '',
    player4: ''
  });

  // Initialize edit form data when team changes
  React.useEffect(() => {
    if (team) {
      setEditFormData({
        teamName: team.name,
        player1: team.players[0] || '',
        player2: team.players[1] || '',
        player3: team.players[2] || '',
        player4: team.players[3] || ''
      });
    }
  }, [team]);

  if (!isOpen || !team) return null;

  // Filter game events for this team
  const teamGameEvents = gameEvents.filter(event => 
    event.type === 'game_reported' && 
    event.teams?.some(t => t.name === team.name)
  );

  // Calculate win-loss record
  const wins = teamGameEvents.filter(event => event.winner?.name === team.name).length;
  const losses = teamGameEvents.filter(event => event.loser?.name === team.name).length;
  const totalGames = wins + losses;
  const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : '0.0';

  // Get team's game history
  const getGameHistory = () => {
    return teamGameEvents.map(event => {
      const isWinner = event.winner?.name === team.name;
      const opponent = isWinner ? event.loser : event.winner;
      const teamScore = event.teams?.find(t => t.name === team.name) === event.teams?.[0] 
        ? event.score?.split('-')[0] 
        : event.score?.split('-')[1];
      const opponentScore = event.teams?.find(t => t.name === team.name) === event.teams?.[0] 
        ? event.score?.split('-')[1] 
        : event.score?.split('-')[0];
      
      return {
        ...event,
        isWinner,
        opponent,
        teamScore,
        opponentScore
      };
    }).reverse(); // Show newest first
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    // This would need to be connected to the actual edit handler
    // For now, just close editing mode
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditFormData({
      teamName: team.name,
      player1: team.players[0] || '',
      player2: team.players[1] || '',
      player3: team.players[2] || '',
      player4: team.players[3] || ''
    });
    setIsEditing(false);
  };

  const isValidTeamName = editFormData.teamName.trim().length > 0 && editFormData.teamName.length <= 50;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="card p-6 w-full max-w-2xl mx-auto shadow-large max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-heading-2 text-gray-900">
            {isEditing ? 'Edit Team' : 'Team Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Team Information Section */}
        <div className="mb-8">
          <h3 className="text-heading-4 text-gray-900 mb-6">Team Information</h3>
          
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name
                </label>
                <input
                  id="teamName"
                  type="text"
                  name="teamName"
                  value={editFormData.teamName}
                  onChange={handleInputChange}
                  maxLength={50}
                  className={`input-primary ${
                    editFormData.teamName && !isValidTeamName ? 'input-error' : ''
                  }`}
                  placeholder="Enter team name"
                  aria-describedby={editFormData.teamName && !isValidTeamName ? 'teamName-error' : undefined}
                />
                <div className="flex justify-between items-center mt-2">
                  {editFormData.teamName && !isValidTeamName && (
                    <p id="teamName-error" className="text-error-600 text-sm">
                      Team name is required and must be 50 characters or less
                    </p>
                  )}
                  <p className="text-caption text-gray-500">{editFormData.teamName.length}/50</p>
                </div>
              </div>

              {[1, 2, 3, 4].map((num) => (
                <div key={num}>
                  <label htmlFor={`player${num}`} className="block text-sm font-medium text-gray-700 mb-2">
                    Player {num}
                  </label>
                  <input
                    id={`player${num}`}
                    type="text"
                    name={`player${num}`}
                    value={editFormData[`player${num}` as keyof typeof editFormData]}
                    onChange={handleInputChange}
                    className="input-primary"
                    placeholder={`Enter player ${num} name`}
                  />
                </div>
              ))}

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleCancelEdit}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={!isValidTeamName}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Team Name</h4>
                <p className="text-body-large font-semibold text-gray-900 break-words">{team.name}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Players</h4>
                <div className="space-y-3">
                  {team.players.map((player, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-body font-medium text-gray-800">{player || `Player ${index + 1} (Not set)`}</span>
                      <span className="text-xs text-gray-600 bg-gray-200 px-3 py-1 rounded-lg font-medium">
                        P{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex-1"
                >
                  Edit Team
                </button>
                <button
                  onClick={() => teamIndex !== null && onDelete(teamIndex)}
                  className="btn-error flex-1"
                >
                  Delete Team
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Win-Loss Record Section */}
        <div className="mb-8">
          <h3 className="text-heading-4 text-gray-900 mb-6">Record</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-success-50 rounded-xl p-4 text-center border border-success-200">
              <div className="text-3xl font-bold text-success-800">{wins}</div>
              <div className="text-sm text-success-600 font-medium">Wins</div>
            </div>
            <div className="bg-error-50 rounded-xl p-4 text-center border border-error-200">
              <div className="text-3xl font-bold text-error-800">{losses}</div>
              <div className="text-sm text-error-600 font-medium">Losses</div>
            </div>
            <div className="bg-primary-50 rounded-xl p-4 text-center border border-primary-200">
              <div className="text-3xl font-bold text-primary-800">{winRate}%</div>
              <div className="text-sm text-primary-600 font-medium">Win Rate</div>
            </div>
          </div>
        </div>

        {/* Game History Section */}
        <div>
          <h3 className="text-heading-4 text-gray-900 mb-6">Game History</h3>
          {teamGameEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-body-small">No games played yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {getGameHistory().map((game) => (
                <div
                  key={game.id}
                  className={`rounded-xl p-4 border ${
                    game.isWinner 
                      ? 'bg-success-50 border-success-200' 
                      : 'bg-error-50 border-error-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`text-xl ${game.isWinner ? 'text-success-600' : 'text-error-600'}`} role="img" aria-hidden="true">
                        {game.isWinner ? '🏆' : '❌'}
                      </span>
                      <div>
                        <p className="text-body font-medium text-gray-800">
                          vs {game.opponent?.name || 'Unknown Team'}
                        </p>
                        <p className="text-caption text-gray-600">
                          {game.courtNumber} • {new Date(game.timestamp).toLocaleDateString()} at {new Date(game.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${game.isWinner ? 'text-success-800' : 'text-error-800'}`}>
                        {game.teamScore} - {game.opponentScore}
                      </p>
                      <p className="text-caption text-gray-600 font-medium">
                        {game.isWinner ? 'WIN' : 'LOSS'}
                      </p>
                    </div>
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