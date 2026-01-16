import mongoose, { Document, Schema } from 'mongoose';

export interface IReconciliation extends Document {
    userId: mongoose.Types.ObjectId;
    fileNameA: string;
    fileNameB: string;
    uploadDate: Date;
    summary: {
        totalA: number;
        totalB: number;
        matchedCount: number;
        mismatchCount: number;
        missingInACount: number;
        missingInBCount: number;
        matchPercentage: number;
    };
    results: {
        matches: any[];
        mismatches: any[];
        missingInA: any[];
        missingInB: any[];
    };
    createdAt: Date;
    updatedAt: Date;
}

const reconciliationSchema = new Schema<IReconciliation>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true, // Index for faster queries
        },
        fileNameA: {
            type: String,
            required: true,
        },
        fileNameB: {
            type: String,
            required: true,
        },
        uploadDate: {
            type: Date,
            default: Date.now,
        },
        summary: {
            totalA: { type: Number, required: true },
            totalB: { type: Number, required: true },
            matchedCount: { type: Number, required: true },
            mismatchCount: { type: Number, required: true },
            missingInACount: { type: Number, required: true },
            missingInBCount: { type: Number, required: true },
            matchPercentage: { type: Number, required: true },
        },
        results: {
            matches: { type: Schema.Types.Mixed, default: [] },
            mismatches: { type: Schema.Types.Mixed, default: [] },
            missingInA: { type: Schema.Types.Mixed, default: [] },
            missingInB: { type: Schema.Types.Mixed, default: [] },
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries by user and date
reconciliationSchema.index({ userId: 1, createdAt: -1 });

export const Reconciliation = mongoose.model<IReconciliation>('Reconciliation', reconciliationSchema);
