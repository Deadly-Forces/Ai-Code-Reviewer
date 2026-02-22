'use client';

import { useState } from 'react';
import type { ReviewResult, ReviewIssue } from '@/lib/openrouter';

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function SeverityBadge({ severity }: { severity: string }) {
    const cls =
        severity === 'critical' ? 'badge-critical'
            : severity === 'warning' ? 'badge-warning'
                : 'badge-info';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-widest ${cls}`}>
            {severity}
        </span>
    );
}

function ScoreRing({ score }: { score: number }) {
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? 'var(--color-success)' : score >= 50 ? 'var(--color-severity-warning)' : 'var(--color-severity-critical)';

    return (
        <div className="relative w-24 h-24 mx-auto">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                {/* Background ring */}
                <circle
                    cx="48" cy="48" r="40"
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="6"
                />
                {/* Score ring */}
                <circle
                    cx="48" cy="48" r="40"
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="score-ring-animated"
                    style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-[var(--color-text-primary)] animate-count">
                    {score}
                </span>
                <span className="text-[0.6rem] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
                    Score
                </span>
            </div>
        </div>
    );
}

function IssueCard({ issue, index }: { issue: ReviewIssue; index: number }) {
    const borderClass =
        issue.severity === 'critical' ? 'issue-card-critical'
            : issue.severity === 'warning' ? 'issue-card-warning'
                : 'issue-card-info';

    return (
        <div
            className={`${borderClass} px-6 py-5 border-t border-[var(--color-border-glass)] animate-fade-in-up bg-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,0.15)] transition-colors`}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            <div className="flex items-center gap-2.5 mb-2.5">
                <SeverityBadge severity={issue.severity || 'info'} />
                <span className="text-[0.92rem] font-semibold text-[var(--color-text-primary)]">
                    {issue.title || 'Untitled Issue'}
                </span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3.5">
                {issue.description}
            </p>
            {issue.line && (
                <div className="mb-3">
                    <div className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-widest text-[var(--color-severity-critical)] mb-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        Current Code
                    </div>
                    <div className="code-block" dangerouslySetInnerHTML={{ __html: escapeHtml(issue.line) }} />
                </div>
            )}
            {issue.fix && (
                <div>
                    <div className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-widest text-[var(--color-success)] mb-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Suggested Fix
                    </div>
                    <div className="code-block" dangerouslySetInnerHTML={{ __html: escapeHtml(issue.fix) }} />
                </div>
            )}
        </div>
    );
}

function CategoryPanel({
    icon,
    title,
    count,
    issues,
    accentColor,
}: {
    icon: string;
    title: string;
    count: number;
    issues: ReviewIssue[];
    accentColor: string;
}) {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="glass-card overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-[var(--color-bg-card-hover)] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <h2 className="text-[0.95rem] font-bold text-[var(--color-text-primary)]">{title}</h2>
                    <span
                        className="px-2 py-0.5 rounded-full text-[0.7rem] font-bold"
                        style={{
                            background: `${accentColor}15`,
                            color: accentColor,
                        }}
                    >
                        {count}
                    </span>
                </div>
                <svg
                    className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-300 ${expanded ? '' : '-rotate-90'}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            <div
                className={`transition-all duration-400 overflow-hidden ${expanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                {issues.length === 0 ? (
                    <div className="text-center py-10 px-6 border-t border-[var(--color-border-glass)] text-[var(--color-text-muted)]">
                        <svg className="mx-auto mb-2.5 opacity-40" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <p className="text-sm">No issues found — looking good! 🎉</p>
                    </div>
                ) : (
                    issues.map((issue, i) => <IssueCard key={i} issue={issue} index={i} />)
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, count, label, color }: { icon: string; count: number; label: string; color: string }) {
    return (
        <div className="stat-card animate-fade-in-up">
            <div className="text-lg mb-1">{icon}</div>
            <div className="text-2xl font-extrabold animate-count" style={{ color }}>
                {count}
            </div>
            <div className="text-[0.68rem] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mt-0.5">
                {label}
            </div>
        </div>
    );
}

export default function ResultsPanel({ review }: { review: ReviewResult }) {
    const [copied, setCopied] = useState(false);
    const [codeExpanded, setCodeExpanded] = useState(true);

    const bugs = review.bugs || [];
    const opts = review.optimizations || [];
    const bps = review.bestPractices || [];

    // Calculate a quality score
    const totalIssues = bugs.length + opts.length + bps.length;
    const criticalCount = bugs.filter(b => b.severity === 'critical').length;
    const score = Math.max(0, Math.min(100, 100 - criticalCount * 20 - bugs.length * 8 - opts.length * 4 - bps.length * 2));

    const handleCopy = async () => {
        if (!review.correctedCode) return;
        await navigator.clipboard.writeText(review.correctedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-5 animate-fade-in-up">
            {/* Summary Card */}
            <div className="glass-card p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Score Ring */}
                    <div className="flex-shrink-0">
                        <ScoreRing score={score} />
                    </div>

                    {/* Summary Text + Stats */}
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="flex items-center justify-center sm:justify-start gap-2 text-lg font-bold mb-2 text-[var(--color-text-primary)]">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            Analysis Summary
                        </h2>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                            {review.summary || 'Analysis complete.'}
                        </p>

                        {/* Stat Cards Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            <StatCard
                                icon="🐛"
                                count={bugs.length}
                                label={bugs.length === 1 ? 'Bug' : 'Bugs'}
                                color="var(--color-severity-critical)"
                            />
                            <StatCard
                                icon="⚡"
                                count={opts.length}
                                label={opts.length === 1 ? 'Opt.' : 'Opts.'}
                                color="var(--color-severity-warning)"
                            />
                            <StatCard
                                icon="✅"
                                count={bps.length}
                                label={bps.length === 1 ? 'Tip' : 'Tips'}
                                color="var(--color-severity-info)"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Panels */}
            {totalIssues > 0 && (
                <>
                    <CategoryPanel icon="🐛" title="Bugs" count={bugs.length} issues={bugs} accentColor="var(--color-severity-critical)" />
                    <CategoryPanel icon="⚡" title="Optimizations" count={opts.length} issues={opts} accentColor="var(--color-severity-warning)" />
                    <CategoryPanel icon="✅" title="Best Practices" count={bps.length} issues={bps} accentColor="var(--color-severity-info)" />
                </>
            )}

            {/* Corrected Code */}
            <div className="glass-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4">
                    <button
                        onClick={() => setCodeExpanded(!codeExpanded)}
                        className="flex items-center gap-2.5 cursor-pointer"
                    >
                        <span className="text-lg">✨</span>
                        <h2 className="text-[0.95rem] font-bold text-[var(--color-text-primary)]">Corrected Code</h2>
                        <svg
                            className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-300 ${codeExpanded ? '' : '-rotate-90'}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                    <button
                        onClick={handleCopy}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 ${copied
                            ? 'bg-[var(--color-success-bg)] border border-[rgba(52,211,153,0.25)] text-[var(--color-success)]'
                            : 'bg-[rgba(129,140,248,0.08)] border border-[rgba(129,140,248,0.15)] text-[var(--color-accent)] hover:bg-[rgba(129,140,248,0.15)]'
                            }`}
                    >
                        {copied ? (
                            <>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                Copy
                            </>
                        )}
                    </button>
                </div>
                <div
                    className={`transition-all duration-400 overflow-hidden ${codeExpanded ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <pre className="border-t border-[var(--color-border-glass)] p-5 overflow-x-auto bg-[rgba(0,0,0,0.15)]">
                        <code className="font-[family-name:var(--font-jetbrains)] text-[0.82rem] leading-relaxed whitespace-pre-wrap break-words text-[var(--color-text-primary)]">
                            {review.correctedCode || '// No corrections needed — the code looks great!'}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    );
}
