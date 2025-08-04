import { dataStore } from './dataStore';
import type { 
  QueueEntryWithTeam, 
  ApiResponse
} from '../types';
import { validateData, addToQueueSchema, removeFromQueueSchema } from '../utils/validation';
import type { AddToQueueInput, RemoveFromQueueInput } from '../utils/validation';

export class QueueService {
  // Get all queues
  static getAllQueues(): ApiResponse<{
    general: QueueEntryWithTeam[];
    kingsCourt: QueueEntryWithTeam[];
  }> {
    try {
      const queues = dataStore.getAllQueues();
      return {
        success: true,
        data: queues
      };
    } catch (error) {
      console.error('Error getting queues:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Get specific queue
  static getQueue(queueType: 'general' | 'kings_court'): ApiResponse<QueueEntryWithTeam[]> {
    try {
      const queue = dataStore.getQueue(queueType);
      return {
        success: true,
        data: queue
      };
    } catch (error) {
      console.error('Error getting queue:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Add team to queue
  static addToQueue(input: AddToQueueInput): ApiResponse<QueueEntryWithTeam> {
    try {
      // Validate input data
      const validation = validateData(addToQueueSchema, input);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          message: validation.errors.map(e => `${e.field}: ${e.message}`).join(', ')
        };
      }

      // Check if team exists
      const team = dataStore.getTeam(input.teamId);
      if (!team) {
        return {
          success: false,
          error: 'Team not found'
        };
      }

      // Check if team is already on a court
      if (dataStore.isTeamOnCourt(input.teamId)) {
        return {
          success: false,
          error: 'Team is currently on a court'
        };
      }

      // Check if team is already in any queue
      const { general: generalQueue, kingsCourt: kingsCourtQueue } = dataStore.getAllQueues();
      const isInQueue = [...generalQueue, ...kingsCourtQueue].some(entry => entry.teamId === input.teamId);
      
      if (isInQueue) {
        return {
          success: false,
          error: 'Team is already in a queue'
        };
      }

      // Add team to queue
      const queueEntry = dataStore.addToQueue(input.teamId, input.queueType);
      if (!queueEntry) {
        return {
          success: false,
          error: 'Failed to add team to queue'
        };
      }

      // Get queue entry with team information
      const queue = dataStore.getQueue(input.queueType);
      const queueEntryWithTeam = queue.find(entry => entry.id === queueEntry.id);
      
      if (!queueEntryWithTeam) {
        return {
          success: false,
          error: 'Failed to get queue entry with team information'
        };
      }

      // Add game event
      dataStore.addGameEvent({
        type: 'teams_queued',
        description: `Team "${team.name}" added to ${input.queueType === 'kings_court' ? 'Kings Court' : 'general'} queue`,
        teamIds: [input.teamId]
      });

      return {
        success: true,
        data: queueEntryWithTeam,
        message: `Team added to ${input.queueType === 'kings_court' ? 'Kings Court' : 'general'} queue successfully`
      };
    } catch (error) {
      console.error('Error adding team to queue:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Remove team from queue
  static removeFromQueue(input: RemoveFromQueueInput): ApiResponse<{ id: string }> {
    try {
      // Validate input data
      const validation = validateData(removeFromQueueSchema, input);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          message: validation.errors.map(e => `${e.field}: ${e.message}`).join(', ')
        };
      }

      // Check if queue entry exists
      const { general: generalQueue, kingsCourt: kingsCourtQueue } = dataStore.getAllQueues();
      const allQueues = [...generalQueue, ...kingsCourtQueue];
      const queueEntry = allQueues.find(entry => entry.id === input.queueEntryId);
      
      if (!queueEntry) {
        return {
          success: false,
          error: 'Queue entry not found'
        };
      }

      // Remove from queue
      const removed = dataStore.removeFromQueue(input.queueEntryId);
      if (!removed) {
        return {
          success: false,
          error: 'Failed to remove team from queue'
        };
      }

      // Add game event
      dataStore.addGameEvent({
        type: 'teams_queued',
        description: `Team "${queueEntry.team.name}" removed from ${queueEntry.queueType === 'kings_court' ? 'Kings Court' : 'general'} queue`,
        teamIds: [queueEntry.teamId]
      });

      return {
        success: true,
        data: { id: input.queueEntryId },
        message: 'Team removed from queue successfully'
      };
    } catch (error) {
      console.error('Error removing team from queue:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Move team to front of queue
  static moveToFront(queueEntryId: string): ApiResponse<QueueEntryWithTeam> {
    try {
      // Check if queue entry exists
      const { general: generalQueue, kingsCourt: kingsCourtQueue } = dataStore.getAllQueues();
      const allQueues = [...generalQueue, ...kingsCourtQueue];
      const queueEntry = allQueues.find(entry => entry.id === queueEntryId);
      
      if (!queueEntry) {
        return {
          success: false,
          error: 'Queue entry not found'
        };
      }

      // Remove from current position
      const removed = dataStore.removeFromQueue(queueEntryId);
      if (!removed) {
        return {
          success: false,
          error: 'Failed to remove team from queue'
        };
      }

      // Add back to front of queue
      const newQueueEntry = dataStore.addToQueue(queueEntry.teamId, queueEntry.queueType);
      if (!newQueueEntry) {
        return {
          success: false,
          error: 'Failed to add team to front of queue'
        };
      }

      // Get updated queue entry with team information
      const queue = dataStore.getQueue(queueEntry.queueType);
      const updatedQueueEntry = queue.find(entry => entry.id === newQueueEntry.id);
      
      if (!updatedQueueEntry) {
        return {
          success: false,
          error: 'Failed to get updated queue entry'
        };
      }

      // Add game event
      dataStore.addGameEvent({
        type: 'teams_queued',
        description: `Team "${queueEntry.team.name}" moved to front of ${queueEntry.queueType === 'kings_court' ? 'Kings Court' : 'general'} queue`,
        teamIds: [queueEntry.teamId]
      });

      return {
        success: true,
        data: updatedQueueEntry,
        message: 'Team moved to front of queue successfully'
      };
    } catch (error) {
      console.error('Error moving team to front of queue:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Clear entire queue
  static clearQueue(queueType: 'general' | 'kings_court'): ApiResponse<{ clearedCount: number }> {
    try {
      const queue = dataStore.getQueue(queueType);
      const clearedCount = queue.length;

      // Remove all entries from the queue
      queue.forEach(entry => {
        dataStore.removeFromQueue(entry.id);
      });

      // Add game event
      dataStore.addGameEvent({
        type: 'teams_queued',
        description: `${queueType === 'kings_court' ? 'Kings Court' : 'General'} queue cleared (${clearedCount} teams removed)`,
        teamIds: queue.map(entry => entry.teamId)
      });

      return {
        success: true,
        data: { clearedCount },
        message: `${queueType === 'kings_court' ? 'Kings Court' : 'General'} queue cleared successfully`
      };
    } catch (error) {
      console.error('Error clearing queue:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Get queue statistics
  static getQueueStats(): ApiResponse<{
    general: {
      count: number;
      estimatedWaitTime: number; // in minutes
    };
    kingsCourt: {
      count: number;
      estimatedWaitTime: number; // in minutes
    };
  }> {
    try {
      const { general: generalQueue, kingsCourt: kingsCourtQueue } = dataStore.getAllQueues();
      
      // Simple estimation: 15 minutes per game, 2 teams per game
      const generalWaitTime = Math.ceil((generalQueue.length / 2) * 15);
      const kingsCourtWaitTime = Math.ceil((kingsCourtQueue.length / 2) * 15);

      return {
        success: true,
        data: {
          general: {
            count: generalQueue.length,
            estimatedWaitTime: generalWaitTime
          },
          kingsCourt: {
            count: kingsCourtQueue.length,
            estimatedWaitTime: kingsCourtWaitTime
          }
        }
      };
    } catch (error) {
      console.error('Error getting queue stats:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Get teams that can be added to queue
  static getAvailableTeamsForQueue(): ApiResponse<{
    teams: Array<{
      id: string;
      name: string;
      players: string[];
    }>;
  }> {
    try {
      const availableTeams = dataStore.getAvailableTeams();
      
      return {
        success: true,
        data: {
          teams: availableTeams.map(team => ({
            id: team.id,
            name: team.name,
            players: team.players
          }))
        }
      };
    } catch (error) {
      console.error('Error getting available teams for queue:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  // Bulk add teams to queue
  static bulkAddToQueue(teamIds: string[], queueType: 'general' | 'kings_court'): ApiResponse<{
    added: QueueEntryWithTeam[];
    failed: Array<{ teamId: string; reason: string }>;
  }> {
    try {
      const added: QueueEntryWithTeam[] = [];
      const failed: Array<{ teamId: string; reason: string }> = [];

      for (const teamId of teamIds) {
        const result = this.addToQueue({ teamId, queueType });
        
        if (result.success && result.data) {
          added.push(result.data);
        } else {
          failed.push({
            teamId,
            reason: result.error || 'Unknown error'
          });
        }
      }

      return {
        success: true,
        data: { added, failed },
        message: `Bulk add completed. ${added.length} teams added, ${failed.length} failed.`
      };
    } catch (error) {
      console.error('Error bulk adding teams to queue:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }
} 