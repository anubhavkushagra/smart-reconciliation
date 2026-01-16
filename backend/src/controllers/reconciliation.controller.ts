import { Response } from 'express';
import { Reconciliation } from '../models/Reconciliation.model.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

// @desc    Save reconciliation result
// @route   POST /api/reconciliations
// @access  Private
export const saveReconciliation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
            return;
        }

        const { fileNameA, fileNameB, summary, results } = req.body;

        // Validation
        if (!fileNameA || !fileNameB || !summary || !results) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
            return;
        }

        // Create reconciliation record
        const reconciliation = await Reconciliation.create({
            userId: req.user.id,
            fileNameA,
            fileNameB,
            summary,
            results,
        });

        res.status(201).json({
            success: true,
            data: reconciliation,
        });
    } catch (error: any) {
        console.error('Save reconciliation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error saving reconciliation',
        });
    }
};

// @desc    Get user's reconciliation history
// @route   GET /api/reconciliations
// @access  Private
export const getReconciliations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Get reconciliations for this user
        const reconciliations = await Reconciliation.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-results'); // Exclude large results data from list view

        // Get total count
        const total = await Reconciliation.countDocuments({ userId: req.user.id });

        res.status(200).json({
            success: true,
            data: {
                reconciliations,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error: any) {
        console.error('Get reconciliations error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching reconciliations',
        });
    }
};

// @desc    Get single reconciliation
// @route   GET /api/reconciliations/:id
// @access  Private
export const getReconciliation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
            return;
        }

        const reconciliation = await Reconciliation.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!reconciliation) {
            res.status(404).json({
                success: false,
                message: 'Reconciliation not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: reconciliation,
        });
    } catch (error: any) {
        console.error('Get reconciliation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching reconciliation',
        });
    }
};

// @desc    Delete reconciliation
// @route   DELETE /api/reconciliations/:id
// @access  Private
export const deleteReconciliation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
            return;
        }

        const reconciliation = await Reconciliation.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!reconciliation) {
            res.status(404).json({
                success: false,
                message: 'Reconciliation not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Reconciliation deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete reconciliation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting reconciliation',
        });
    }
};
