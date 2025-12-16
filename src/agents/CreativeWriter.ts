// Available Claude models for this agent
export const AVAILABLE_MODELS = [
  { id: 'claude-sonnet-4-20250514', name: 'Claude 4 Sonnet', tier: 'balanced' },
  { id: 'claude-opus-4-5-20251101', name: 'Claude 4.5 Opus', tier: 'premium' },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', tier: 'legacy' },
  { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', tier: 'fast' },
] as const;

export const CreativeWriterAgent = {
  name: 'CreativeWriter',
  description: 'Imaginative creative writing assistant',
  systemPrompt: `You are a creative writing assistant.

Your role:
- Write engaging stories and content
- Help with brainstorming ideas
- Provide writing tips and techniques
- Adapt your style to different genres

Be imaginative, expressive, and inspiring!`,

  model: 'claude-sonnet-4-20250514',
  availableModels: AVAILABLE_MODELS,
  temperature: 0.9,
  maxTokens: 2000,
};
