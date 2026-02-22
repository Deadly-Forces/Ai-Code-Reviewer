/**
 * POST /api/review
 * Accepts JSON body { code, language } or FormData with file upload.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getReview } from '@/lib/openrouter';
import { detectLanguage, ALLOWED_EXTENSIONS } from '@/lib/languages';

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get('content-type') || '';
        let code = '';
        let language = 'auto';

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File | null;
            language = (formData.get('language') as string) || 'auto';

            if (file) {
                // Validate file extension
                const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
                if (!ALLOWED_EXTENSIONS.includes(ext)) {
                    return NextResponse.json(
                        { error: `File type ${ext} is not supported. Upload a source code file.` },
                        { status: 400 }
                    );
                }

                // Check file size (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    return NextResponse.json(
                        { error: 'File too large. Maximum size is 5MB.' },
                        { status: 400 }
                    );
                }

                code = await file.text();
                if (language === 'auto') {
                    language = detectLanguage(file.name);
                }
            }
        } else {
            const body = await request.json();
            code = body.code || '';
            language = body.language || 'auto';
        }

        if (!code.trim()) {
            return NextResponse.json(
                { error: 'No code provided. Paste code or upload a file.' },
                { status: 400 }
            );
        }

        const review = await getReview(code, language);
        return NextResponse.json({ success: true, review });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
        console.error('Review error:', message);

        const status = message.includes('API key') ? 401
            : message.includes('Rate limit') ? 429
                : 500;

        return NextResponse.json({ error: message }, { status });
    }
}
