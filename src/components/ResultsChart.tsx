import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { ReconciliationResult } from "@/lib/types";

interface ResultsChartProps {
    summary: ReconciliationResult["summary"];
}

export function ResultsChart({ summary }: ResultsChartProps) {
    const data = [
        { name: "Matched", value: summary.matchedCount, color: "#82d616" },
        { name: "Mismatch", value: summary.mismatchCount, color: "#fbcf33" },
        { name: "Missing in A", value: summary.missingInACount, color: "#17c1e8" },
        { name: "Missing in B", value: summary.missingInBCount, color: "#ea0606" },
    ];

    return (
        <div className="w-full h-[300px] bg-white rounded-2xl shadow-soft-xl p-4">
            <h6 className="font-bold text-text-main mb-4">Reconciliation Overview</h6>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
