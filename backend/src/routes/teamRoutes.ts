import { Router } from 'express';
import { TeamController } from '@/controllers/teamController';

const router = Router();

// Team CRUD operations
router.post('/', TeamController.createTeam);
router.get('/', TeamController.getAllTeams);
router.get('/search', TeamController.searchTeams);
router.get('/available', TeamController.getAvailableTeams);
router.get('/:id', TeamController.getTeam);
router.put('/:id', TeamController.updateTeam);
router.delete('/:id', TeamController.deleteTeam);

// Team statistics
router.get('/:id/stats', TeamController.getTeamStats);

export default router; 