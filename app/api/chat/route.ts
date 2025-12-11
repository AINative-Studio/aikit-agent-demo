import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { messages, agent } = await request.json();

    const response = await anthropic.messages.create({
      model: agent.model,
      max_tokens: agent.maxTokens,
      temperature: agent.temperature,
      system: agent.systemPrompt,
      messages: messages,
    });

    const content = response.content[0];
    const message = content.type === 'text' ? content.text : '';

    return NextResponse.json({ message });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
