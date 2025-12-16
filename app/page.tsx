'use client';

import { useState, useRef, useEffect } from 'react';
import { CustomerSupportAgent, AVAILABLE_MODELS } from '@/agents/CustomerSupport';
import { CodeAssistantAgent } from '@/agents/CodeAssistant';
import { CreativeWriterAgent } from '@/agents/CreativeWriter';

// Agent registry
const AGENTS = {
  support: CustomerSupportAgent,
  code: CodeAssistantAgent,
  creative: CreativeWriterAgent,
};

// Types for usage stats (matching AI Kit's UsageEvent)
interface UsageStats {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

// Types for metadata
interface StreamMetadata {
  agentName: string;
  model: string;
  temperature: number;
  startTime: string;
}

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<keyof typeof AGENTS>('support');
  const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[0].id);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [metadata, setMetadata] = useState<StreamMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentAgent = { ...AGENTS[selectedAgent], model: selectedModel };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setStreamingContent('');
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          agent: currentAgent,
          enableStreaming: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle SSE streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('event:')) {
              // Event type line - skip for now
              continue;
            }

            if (line.startsWith('data:')) {
              const dataStr = line.replace('data:', '').trim();
              if (!dataStr) continue;

              try {
                const data = JSON.parse(dataStr);

                // Handle different SSE event types from AI Kit
                if (data.token !== undefined) {
                  // Token event
                  fullContent += data.token;
                  setStreamingContent(fullContent);
                } else if (data.promptTokens !== undefined) {
                  // Usage event
                  setUsageStats(data);
                } else if (data.agentName !== undefined) {
                  // Metadata event
                  setMetadata(data);
                } else if (data.error !== undefined) {
                  // Error event
                  setError(data.error);
                }
              } catch (e) {
                // Skip malformed JSON
              }
            }
          }
        }
      }

      // Add completed message to history
      if (fullContent) {
        setMessages((prev) => [...prev, { role: 'assistant', content: fullContent }]);
        setStreamingContent('');
      }

    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleAgentChange = (agent: keyof typeof AGENTS) => {
    setSelectedAgent(agent);
    setMessages([]);
    setUsageStats(null);
    setMetadata(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            AI Kit Agent Demo
          </h1>
          <p className="text-gray-600">Multi-agent chat with real-time streaming powered by AI Kit</p>
          <div className="mt-2 flex justify-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">@ainative/ai-kit-nextjs</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">@ainative-studio/aikit-core</span>
          </div>
        </div>

        {/* Agent Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Your Agent:</h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleAgentChange('support')}
              className={`p-4 rounded-lg border-2 transition-all ${selectedAgent === 'support' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
            >
              <div className="text-3xl mb-2">👨‍💼</div>
              <div className="font-semibold text-gray-800">Customer Support</div>
              <div className="text-sm text-gray-600">Helpful & friendly</div>
              <div className="text-xs text-gray-400 mt-1">temp: 0.7</div>
            </button>

            <button
              onClick={() => handleAgentChange('code')}
              className={`p-4 rounded-lg border-2 transition-all ${selectedAgent === 'code' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
            >
              <div className="text-3xl mb-2">💻</div>
              <div className="font-semibold text-gray-800">Code Assistant</div>
              <div className="text-sm text-gray-600">Technical & precise</div>
              <div className="text-xs text-gray-400 mt-1">temp: 0.3</div>
            </button>

            <button
              onClick={() => handleAgentChange('creative')}
              className={`p-4 rounded-lg border-2 transition-all ${selectedAgent === 'creative' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
            >
              <div className="text-3xl mb-2">✍️</div>
              <div className="font-semibold text-gray-800">Creative Writer</div>
              <div className="text-sm text-gray-600">Imaginative & expressive</div>
              <div className="text-xs text-gray-400 mt-1">temp: 0.9</div>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <span className="text-lg">⚠️</span>
                <span className="font-medium">Error:</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="h-96 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 && !streamingContent && (
              <div className="text-center text-gray-400 py-20">
                <p className="text-lg">Select an agent and start chatting!</p>
                <p className="text-sm mt-2">Responses stream in real-time with AI Kit SSE.</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <div className="text-xs mb-1 opacity-70">{msg.role === 'user' ? 'You' : currentAgent.name}</div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}

            {/* Streaming Content */}
            {streamingContent && (
              <div className="flex justify-start">
                <div className="max-w-[70%] p-4 rounded-lg bg-gray-100 text-gray-800">
                  <div className="text-xs mb-1 opacity-70">{currentAgent.name}</div>
                  <div className="whitespace-pre-wrap">{streamingContent}<span className="animate-pulse">▊</span></div>
                </div>
              </div>
            )}

            {/* Loading Animation */}
            {loading && !streamingContent && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage()}
              placeholder={`Chat with ${currentAgent.name}...`}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>

        {/* Model Selector */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-semibold mb-3 text-gray-800">Select Model:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AVAILABLE_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedModel === model.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="font-medium text-sm text-gray-800">{model.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    model.tier === 'premium' ? 'bg-purple-100 text-purple-700' :
                    model.tier === 'balanced' ? 'bg-blue-100 text-blue-700' :
                    model.tier === 'fast' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {model.tier}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Agent Info & Stats Panel */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          {/* Current Agent Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-semibold mb-2 text-gray-800">Current Agent: {currentAgent.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{currentAgent.systemPrompt.split('\n')[0]}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded font-medium">
                {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || selectedModel}
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
                Temp: {currentAgent.temperature}
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
                Max: {currentAgent.maxTokens} tokens
              </span>
            </div>
          </div>

          {/* Usage Stats (AI Kit Feature) */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">Usage Stats</h3>
              <button
                onClick={() => setShowStats(!showStats)}
                className="text-xs text-blue-500 hover:underline"
              >
                {showStats ? 'Hide' : 'Show'}
              </button>
            </div>
            {showStats && usageStats ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Input Tokens:</span>
                  <span className="font-mono text-gray-800">{usageStats.promptTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Output Tokens:</span>
                  <span className="font-mono text-gray-800">{usageStats.completionTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-gray-600 font-medium">Total Tokens:</span>
                  <span className="font-mono font-medium text-gray-800">{usageStats.totalTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Est. Cost:</span>
                  <span className="font-mono text-green-600">${usageStats.estimatedCost.toFixed(6)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Send a message to see usage stats</p>
            )}
          </div>
        </div>

        {/* AI Kit Features Showcase */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-semibold mb-4 text-gray-800">AI Kit Features Demonstrated</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl mb-1">🌊</div>
              <div className="font-medium text-sm text-gray-800">SSE Streaming</div>
              <div className="text-xs text-gray-600">createSSEStream()</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl mb-1">📊</div>
              <div className="font-medium text-sm text-gray-800">Usage Tracking</div>
              <div className="text-xs text-gray-600">sendUsage()</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-2xl mb-1">🔧</div>
              <div className="font-medium text-sm text-gray-800">Route Helpers</div>
              <div className="text-xs text-gray-600">createStreamingRoute()</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="text-2xl mb-1">⚡</div>
              <div className="font-medium text-sm text-gray-800">CORS & Heartbeat</div>
              <div className="text-xs text-gray-600">Built-in config</div>
            </div>
          </div>
        </div>

        {/* Tool Definitions Showcase */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-semibold mb-4 text-gray-800">AI Kit Tool Definitions (aikit-core)</h3>
          <p className="text-sm text-gray-600 mb-4">
            Tools extend agent capabilities. Define with Zod schemas for type-safe validation.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <div className="text-xl mb-1">🌤️</div>
              <div className="font-medium text-sm text-gray-800">Weather Tool</div>
              <div className="text-xs text-gray-500">get_weather</div>
              <div className="text-xs text-gray-400 mt-1">timeout: 5s</div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
              <div className="text-xl mb-1">🔢</div>
              <div className="font-medium text-sm text-gray-800">Calculator</div>
              <div className="text-xs text-gray-500">calculate</div>
              <div className="text-xs text-gray-400 mt-1">timeout: 1s</div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <div className="text-xl mb-1">🔍</div>
              <div className="font-medium text-sm text-gray-800">Web Search</div>
              <div className="text-xs text-gray-500">web_search</div>
              <div className="text-xs text-gray-400 mt-1">retry: 2x</div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
              <div className="text-xl mb-1">🗄️</div>
              <div className="font-medium text-sm text-gray-800">Database</div>
              <div className="text-xs text-gray-500">query_database</div>
              <div className="text-xs text-gray-400 mt-1">auth required</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-mono text-gray-600">
              <span className="text-purple-600">interface</span> ToolDefinition {'{'} name, description, parameters: <span className="text-blue-600">z.ZodType</span>, execute, retry?, timeoutMs? {'}'}
            </div>
          </div>
        </div>

        {/* Metadata Display */}
        {metadata && (
          <div className="mt-6 bg-gray-800 rounded-lg shadow-lg p-4 text-sm font-mono">
            <div className="text-gray-400 mb-2">// Stream Metadata</div>
            <pre className="text-green-400 overflow-x-auto">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
