# Add New Audit Tool

## Purpose

Add a new accessibility audit tool following the adapter pattern and ensuring proper integration.

## Required Steps

1. **Create Adapter** (`src/adapters/{tool}-adapter.ts`):
   - Implement tool-specific execution logic
   - Handle errors and timeouts
   - Return typed result matching `src/types/audit.ts`

2. **Define Types** (`src/types/audit.ts`):
   - Add result interface for new tool
   - Include all fields from tool output
   - Ensure type safety

3. **Add Normalisation** (`src/services/normalisation/normaliser.ts`):
   - Implement `normalise{Tool}Result()` method
   - Map tool output to `NormalisedResult` schema
   - Add WCAG mappings in `src/utils/wcag.ts`

4. **Update Audit Executor** (`src/services/audits/audit-executor.ts`):
   - Add `execute{Tool}Audit()` method
   - Use adapter and normaliser

5. **Register MCP Tool** (`src/tools/index.ts`):
   - Add tool definition to `TOOLS` array
   - Add handler case in `tools/call` handler

6. **Add WCAG Mappings** (`src/utils/wcag.ts`):
   - Add rule ID to WCAG reference mappings
   - Define severity for each rule

7. **Sample Output**:
   - Create sample output fixture in `tests/fixtures/`
   - Test normalisation with sample data

## Schema Definition

New tool must define:
- Raw result type in `src/types/audit.ts`
- Normalisation method in `Normaliser` class
- WCAG mappings for all rules

## Validation

- Adapter must handle all error cases
- Normalisation must produce valid `NormalisedResult`
- All rules must have WCAG references
- Tool must be registered in MCP server

