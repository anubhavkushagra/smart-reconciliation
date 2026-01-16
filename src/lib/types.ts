export interface Transaction {
    id: string; // Unique identifier (determined by mapping)
    date?: string;
    amount: number;
    description?: string;
    originalRow: Record<string, any>; // Keep original data for display
}

export interface ReconciliationResult {
    summary: {
        totalA: number;
        totalB: number;
        matchedCount: number;
        mismatchCount: number;
        missingInACount: number;
        missingInBCount: number;
        matchPercentage: number;
    };
    matches: { a: Transaction; b: Transaction }[];
    mismatches: { a: Transaction; b: Transaction; reason: string }[];
    missingInA: Transaction[];
    missingInB: Transaction[];
}

export interface ColumnMapping {
    idCol: string;
    amountCol: string;
    dateCol?: string;
}
