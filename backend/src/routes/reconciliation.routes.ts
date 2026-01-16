import express from 'express';
import {
    saveReconciliation,
    getReconciliations,
    getReconciliation,
    deleteReconciliation,
} from '../controllers/reconciliation.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', saveReconciliation);
router.get('/', getReconciliations);
router.get('/:id', getReconciliation);
router.delete('/:id', deleteReconciliation);

export default router;
