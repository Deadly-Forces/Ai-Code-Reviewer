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
    const apiKey = process.env.OPENROUTER_API_KEY;
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

    // Strip markdown code fences if present
    text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    // Try to extract JSON object if there's surrounding text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        text = jsonMatch[0];
    }

    try {
        return JSON.parse(text) as ReviewResult;
    } catch {
        console.error('Failed to parse AI response:', text.substring(0, 500));
        throw new Error('AI returned an invalid response. Please try again.');
    }
}
