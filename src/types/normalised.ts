export type Severity = 'critical' | 'serious' | 'moderate' | 'minor';
export type Confidence = 'high' | 'medium' | 'low';
export type Outcome = 'pass' | 'fail' | 'unknown';

export interface NormalisedResult {
  rule_id: string;
  wcag_ref: string[];
  severity: Severity;
  confidence: Confidence;
  outcome: Outcome;
  selector: string;
  dom_context: string;
  message: string;
  reason_code?: string;
}

export interface NormalisedAuditResult {
  url: string;
  tool: 'axe' | 'lighthouse' | 'wave';
  timestamp: string;
  results: NormalisedResult[];
  summary: {
    total: number;
    pass: number;
    fail: number;
    unknown: number;
    by_severity: {
      critical: number;
      serious: number;
      moderate: number;
      minor: number;
    };
  };
}

