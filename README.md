# Accessibility MCP Server

An MCP (Model Context Protocol) server that provides accessibility auditing tools for LLMs through Cursor. Integrates axe-core (via Playwright), Lighthouse CLI, and optional WAVE API to deliver deterministic, machine-actionable accessibility audit results.

## Features

- **axe-core Integration**: Automated accessibility testing via Playwright with full WCAG 2.1/2.2 coverage
- **Lighthouse CLI**: Comprehensive accessibility audits with performance insights
- **WAVE API**: Optional integration for additional accessibility validation
- **Deterministic Output**: All results normalised to explicit pass/fail/unknown outcomes
- **WCAG Compliance**: Every finding mapped to WCAG 2.1/2.2 criteria with severity classification
- **Machine-Actionable**: Results include selectors and DOM context for remediation
- **Type-Safe**: Full TypeScript implementation with strict type checking

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd accessibility-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Install Playwright browsers (required for axe-core)
npx playwright install chromium
```

## Configuration

Create a `.env` file in the project root (see `.env.example` for template):

```env
# WAVE API Configuration (optional)
WAVE_API_KEY=your_wave_api_key_here
WAVE_API_URL=https://wave.webaim.org/api/request

# Lighthouse Configuration (optional)
LIGHTHOUSE_TIMEOUT=60000
LIGHTHOUSE_CHROME_FLAGS=--headless --no-sandbox

# Playwright Configuration (optional)
PLAYWRIGHT_BROWSER=chromium
PLAYWRIGHT_TIMEOUT=30000
```

## Usage

### As MCP Server in Cursor

1. Build the project: `npm run build`
2. Configure in Cursor's MCP settings (`~/.cursor/mcp.json` or Cursor settings):

```json
{
  "mcpServers": {
    "accessibility": {
      "command": "node",
      "args": ["/absolute/path/to/accessibility-mcp/dist/index.js"]
    }
  }
}
```

3. Restart Cursor to load the MCP server

### Available MCP Tools

#### `axe_audit`

Run an accessibility audit using axe-core via Playwright. Supports URLs, local file paths, and localhost URLs.

**Parameters:**
- `url` (required): The URL to audit. Can be:
  - HTTP/HTTPS URL: `"https://example.com"` or `"http://localhost:3000"`
  - Local file path: `"./index.html"` or `"/path/to/file.html"`
  - File protocol URL: `"file:///path/to/file.html"`
- `options` (optional): Configuration object
  - `tags`: Array of WCAG tags (e.g., `["wcag2a", "wcag2aa"]`)
  - `rules`: Object with rule-specific configuration
  - `timeout`: Timeout in milliseconds (default: 30000)
  - `browser`: Browser to use - `"chromium"`, `"firefox"`, or `"webkit"` (default: `"chromium"`)

**Examples:**
```json
{
  "name": "axe_audit",
  "arguments": {
    "url": "https://example.com",
    "options": {
      "tags": ["wcag2a", "wcag2aa"],
      "browser": "chromium"
    }
  }
}
```

```json
{
  "name": "axe_audit",
  "arguments": {
    "url": "./src/index.html"
  }
}
```

```json
{
  "name": "axe_audit",
  "arguments": {
    "url": "http://localhost:3000"
  }
}
```

#### `lighthouse_audit`

Run an accessibility audit using Lighthouse CLI. Supports URLs, local file paths, and localhost URLs.

**Parameters:**
- `url` (required): The URL to audit. Can be:
  - HTTP/HTTPS URL: `"https://example.com"` or `"http://localhost:3000"`
  - Local file path: `"./index.html"` or `"/path/to/file.html"`
  - File protocol URL: `"file:///path/to/file.html"`
- `categories` (optional): Array of Lighthouse categories to include
- `options` (optional): Configuration object
  - `onlyCategories`: Array of categories to include
  - `skipAudits`: Array of audit IDs to skip
  - `timeout`: Timeout in milliseconds (default: 60000)

**Examples:**
```json
{
  "name": "lighthouse_audit",
  "arguments": {
    "url": "https://example.com",
    "categories": ["accessibility"]
  }
}
```

```json
{
  "name": "lighthouse_audit",
  "arguments": {
    "url": "./dist/index.html"
  }
}
```

#### `wave_audit`

Run an accessibility audit using WAVE API (requires API key). Supports URLs and localhost URLs. Local files are automatically served via a temporary local server.

**Parameters:**
- `url` (required): The URL to audit. Can be:
  - HTTP/HTTPS URL: `"https://example.com"` or `"http://localhost:3000"`
  - Local file path: `"./index.html"` (will be served via temporary server)
- `apiKey` (optional): WAVE API key (uses `WAVE_API_KEY` env var if not provided)

**Examples:**
```json
{
  "name": "wave_audit",
  "arguments": {
    "url": "https://example.com",
    "apiKey": "your_api_key"
  }
}
```

```json
{
  "name": "wave_audit",
  "arguments": {
    "url": "./src/index.html"
  }
}
```

**Note:** For local files, the MCP server automatically creates a temporary HTTP server to serve the file, as WAVE API requires HTTP/HTTPS URLs.

### Output Format

All tools return normalised results in the following format:

```typescript
{
  url: string;
  tool: 'axe' | 'lighthouse' | 'wave';
  timestamp: string;
  results: Array<{
    rule_id: string;
    wcag_ref: string[];
    severity: 'critical' | 'serious' | 'moderate' | 'minor';
    confidence: 'high' | 'medium' | 'low';
    outcome: 'pass' | 'fail' | 'unknown';
    selector: string;
    dom_context: string;
    message: string;
    reason_code?: string; // Required when outcome is 'unknown'
  }>;
  summary: {
    total: number;
    pass: number;
    fail: number;
    unknown: number;
    by_severity: {
      critical: number;
      serious: number;
      moderate: number;
      minor: number;
    };
  };
}
```

## Development

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Scripts

```bash
# Development mode (with hot reload)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Type check without building
npm run type-check

