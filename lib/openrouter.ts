/**
 * OpenRouter API client.
 * Reads model and API key from environment variables.
 */

import { buildPrompt } from './prompt';

export interface ReviewIssue {
    severity: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
    line?: string;
    fix?: string;
}

export interface ReviewResult {
    summary: string;
    bugs: ReviewIssue[];
    optimizations: ReviewIssue[];
    bestPractices: ReviewIssue[];
    correctedCode: string;
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function getReview(code: string, language: string): Promise<ReviewResult> {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    const model = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

    if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
        throw new Error('OPENROUTER_API_KEY is not configured. Set it in your .env file.');
    }

    const prompt = buildPrompt(code, language);

    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'AI Code Reviewer',
        },
        body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        if (response.status === 401 || response.status === 403) {
            console.error('OpenRouter Auth Error:', response.status, errorBody);
            throw new Error('Invalid OpenRouter API key. Check your .env configuration.');
        }
        if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        throw new Error(`OpenRouter API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    let text: string = data.choices?.[0]?.message?.content;

    if (!text) {
        throw new Error('No response received from the AI model.');
    }

    // Strip <think>...</think> blocks from reasoning models (e.g. DeepSeek R1)
    text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    // Strip markdown code fences if present (handle ```json, ```JSON, ``` etc.)
    text = text.replace(/```(?:json|JSON)?\s*\n?/g, '').trim();

    // Remove control characters that can break JSON parsing
    text = text.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F]/g, '');

    // Try to extract JSON object if there's surrounding text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        text = jsonMatch[0];
    }

    try {
        return JSON.parse(text) as ReviewResult;
    } catch (parseErr) {
        console.error('Failed to parse AI response. Raw text:\n', text.substring(0, 1000));
        // Attempt a second pass: fix common JSON issues (trailing commas)
        try {
            const cleaned = text
                .replace(/,\s*}/g, '}')
                .replace(/,\s*]/g, ']');
            return JSON.parse(cleaned) as ReviewResult;
        } catch {
            throw new Error('AI returned an invalid response. Please try again.');
        }
    }
}
