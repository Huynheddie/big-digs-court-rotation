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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-orange-50 to-amber-100 border border-orange-200 rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-900">
            {isEditing ? 'Edit Team' : 'Team Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Team Information Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-orange-700 mb-4">Team Information</h3>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={editFormData.teamName}
                  onChange={handleInputChange}
                  maxLength={50}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    editFormData.teamName && !isValidTeamName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-orange-300'
                  }`}
                  placeholder="Enter team name"
                />
                <div className="flex justify-between items-center mt-1">
                  {editFormData.teamName && !isValidTeamName && (
                    <p className="text-red-500 text-xs">Team name is required and must be 50 characters or less</p>
                  )}
                  <p className="text-gray-500 text-xs">{editFormData.teamName.length}/50</p>
                </div>
              </div>

              {[1, 2, 3, 4].map((num) => (
                <div key={num}>
                  <label className="block text-sm font-medium text-orange-700 mb-2">
                    Player {num}
                  </label>
                  <input
                    type="text"
                    name={`player${num}`}
                    value={editFormData[`player${num}` as keyof typeof editFormData]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={`Enter player ${num} name`}
                  />
                </div>
              ))}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={!isValidTeamName}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-orange-700 mb-2">Team Name</h4>
                <p className="text-lg font-semibold text-orange-900 break-words">{team.name}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-orange-700 mb-2">Players</h4>
                <div className="space-y-2">
                  {team.players.map((player, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-orange-50/60 rounded border border-orange-200">
                      <span className="text-orange-800 font-medium">{player || `Player ${index + 1} (Not set)`}</span>
                      <span className="text-xs text-orange-700 bg-orange-200 px-2 py-1 rounded">
                        P{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Edit Team
                </button>
                <button
                  onClick={() => teamIndex !== null && onDelete(teamIndex)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Delete Team
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Win-Loss Record Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-orange-700 mb-4">Record</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-800">{wins}</div>
              <div className="text-sm text-green-600">Wins</div>
            </div>
            <div className="bg-red-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-800">{losses}</div>
              <div className="text-sm text-red-600">Losses</div>
            </div>
            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-800">{winRate}%</div>
              <div className="text-sm text-blue-600">Win Rate</div>
            </div>
          </div>
        </div>

        {/* Game History Section */}
        <div>
          <h3 className="text-lg font-semibold text-orange-700 mb-4">Game History</h3>
          {teamGameEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-sm">No games played yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {getGameHistory().map((game) => (
                <div
                  key={game.id}
                  className={`rounded-lg p-3 border ${
                    game.isWinner 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg ${game.isWinner ? 'text-green-600' : 'text-red-600'}`}>
                        {game.isWinner ? '🏆' : '❌'}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          vs {game.opponent?.name || 'Unknown Team'}
                        </p>
                                                 <p className="text-xs text-gray-600">
                           {game.courtNumber} • {new Date(game.timestamp).toLocaleDateString()} at {new Date(game.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${game.isWinner ? 'text-green-800' : 'text-red-800'}`}>
                        {game.teamScore} - {game.opponentScore}
                      </p>
                      <p className="text-xs text-gray-600">
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