import { Router } from 'express';
import { CourtController } from '../controllers/courtController';

const router = Router();

// Court operations
router.get('/', CourtController.getAllCourts);
router.get('/:id', CourtController.getCourt);
router.put('/:id', CourtController.updateCourt);
router.put('/:id/assign', CourtController.assignTeamsToCourt);
router.put('/:id/clear', CourtController.clearCourt);
router.put('/:id/fill', CourtController.fillCourtFromQueue);

// Game operations
router.post('/report-game', CourtController.reportGame);

export default router; 