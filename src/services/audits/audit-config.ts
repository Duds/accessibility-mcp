export interface AuditConfig {
  timeout?: number;
  browser?: 'chromium' | 'firefox' | 'webkit';
  tags?: string[];
  rules?: Record<string, { enabled: boolean }>;
  categories?: string[];
  onlyCategories?: string[];
  skipAudits?: string[];
}

export const DEFAULT_AUDIT_CONFIG: AuditConfig = {
  timeout: 30000,
  browser: 'chromium',
};

