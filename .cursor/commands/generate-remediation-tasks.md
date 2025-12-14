# Generate Remediation Tasks

## Purpose

Convert accessibility audit findings into actionable remediation tasks with evidence requirements.

## Output Format

Generate tasks in Jira-ready format with:
- **Title**: Rule ID and brief description
- **Description**: Full violation message and WCAG references
- **Evidence**: Selector, DOM context, and screenshot reference (if available)
- **Steps**: Plain-language remediation steps
- **Priority**: Based on severity (critical = highest, minor = lowest)

## Task Structure

```json
{
  "title": "Fix {rule_id}: {message}",
  "description": "WCAG: {wcag_ref.join(', ')}\n\n{message}",
  "evidence": {
    "selector": "{selector}",
    "dom_context": "{dom_context}",
    "url": "{url}"
  },
  "steps": [
    "Step 1: Identify element using selector",
    "Step 2: Apply fix based on WCAG requirement",
    "Step 3: Verify fix with re-audit"
  ],
  "priority": "{severity}",
  "labels": ["accessibility", "wcag", "{wcag_ref}"]
}
```

## Remediation Steps

Generate steps based on rule type:
- **Missing alt text**: Add appropriate alt attribute
- **Color contrast**: Adjust foreground/background colors to meet WCAG AA/AAA
- **ARIA issues**: Add/remove/fix ARIA attributes
- **Keyboard navigation**: Ensure focusable elements are keyboard accessible
- **Semantic HTML**: Use appropriate HTML elements

## Evidence Requirements

Each task must include:
- CSS selector for the element
- DOM context (HTML snippet)
- URL where violation occurred
- Screenshot reference (if available)