# Lint code
npm run lint
```

### Project Structure

```
accessibility-mcp/
├── .cursor/
│   ├── rules/          # Cursor behavioural constraints
│   └── commands/       # Cursor repeatable actions
├── src/
│   ├── adapters/       # External tool adapters (axe, Lighthouse, WAVE)
│   ├── services/       # Business logic (audits, normalisation)
│   ├── tools/          # MCP tool definitions
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions (WCAG mappings, selectors)
│   ├── index.ts        # Entry point
│   └── server.ts       # MCP server setup
├── tests/
│   ├── fixtures/       # Test data fixtures
│   ├── unit/           # Unit tests
│   └── integration/    # Integration tests
└── dist/               # Compiled JavaScript output
```

### Architecture

The server follows a clean architecture pattern:

1. **Tools Layer** (`src/tools/`): MCP tool definitions that expose audit capabilities
2. **Services Layer** (`src/services/`): Business logic for audit execution and result normalisation
3. **Adapters Layer** (`src/adapters/`): Interface layer for external tools (axe, Lighthouse, WAVE)
4. **Types Layer** (`src/types/`): Shared type definitions for audit results and normalised outputs

### Adding a New Audit Tool

See `.cursor/commands/add-new-audit-tool.md` for detailed instructions on adding a new accessibility audit tool.

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test tests/unit/normaliser.test.ts
```

## CI/CD Integration

The project includes commands for CI/CD integration. See `.cursor/commands/ci-gate-accessibility.md` for details on setting up accessibility gates in your CI pipeline.

## Contributing

1. Follow the architectural constraints defined in `.cursor/rules/`
2. Ensure all code passes type checking: `npm run type-check`
3. Write tests for new features
4. Ensure deterministic outputs (see `.cursor/rules/determinism.md`)
5. Map all findings to WCAG criteria (see `.cursor/rules/accessibility.md`)

## License

MIT

## Acknowledgments

- [axe-core](https://github.com/dequelabs/axe-core) - Accessibility testing engine
- [Lighthouse](https://github.com/GoogleChrome/lighthouse) - Web performance and accessibility auditing
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation tool
- [Playwright](https://playwright.dev/) - Browser automation framework
- [Model Context Protocol](https://modelcontextprotocol.io/) - Protocol for LLM tool integration
