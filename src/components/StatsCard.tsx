import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    gradient?: string;
}

export function StatsCard({ label, value, icon: Icon, description, gradient }: StatsCardProps) {
    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="flex-auto p-4">
                <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                        <div>
                            <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase text-text-muted">
                                {label}
                            </p>
                            <h5 className="mb-0 font-bold text-text-main">
                                {value}
                            </h5>
                            {description && (
                                <p className="mb-0 text-sm leading-normal text-text-muted mt-1">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="px-3 text-right basis-1/3">
                        <div className={`inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl ${gradient || "from-primary to-primary-hover"} shadow-soft-2xl ring-2 ring-white`}>
                            <div className="relative top-3.5 text-lg text-white grid place-items-center">
                                <Icon size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
