import { Request, Response } from 'express';
import { QueueService } from '../services/queueService';
import type { AddToQueueInput, RemoveFromQueueInput } from '../utils/validation';

export class QueueController {
  // Get all queues
  static async getAllQueues(req: Request, res: Response) {
    try {
      const result = QueueService.getAllQueues();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in getAllQueues controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get specific queue
  static async getQueue(req: Request, res: Response) {
    try {
      const { type } = req.params;
      
      if (type !== 'general' && type !== 'kings_court') {
        return res.status(400).json({
          success: false,
          error: 'Queue type must be either "general" or "kings_court"'
        });
      }

      const result = QueueService.getQueue(type);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in getQueue controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Add team to queue
  static async addToQueue(req: Request, res: Response) {
    try {
      const input: AddToQueueInput = req.body;
      const result = QueueService.addToQueue(input);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in addToQueue controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Remove team from queue
  static async removeFromQueue(req: Request, res: Response) {
    try {
      const input: RemoveFromQueueInput = req.body;
      const result = QueueService.removeFromQueue(input);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in removeFromQueue controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Move team to front of queue
  static async moveToFront(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Queue entry ID is required'
        });
      }

      const result = QueueService.moveToFront(id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in moveToFront controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Clear queue
  static async clearQueue(req: Request, res: Response) {
    try {
      const { type } = req.params;
      
      if (type !== 'general' && type !== 'kings_court') {
        return res.status(400).json({
          success: false,
          error: 'Queue type must be either "general" or "kings_court"'
        });
      }

      const result = QueueService.clearQueue(type);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in clearQueue controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get queue statistics
  static async getQueueStats(req: Request, res: Response) {
    try {
      const result = QueueService.getQueueStats();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in getQueueStats controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get available teams for queue
  static async getAvailableTeamsForQueue(req: Request, res: Response) {
    try {
      const result = QueueService.getAvailableTeamsForQueue();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in getAvailableTeamsForQueue controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Bulk add teams to queue
  static async bulkAddToQueue(req: Request, res: Response) {
    try {
      const { teamIds, queueType } = req.body;
      
      if (!Array.isArray(teamIds) || teamIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'teamIds must be a non-empty array'
        });
      }

      if (queueType !== 'general' && queueType !== 'kings_court') {
        return res.status(400).json({
          success: false,
          error: 'queueType must be either "general" or "kings_court"'
        });
      }

      const result = QueueService.bulkAddToQueue(teamIds, queueType);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in bulkAddToQueue controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 