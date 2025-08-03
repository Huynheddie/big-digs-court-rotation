import { Request, Response } from 'express';
import { CourtService } from '@/services/courtService';
import type { UpdateCourtInput, AssignTeamsInput, ReportGameInput } from '@/utils/validation';

export class CourtController {
  // Get all courts
  static async getAllCourts(req: Request, res: Response) {
    try {
      const result = CourtService.getAllCourts();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in getAllCourts controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get court by ID
  static async getCourt(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Court ID is required'
        });
      }

      const result = CourtService.getCourt(id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error in getCourt controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Update court
  static async updateCourt(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates: UpdateCourtInput = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Court ID is required'
        });
      }

      const result = CourtService.updateCourt(id, updates);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in updateCourt controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Assign teams to court
  static async assignTeamsToCourt(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { team1Id, team2Id }: AssignTeamsInput = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Court ID is required'
        });
      }

      const result = CourtService.assignTeamsToCourt(id, team1Id, team2Id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in assignTeamsToCourt controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Clear court
  static async clearCourt(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Court ID is required'
        });
      }

      const result = CourtService.clearCourt(id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in clearCourt controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Report game
  static async reportGame(req: Request, res: Response) {
    try {
      const gameData: ReportGameInput = req.body;
      
      // Ensure required fields are present
      if (!gameData.courtId || !gameData.team1Score || !gameData.team2Score) {
        return res.status(400).json({
          success: false,
          error: 'courtId, team1Score, and team2Score are required'
        });
      }

      const result = CourtService.reportGame(gameData as any);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in reportGame controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Fill court from queue
  static async fillCourtFromQueue(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Court ID is required'
        });
      }

      const result = CourtService.fillCourtFromQueue(id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in fillCourtFromQueue controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 