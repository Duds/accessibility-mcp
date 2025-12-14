# CI Gate Accessibility

## Purpose

Insert accessibility thresholds into CI/CD pipeline to enforce accessibility standards.

## Implementation

1. **Define Thresholds**:
   - Maximum number of critical violations: 0
   - Maximum number of serious violations: 5
   - Maximum number of moderate violations: 20
   - Maximum number of unknown outcomes: 10

2. **Failure Conditions**:
   - Any critical violations = fail
   - Serious violations exceed threshold = fail
   - Unknown outcomes exceed threshold = fail (indicates incomplete audit)

3. **CI Integration**:
   - Run audit as part of CI pipeline
   - Parse normalised audit results
   - Check thresholds against summary counts
   - Fail build if thresholds exceeded

## Example CI Script

```typescript
import { AuditExecutor } from './services/audits/audit-executor.js';

const THRESHOLDS = {
  critical: 0,
  serious: 5,
  moderate: 20,
  unknown: 10,
};

const executor = new AuditExecutor();
const result = await executor.executeAxeAudit(process.env.URL);

if (result.summary.by_severity.critical > THRESHOLDS.critical) {
  console.error('Critical violations exceed threshold');
  process.exit(1);
}

if (result.summary.by_severity.serious > THRESHOLDS.serious) {
  console.error('Serious violations exceed threshold');
  process.exit(1);
}

if (result.summary.unknown > THRESHOLDS.unknown) {
  console.error('Unknown outcomes exceed threshold');
  process.exit(1);
}
```

## Threshold Configuration

Thresholds should be:
- Configurable via environment variables
- Documented in CI configuration
- Enforced at build time, not advisory

## Failing Example

Generate a failing example by:
1. Running audit on a page with known violations
2. Checking summary counts against thresholds
3. Demonstrating CI failure output

