import type { Transaction, ReconciliationResult, ColumnMapping } from "./types";

export const normalizeAmount = (val: any): number => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    // Remove currency symbols and commas
    const cleaned = String(val).replace(/[^0-9.-]+/g, "");
    return parseFloat(cleaned) || 0;
};

export const parseDataToTransactions = (
    data: any[],
    mapping: ColumnMapping
): Transaction[] => {
    return data.map((row, index) => {
        // Generate a fallback ID if missing/empty
        const idVal = row[mapping.idCol];
        const id = idVal ? String(idVal).trim() : `ROW-${index}`;

        return {
            id,
            amount: normalizeAmount(row[mapping.amountCol]),
            date: mapping.dateCol ? row[mapping.dateCol] : undefined,
            description: JSON.stringify(row), // Simplified description
            originalRow: row,
        };
    });
};

export const reconcileData = (
    datasetA: Transaction[],
    datasetB: Transaction[],
    tolerance: number = 0.01 // Floating point tolerance
): ReconciliationResult => {
    const mapA = new Map(datasetA.map((t) => [t.id, t]));
    const mapB = new Map(datasetB.map((t) => [t.id, t]));

    const matches: { a: Transaction; b: Transaction }[] = [];
    const mismatches: { a: Transaction; b: Transaction; reason: string }[] = [];
    const missingInA: Transaction[] = [];
    const missingInB: Transaction[] = [];

    // Iterate through A to find matches/mismatches/missingInB
    datasetA.forEach((itemA) => {
        const itemB = mapB.get(itemA.id);

        if (itemB) {
            // Found in both, check amount
            const diff = Math.abs(itemA.amount - itemB.amount);
            if (diff <= tolerance) {
                matches.push({ a: itemA, b: itemB });
            } else {
                mismatches.push({
                    a: itemA,
                    b: itemB,
                    reason: `Amount Mismatch: ${itemA.amount} vs ${itemB.amount} (Diff: ${diff.toFixed(2)})`,
                });
            }
        } else {
            missingInB.push(itemA);
        }
    });

    // Iterate through B to find missingInA
    datasetB.forEach((itemB) => {
        if (!mapA.has(itemB.id)) {
            missingInA.push(itemB);
        }
    });

    const totalA = datasetA.length;
    const totalB = datasetB.length;
    // Calculate approximate match percentage based on Dataset A coverage + Dataset B coverage
    // Or simply matches / (matches + mismatches + missing)
    const totalUnique = matches.length + mismatches.length + missingInA.length + missingInB.length;

    return {
        summary: {
            totalA,
            totalB,
            matchedCount: matches.length,
            mismatchCount: mismatches.length,
            missingInACount: missingInA.length,
            missingInBCount: missingInB.length,
            matchPercentage: totalUnique > 0 ? ((matches.length) / totalUnique) * 100 : 0,
        },
        matches,
        mismatches,
        missingInA,
        missingInB,
    };
};
