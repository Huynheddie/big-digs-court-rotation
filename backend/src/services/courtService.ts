import { dataStore } from './dataStore';
import type { 
  CourtWithTeams, 
  ReportGameData,
  ApiResponse,
  GameEvent
} from '../types';
import { validateData, updateCourtSchema, assignTeamsToCourtSchema, reportGameSchema } from '../utils/validation';
import type { UpdateCourtInput } from '../utils/validation';

export class CourtService {
  // Get all courts with team information
  static getAllCourts(): ApiResponse<CourtWithTeams[]> {
    try {
      const courts = dataStore.getAllCourtsWithTeams();
      return {
        success: true,
        data: courts
      };
    } catch (error) {
      console.error('Error getting courts:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Get court by ID with team information
  static getCourt(id: string): ApiResponse<CourtWithTeams> {
    try {
      const court = dataStore.getCourtWithTeams(id);
      if (!court) {
        return {
          success: false,
          error: 'Court not found'
        };
      }

      return {
        success: true,
        data: court
      };
    } catch (error) {
      console.error('Error getting court:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Update court properties
  static updateCourt(id: string, updates: UpdateCourtInput): ApiResponse<CourtWithTeams> {
    try {
      // Validate input data
      const validation = validateData(updateCourtSchema, updates);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          message: validation.errors.map(e => `${e.field}: ${e.message}`).join(', ')
        };
      }

      // Check if court exists
      const existingCourt = dataStore.getCourt(id);
      if (!existingCourt) {
        return {
          success: false,
          error: 'Court not found'
        };
      }

      // Update the court
      const updatedCourt = dataStore.updateCourt(id, updates);
      if (!updatedCourt) {
        return {
          success: false,
          error: 'Failed to update court'
        };
      }

      // Get updated court with teams
      const courtWithTeams = dataStore.getCourtWithTeams(id);
      if (!courtWithTeams) {
        return {
          success: false,
          error: 'Failed to get updated court data'
        };
      }

      return {
        success: true,
        data: courtWithTeams,
        message: 'Court updated successfully'
      };
    } catch (error) {
      console.error('Error updating court:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Assign teams to a court
  static assignTeamsToCourt(courtId: string, team1Id: string, team2Id: string): ApiResponse<CourtWithTeams> {
    try {
      // Validate input data
      const validation = validateData(assignTeamsToCourtSchema, { team1Id, team2Id });
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          message: validation.errors.map(e => `${e.field}: ${e.message}`).join(', ')
        };
      }

      // Check if court exists
      const existingCourt = dataStore.getCourt(courtId);
      if (!existingCourt) {
        return {
          success: false,
          error: 'Court not found'
        };
      }

      // Check if teams exist
      const team1 = dataStore.getTeam(team1Id);
      const team2 = dataStore.getTeam(team2Id);
      if (!team1 || !team2) {
        return {
          success: false,
          error: 'One or both teams not found'
        };
      }

      // Check if teams are available
      if (dataStore.isTeamOnCourt(team1Id) || dataStore.isTeamOnCourt(team2Id)) {
        return {
          success: false,
          error: 'One or both teams are already on a court'
        };
      }

      // Assign teams to court
      const updatedCourt = dataStore.assignTeamsToCourt(courtId, team1Id, team2Id);
      if (!updatedCourt) {
        return {
          success: false,
          error: 'Failed to assign teams to court'
        };
      }

      // Get updated court with teams
      const courtWithTeams = dataStore.getCourtWithTeams(courtId);
      if (!courtWithTeams) {
        return {
          success: false,
          error: 'Failed to get updated court data'
        };
      }

      // Add game event
      dataStore.addGameEvent({
        type: 'teams_added',
        description: `Teams assigned to ${courtWithTeams.name}: ${team1.name} vs ${team2.name}`,
        courtId,
        courtNumber: courtWithTeams.name,
        teamIds: [team1Id, team2Id],
        netColor: courtWithTeams.netColor
      });

      return {
        success: true,
        data: courtWithTeams,
        message: 'Teams assigned to court successfully'
      };
    } catch (error) {
      console.error('Error assigning teams to court:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Clear a court
  static clearCourt(courtId: string): ApiResponse<CourtWithTeams> {
    try {
      // Check if court exists
      const existingCourt = dataStore.getCourtWithTeams(courtId);
      if (!existingCourt) {
        return {
          success: false,
          error: 'Court not found'
        };
      }

      // Clear the court
      const updatedCourt = dataStore.clearCourt(courtId);
      if (!updatedCourt) {
        return {
          success: false,
          error: 'Failed to clear court'
        };
      }

      // Get updated court with teams
      const courtWithTeams = dataStore.getCourtWithTeams(courtId);
      if (!courtWithTeams) {
        return {
          success: false,
          error: 'Failed to get updated court data'
        };
      }

      // Add game event
      const previousTeams = existingCourt.team1 && existingCourt.team2 
        ? `${existingCourt.team1.name} vs ${existingCourt.team2.name}`
        : 'No teams';
      
      dataStore.addGameEvent({
        type: 'court_cleared',
        description: `${existingCourt.name} was manually cleared. Previous teams: ${previousTeams}`,
        courtId,
        courtNumber: existingCourt.name,
        teamIds: existingCourt.team1 && existingCourt.team2 
          ? [existingCourt.team1.id, existingCourt.team2.id] 
          : [],
        netColor: existingCourt.netColor
      });

      return {
        success: true,
        data: courtWithTeams,
        message: 'Court cleared successfully'
      };
    } catch (error) {
      console.error('Error clearing court:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Report a game result
  static reportGame(gameData: ReportGameData): ApiResponse<{
    court: CourtWithTeams;
    gameEvent: GameEvent;
    winner: string;
    loser: string;
    score: string;
  }> {
    try {
      // Validate input data
      const validation = validateData(reportGameSchema, gameData);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          message: validation.errors.map(e => `${e.field}: ${e.message}`).join(', ')
        };
      }

      // Check if court exists
      const court = dataStore.getCourtWithTeams(gameData.courtId);
      if (!court) {
        return {
          success: false,
          error: 'Court not found'
        };
      }

      // Check if court has teams
      if (!court.team1 || !court.team2) {
        return {
          success: false,
          error: 'Court must have two teams to report a game'
        };
      }

      // Determine winner and loser
      const team1Score = parseInt(gameData.team1Score);
      const team2Score = parseInt(gameData.team2Score);
      const winner = team1Score > team2Score ? court.team1 : court.team2;
      const loser = team1Score > team2Score ? court.team2 : court.team1;
      const score = `${gameData.team1Score}-${gameData.team2Score}`;

      // Process game result based on court type
      const isKingsCourt = court.name === 'Kings Court';
      let updatedCourt: CourtWithTeams | null = null;
      let eventDescription = '';

      if (isKingsCourt) {
        // Kings Court logic
        const winnerWasTeam1 = court.team1!.id === winner.id;
        const currentConsecutiveWins = winnerWasTeam1 
          ? (court.team1ConsecutiveWins || 0) 
          : (court.team2ConsecutiveWins || 0);
        const newConsecutiveWins = currentConsecutiveWins + 1;

        if (newConsecutiveWins >= 2) {
          // Winner has 2 consecutive wins, must leave
          dataStore.clearCourt(gameData.courtId);
          updatedCourt = dataStore.getCourtWithTeams(gameData.courtId);
          eventDescription = `Game finished on ${court.name}: ${court.team1!.name} vs ${court.team2!.name} - Final Score: ${score}. WINNER: ${winner.name} wins their second consecutive game and must leave the court to make room for others. LOSER: ${loser.name} removed from court and must re-queue manually.`;
        } else {
          // Winner stays, loser leaves
          const updates: UpdateCourtInput = {
            score,
            team1ConsecutiveWins: winnerWasTeam1 ? newConsecutiveWins : 0,
            team2ConsecutiveWins: winnerWasTeam1 ? 0 : newConsecutiveWins,
          };

          if (winnerWasTeam1) {
            updates.team2Id = null;
          } else {
            updates.team1Id = null;
          }

          dataStore.updateCourt(gameData.courtId, updates);
          updatedCourt = dataStore.getCourtWithTeams(gameData.courtId);
          eventDescription = `Game finished on ${court.name}: ${court.team1!.name} vs ${court.team2!.name} - Final Score: ${score}. WINNER: ${winner.name} stays on the court for another game. LOSER: ${loser.name} removed from court and must re-queue manually.`;
        }
      } else {
        // Challenger court logic - winner goes to Kings Court queue, both teams leave court
        dataStore.clearCourt(gameData.courtId);
        updatedCourt = dataStore.getCourtWithTeams(gameData.courtId);
        
        // Add winner to Kings Court queue
        dataStore.addToQueue(winner.id, 'kings_court');
        
        eventDescription = `Game finished on ${court.name}: ${court.team1!.name} vs ${court.team2!.name} - Final Score: ${score}. WINNER: ${winner.name} advances to Kings Court queue to play. LOSER: ${loser.name} removed from court and must re-queue manually.`;
      }

      if (!updatedCourt) {
        return {
          success: false,
          error: 'Failed to update court after game'
        };
      }

      // Add game event
      const gameEvent = dataStore.addGameEvent({
        type: 'game_reported',
        description: eventDescription,
        courtId: gameData.courtId,
        courtNumber: court.name,
        teamIds: [court.team1!.id, court.team2!.id],
        score,
        netColor: court.netColor,
        winnerId: winner.id,
        loserId: loser.id
      });

      return {
        success: true,
        data: {
          court: updatedCourt,
          gameEvent,
          winner: winner.name,
          loser: loser.name,
          score
        },
        message: 'Game reported successfully'
      };
    } catch (error) {
      console.error('Error reporting game:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Fill court from queue
  static fillCourtFromQueue(courtId: string): ApiResponse<CourtWithTeams> {
    try {
      // Check if court exists
      const court = dataStore.getCourtWithTeams(courtId);
      if (!court) {
        return {
          success: false,
          error: 'Court not found'
        };
      }

      const isKingsCourt = court.name === 'Kings Court';
      const hasTeam1 = court.team1 !== null;
      const hasTeam2 = court.team2 !== null;

      if (hasTeam1 && hasTeam2) {
        return {
          success: false,
          error: 'Court is already full'
        };
      }

      // Get available teams from queues
      const { general: generalQueue, kingsCourt: kingsCourtQueue } = dataStore.getAllQueues();
      let teamsToAdd: string[] = [];

      if (isKingsCourt) {
        // Kings Court: try Kings Court queue first, then general queue
        if (!hasTeam1 && !hasTeam2) {
          // Need 2 teams
          if (kingsCourtQueue.length >= 2) {
            teamsToAdd = [kingsCourtQueue[0]?.teamId, kingsCourtQueue[1]?.teamId].filter(Boolean) as string[];
          } else if (kingsCourtQueue.length === 1 && generalQueue.length >= 1) {
            teamsToAdd = [kingsCourtQueue[0]?.teamId, generalQueue[0]?.teamId].filter(Boolean) as string[];
          } else if (generalQueue.length >= 2) {
            teamsToAdd = [generalQueue[0]?.teamId, generalQueue[1]?.teamId].filter(Boolean) as string[];
          }
        } else {
          // Need 1 team
          if (kingsCourtQueue.length >= 1) {
            teamsToAdd = [kingsCourtQueue[0]?.teamId].filter(Boolean) as string[];
          } else if (generalQueue.length >= 1) {
            teamsToAdd = [generalQueue[0]?.teamId].filter(Boolean) as string[];
          }
        }
      } else {
        // Challenger court: only use general queue
        if (generalQueue.length >= 2) {
          teamsToAdd = [generalQueue[0]?.teamId, generalQueue[1]?.teamId].filter(Boolean) as string[];
        }
      }

      if (teamsToAdd.length === 0) {
        return {
          success: false,
          error: 'Not enough teams in queue to fill court'
        };
      }

      // Remove teams from queues
      teamsToAdd.forEach(teamId => {
        const queueEntries = [...generalQueue, ...kingsCourtQueue];
        const entry = queueEntries.find(e => e.teamId === teamId);
        if (entry) {
          dataStore.removeFromQueue(entry.id);
        }
      });

      // Assign teams to court
      if (teamsToAdd.length === 2) {
        dataStore.assignTeamsToCourt(courtId, teamsToAdd[0], teamsToAdd[1]);
      } else if (teamsToAdd.length === 1) {
        const updates: UpdateCourtInput = hasTeam1 
          ? { team2Id: teamsToAdd[0] }
          : { team1Id: teamsToAdd[0] };
        dataStore.updateCourt(courtId, updates);
      }

      // Get updated court
      const updatedCourt = dataStore.getCourtWithTeams(courtId);
      if (!updatedCourt) {
        return {
          success: false,
          error: 'Failed to get updated court data'
        };
      }

      // Add game event
      const teamNames = teamsToAdd.map(id => dataStore.getTeam(id)?.name).filter(Boolean);
      dataStore.addGameEvent({
        type: 'teams_added',
        description: `Teams added to ${court.name} from queue: ${teamNames.join(' vs ')}`,
        courtId,
        courtNumber: court.name,
        teamIds: teamsToAdd,
        netColor: court.netColor
      });

      return {
        success: true,
        data: updatedCourt,
        message: 'Court filled from queue successfully'
      };
    } catch (error) {
      console.error('Error filling court from queue:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }
} 