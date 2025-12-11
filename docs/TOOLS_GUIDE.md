# AI Kit Tools Complete Reference

Complete guide to all tools available for AI Kit agents.

---

## Table of Contents

1. [Native Claude Tools](#native-claude-tools)
2. [AI Kit Official Tools](#ai-kit-official-tools)
3. [ZeroDB Integration Tools](#zerodb-integration-tools)
4. [Custom Tool Development](#custom-tool-development)
5. [Tool Usage Examples](#tool-usage-examples)

---

## Native Claude Tools

Built into Claude - no installation needed.

### Computer Use Tool

Control computers programmatically:

```typescript
const computerTool = {
  type: "computer_20241022",
  name: "computer",
  display_width_px: 1024,
  display_height_px: 768,
  display_number: 1
};
```

**Use Cases:**
- Screen capture and analysis
- Browser automation
- Desktop app interaction
- Visual testing

### Text Editor Tool

Edit files programmatically:

```typescript
const textEditorTool = {
  type: "text_editor_20241022",
  name: "str_replace_editor"
};
```

**Use Cases:**
- File editing
- Code refactoring
- Find and replace
- Document processing

### Bash Tool

Execute shell commands:

```typescript
const bashTool = {
  type: "bash_20241022",
  name: "bash"
};
```

**Use Cases:**
- Command execution
- File system operations
- Build processes
- System administration

---

## AI Kit Official Tools

Install: `npm install @ainative/ai-kit-tools`

### Web Search Tool

Real-time web search:

```typescript
import { WebSearchTool } from '@ainative/ai-kit-tools';

// Search the web
await WebSearchTool.search({
  query: "latest AI developments 2025",
  num_results: 10
});
```

**Use Cases:**
- Real-time information
- Research assistance
- Fact-checking
- Current events

**Add to Agent:**

```typescript
import { WebSearchTool } from '@ainative/ai-kit-tools';

export const ResearchAgent = {
  name: 'ResearchAgent',
  tools: [WebSearchTool],
  systemPrompt: `You have access to web search.
  Use it to find current, accurate information.`,
  // ... rest of config
};
```

### Code Execution Tool

Run code safely:

```typescript
import { CodeExecutionTool } from '@ainative/ai-kit-tools';

// Execute Python
await CodeExecutionTool.execute({
  code: `
import pandas as pd
data = pd.DataFrame({'A': [1, 2, 3]})
print(data.describe())
  `,
  language: "python",
  timeout: 30000
});

// Execute JavaScript
await CodeExecutionTool.execute({
  code: `
const sum = [1, 2, 3].reduce((a, b) => a + b, 0);
console.log('Sum:', sum);
  `,
  language: "javascript",
  timeout: 30000
});
```

**Use Cases:**
- Data analysis
- Mathematical calculations
- Algorithm testing
- Prototyping

### File Operations Tool

Manage files:

```typescript
import { FileOperationsTool } from '@ainative/ai-kit-tools';

// Read file
await FileOperationsTool.read({ 
  path: "/data/input.csv" 
});

// Write file
await FileOperationsTool.write({ 
  path: "/output/results.json", 
  content: JSON.stringify(data, null, 2) 
});

// List files
await FileOperationsTool.list({ 
  path: "/data" 
});
```

**Use Cases:**
- Document processing
- Data import/export
- Report generation
- File management

### Web Scraping Tool

Extract data from websites:

```typescript
import { WebScrapingTool } from '@ainative/ai-kit-tools';

await WebScrapingTool.scrape({
  url: "https://news.ycombinator.com",
  selectors: [".storylink", ".score", ".age"]
});
```

**Use Cases:**
- Data collection
- Price monitoring
- Content aggregation
- Market research

---

## ZeroDB Integration Tools

Install: `npm install @ainative/ai-kit-zerodb`

Configure environment:

```env
ZERODB_PROJECT_ID=your-project-id
ZERODB_API_KEY=your-api-key
```

### Memory Tool

Store and retrieve agent memory:

```typescript
import { ZeroDBMemoryTool } from '@ainative/ai-kit-zerodb';

// Store memory
await ZeroDBMemoryTool.store({
  content: "User prefers dark mode and concise responses",
  role: "assistant",
  session_id: "user-123",
  metadata: { 
    category: "preferences",
    timestamp: new Date().toISOString()
  }
});

// Search memories
const memories = await ZeroDBMemoryTool.search({
  query: "user preferences",
  session_id: "user-123",
  limit: 5
});

// Get context window
const context = await ZeroDBMemoryTool.get_context({
  session_id: "user-123",
  max_tokens: 1000
});
```

**Use Cases:**
- Long-term conversation memory
- User preferences
- Context persistence
- Personalization

### Vector Search Tool

Semantic similarity search:

```typescript
import { VectorSearchTool } from '@ainative/ai-kit-zerodb';

// Search for similar content
const results = await VectorSearchTool.search({
  query_vector: embeddings,  // 1536-dim array
  threshold: 0.7,
  limit: 10,
  namespace: "knowledge-base",
  filter_metadata: { category: "documentation" }
});

// Upsert vector
await VectorSearchTool.upsert({
  vector_embedding: embeddings,
  document: "Full text content here",
  metadata: { 
    title: "AI Kit Guide",
    category: "documentation"
  }
});
```

**Use Cases:**
- Semantic search
- Document similarity
- RAG (Retrieval Augmented Generation)
- Knowledge base queries

### Database Query Tool

NoSQL database operations:

```typescript
import { ZeroDBQueryTool } from '@ainative/ai-kit-zerodb';

// Query with filters
const users = await ZeroDBQueryTool.query({
  table_id: "users",
  filter: { 
    active: true,
    plan: "pro" 
  },
  limit: 100,
  sort: { created_at: -1 }
});

// Insert data
await ZeroDBQueryTool.insert({
  table_id: "users",
  rows: [
    { name: "Alice", email: "alice@example.com", plan: "pro" },
    { name: "Bob", email: "bob@example.com", plan: "free" }
  ]
});

// Update data
await ZeroDBQueryTool.update({
  table_id: "users",
  filter: { email: "alice@example.com" },
  update: { $set: { plan: "enterprise" } }
});
```

**Use Cases:**
- User data retrieval
- Analytics
- Report generation
- Data management

### File Storage Tool

Cloud file storage:

```typescript
import { ZeroDBFilesTool } from '@ainative/ai-kit-zerodb';

// Upload file
const fileId = await ZeroDBFilesTool.upload({
  file_name: "report.pdf",
  file_content: base64EncodedContent,
  content_type: "application/pdf",
  metadata: { 
    type: "report",
    generated: new Date().toISOString()
  }
});

// Download file
const file = await ZeroDBFilesTool.download({
  file_id: fileId,
  return_base64: true
});

// List files
const files = await ZeroDBFilesTool.list({
  folder: "reports",
  limit: 50
});

// Generate presigned URL
const url = await ZeroDBFilesTool.generate_presigned_url({
  file_id: fileId,
  expiration_seconds: 3600
});
```

**Use Cases:**
- Document storage
- Image processing
- Multimodal AI (images + text)
- Asset management

---

## Custom Tool Development

Create your own tools for any integration.

### Tool Structure

```typescript
// src/tools/WeatherTool.ts
export const WeatherTool = {
  name: "get_weather",
  description: "Get current weather for a location",
  
  input_schema: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "City name or coordinates"
      },
      units: {
        type: "string",
        enum: ["celsius", "fahrenheit"],
        description: "Temperature units"
      }
    },
    required: ["location"]
  },
  
  execute: async (params: { 
    location: string; 
    units?: string 
  }) => {
    // Your API call here
    const response = await fetch(
      `https://api.weather.com/v1/current?location=${params.location}`
    );
    const data = await response.json();
    
    return {
      temperature: data.temp,
      conditions: data.conditions,
      units: params.units || 'celsius'
    };
  }
};
```

### Use Custom Tool in Agent

```typescript
// src/agents/TravelAgent.ts
import { WeatherTool } from '@/tools/WeatherTool';
import { WebSearchTool } from '@ainative/ai-kit-tools';

export const TravelAgent = {
  name: 'TravelAgent',
  systemPrompt: `You help users plan trips.
  You have access to:
  - Weather information
  - Web search for travel info`,
  
  tools: [
    WeatherTool,
    WebSearchTool,
  ],
  
  model: 'claude-sonnet-4-20250514',
  temperature: 0.7,
  maxTokens: 2000,
};
```

---

## Tool Usage Examples

### Multi-Tool Agent

Combine multiple tools for powerful agents:

```typescript
// src/agents/SuperAgent.ts
import { WebSearchTool, CodeExecutionTool } from '@ainative/ai-kit-tools';
import { ZeroDBMemoryTool, VectorSearchTool } from '@ainative/ai-kit-zerodb';
import { WeatherTool } from '@/tools/WeatherTool';

export const SuperAgent = {
  name: 'SuperAgent',
  description: 'Multi-capable AI assistant',
  
  systemPrompt: `You are an advanced AI assistant with access to:

1. **Web Search** - Find current information online
2. **Code Execution** - Run Python/JavaScript code
3. **Memory System** - Remember user preferences
4. **Vector Search** - Find relevant documents
5. **Weather Data** - Get current weather

Use these tools intelligently to provide accurate, helpful responses.
Always cite sources when using web search.
Save important user preferences to memory.`,

  tools: [
    WebSearchTool,
    CodeExecutionTool,
    ZeroDBMemoryTool,
    VectorSearchTool,
    WeatherTool,
  ],
  
  model: 'claude-sonnet-4-20250514',
  temperature: 0.7,
  maxTokens: 4000,
};
```

### API Integration with Tools

```typescript
// app/api/chat/route.ts
import { SuperAgent } from '@/agents/SuperAgent';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const response = await anthropic.messages.create({
    model: SuperAgent.model,
    max_tokens: SuperAgent.maxTokens,
    temperature: SuperAgent.temperature,
    system: SuperAgent.systemPrompt,
    tools: SuperAgent.tools,  // Pass tools here
    messages: messages,
  });

  // Handle tool calls if present
  if (response.stop_reason === 'tool_use') {
    // Process tool calls
    // Return results to Claude
    // Get final response
  }

  const content = response.content[0];
  const message = content.type === 'text' ? content.text : '';

  return NextResponse.json({ message });
}
```

---

## Tool Categories Summary

| Category | Tools | Installation |
|----------|-------|--------------|
| **Native Claude** | Computer Use, Text Editor, Bash | Built-in |
| **AI Kit Tools** | Web Search, Code Execution, File Ops, Web Scraping | `npm install @ainative/ai-kit-tools` |
| **ZeroDB Tools** | Memory, Vector Search, DB Query, File Storage | `npm install @ainative/ai-kit-zerodb` |
| **Custom Tools** | Anything you build! | Create in `src/tools/` |

---

## Quick Installation

```bash
# Install all official tools
npm install @ainative/ai-kit-tools @ainative/ai-kit-zerodb

# Or install separately
npm install @ainative/ai-kit-tools      # AI Kit tools only
npm install @ainative/ai-kit-zerodb     # ZeroDB tools only
```

---

**Made with ❤️ by AI Native Studio**

*For more information, see [CLASS_GUIDE.md](./CLASS_GUIDE.md)*
