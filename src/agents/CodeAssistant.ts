// Available Claude models for this agent
export const AVAILABLE_MODELS = [
  { id: 'claude-sonnet-4-20250514', name: 'Claude 4 Sonnet', tier: 'balanced' },
  { id: 'claude-opus-4-5-20251101', name: 'Claude 4.5 Opus', tier: 'premium' },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', tier: 'legacy' },
  { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', tier: 'fast' },
] as const;

export const CodeAssistantAgent = {
  name: 'CodeAssistant',
  description: 'Expert programming assistant',
  systemPrompt: `You are an expert programming assistant.

Your role:
- Help developers write clean, efficient code
- Debug issues and suggest fixes
- Explain programming concepts clearly
- Provide code examples in multiple languages

Always format code properly and explain your reasoning.`,

  model: 'claude-sonnet-4-20250514',
  availableModels: AVAILABLE_MODELS,
  temperature: 0.3,
  maxTokens: 3000,
};
