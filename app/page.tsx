'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import CodeInput from '@/components/CodeInput';
import ResultsPanel from '@/components/ResultsPanel';
import type { ReviewResult } from '@/lib/openrouter';

function Toast({ message, type, onDone }: { message: string; type: 'success' | 'error'; onDone: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onDone, 400);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={`fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl text-sm font-medium shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 pointer-events-none ${show ? 'toast-enter' : 'toast-exit'
        } ${type === 'error'
          ? 'bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.25)] text-[var(--color-text-primary)]'
          : 'bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.25)] text-[var(--color-text-primary)]'
        }`}
    >
      <span className="text-base">{type === 'error' ? '✕' : '✓'}</span>
      {message}
    </div>
  );
}

export default function Home() {
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  const handleAnalyze = async (data: { code?: string; file?: File; language: string }) => {
    setIsLoading(true);
    setReview(null);

    try {
      let body: BodyInit;
      const headers: Record<string, string> = {};

      if (data.file) {
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('language', data.language);
        body = formData;
      } else {
        body = JSON.stringify({ code: data.code, language: data.language });
        headers['Content-Type'] = 'application/json';
      }

      const res = await fetch('/api/review', { method: 'POST', headers, body });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'An error occurred during analysis.');
      }

      setReview(result.review);
      showToast('Analysis complete!', 'success');

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to analyze code.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-[920px] mx-auto px-5 py-12 pb-8">
      {/* Header */}
      <header className="text-center mb-10 animate-fade-in-up">
        {/* Logo */}
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-secondary)] blur-xl opacity-40" />
            <svg className="relative" width="42" height="42" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
              <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" stroke="white" strokeWidth="1.5" fill="none" opacity="0.9" />
              <circle cx="16" cy="16" r="3" fill="white" opacity="0.85" />
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#818cf8" />
                  <stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent tracking-tight leading-tight">
            AI Code Reviewer
          </h1>
        </div>

        <p className="text-[var(--color-text-secondary)] text-sm max-w-md mx-auto leading-relaxed">
          Paste or upload your code for instant AI-powered analysis — get bug reports,
          optimizations, and best practice suggestions in seconds.
        </p>

        {/* Feature pills */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[
            { icon: '🐛', label: 'Bug Detection' },
            { icon: '⚡', label: 'Optimizations' },
            { icon: '✅', label: 'Best Practices' },
          ].map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[rgba(129,140,248,0.06)] border border-[var(--color-border-glass)] text-[var(--color-text-muted)] tracking-wide"
            >
              <span>{f.icon}</span>
              {f.label}
            </span>
          ))}
        </div>
      </header>

      {/* Code Input */}
      <CodeInput onAnalyze={handleAnalyze} isLoading={isLoading} />

      {/* Keyboard shortcut hint */}
      <p className="text-center text-xs text-[var(--color-text-muted)] mt-4 opacity-50">
        Press{' '}
        <kbd className="px-1.5 py-0.5 rounded-md bg-black/40 border border-[var(--color-border-glass)] text-[0.65rem] font-[family-name:var(--font-jetbrains)]">
          Ctrl
        </kbd>{' '}
        +{' '}
        <kbd className="px-1.5 py-0.5 rounded-md bg-black/40 border border-[var(--color-border-glass)] text-[0.65rem] font-[family-name:var(--font-jetbrains)]">
          Enter
        </kbd>{' '}
        to analyze
      </p>

      {/* Results */}
      {review && (
        <div ref={resultsRef} className="mt-10">
          <ResultsPanel review={review} />
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          key={toast.message + Date.now()}
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </main>
  );
}
