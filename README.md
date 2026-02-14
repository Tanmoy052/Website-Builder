# AI Studio - Website Builder Platform

A production-ready AI Website Builder inspired by Google AI Studio.

## Features

- **AI Chat Studio**: Professional chat interface with history and system/user messages.
- **Model Selection**: Switch between Gemini 2.0, GPT-4o, and DeepSeek.
- **Website Generation Engine**: Generates full-stack code based on natural language prompts.
- **Live Preview**: Responsive preview of generated frontend with hot-reload.
- **ZIP Export**: Download the entire source code of your generated website.
- **File Upload**: Include local context in your AI generations.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons.
- **Backend**: Next.js API Routes, Node.js, JSZip.
- **AI**: Google Generative AI (Gemini), OpenAI API.

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key
   OPENAI_API_KEY=your_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app`: Next.js App Router pages and API routes.
- `/components`: Reusable UI components.
- `/lib`: Core business logic and AI provider abstraction.
- `/styles`: Global CSS and Tailwind configurations.
- `/public`: Static assets.

## License

MIT
