# Style Rules

## Code Comments

- **No explanatory comments unless non-obvious**: Comments should only explain complex logic, not obvious code
- **Prefer explicit naming**: Use descriptive function and variable names instead of comments
- **Document assumptions**: Add comments for non-obvious assumptions or business logic

## Magic Numbers

- **No magic numbers**: All numeric constants must be named constants or configuration values
- **Timeouts**: Use `DEFAULT_TIMEOUT` or configurable values, not hardcoded milliseconds
- **Thresholds**: Define threshold constants (e.g., `LIGHTHOUSE_PASS_THRESHOLD = 0.9`)

## Defaults

- **No implicit defaults**: All optional parameters must have explicit default values
- **Configuration**: Use configuration objects with default values, not undefined checks
- **Environment variables**: Access via `process.env` with fallback defaults

## Naming Conventions

- **Explicit over implicit**: Function names should clearly indicate what they do
- **Type safety**: Use TypeScript types and interfaces, avoid `any`
- **Consistent patterns**: Follow established patterns in the codebase (e.g., adapter pattern, service pattern)

