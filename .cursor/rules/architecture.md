# Architecture Rules

## Separation of Concerns

- **No hidden logic in UI layers**: All audit execution must live in `/services/audits`
- **Adapter pattern**: All external tools (axe-core, Lighthouse CLI, WAVE API) must be exposed via explicit adapters in `/adapters`
- **No direct CLI calls**: Tools, controllers, and UI layers must not make direct CLI calls. All external tool interactions go through adapters.

## Layer Structure

```
Tools (MCP) → Services → Adapters → External Tools
```

- **Tools**: MCP tool definitions that expose audit capabilities
- **Services**: Business logic for audit execution and result normalisation
- **Adapters**: Interface layer for external tools, handles tool-specific APIs and error handling

## Enforcement

- All audit execution must go through `AuditExecutor` in `/services/audits/audit-executor.ts`
- All tool adapters must be in `/adapters` directory
- No direct imports of Playwright, Lighthouse, or WAVE API outside of adapters

