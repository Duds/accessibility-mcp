# Determinism Rules

## Output Requirements

- **No probabilistic scoring without thresholds**: Scores like Lighthouse's 0-1 scale must be converted to explicit pass/fail/unknown with defined thresholds
- **Explicit outcomes**: All results must have an explicit `outcome` field with value `'pass'`, `'fail'`, or `'unknown'`
- **Unknown requires reason**: When `outcome` is `'unknown'`, a `reason_code` field is mandatory
- **No ambiguous fields**: No "overall quality" or "accessibility score" fields without decomposition into specific rule outcomes

## Normalisation Schema

All tool outputs must be normalised to the unified schema in `src/types/normalised.ts`:

```typescript
interface NormalisedResult {
  rule_id: string;
  wcag_ref: string[];
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  confidence: 'high' | 'medium' | 'low';
  outcome: 'pass' | 'fail' | 'unknown';
  selector: string;
  dom_context: string;
  message: string;
  reason_code?: string; // Required when outcome is 'unknown'
}
```

## Thresholds

- **Lighthouse scores**: `score >= 0.9` = pass, `score === 0` = fail, otherwise unknown
- **Confidence mapping**: High impact = high confidence, moderate = medium, minor = low
- **Unknown reason codes**: Must be explicit (e.g., 'INCOMPLETE_CHECK', 'SCORE_AMBIGUOUS', 'WAVE_ALERT')

