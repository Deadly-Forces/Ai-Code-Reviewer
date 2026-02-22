# AI Code Reviewer

> Instant AI-powered code analysis — bugs, optimizations, and best practices in seconds.

Built with **Next.js 16**, **TypeScript**, and **Tailwind CSS v4**. Powered by [OpenRouter](https://openrouter.ai/) for multi-model AI access.

---

## ✨ Features

- **🐛 Bug Detection** — Finds logical errors, null reference issues, off-by-one bugs, and more
- **⚡ Optimizations** — Suggests performance improvements and cleaner patterns
- **✅ Best Practices** — Recommends idiomatic code, naming conventions, and security fixes
- **✨ Corrected Code** — Provides a fully corrected version of your code with one-click copy
- **📊 Quality Score** — Animated score ring showing overall code health at a glance
- **📁 File Upload** — Drag & drop or browse — auto-detects language from file extension
- **🌐 20+ Languages** — JavaScript, TypeScript, Python, Java, C++, Go, Rust, and more

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- An [OpenRouter API key](https://openrouter.ai/keys)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ai-code-reviewer.git
cd ai-code-reviewer

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

Edit `.env` with your OpenRouter API key:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=google/gemini-2.0-flash-001
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Project Structure

```
├── app/
│   ├── api/review/        # POST endpoint — sends code to OpenRouter
│   ├── globals.css         # Design system — colors, animations, components
│   ├── layout.tsx          # Root layout with ambient background + footer
│   └── page.tsx            # Home page — header, input, results
├── components/
│   ├── CodeInput.tsx       # Code paste / file upload with language selector
│   └── ResultsPanel.tsx    # Score ring, stat cards, issue panels, corrected code
├── lib/
│   ├── languages.ts        # Language options + file extension mapping
│   ├── openrouter.ts       # OpenRouter API client + response parsing
│   └── prompt.ts           # System prompt builder for code review
└── .env.example            # Environment variable template
```

---

## ⚙️ Configuration

| Variable | Description | Default |
|---|---|---|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | — |
| `OPENROUTER_MODEL` | AI model to use | `google/gemini-2.0-flash-001` |

You can use any model available on [OpenRouter](https://openrouter.ai/models), including GPT-4o, Claude, Gemini, DeepSeek, and more.

---

## 🛠️ Tech Stack

- **Framework** — [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **Language** — [TypeScript](https://www.typescriptlang.org/)
- **Styling** — [Tailwind CSS v4](https://tailwindcss.com/)
- **Fonts** — [Inter](https://rsms.me/inter/) + [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
- **AI** — [OpenRouter](https://openrouter.ai/) (multi-model gateway)

---

## 📄 License

MIT
