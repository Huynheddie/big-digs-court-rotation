import { Router } from 'express';
import { QueueController } from '@/controllers/queueController';

const router = Router();

// Queue operations
router.get('/', QueueController.getAllQueues);
router.get('/stats', QueueController.getQueueStats);
router.get('/available-teams', QueueController.getAvailableTeamsForQueue);
router.get('/:type', QueueController.getQueue);
router.post('/add', QueueController.addToQueue);
router.post('/bulk-add', QueueController.bulkAddToQueue);
router.delete('/remove', QueueController.removeFromQueue);
router.put('/:id/move-to-front', QueueController.moveToFront);
router.delete('/:type/clear', QueueController.clearQueue);

export default router; 