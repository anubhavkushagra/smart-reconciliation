import { useCallback, useState } from "react";
import Papa from "papaparse";
import { Upload, CheckCircle, XCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
    label: string;
    onDataLoaded: (data: any[], filename: string) => void;
}

export function FileUpload({ label, onDataLoaded }: FileUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const processFile = (file: File) => {
        if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
            setError("Please upload a valid CSV file.");
            return;
        }

        setFileName(file.name);
        setError(null);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.data && results.data.length > 0) {
                    onDataLoaded(results.data, file.name);
                } else {
                    setError("File appears to be empty.");
                }
            },
            error: (err) => {
                setError(`Parsing error: ${err.message} `);
            },
        });
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                processFile(files[0]);
            }
        },
        [onDataLoaded]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-bold text-text-main mb-2 ml-1">
                {label}
            </label>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer overflow-hidden",
                    isDragOver
                        ? "border-primary bg-primary/5"
                        : "border-gray-300 bg-white hover:bg-gray-50",
                    error ? "border-error/50 bg-error/5" : "",
                    fileName ? "border-success/50 bg-success/5" : ""
                )}
            >
                <input
                    type="file"
                    accept=".csv"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                />

                <AnimatePresence mode="wait">
                    {fileName ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center text-success"
                        >
                            <CheckCircle size={32} className="mb-2" />
                            <p className="text-sm font-semibold truncate max-w-[200px]">{fileName}</p>
                            <p className="text-xs opacity-70">Ready to analyze</p>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center text-error"
                        >
                            <XCircle size={32} className="mb-2" />
                            <p className="text-sm font-semibold">{error}</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center text-text-muted"
                        >
                            <Upload size={32} className={cn("mb-2 transition-transform", isDragOver ? "-translate-y-1" : "")} />
                            <p className="text-sm font-medium">Drop CSV here or click to upload</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
