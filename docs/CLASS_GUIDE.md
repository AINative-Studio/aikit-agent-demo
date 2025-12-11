# AI Kit Class Complete Guide

**AI Native Studio - Building Production AI Applications Fast**

This comprehensive guide covers everything taught in the December 2025 AI Kit class.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Creating Your First Agent](#creating-your-first-agent)
3. [Building Multi-Agent Systems](#building-multi-agent-systems)
4. [Adding Chat History](#adding-chat-history)
5. [Available Tools & Integrations](#available-tools--integrations)
6. [Testing & Deployment](#testing--deployment)

---

## Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API Key from https://console.anthropic.com/
- Code editor (VS Code recommended)

### Create Your First Project

```bash
# Interactive creation
npx @ainative/ai-kit-cli@latest create my-first-ai-app

# Navigate into project
cd my-first-ai-app

# Set up environment
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=sk-ant-api03-your-key

# Install and run
pnpm install
pnpm dev

# Visit http://localhost:3000
```

**What you get:**
- Next.js 14 with TypeScript
- Anthropic Claude SDK configured
- Tailwind CSS for styling
- Basic chat interface
- Ready for agents!

---

## Creating Your First Agent

### Interactive Agent Creation

```bash
# In your project directory
npx @ainative/ai-kit-cli@latest add agent

# Prompts:
# ? Agent name: CustomerSupportAgent
# ? Where should this be created? (agents) [Press Enter]

# Result:
# ✅ Created src/agents/CustomerSupportAgent.ts
```

### Quick Non-Interactive Creation

```bash
# Create multiple agents quickly
echo "CustomerSupport" | npx @ainative/ai-kit-cli@latest add agent
echo "CodeAssistant" | npx @ainative/ai-kit-cli@latest add agent
echo "CreativeWriter" | npx @ainative/ai-kit-cli@latest add agent

# View all agents
ls src/agents/
```

### Agent File Structure

Every agent follows this pattern:

```typescript
// src/agents/CustomerSupport.ts
export const CustomerSupportAgent = {
  name: 'CustomerSupport',
  description: 'Friendly support agent',
  
  systemPrompt: `You are a friendly customer support agent.
  
  Your responsibilities:
  - Help with product questions
  - Troubleshoot technical issues
  - Handle billing inquiries
  - Be empathetic and solution-focused`,
  
  tools: [],  // Add tools here
  model: 'claude-sonnet-4-20250514',
  temperature: 0.7,  // 0.0-1.0 (precision to creativity)
  maxTokens: 2000,
};
```

---

## Building Multi-Agent Systems

### Why Multiple Agents?

Different agents excel at different tasks:

| Agent Type | Temperature | Best For |
|------------|-------------|----------|
| Code Assistant | 0.3 | Precise code, debugging |
| Customer Support | 0.7 | Balanced, helpful responses |
| Creative Writer | 0.9 | Imaginative content |

### Create Specialized Agents

**1. Code Assistant (Precise - temp 0.3)**

```typescript
// src/agents/CodeAssistant.ts
export const CodeAssistantAgent = {
  name: 'CodeAssistant',
  systemPrompt: `You are an expert programming assistant.
  
  Your role:
  - Write clean, efficient code
  - Debug issues and suggest fixes
  - Explain concepts clearly
  - Provide examples in multiple languages
  
  Always format code properly and explain reasoning.`,
  
  model: 'claude-sonnet-4-20250514',
  temperature: 0.3,  // Precise, consistent
  maxTokens: 3000,
};
```

**2. Customer Support (Balanced - temp 0.7)**

```typescript
// src/agents/CustomerSupport.ts
export const CustomerSupportAgent = {
  name: 'CustomerSupport',
  systemPrompt: `You are a friendly customer support agent.
  
  Your role:
  - Help customers with questions
  - Troubleshoot technical issues
  - Handle billing inquiries
  - Be empathetic and helpful
  
  Always greet warmly and be solution-focused.`,
  
  model: 'claude-sonnet-4-20250514',
  temperature: 0.7,  // Balanced
  maxTokens: 2000,
};
```

**3. Creative Writer (Imaginative - temp 0.9)**

```typescript
// src/agents/CreativeWriter.ts
export const CreativeWriterAgent = {
  name: 'CreativeWriter',
  systemPrompt: `You are a creative writing assistant.
  
  Your role:
  - Write engaging stories and content
  - Help with brainstorming ideas
  - Provide writing tips
  - Adapt to different genres
  
  Be imaginative, expressive, and inspiring!`,
  
  model: 'claude-sonnet-4-20250514',
  temperature: 0.9,  // Creative, varied
  maxTokens: 2000,
};
```

### Build Multi-Agent UI

```typescript
// app/page.tsx
'use client';

import { useState } from 'react';
import { CustomerSupportAgent } from '@/agents/CustomerSupport';
import { CodeAssistantAgent } from '@/agents/CodeAssistant';
import { CreativeWriterAgent } from '@/agents/CreativeWriter';

const AGENTS = {
  support: CustomerSupportAgent,
  code: CodeAssistantAgent,
  creative: CreativeWriterAgent,
};

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState('support');
  const currentAgent = AGENTS[selectedAgent];

  return (
    <div className="p-4">
      {/* Agent Selector */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setSelectedAgent('support')}
          className={`p-4 rounded-lg ${
            selectedAgent === 'support' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200'
          }`}
        >
          👔 Customer Support
        </button>
        
        <button
          onClick={() => setSelectedAgent('code')}
          className={`p-4 rounded-lg ${
            selectedAgent === 'code' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200'
          }`}
        >
          💻 Code Assistant
        </button>
        
        <button
          onClick={() => setSelectedAgent('creative')}
          className={`p-4 rounded-lg ${
            selectedAgent === 'creative' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-200'
          }`}
        >
          ✍️ Creative Writer
        </button>
      </div>

      {/* Current Agent Info */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold">{currentAgent.name}</h2>
        <p className="text-sm text-gray-600">
          Temperature: {currentAgent.temperature}
        </p>
      </div>
    </div>
  );
}
```

---

## Adding Chat History

Chat history is NOT built into AI Kit - you build it with React state!

### Complete Implementation

```typescript
'use client';

import { useState } from 'react';

export default function ChatPage() {
  // 1. State for message history
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
  }>>([]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Send message function
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send full history to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage], // Full history!
          agent: currentAgent,
        }),
      });

      const data = await response.json();
      
      // Add AI response
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: data.message 
      }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Render chat history
  return (
    <div className="flex flex-col h-screen">
      {/* Message Display */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {/* Loading animation */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
```

### API Route with History Support

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, agent } = await request.json();

    // Claude processes full conversation history
    const response = await anthropic.messages.create({
      model: agent.model,
      max_tokens: agent.maxTokens,
      temperature: agent.temperature,
      system: agent.systemPrompt,
      messages: messages, // All previous messages
    });

    const content = response.content[0];
    const message = content.type === 'text' ? content.text : '';

    return NextResponse.json({ message });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Clear History on Agent Switch

```typescript
const handleAgentChange = (newAgent) => {
  setSelectedAgent(newAgent);
  setMessages([]); // Clear history when switching
};
```

---

## Available Tools & Integrations

See [TOOLS_GUIDE.md](./TOOLS_GUIDE.md) for complete tool documentation including:

- Native Claude Tools (Computer Use, Text Editor, Bash)
- AI Kit Tools (Web Search, Code Execution, File Ops)
- ZeroDB Tools (Memory, Vector Search, Database)
- Custom Tool Development

---

## Testing & Deployment

### Unit Testing

```typescript
// agents/__tests__/CustomerSupport.test.ts
import { describe, it, expect, vi } from 'vitest';
import { CustomerSupportAgent } from '../CustomerSupport';

// Mock Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      messages: {
        create: vi.fn().mockResolvedValue({
          content: [{ type: 'text', text: 'Test response' }],
        }),
      },
    })),
  };
});

describe('CustomerSupportAgent', () => {
  it('has correct configuration', () => {
    expect(CustomerSupportAgent.temperature).toBe(0.7);
    expect(CustomerSupportAgent.model).toBe('claude-sonnet-4-20250514');
  });
});
```

Run tests:
```bash
pnpm vitest run
```

### Deploy to Vercel

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
gh repo create my-ai-app --public --source=. --push

# Deploy to Vercel
vercel

# Add environment variable
vercel env add ANTHROPIC_API_KEY

# Deploy to production
vercel --prod
```

---

## Troubleshooting

### Model Not Found Error

```
Error: 404 model: claude-3-5-sonnet-20241022
```

**Fix:** Update to current model

```typescript
model: 'claude-sonnet-4-20250514'  // ✅ Current
```

### Test Error: "sendMessage is not a function"

**Fix:** Mock the Anthropic SDK (see Testing section above)

### Chat History Not Working

**Fix:** Send full message array to API

```typescript
// ❌ Wrong
messages: [userMessage]

// ✅ Correct
messages: [...messages, userMessage]
```

---

## Quick Reference

### Essential Commands

```bash
# Create project
npx @ainative/ai-kit-cli@latest create my-app

# Add agent
npx @ainative/ai-kit-cli@latest add agent

# Quick agent
echo "AgentName" | npx @ainative/ai-kit-cli@latest add agent

# Dev server
pnpm dev

# Tests
pnpm vitest

# Deploy
vercel --prod
```

### Temperature Guide

| Range | Use Case |
|-------|----------|
| 0.0 - 0.3 | Precise (code, data) |
| 0.4 - 0.7 | Balanced (support) |
| 0.8 - 1.0 | Creative (writing) |

### Current Model

```typescript
model: 'claude-sonnet-4-20250514'  // ✅ Use this
```

---

**Made with ❤️ by AI Native Studio**

*December 2025 AI Kit Class*

For more details on specific topics, see:
- [TOOLS_GUIDE.md](./TOOLS_GUIDE.md) - Complete tool documentation
- [README.md](../README.md) - Project overview
