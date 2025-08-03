import { Request, Response } from 'express';
import { TeamService } from '@/services/teamService';
import type { CreateTeamInput, UpdateTeamInput } from '@/utils/validation';

export class TeamController {
  // Create a new team
  static async createTeam(req: Request, res: Response) {
    try {
      const teamData: CreateTeamInput = req.body;
      
      // Ensure required fields are present
      if (!teamData.name) {
        return res.status(400).json({
          success: false,
          error: 'Team name is required'
        });
      }

      const result = TeamService.createTeam(teamData as any);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in createTeam controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get all teams
  static async getAllTeams(req: Request, res: Response) {
    try {
      const result = TeamService.getAllTeams();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in getAllTeams controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get team by ID
  static async getTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Team ID is required'
        });
      }

      const result = TeamService.getTeam(id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error in getTeam controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Update team
  static async updateTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates: UpdateTeamInput = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Team ID is required'
        });
      }

      const result = TeamService.updateTeam(id, updates);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in updateTeam controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Delete team
  static async deleteTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Team ID is required'
        });
      }

      const result = TeamService.deleteTeam(id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Error in deleteTeam controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get available teams
  static async getAvailableTeams(req: Request, res: Response) {
    try {
      const result = TeamService.getAvailableTeams();

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in getAvailableTeams controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Search teams
  static async searchTeams(req: Request, res: Response) {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      const result = TeamService.searchTeams(query);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error in searchTeams controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get team statistics
  static async getTeamStats(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Team ID is required'
        });
      }

      const result = TeamService.getTeamStats(id);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error('Error in getTeamStats controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 