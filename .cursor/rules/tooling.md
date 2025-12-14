# Tooling Rules

## Approved Tools

- **axe-core**: Via `@axe-core/playwright` package, executed through Playwright browser automation
- **Lighthouse CLI**: Via `lighthouse` package, executed programmatically (not via CLI command)
- **WAVE API**: Via HTTP API calls (optional, requires API key)

## Tool Restrictions

- **No browser extension dependencies**: Do not rely on browser extensions or manual browser interactions
- **No SaaS calls without adapters**: All external API calls must go through adapters in `/adapters` directory
- **JSON output only**: All tools must return structured JSON, never plain text or HTML

## Adapter Requirements

- **Error handling**: All adapters must handle timeouts, network errors, and invalid responses
- **Type safety**: Adapter outputs must be typed using interfaces in `src/types/audit.ts`
- **Normalisation**: Raw adapter outputs are normalised by services, not by adapters themselves

## Tool Integration

- **Playwright**: Use for axe-core execution, supports chromium, firefox, webkit
- **Lighthouse**: Execute programmatically, not via CLI subprocess
- **WAVE**: HTTP API calls with proper error handling and response parsing

