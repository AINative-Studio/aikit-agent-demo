import Anthropic from '@anthropic-ai/sdk';
import {
  createStreamingRoute,
  createSSEStream,
} from '@ainative/ai-kit-nextjs';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Using AI Kit's createStreamingRoute for proper SSE streaming
export const POST = createStreamingRoute(
  async ({ body }) => {
    const { messages, agent, enableStreaming = true } = body;

    // Create SSE stream with AI Kit helpers
    const { stream, sendToken, sendUsage, sendError, sendMetadata, end } = createSSEStream();

    // Start async processing
    (async () => {
      try {
        // Send start metadata
        sendMetadata({
          agentName: agent.name,
          model: agent.model,
          temperature: agent.temperature,
          startTime: new Date().toISOString(),
        });

        if (enableStreaming) {
          // Streaming mode - token by token
          const response = await anthropic.messages.create({
            model: agent.model,
            max_tokens: agent.maxTokens,
            temperature: agent.temperature,
            system: agent.systemPrompt,
            messages: messages,
            stream: true,
          });

          let inputTokens = 0;
          let outputTokens = 0;

          for await (const event of response) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta as { type: string; text?: string };
              if (delta.type === 'text_delta' && delta.text) {
                sendToken(delta.text);
              }
            }
            if (event.type === 'message_delta') {
              const usage = (event as any).usage;
              if (usage) {
                outputTokens = usage.output_tokens || 0;
              }
            }
            if (event.type === 'message_start') {
              const usage = (event as any).message?.usage;
              if (usage) {
                inputTokens = usage.input_tokens || 0;
              }
            }
          }

          // Send usage stats
          sendUsage({
            promptTokens: inputTokens,
            completionTokens: outputTokens,
            totalTokens: inputTokens + outputTokens,
            estimatedCost: calculateCost(inputTokens, outputTokens, agent.model),
          });

        } else {
          // Non-streaming mode (fallback)
          const response = await anthropic.messages.create({
            model: agent.model,
            max_tokens: agent.maxTokens,
            temperature: agent.temperature,
            system: agent.systemPrompt,
            messages: messages,
          });

          const content = response.content[0];
          const message = content.type === 'text' ? content.text : '';
          sendToken(message);

          sendUsage({
            promptTokens: response.usage.input_tokens,
            completionTokens: response.usage.output_tokens,
            totalTokens: response.usage.input_tokens + response.usage.output_tokens,
            estimatedCost: calculateCost(
              response.usage.input_tokens,
              response.usage.output_tokens,
              agent.model
            ),
          });
        }

        end();
      } catch (error: any) {
        sendError({
          error: error.message || 'Unknown error occurred',
          code: error.status?.toString() || 'UNKNOWN',
          details: { type: error.type },
        });
        end();
      }
    })();

    return stream;
  },
  {
    cors: {
      allowedOrigins: '*',
      allowedMethods: ['POST', 'OPTIONS'],
      credentials: true,
    },
    enableHeartbeat: true,
    heartbeatInterval: 15000,
    logging: true,
  }
);

// Calculate estimated cost based on model and tokens
function calculateCost(inputTokens: number, outputTokens: number, model: string): number {
  // Pricing per 1M tokens (as of Dec 2025)
  const pricing: Record<string, { input: number; output: number }> = {
    // Claude 4.5 (Opus)
    'claude-opus-4-5-20251101': { input: 15.0, output: 75.0 },
    // Claude 4 (Sonnet)
    'claude-sonnet-4-20250514': { input: 3.0, output: 15.0 },
    // Claude 3.5 models
    'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0 },
    'claude-3-5-haiku-20241022': { input: 0.80, output: 4.0 },
    // Claude 3 models
    'claude-3-opus-20240229': { input: 15.0, output: 75.0 },
    'claude-3-sonnet-20240229': { input: 3.0, output: 15.0 },
    'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
  };

  const modelPricing = pricing[model] || pricing['claude-sonnet-4-20250514'];
  const inputCost = (inputTokens / 1_000_000) * modelPricing.input;
  const outputCost = (outputTokens / 1_000_000) * modelPricing.output;

  return Math.round((inputCost + outputCost) * 10000) / 10000;
}
