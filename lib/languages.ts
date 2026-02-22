/**
 * Language detection: maps file extensions to language names.
 */

export const EXT_TO_LANGUAGE: Record<string, string> = {
    '.js': 'javascript',
    '.ts': 'typescript',
    '.jsx': 'javascript',
    '.tsx': 'typescript',
    '.py': 'python',
    '.java': 'java',
    '.c': 'c',
    '.cpp': 'cpp',
    '.cs': 'csharp',
    '.go': 'go',
    '.rs': 'rust',
    '.rb': 'ruby',
    '.php': 'php',
    '.swift': 'swift',
    '.kt': 'kotlin',
    '.scala': 'scala',
    '.html': 'html',
    '.css': 'css',
    '.sql': 'sql',
    '.sh': 'bash',
    '.bash': 'bash',
    '.dart': 'dart',
    '.lua': 'lua',
    '.r': 'r',
    '.vue': 'vue',
    '.svelte': 'svelte',
};

/** All allowed upload file extensions */
export const ALLOWED_EXTENSIONS = Object.keys(EXT_TO_LANGUAGE).concat([
    '.ps1', '.m', '.mm', '.h', '.hpp', '.json', '.xml', '.yaml', '.yml',
]);

/** Detect language from a filename */
export function detectLanguage(filename: string): string {
    const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
    return EXT_TO_LANGUAGE[ext] || 'auto';
}

/** Language options for the UI dropdown */
export const LANGUAGE_OPTIONS = [
    { value: 'auto', label: 'Auto Detect' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'php', label: 'PHP' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'dart', label: 'Dart' },
    { value: 'sql', label: 'SQL' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'bash', label: 'Bash' },
];
