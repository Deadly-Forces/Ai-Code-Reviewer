'use client';

import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { LANGUAGE_OPTIONS } from '@/lib/languages';

interface CodeInputProps {
    onAnalyze: (data: { code?: string; file?: File; language: string }) => void;
    isLoading: boolean;
}

export default function CodeInput({ onAnalyze, isLoading }: CodeInputProps) {
    const [tab, setTab] = useState<'paste' | 'upload'>('paste');
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('auto');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        setUploadedFile(file);
        // Auto-detect language
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const extMap: Record<string, string> = {
            js: 'javascript', ts: 'typescript', jsx: 'javascript', tsx: 'typescript',
            py: 'python', java: 'java', c: 'c', cpp: 'cpp', cs: 'csharp',
            go: 'go', rs: 'rust', rb: 'ruby', php: 'php', swift: 'swift',
            kt: 'kotlin', dart: 'dart', sql: 'sql', html: 'html', css: 'css',
            sh: 'bash', bash: 'bash',
        };
        if (extMap[ext]) setLanguage(extMap[ext]);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = () => {
        if (tab === 'paste') {
            if (!code.trim()) return;
            onAnalyze({ code, language });
        } else {
            if (!uploadedFile) return;
            onAnalyze({ file: uploadedFile, language });
        }
    };

    const lineCount = code ? code.split('\n').length : 0;

    return (
        <div className="glass-card overflow-hidden animate-fade-in-up">
            {/* Toolbar: Tabs + Language Selector */}
            <div className="flex items-center justify-between border-b border-[var(--color-border-glass)] px-1 sm:px-3 flex-wrap gap-2">
                {/* Tabs */}
                <div className="relative flex">
                    <button
                        onClick={() => setTab('paste')}
                        className={`tab-pill flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all cursor-pointer ${tab === 'paste' ? 'tab-pill-active' : 'tab-pill-inactive'
                            }`}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                        </svg>
                        Paste Code
                    </button>
                    <button
                        onClick={() => setTab('upload')}
                        className={`tab-pill flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all cursor-pointer ${tab === 'upload' ? 'tab-pill-active' : 'tab-pill-inactive'
                            }`}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Upload File
                    </button>

                    {/* Sliding indicator */}
                    <div
                        className="tab-indicator"
                        style={{
                            left: tab === 'paste' ? '0px' : '50%',
                            width: '50%',
                        }}
                    />
                </div>

                {/* Language selector */}
                <div className="relative mr-2 my-1.5">
                    <select
                        value={language}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value)}
                        aria-label="Select programming language"
                        className="appearance-none pl-3 pr-8 py-2 bg-black/30 border border-[var(--color-border-glass)] rounded-lg text-[var(--color-text-primary)] text-xs font-medium cursor-pointer outline-none focus:border-[var(--color-accent)] transition-colors tracking-wide"
                    >
                        {LANGUAGE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[var(--color-bg-secondary)]">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {/* Custom chevron */}
                    <svg
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]"
                        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </div>

            {/* Paste Tab — Code Editor */}
            {tab === 'paste' && (
                <div className="relative flex">
                    {/* Line numbers gutter */}
                    {lineCount > 0 && (
                        <div className="flex-shrink-0 w-12 pt-5 pb-5 pr-0 text-right select-none border-r border-[var(--color-border-glass)] bg-black/10">
                            {Array.from({ length: lineCount }, (_, i) => (
                                <div
                                    key={i}
                                    className="font-[family-name:var(--font-jetbrains)] text-[0.72rem] leading-[1.75] text-[var(--color-text-muted)] opacity-50 pr-3"
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    )}
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="code-textarea flex-1"
                        placeholder="// Paste your code here — supports 20+ languages"
                        spellCheck={false}
                    />
                </div>
            )}

            {/* Upload Tab */}
            {tab === 'upload' && (
                <div
                    className={`upload-zone p-14 mx-4 my-4 rounded-xl text-center cursor-pointer transition-all ${isDragging ? 'upload-zone-active' : ''
                        }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    {!uploadedFile ? (
                        <>
                            <div className={`mb-4 transition-all ${isDragging ? 'text-[var(--color-accent)] -translate-y-1 scale-110' : 'text-[var(--color-text-muted)]'}`}>
                                <svg className="mx-auto" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            </div>
                            <p className="text-[var(--color-text-secondary)] font-semibold text-sm mb-1">
                                Drop your file here
                            </p>
                            <p className="text-[var(--color-text-muted)] text-xs">
                                or <span className="text-[var(--color-accent)] underline underline-offset-2">browse</span> to select
                            </p>
                        </>
                    ) : (
                        <div className="flex items-center justify-center gap-3">
                            <div className="inline-flex items-center gap-2.5 bg-[rgba(129,140,248,0.08)] px-4 py-2.5 rounded-lg border border-[rgba(129,140,248,0.15)]">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-accent)]">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <span className="font-[family-name:var(--font-jetbrains)] text-sm text-[var(--color-accent)]">
                                    {uploadedFile.name}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setUploadedFile(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="ml-1 w-5 h-5 rounded-full flex items-center justify-center bg-[rgba(248,113,113,0.1)] text-[var(--color-severity-critical)] hover:bg-[rgba(248,113,113,0.2)] text-xs leading-none cursor-pointer transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        aria-label="Upload code file"
                        onChange={(e) => {
                            if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                        }}
                    />
                </div>
            )}

            {/* Analyze Button */}
            <button
                onClick={handleSubmit}
                disabled={isLoading || (tab === 'paste' ? !code.trim() : !uploadedFile)}
                className="shimmer-btn flex items-center justify-center gap-2.5 w-full py-4 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)] text-white font-bold text-sm tracking-wide rounded-b-2xl cursor-pointer transition-all hover:shadow-[0_8px_32px_rgba(129,140,248,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.995]"
            >
                {isLoading ? (
                    <>
                        <div className="spinner" />
                        <span>Analyzing…</span>
                    </>
                ) : (
                    <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <span>Analyze Code</span>
                    </>
                )}
            </button>
        </div>
    );
}
