import { useEffect, useState } from "react";
import { getReconciliationHistory, deleteReconciliation } from "@/lib/persistence";
import type { SavedReconciliation } from "@/lib/persistence";
import { useAuth } from "@/context/AuthContext";
import { Trash2, FileText, Calendar } from "lucide-react";

export function ReportsView() {
    const { user } = useAuth();
    const [history, setHistory] = useState<SavedReconciliation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadHistory();
        }
    }, [user]);

    const loadHistory = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getReconciliationHistory();
            setHistory(data);
        } catch (e) {
            console.error("Failed to load history", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!user) return;
        if (window.confirm("Are you sure you want to delete this report?")) {
            await deleteReconciliation(id);
            loadHistory();
        }
    };

    // Need to import this specifically since it's not exported from persistence in the new version, 
    // or just re-implement the wrapper if deleteReconciliation is exported.
    // Checking persistence.ts, deleteReconciliation IS exported.

    if (loading) {
        return <div className="p-8 text-center text-text-muted">Loading history...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text-main">History & Reports</h2>
                    <p className="text-text-muted">View past reconciliation results.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft-xl overflow-hidden">
                {history.length === 0 ? (
                    <div className="p-12 text-center text-text-muted">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No reports found. Run a reconciliation to generate reports.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-text-muted font-bold">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Files</th>
                                    <th className="p-4 text-center">Match Rate</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record) => (
                                    <tr key={record._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-primary" />
                                                {new Date(record.createdAt).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-text-main">{record.fileNameA}</div>
                                            <div className="text-xs text-text-muted">vs {record.fileNameB}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${record.summary?.matchPercentage === 100
                                                    ? "bg-success/10 text-success"
                                                    : "bg-warning/10 text-warning"
                                                }`}>
                                                {record.summary?.matchPercentage?.toFixed(1) || "0.0"}%
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(record._id)}
                                                className="text-text-muted hover:text-error transition-colors p-2"
                                                title="Delete Report"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}


