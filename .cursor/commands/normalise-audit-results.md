# Normalise Audit Results

## Purpose

Convert raw tool output (axe, Lighthouse, WAVE) to unified normalised schema.

## Process

1. Take raw tool output from adapters (types in `src/types/audit.ts`)
2. Use `Normaliser` from `src/services/normalisation/normaliser.ts`
3. Call appropriate normalisation method:
   - `normaliseAxeResult(axeResult)` for axe-core results
   - `normaliseLighthouseResult(lighthouseResult)` for Lighthouse results
   - `normaliseWaveResult(waveResult)` for WAVE results
4. Validate normalised results match `NormalisedAuditResult` schema

## Required Fields

All normalised results must have:
- `rule_id`: Tool-specific rule identifier
- `wcag_ref`: Array of WCAG references (at least one)
- `severity`: critical, serious, moderate, or minor
- `confidence`: high, medium, or low
- `outcome`: pass, fail, or unknown
- `selector`: CSS selector or XPath
- `dom_context`: HTML snippet (max 200 chars)
- `message`: Human-readable description
- `reason_code`: Required when outcome is 'unknown'

## Validation

- Every result must have at least one WCAG reference
- Unknown outcomes must have reason_code
- Selectors and DOM context must be non-empty for violations
- Severity must match impact level from tool output

