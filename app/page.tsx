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
  const [selectedAgent, setSelectedAgent] = useState<keyof typeof AGENTS>('support');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const currentAgent = AGENTS[selectedAgent];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          agent: currentAgent,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            🤖 AI Agent Demo
          </h1>
          <p className="text-gray-600">Choose an agent and start chatting!</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Your Agent:</h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => { setSelectedAgent('support'); setMessages([]); }}
              className={`p-4 rounded-lg border-2 transition-all ${selectedAgent === 'support' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
            >
              <div className="text-3xl mb-2">👨‍💼</div>
              <div className="font-semibold">Customer Support</div>
              <div className="text-sm text-gray-600">Helpful & friendly</div>
            </button>

            <button
              onClick={() => { setSelectedAgent('code'); setMessages([]); }}
              className={`p-4 rounded-lg border-2 transition-all ${selectedAgent === 'code' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
            >
              <div className="text-3xl mb-2">💻</div>
              <div className="font-semibold">Code Assistant</div>
              <div className="text-sm text-gray-600">Technical & precise</div>
            </button>

            <button
              onClick={() => { setSelectedAgent('creative'); setMessages([]); }}
              className={`p-4 rounded-lg border-2 transition-all ${selectedAgent === 'creative' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
            >
              <div className="text-3xl mb-2">✍️</div>
              <div className="font-semibold">Creative Writer</div>
              <div className="text-sm text-gray-600">Imaginative & expressive</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-96 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-20">
                <p className="text-lg">Select an agent and start chatting!</p>
                <p className="text-sm mt-2">Try asking different types of questions to see how each agent responds.</p>
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

            {loading && (
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
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
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

        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-semibold mb-2 text-gray-800">Current Agent: {currentAgent.name}</h3>
          <p className="text-sm text-gray-600">{currentAgent.systemPrompt.split('\n')[0]}</p>
          <div className="mt-2 flex gap-4 text-xs text-gray-500">
            <span>Model: {currentAgent.model.split('-').slice(0, 3).join('-')}</span>
            <span>Temperature: {currentAgent.temperature}</span>
            <span>Max Tokens: {currentAgent.maxTokens}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
