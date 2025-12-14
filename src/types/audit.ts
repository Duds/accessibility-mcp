export interface AxeResult {
  violations: AxeViolation[];
  passes: AxeNodeResult[];
  incomplete: AxeNodeResult[];
  inapplicable: AxeNodeResult[];
  url: string;
  timestamp: string;
}

export interface AxeViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor' | null;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: AxeNode[];
}

export interface AxeNode {
  html: string;
  target: string[];
  any: AxeCheck[];
  all: AxeCheck[];
  none: AxeCheck[];
}

export interface AxeNodeResult {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor' | null;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: AxeNode[];
}

export interface AxeCheck {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor' | null;
  message: string;
  data: unknown;
  relatedNodes: AxeNode[];
}

export interface LighthouseResult {
  url: string;
  fetchTime: string;
  audits: Record<string, LighthouseAudit>;
  categories: Record<string, LighthouseCategory>;
}

export interface LighthouseAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: 'numeric' | 'binary' | 'manual' | 'informative' | 'notApplicable' | 'error';
  displayValue?: string;
  details?: LighthouseAuditDetails;
}

export interface LighthouseAuditDetails {
  type: string;
  headings?: Array<{ key: string; itemType: string; text: string }>;
  items?: Array<Record<string, unknown>>;
  nodes?: Array<{ path: string; selector: string; snippet: string }>;
}

export interface LighthouseCategory {
  id: string;
  title: string;
  score: number | null;
  description: string;
  manualDescription?: string;
  auditRefs: Array<{ id: string; weight: number; group?: string }>;
}

export interface WaveResult {
  statsummary: {
    total: number;
    error: number;
    contrast: number;
    alert: number;
    feature: number;
    structure: number;
    aria: number;
  };
  categories: {
    error: WaveItem[];
    contrast: WaveItem[];
    alert: WaveItem[];
    feature: WaveItem[];
    structure: WaveItem[];
    aria: WaveItem[];
  };
  url: string;
  timestamp: string;
}

export interface WaveItem {
  code: string;
  count: number;
  pages: number;
  description: string;
  contrast?: {
    ratio: string;
    large: boolean;
    expected: string;
  };
}

