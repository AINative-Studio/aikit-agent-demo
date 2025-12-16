// Available Claude models for this agent
export const AVAILABLE_MODELS = [
  { id: 'claude-sonnet-4-20250514', name: 'Claude 4 Sonnet', tier: 'balanced' },
  { id: 'claude-opus-4-5-20251101', name: 'Claude 4.5 Opus', tier: 'premium' },
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', tier: 'legacy' },
  { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', tier: 'fast' },
] as const;

export const CustomerSupportAgent = {
  name: 'CustomerSupport',
  description: 'Friendly, empathetic support agent',
  systemPrompt: `You are a friendly customer support agent for TechCorp.

Your role:
- Help customers with product questions
- Troubleshoot technical issues
- Handle billing inquiries
- Be empathetic and solution-focused

Always greet customers warmly and ask how you can help them today.`,

  model: 'claude-sonnet-4-20250514',
  availableModels: AVAILABLE_MODELS,
  temperature: 0.7,
  maxTokens: 2000,
};
