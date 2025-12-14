import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export interface AuditToolParams {
  url: string;
  options?: Record<string, unknown>;
}

export interface AxeAuditParams extends AuditToolParams {
  options?: {
    tags?: string[];
    rules?: Record<string, { enabled: boolean }>;
    timeout?: number;
  };
}

export interface LighthouseAuditParams extends AuditToolParams {
  categories?: string[];
  options?: {
    onlyCategories?: string[];
    skipAudits?: string[];
  };
}

export interface WaveAuditParams extends AuditToolParams {
  apiKey?: string;
}

export type AuditTool = Tool;

