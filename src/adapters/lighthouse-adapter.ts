import lighthouse from 'lighthouse';
import type { Result as LighthouseResult } from 'lighthouse';
import type { LighthouseResult as AuditLighthouseResult } from '../types/audit.js';
import { resolveUrl, type ResolvedUrl } from '../utils/url-resolver.js';

export interface LighthouseAdapterOptions {
  timeout?: number;
  categories?: string[];
  onlyCategories?: string[];
  skipAudits?: string[];
}

export class LighthouseAdapter {
  private readonly timeout: number;

  constructor(options: LighthouseAdapterOptions = {}) {
    this.timeout = options.timeout ?? 60000;
  }

  async audit(urlOrPath: string, options?: LighthouseAdapterOptions): Promise<AuditLighthouseResult> {
    const resolved: ResolvedUrl = await resolveUrl(urlOrPath);
    const chromeFlags = ['--headless', '--no-sandbox'];
    const config: {
      extends?: string;
      categories?: Record<string, { title: string }>;
      onlyCategories?: string[];
      skipAudits?: string[];
    } = {
      extends: 'lighthouse:default',
    };

    if (options?.onlyCategories) {
      config.onlyCategories = options.onlyCategories;
    } else if (options?.categories) {
      config.onlyCategories = options.categories;
    }

    if (options?.skipAudits) {
      config.skipAudits = options.skipAudits;
    }

    let result: LighthouseResult | null = null;
    try {
      result = await lighthouse(resolved.url, {
      port: 9222,
      chromeFlags,
      logLevel: 'error',
      output: 'json',
      onlyCategories: config.onlyCategories,
      skipAudits: config.skipAudits,
    });
    } finally {
      if (resolved.cleanup) {
        await resolved.cleanup();
      }
    }

    if (!result) {
      throw new Error('Lighthouse audit returned no result');
    }

    return this.transformResult(result);
  }

  private transformResult(result: LighthouseResult): AuditLighthouseResult {
    return {
      url: result.lhr.finalUrl,
      fetchTime: result.lhr.fetchTime,
      audits: Object.entries(result.lhr.audits).reduce((acc, [key, audit]) => {
        acc[key] = {
          id: audit.id,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          scoreDisplayMode: audit.scoreDisplayMode,
          displayValue: audit.displayValue,
          details: audit.details
            ? {
                type: audit.details.type,
                headings: audit.details.headings,
                items: audit.details.items,
                nodes: audit.details.nodes,
              }
            : undefined,
        };
        return acc;
      }, {} as Record<string, AuditLighthouseResult['audits'][string]>),
      categories: Object.entries(result.lhr.categories).reduce((acc, [key, category]) => {
        acc[key] = {
          id: category.id,
          title: category.title,
          score: category.score,
          description: category.description,
          manualDescription: category.manualDescription,
          auditRefs: category.auditRefs.map((ref) => ({
            id: ref.id,
            weight: ref.weight,
            group: ref.group,
          })),
        };
        return acc;
      }, {} as Record<string, AuditLighthouseResult['categories'][string]>),
    };
  }
}

