import { reconciliationAPI } from "./api";
import type { ReconciliationResult } from "./types";

export interface SavedReconciliation {
    _id: string; // MongoDB ID
    createdAt: string; // ISO date string
    fileNameA: string;
    fileNameB: string;
    summary: {
        totalA: number;
        totalB: number;
        matchedCount: number;
        mismatchCount: number;
        missingInACount: number;
        missingInBCount: number;
        matchPercentage: number;
    };
    results?: ReconciliationResult; // Optional, might be excluded in list view
    user: string;
}

export const saveReconciliation = async (
    fileAName: string,
    fileBName: string,
    result: ReconciliationResult
): Promise<void> => {
    try {
        await reconciliationAPI.save({
            fileNameA: fileAName,
            fileNameB: fileBName,
            summary: result.summary,
            results: result // Send entire result object
        });
        console.log("Reconciliation saved to backend");
    } catch (error) {
        console.error("Failed to save reconciliation:", error);
    }
};

export const getReconciliationHistory = async (): Promise<SavedReconciliation[]> => {
    try {
        const response = await reconciliationAPI.getAll();
        if (response.success && response.data) {
            // Backend returns { data: { reconciliations: [], pagination: {} } }
            // We need to extract the array
            return (response.data as any).reconciliations || [];
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch history:", error);
        return [];
    }
};

export const deleteReconciliation = async (id: string): Promise<void> => {
    try {
        await reconciliationAPI.delete(id);
    } catch (error) {
        console.error("Failed to delete reconciliation:", error);
    }
};
