# Accessibility Rules

## WCAG Compliance

- **WCAG references mandatory**: Every rule result must include at least one WCAG reference in `wcag_ref` array
- **Format**: WCAG references must follow format `WCAG2.1:X.Y.Z` or `WCAG2.2:X.Y.Z`
- **Mapping**: Use `src/utils/wcag.ts` for rule ID to WCAG criterion mapping

## Severity Classification

- **Severity = impact + confidence**: Severity must reflect both the impact level and confidence in the finding
- **Impact levels**: critical, serious, moderate, minor
- **Confidence levels**: high, medium, low
- **Mapping**: Use `mapImpactToSeverity()` and `getConfidenceFromImpact()` utilities

## Violation Requirements

- **Selector required**: All violations must include a `selector` field with the CSS selector or XPath
- **DOM context required**: All violations must include `dom_context` field with relevant HTML snippet (max 200 chars)
- **No prose-only findings**: All findings must be machine-actionable with selector and DOM context

## Rule Identification

- **Rule ID format**: Must match tool-specific rule identifiers (e.g., axe rule IDs, Lighthouse audit IDs, WAVE error codes)
- **Consistent mapping**: Same rule across tools should map to same WCAG criteria

