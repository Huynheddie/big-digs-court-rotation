import { dataStore } from './dataStore';
import type { 
  Team, 
  CreateTeamData, 
  UpdateTeamData, 
  ApiResponse,
  AppError 
} from '@/types';
import { validateData, createTeamSchema, updateTeamSchema } from '@/utils/validation';

export class TeamService {
  // Create a new team
  static createTeam(teamData: CreateTeamData): ApiResponse<Team> {
    try {
      // Validate input data
      const validation = validateData(createTeamSchema, teamData);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          message: validation.errors.map(e => `${e.field}: ${e.message}`).join(', ')
        };
      }

      // Check if team name already exists
      const existingTeam = dataStore.getTeamByName(teamData.name);
      if (existingTeam) {
        return {
          success: false,
          error: 'Team name already exists'
        };
      }

      // Create the team
      const team = dataStore.createTeam(teamData);

      // Add game event
      dataStore.addGameEvent({
        type: 'team_added',
        description: `New team "${team.name}" was registered with players: ${team.players.join(', ')}`,
        teamIds: [team.id]
      });

      return {
        success: true,
        data: team,
        message: 'Team created successfully'
      };
    } catch (error) {
      console.error('Error creating team:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Get all teams
  static getAllTeams(): ApiResponse<Team[]> {
    try {
      const teams = dataStore.getAllTeams();
      return {
        success: true,
        data: teams
      };
    } catch (error) {
      console.error('Error getting teams:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Get team by ID
  static getTeam(id: string): ApiResponse<Team> {
    try {
      const team = dataStore.getTeam(id);
      if (!team) {
        return {
          success: false,
          error: 'Team not found'
        };
      }

      return {
        success: true,
        data: team
      };
    } catch (error) {
      console.error('Error getting team:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Update team
  static updateTeam(id: string, updates: UpdateTeamData): ApiResponse<Team> {
    try {
      // Validate input data
      const validation = validateData(updateTeamSchema, updates);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          message: validation.errors.map(e => `${e.field}: ${e.message}`).join(', ')
        };
      }

      // Check if team exists
      const existingTeam = dataStore.getTeam(id);
      if (!existingTeam) {
        return {
          success: false,
          error: 'Team not found'
        };
      }

      // Check if new name conflicts with existing team
      if (updates.name && updates.name !== existingTeam.name) {
        const teamWithSameName = dataStore.getTeamByName(updates.name);
        if (teamWithSameName) {
          return {
            success: false,
            error: 'Team name already exists'
          };
        }
      }

      // Update the team
      const updatedTeam = dataStore.updateTeam(id, updates);
      if (!updatedTeam) {
        return {
          success: false,
          error: 'Failed to update team'
        };
      }

      // Add game event
      dataStore.addGameEvent({
        type: 'team_added', // Reusing this type for updates
        description: `Team "${updatedTeam.name}" was updated`,
        teamIds: [updatedTeam.id]
      });

      return {
        success: true,
        data: updatedTeam,
        message: 'Team updated successfully'
      };
    } catch (error) {
      console.error('Error updating team:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Delete team
  static deleteTeam(id: string): ApiResponse<{ id: string }> {
    try {
      // Check if team exists
      const existingTeam = dataStore.getTeam(id);
      if (!existingTeam) {
        return {
          success: false,
          error: 'Team not found'
        };
      }

      // Check if team is currently on a court
      if (dataStore.isTeamOnCourt(id)) {
        return {
          success: false,
          error: 'Cannot delete team while they are on a court'
        };
      }

      // Delete the team
      const deleted = dataStore.deleteTeam(id);
      if (!deleted) {
        return {
          success: false,
          error: 'Failed to delete team'
        };
      }

      // Add game event
      dataStore.addGameEvent({
        type: 'team_deleted',
        description: `Team "${existingTeam.name}" was deleted from the system`
      });

      return {
        success: true,
        data: { id },
        message: 'Team deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting team:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Get available teams (not on court or in queue)
  static getAvailableTeams(): ApiResponse<Team[]> {
    try {
      const availableTeams = dataStore.getAvailableTeams();
      return {
        success: true,
        data: availableTeams
      };
    } catch (error) {
      console.error('Error getting available teams:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Search teams by name
  static searchTeams(query: string): ApiResponse<Team[]> {
    try {
      const teams = dataStore.getAllTeams();
      const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(query.toLowerCase())
      );

      return {
        success: true,
        data: filteredTeams
      };
    } catch (error) {
      console.error('Error searching teams:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Get team statistics
  static getTeamStats(teamId: string): ApiResponse<{
    totalGames: number;
    wins: number;
    losses: number;
    winRate: number;
    currentStatus: 'available' | 'on_court' | 'in_queue';
  }> {
    try {
      const team = dataStore.getTeam(teamId);
      if (!team) {
        return {
          success: false,
          error: 'Team not found'
        };
      }

      // Get game events for this team
      const gameEvents = dataStore.getGameEvents(1000);
      const teamGames = gameEvents.filter(event => 
        event.type === 'game_reported' && 
        event.teamIds?.includes(teamId)
      );

      const wins = teamGames.filter(event => event.winnerId === teamId).length;
      const losses = teamGames.filter(event => event.loserId === teamId).length;
      const totalGames = wins + losses;
      const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

      // Determine current status
      let currentStatus: 'available' | 'on_court' | 'in_queue' = 'available';
      if (dataStore.isTeamOnCourt(teamId)) {
        currentStatus = 'on_court';
      } else if (dataStore.getAvailableTeams().every(t => t.id !== teamId)) {
        currentStatus = 'in_queue';
      }

      return {
        success: true,
        data: {
          totalGames,
          wins,
          losses,
          winRate: Math.round(winRate * 10) / 10, // Round to 1 decimal place
          currentStatus
        }
      };
    } catch (error) {
      console.error('Error getting team stats:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }
} 