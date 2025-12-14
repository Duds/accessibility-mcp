# Run Accessibility Audit

## Purpose

Scaffold an accessibility audit run using axe-core and/or Lighthouse with consistent configuration and JSON output.

## Usage

When asked to run an accessibility audit:

1. Create audit configuration in `src/services/audits/audit-config.ts` if needed
2. Use `AuditExecutor` from `src/services/audits/audit-executor.ts`
3. Execute audit via appropriate method:
   - `executeAxeAudit(url, config)` for axe-core
   - `executeLighthouseAudit(url, config)` for Lighthouse
   - `executeWaveAudit(url, config)` for WAVE API
4. Save results to `/reports` directory as JSON files with timestamp
5. Return normalised audit results

## Output Format

Results must be saved as JSON files in `/reports` directory:
- Filename format: `{tool}-{timestamp}.json`
- Content: Normalised audit result from `NormalisedAuditResult` type

## Configuration

Use consistent configuration:
- Timeout: 30000ms default
- Browser: chromium default
- Tags: Include WCAG tags for axe-core (e.g., ["wcag2a", "wcag2aa"])

## Example

```typescript
import { AuditExecutor } from './services/audits/audit-executor.js';
import { writeFile } from 'fs/promises';

const executor = new AuditExecutor();
const result = await executor.executeAxeAudit('https://example.com');
await writeFile(`reports/axe-${Date.now()}.json`, JSON.stringify(result, null, 2));
```

