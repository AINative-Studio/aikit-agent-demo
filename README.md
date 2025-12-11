# AI Kit Multi-Agent Browser Demo

A production-ready demonstration of AI Kit's multi-agent capabilities featuring three distinct AI agents powered by Claude Sonnet 4. Built with Next.js 14, TypeScript, and Tailwind CSS.

**Live Demo from AI Native Studio Class - December 2025**

## Features

- 🤖 **Three Specialized Agents**
  - **Customer Support** - Friendly, empathetic support (temp: 0.7)
  - **Code Assistant** - Precise technical guidance (temp: 0.3)
  - **Creative Writer** - Imaginative content creation (temp: 0.9)

- 💬 **Full Chat History** - Context-aware conversations with complete message history
- 🎨 **Modern UI** - Beautiful, responsive interface built with Tailwind CSS
- ⚡ **Real-time Streaming** - Fast responses with optimized API integration
- 🔄 **Agent Switching** - Seamlessly switch between agents mid-conversation
- 📱 **Mobile Responsive** - Works perfectly on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **AI SDK**: Anthropic Claude API
- **Model**: Claude Sonnet 4 (claude-sonnet-4-20250514)
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Anthropic API Key ([Get one here](https://console.anthropic.com/))

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/AINative-Studio/aikit-agent-demo.git
cd aikit-agent-demo
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the demo!

## Project Structure

```
aikit-agent-demo/
├── src/
│   └── agents/
│       ├── CustomerSupport.ts    # Support agent configuration
│       ├── CodeAssistant.ts      # Code agent configuration
│       └── CreativeWriter.ts     # Writer agent configuration
├── app/
│   ├── page.tsx                  # Main chat UI
│   ├── layout.tsx                # Root layout
│   └── api/
│       └── chat/
│           └── route.ts          # Chat API endpoint
├── .env.example                  # Environment template
└── README.md
```

## Agent Configurations

### Customer Support Agent
- **Temperature**: 0.7 (balanced)
- **Max Tokens**: 2000
- **Use Case**: Product questions, troubleshooting, billing
- **Personality**: Friendly, empathetic, solution-focused

### Code Assistant Agent
- **Temperature**: 0.3 (precise)
- **Max Tokens**: 3000
- **Use Case**: Code generation, debugging, technical explanations
- **Personality**: Expert, clear, methodical

### Creative Writer Agent
- **Temperature**: 0.9 (creative)
- **Max Tokens**: 2000
- **Use Case**: Stories, content creation, brainstorming
- **Personality**: Imaginative, expressive, inspiring

## How It Works

### Chat Flow

1. **User selects an agent** - Click on one of the three agent cards
2. **User sends a message** - Type in the input field and press Enter
3. **Message history builds** - All messages stored in React state
4. **Full context sent to API** - Complete conversation history included
5. **Claude responds** - Agent processes with its unique personality
6. **UI updates** - Response displayed with role-based styling

### API Integration

The \`/api/chat\` endpoint:
- Receives messages array + agent configuration
- Calls Anthropic's Claude API
- Returns streaming or complete responses
- Handles errors gracefully

## Customization

### Adding New Agents

Create a new agent file in \`src/agents/\`:

```typescript
export const MyCustomAgent = {
  name: 'MyAgent',
  systemPrompt: \`You are a specialized agent for...\`,
  model: 'claude-sonnet-4-20250514',
  temperature: 0.5,
  maxTokens: 2000,
};
```

Then import and add to the \`AGENTS\` object in \`app/page.tsx\`.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add \`ANTHROPIC_API_KEY\` environment variable
4. Deploy!

## Learn More

- **AI Kit**: https://www.ainative.studio/ai-kit
- **ZeroDB**: https://zerodb.ainative.studio
- **Anthropic Claude**: https://www.anthropic.com/claude
- **Next.js**: https://nextjs.org

## Built With AI Kit

This demo was created using AI Native Studio's AI Kit - a framework for building production-ready AI applications fast.

### Get Started with AI Kit

```bash
npx @ainative/ai-kit-cli@latest create my-ai-app
```

## License

MIT License - feel free to use this demo as a starting point for your own AI applications!

---

**Made with ❤️ by AI Native Studio**

Demonstrating the power of AI Kit + Claude Sonnet 4 for the AI Native Studio class, December 2025.
