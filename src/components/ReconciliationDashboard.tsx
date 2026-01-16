import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { StatsCard } from "./StatsCard";
import { ResultsChart } from "./ResultsChart";
import { parseDataToTransactions, reconcileData } from "@/lib/reconcile";
import type { ReconciliationResult } from "@/lib/types";
import { CheckCircle, AlertTriangle, FileQuestion, ArrowRight, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { saveReconciliation } from "@/lib/persistence";

export function ReconciliationDashboard() {
    const { user, isAuthenticated } = useAuth();
    const [fileA, setFileA] = useState<{ name: string; data: any[] } | null>(null);
    const [fileB, setFileB] = useState<{ name: string; data: any[] } | null>(null);
    const [step, setStep] = useState<"UPLOAD" | "MAPPING" | "RESULTS">("UPLOAD");
    const [results, setResults] = useState<ReconciliationResult | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const handleReconcile = () => {
        if (!fileA || !fileB) return;

        const getMapping = (row: any) => {
            const idCol = Object.keys(row).find(k => /id|ref|no|inv/i.test(k)) || Object.keys(row)[0];
            const amountCol = Object.keys(row).find(k => /amount|total|val|price/i.test(k)) || Object.keys(row)[1];
            return { idCol, amountCol };
        };

        const mappingA = getMapping(fileA.data[0]);
        const mappingB = getMapping(fileB.data[0]);

        const txA = parseDataToTransactions(fileA.data, mappingA);
        const txB = parseDataToTransactions(fileB.data, mappingB);

        const res = reconcileData(txA, txB);
        setResults(res);
        setStep("RESULTS");
        setIsSaved(false);

        // Auto-save if user is logged in
        if (isAuthenticated && user) {
            saveReconciliation(fileA.name, fileB.name, res);
            setIsSaved(true);
        }
    };

    const reset = () => {
        setFileA(null);
        setFileB(null);
        setResults(null);
        setStep("UPLOAD");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    {step === "RESULTS" && (
                        <button onClick={reset} className="text-sm text-primary font-bold hover:underline mb-2">
                            ← Start Over
                        </button>
                    )}
                    <h2 className="text-3xl font-bold text-text-main">
                        {step === "RESULTS" ? "Reconciliation Report" : "New Reconciliation"}
                    </h2>
                    <p className="text-text-muted">
                        {step === "RESULTS"
                            ? `Comparing ${fileA?.name} vs ${fileB?.name}`
                            : "Upload two datasets to identify discrepancies automatically."
                        }
                    </p>
                    {isSaved && (
                        <p className="text-success text-sm mt-1 flex items-center gap-1">
                            <Save size={14} /> Saved to history
                        </p>
                    )}
                </div>
            </div>

            {step === "UPLOAD" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="bg-white p-6 rounded-2xl shadow-soft-xl">
                        <h4 className="font-bold mb-4 text-text-main">Source A (e.g. Ledger)</h4>
                        <FileUpload
                            label=""
                            onDataLoaded={(data, name) => setFileA({ name, data })}
                        />
                        {fileA && <p className="text-xs text-center mt-2 text-success font-bold">Loaded {fileA.data.length} records</p>}
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-soft-xl">
                        <h4 className="font-bold mb-4 text-text-main">Source B (e.g. Bank)</h4>
                        <FileUpload
                            label=""
                            onDataLoaded={(data, name) => setFileB({ name, data })}
                        />
                        {fileB && <p className="text-xs text-center mt-2 text-success font-bold">Loaded {fileB.data.length} records</p>}
                    </div>

                    <div className="md:col-span-2 flex justify-center mt-4">
                        <button
                            disabled={!fileA || !fileB}
                            onClick={handleReconcile}
                            className="px-8 py-3 bg-gradient-to-tl from-primary to-primary-hover text-white rounded-lg shadow-soft-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-soft-xl transition-all flex items-center gap-2"
                        >
                            Start Reconciliation <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {step === "RESULTS" && results && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            label="Perfect Matches"
                            value={results.summary.matchedCount}
                            icon={CheckCircle}
                            gradient="from-success to-lime-400"
                            description={`${results.summary.matchPercentage.toFixed(1)}% match rate`}
                        />
                        <StatsCard
                            label="Mismatches"
                            value={results.summary.mismatchCount}
                            icon={AlertTriangle}
                            gradient="from-warning to-orange-400"
                            description="Found in both but different amounts"
                        />
                        <StatsCard
                            label={`Missing in ${fileA?.name.slice(0, 10)}...`}
                            value={results.summary.missingInACount}
                            icon={FileQuestion}
                            gradient="from-info to-blue-400"
                        />
                        <StatsCard
                            label={`Missing in ${fileB?.name.slice(0, 10)}...`}
                            value={results.summary.missingInBCount}
                            icon={FileQuestion}
                            gradient="from-error to-red-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Simple Chart */}
                        <div className="lg:col-span-1">
                            <ResultsChart summary={results.summary} />
                        </div>

                        {/* Details Table Mockup (Real table would be larger) */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft-xl p-6 overflow-hidden">
                            <h5 className="font-bold mb-4">Discrepancy Details</h5>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-text-muted font-bold">
                                        <tr>
                                            <th className="p-3 rounded-l-lg">Type</th>
                                            <th className="p-3">ID</th>
                                            <th className="p-3">Source A</th>
                                            <th className="p-3">Source B</th>
                                            <th className="p-3 rounded-r-lg">Diff</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.mismatches.map((m, i) => (
                                            <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                                <td className="p-3 text-warning font-bold">Mismatch</td>
                                                <td className="p-3 font-mono text-xs">{m.a.id}</td>
                                                <td className="p-3">{m.a.amount}</td>
                                                <td className="p-3">{m.b.amount}</td>
                                                <td className="p-3 text-error font-bold">{(m.a.amount - m.b.amount).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        {results.missingInB.map((m, i) => (
                                            <tr key={i} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                                <td className="p-3 text-error font-bold">Missing in B</td>
                                                <td className="p-3 font-mono text-xs">{m.id}</td>
                                                <td className="p-3">{m.amount}</td>
                                                <td className="p-3 border-b-0 italic text-gray-400">---</td>
                                                <td className="p-3 text-error">{m.amount}</td>
                                            </tr>
                                        ))}
                                        {results.matches.length === 0 && results.mismatches.length === 0 && results.missingInB.length === 0 && (
                                            <tr><td colSpan={5} className="p-4 text-center text-text-muted">No discrepancies to show or perfect match!</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
