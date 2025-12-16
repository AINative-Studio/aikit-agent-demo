/**
 * Example Tool Definitions using AI Kit's ToolDefinition type
 * These demonstrate how to create tools for AI agents
 */

import { z } from 'zod';

// Note: In a real app, you'd import from @ainative-studio/aikit-core
// import type { ToolDefinition } from '@ainative-studio/aikit-core';

// Tool Definition interface (matching aikit-core)
interface ToolDefinition<TParams = unknown, TResult = unknown> {
  name: string;
  description: string;
  parameters: z.ZodType<TParams>;
  execute: (params: TParams) => Promise<TResult>;
  retry?: { maxAttempts: number; backoffMs: number };
  timeoutMs?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Weather Tool - Get current weather for a location
 */
export const WeatherTool: ToolDefinition<
  { location: string; units?: 'celsius' | 'fahrenheit' },
  { temperature: number; conditions: string; units: string }
> = {
  name: 'get_weather',
  description: 'Get current weather conditions for a specific location',

  parameters: z.object({
    location: z.string().describe('City name or coordinates'),
    units: z.enum(['celsius', 'fahrenheit']).optional().default('celsius'),
  }),

  execute: async (params) => {
    // Simulated weather data (in real app, call weather API)
    const mockWeather = {
      temperature: params.units === 'fahrenheit' ? 72 : 22,
      conditions: 'Partly cloudy',
      units: params.units || 'celsius',
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockWeather;
  },

  retry: { maxAttempts: 3, backoffMs: 1000 },
  timeoutMs: 5000,
  metadata: { category: 'utilities', requiresAuth: false },
};

/**
 * Calculator Tool - Perform mathematical calculations
 */
export const CalculatorTool: ToolDefinition<
  { expression: string },
  { result: number; expression: string }
> = {
  name: 'calculate',
  description: 'Evaluate a mathematical expression and return the result',

  parameters: z.object({
    expression: z.string().describe('Mathematical expression to evaluate (e.g., "2 + 2 * 3")'),
  }),

  execute: async (params) => {
    // Simple expression evaluator (in production, use a safe math library)
    const sanitized = params.expression.replace(/[^0-9+\-*/().%\s]/g, '');
    const result = Function(`'use strict'; return (${sanitized})`)();

    return {
      result: Number(result),
      expression: params.expression,
    };
  },

  timeoutMs: 1000,
  metadata: { category: 'utilities', safe: true },
};

/**
 * Search Tool - Search for information
 */
export const SearchTool: ToolDefinition<
  { query: string; limit?: number },
  { results: Array<{ title: string; snippet: string; url: string }> }
> = {
  name: 'web_search',
  description: 'Search the web for information on a given topic',

  parameters: z.object({
    query: z.string().describe('Search query'),
    limit: z.number().optional().default(5).describe('Maximum number of results'),
  }),

  execute: async (params) => {
    // Simulated search results
    const mockResults = [
      {
        title: `Results for: ${params.query}`,
        snippet: `Found information about ${params.query}...`,
        url: `https://example.com/search?q=${encodeURIComponent(params.query)}`,
      },
    ];

    await new Promise(resolve => setTimeout(resolve, 300));

    return { results: mockResults.slice(0, params.limit) };
  },

  retry: { maxAttempts: 2, backoffMs: 500 },
  timeoutMs: 10000,
  metadata: { category: 'search', requiresAuth: false },
};

/**
 * Database Query Tool - Query a database
 */
export const DatabaseTool: ToolDefinition<
  { table: string; filter?: Record<string, unknown>; limit?: number },
  { rows: Array<Record<string, unknown>>; count: number }
> = {
  name: 'query_database',
  description: 'Query records from a database table with optional filters',

  parameters: z.object({
    table: z.string().describe('Table name to query'),
    filter: z.record(z.unknown()).optional().describe('Filter conditions'),
    limit: z.number().optional().default(10).describe('Maximum rows to return'),
  }),

  execute: async (params) => {
    // Simulated database query
    const mockRows = [
      { id: 1, name: 'Sample Record', created_at: new Date().toISOString() },
    ];

    return {
      rows: mockRows.slice(0, params.limit),
      count: mockRows.length,
    };
  },

  timeoutMs: 30000,
  metadata: { category: 'database', requiresAuth: true },
};

// Export all tools as a registry
export const TOOL_REGISTRY = {
  weather: WeatherTool,
  calculator: CalculatorTool,
  search: SearchTool,
  database: DatabaseTool,
};

// Helper to get tool by name
export function getTool(name: string) {
  return Object.values(TOOL_REGISTRY).find(tool => tool.name === name);
}
