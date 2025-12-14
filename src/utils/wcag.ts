export interface WCAGMapping {
  ruleId: string;
  wcagRefs: string[];
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
}

const WCAG_MAPPINGS: Record<string, WCAGMapping> = {
  'aria-allowed-attr': {
    ruleId: 'aria-allowed-attr',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-hidden-focus': {
    ruleId: 'aria-hidden-focus',
    wcagRefs: ['WCAG2.1:2.1.1', 'WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-required-attr': {
    ruleId: 'aria-required-attr',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-required-children': {
    ruleId: 'aria-required-children',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-required-parent': {
    ruleId: 'aria-required-parent',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-roles': {
    ruleId: 'aria-roles',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-valid-attr-value': {
    ruleId: 'aria-valid-attr-value',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-valid-attr': {
    ruleId: 'aria-valid-attr',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'button-name': {
    ruleId: 'button-name',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'critical',
  },
  'color-contrast': {
    ruleId: 'color-contrast',
    wcagRefs: ['WCAG2.1:1.4.3', 'WCAG2.1:1.4.6'],
    severity: 'serious',
  },
  'document-title': {
    ruleId: 'document-title',
    wcagRefs: ['WCAG2.1:2.4.2'],
    severity: 'moderate',
  },
  'html-has-lang': {
    ruleId: 'html-has-lang',
    wcagRefs: ['WCAG2.1:3.1.1'],
    severity: 'serious',
  },
  'image-alt': {
    ruleId: 'image-alt',
    wcagRefs: ['WCAG2.1:1.1.1'],
    severity: 'critical',
  },
  'input-button-name': {
    ruleId: 'input-button-name',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'critical',
  },
  'label': {
    ruleId: 'label',
    wcagRefs: ['WCAG2.1:1.3.1', 'WCAG2.1:3.3.2', 'WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'link-name': {
    ruleId: 'link-name',
    wcagRefs: ['WCAG2.1:2.4.4', 'WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'list': {
    ruleId: 'list',
    wcagRefs: ['WCAG2.1:1.3.1'],
    severity: 'moderate',
  },
  'listitem': {
    ruleId: 'listitem',
    wcagRefs: ['WCAG2.1:1.3.1'],
    severity: 'moderate',
  },
  'meta-refresh': {
    ruleId: 'meta-refresh',
    wcagRefs: ['WCAG2.1:2.2.1', 'WCAG2.1:2.2.4'],
    severity: 'serious',
  },
  'object-alt': {
    ruleId: 'object-alt',
    wcagRefs: ['WCAG2.1:1.1.1'],
    severity: 'serious',
  },
  'role-img-alt': {
    ruleId: 'role-img-alt',
    wcagRefs: ['WCAG2.1:1.1.1'],
    severity: 'serious',
  },
  'tabindex': {
    ruleId: 'tabindex',
    wcagRefs: ['WCAG2.1:2.1.1'],
    severity: 'serious',
  },
  'table-fake-caption': {
    ruleId: 'table-fake-caption',
    wcagRefs: ['WCAG2.1:1.3.1'],
    severity: 'moderate',
  },
  'td-headers-attr': {
    ruleId: 'td-headers-attr',
    wcagRefs: ['WCAG2.1:1.3.1'],
    severity: 'moderate',
  },
  'th-has-data-cells': {
    ruleId: 'th-has-data-cells',
    wcagRefs: ['WCAG2.1:1.3.1'],
    severity: 'moderate',
  },
  'valid-lang': {
    ruleId: 'valid-lang',
    wcagRefs: ['WCAG2.1:3.1.2'],
    severity: 'moderate',
  },
  'video-caption': {
    ruleId: 'video-caption',
    wcagRefs: ['WCAG2.1:1.2.2'],
    severity: 'serious',
  },
};

const LIGHTHOUSE_WCAG_MAPPINGS: Record<string, WCAGMapping> = {
  'accessibility': {
    ruleId: 'accessibility',
    wcagRefs: ['WCAG2.1:1.1.1', 'WCAG2.1:1.3.1', 'WCAG2.1:1.4.3', 'WCAG2.1:2.1.1', 'WCAG2.1:2.4.2', 'WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-allowed-attr': {
    ruleId: 'aria-allowed-attr',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-hidden-body': {
    ruleId: 'aria-hidden-body',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-hidden-focus': {
    ruleId: 'aria-hidden-focus',
    wcagRefs: ['WCAG2.1:2.1.1', 'WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-input-field-name': {
    ruleId: 'aria-input-field-name',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-required-attr': {
    ruleId: 'aria-required-attr',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-roles': {
    ruleId: 'aria-roles',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-valid-attr-value': {
    ruleId: 'aria-valid-attr-value',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'aria-valid-attr': {
    ruleId: 'aria-valid-attr',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'button-name': {
    ruleId: 'button-name',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'critical',
  },
  'color-contrast': {
    ruleId: 'color-contrast',
    wcagRefs: ['WCAG2.1:1.4.3', 'WCAG2.1:1.4.6'],
    severity: 'serious',
  },
  'document-title': {
    ruleId: 'document-title',
    wcagRefs: ['WCAG2.1:2.4.2'],
    severity: 'moderate',
  },
  'html-has-lang': {
    ruleId: 'html-has-lang',
    wcagRefs: ['WCAG2.1:3.1.1'],
    severity: 'serious',
  },
  'html-lang-valid': {
    ruleId: 'html-lang-valid',
    wcagRefs: ['WCAG2.1:3.1.1'],
    severity: 'serious',
  },
  'image-alt': {
    ruleId: 'image-alt',
    wcagRefs: ['WCAG2.1:1.1.1'],
    severity: 'critical',
  },
  'input-image-alt': {
    ruleId: 'input-image-alt',
    wcagRefs: ['WCAG2.1:1.1.1'],
    severity: 'critical',
  },
  'label': {
    ruleId: 'label',
    wcagRefs: ['WCAG2.1:1.3.1', 'WCAG2.1:3.3.2', 'WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'link-name': {
    ruleId: 'link-name',
    wcagRefs: ['WCAG2.1:2.4.4', 'WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'list': {
    ruleId: 'list',
    wcagRefs: ['WCAG2.1:1.3.1'],
    severity: 'moderate',
  },
  'listitem': {
    ruleId: 'listitem',
    wcagRefs: ['WCAG2.1:1.3.1'],
    severity: 'moderate',
  },
  'meta-refresh': {
    ruleId: 'meta-refresh',
    wcagRefs: ['WCAG2.1:2.2.1', 'WCAG2.1:2.2.4'],
    severity: 'serious',
  },
  'object-alt': {
    ruleId: 'object-alt',
    wcagRefs: ['WCAG2.1:1.1.1'],
    severity: 'serious',
  },
  'tabindex': {
    ruleId: 'tabindex',
    wcagRefs: ['WCAG2.1:2.1.1'],
    severity: 'serious',
  },
  'td-headers-attr': {
    ruleId: 'td-headers-attr',
    wcagRefs: ['WCAG2.1:1.3.1'],
    severity: 'moderate',
  },
  'th-has-data-cells': {
    ruleId: 'th-has-data-cells',
    wcagRefs: ['WCAG2.1:1.3.1'],
    severity: 'moderate',
  },
  'valid-lang': {
    ruleId: 'valid-lang',
    wcagRefs: ['WCAG2.1:3.1.2'],
    severity: 'moderate',
  },
  'video-caption': {
    ruleId: 'video-caption',
    wcagRefs: ['WCAG2.1:1.2.2'],
    severity: 'serious',
  },
  'video-description': {
    ruleId: 'video-description',
    wcagRefs: ['WCAG2.1:1.2.3'],
    severity: 'moderate',
  },
};

const WAVE_WCAG_MAPPINGS: Record<string, WCAGMapping> = {
  'error_alt_missing': {
    ruleId: 'error_alt_missing',
    wcagRefs: ['WCAG2.1:1.1.1'],
    severity: 'critical',
  },
  'error_alt_link': {
    ruleId: 'error_alt_link',
    wcagRefs: ['WCAG2.1:1.1.1'],
    severity: 'serious',
  },
  'error_alt_spacer': {
    ruleId: 'error_alt_spacer',
    wcagRefs: ['WCAG2.1:1.1.1'],
    severity: 'moderate',
  },
  'error_button_empty': {
    ruleId: 'error_button_empty',
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'critical',
  },
  'error_heading_empty': {
    ruleId: 'error_heading_empty',
    wcagRefs: ['WCAG2.1:1.3.1'],
    severity: 'serious',
  },
  'error_label_empty': {
    ruleId: 'error_label_empty',
    wcagRefs: ['WCAG2.1:1.3.1', 'WCAG2.1:3.3.2'],
    severity: 'serious',
  },
  'error_link_empty': {
    ruleId: 'error_link_empty',
    wcagRefs: ['WCAG2.1:2.4.4', 'WCAG2.1:4.1.2'],
    severity: 'serious',
  },
  'error_missing_form_label': {
    ruleId: 'error_missing_form_label',
    wcagRefs: ['WCAG2.1:1.3.1', 'WCAG2.1:3.3.2'],
    severity: 'serious',
  },
  'contrast': {
    ruleId: 'contrast',
    wcagRefs: ['WCAG2.1:1.4.3', 'WCAG2.1:1.4.6'],
    severity: 'serious',
  },
};

export function getWCAGMapping(ruleId: string, tool: 'axe' | 'lighthouse' | 'wave'): WCAGMapping | undefined {
  switch (tool) {
    case 'axe':
      return WCAG_MAPPINGS[ruleId];
    case 'lighthouse':
      return LIGHTHOUSE_WCAG_MAPPINGS[ruleId];
    case 'wave':
      return WAVE_WCAG_MAPPINGS[ruleId];
    default:
      return undefined;
  }
}

export function getDefaultWCAGMapping(ruleId: string): WCAGMapping {
  return {
    ruleId,
    wcagRefs: ['WCAG2.1:4.1.2'],
    severity: 'moderate',
  };
}

export function mapImpactToSeverity(impact: 'critical' | 'serious' | 'moderate' | 'minor' | null): 'critical' | 'serious' | 'moderate' | 'minor' {
  if (!impact) {
    return 'moderate';
  }
  return impact;
}

export function getConfidenceFromImpact(impact: 'critical' | 'serious' | 'moderate' | 'minor' | null): 'high' | 'medium' | 'low' {
  if (impact === 'critical' || impact === 'serious') {
    return 'high';
  }
  if (impact === 'moderate') {
    return 'medium';
  }
  return 'low';
}

