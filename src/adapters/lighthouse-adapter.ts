import lighthouse from 'lighthouse';
import type { RunnerResult } from 'lighthouse';
import type { LighthouseResult as AuditLighthouseResult } from '../types/audit.js';
import { resolveUrl, type ResolvedUrl } from '../utils/url-resolver.js';

export interface LighthouseAdapterOptions {
  timeout?: number;
  categories?: string[];
  onlyCategories?: string[];
  skipAudits?: string[];
}

export class LighthouseAdapter {
  constructor(_options: LighthouseAdapterOptions = {}) {
    // Timeout is handled by lighthouse options
  }

  async audit(urlOrPath: string, options?: LighthouseAdapterOptions): Promise<AuditLighthouseResult> {
    const resolved: ResolvedUrl = await resolveUrl(urlOrPath);
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

    let result: RunnerResult | undefined;
    try {
      result = await lighthouse(resolved.url, {
        logLevel: 'error',
        output: 'json',
        onlyCategories: config.onlyCategories,
        skipAudits: config.skipAudits,
      } as Parameters<typeof lighthouse>[1]);
    } finally {
      if (resolved.cleanup) {
        await resolved.cleanup();
      }
    }

    if (!result?.lhr) {
      throw new Error('Lighthouse audit returned no result');
    }

    return this.transformResult(result, resolved.url);
  }

  private transformResult(result: RunnerResult, resolvedUrl: string): AuditLighthouseResult {
    const lhr = result.lhr;
    return {
      url: lhr.finalUrl || lhr.requestedUrl || resolvedUrl,
      fetchTime: lhr.fetchTime,
      audits: Object.entries(lhr.audits).reduce((acc, [, audit]) => {
        const auditDetails = audit.details;
        let details: AuditLighthouseResult['audits'][string]['details'] = undefined;
        if (auditDetails && typeof auditDetails === 'object' && 'type' in auditDetails && 
            ('headings' in auditDetails || 'items' in auditDetails || 'nodes' in auditDetails)) {
          const detailsObj: {
            type: string;
            headings?: Array<{ key: string; itemType: string; text: string }>;
            items?: Array<Record<string, unknown>>;
            nodes?: Array<{ path: string; selector: string; snippet: string }>;
          } = {
            type: String(auditDetails.type),
          };
          if ('headings' in auditDetails && Array.isArray(auditDetails.headings)) {
            detailsObj.headings = auditDetails.headings as Array<{ key: string; itemType: string; text: string }>;
          }
          if ('items' in auditDetails && Array.isArray(auditDetails.items)) {
            detailsObj.items = auditDetails.items as Array<Record<string, unknown>>;
          }
          if ('nodes' in auditDetails && Array.isArray(auditDetails.nodes)) {
            detailsObj.nodes = auditDetails.nodes.map((node: unknown) => {
              if (typeof node === 'object' && node !== null && 'selector' in node && 'snippet' in node) {
                return {
                  path: 'path' in node ? String(node.path) : '',
                  selector: String(node.selector),
                  snippet: String(node.snippet),
                };
              }
              return { path: '', selector: '', snippet: '' };
            });
          }
          details = detailsObj;
        }
        acc[audit.id] = {
          id: audit.id,
          title: audit.title,
          description: audit.description ?? '',
          score: audit.score,
          scoreDisplayMode: (audit.scoreDisplayMode === 'numeric' || audit.scoreDisplayMode === 'binary' || 
                            audit.scoreDisplayMode === 'manual' || audit.scoreDisplayMode === 'informative' ||
                            audit.scoreDisplayMode === 'notApplicable' || audit.scoreDisplayMode === 'error')
            ? audit.scoreDisplayMode
            : 'numeric',
          ...(audit.displayValue ? { displayValue: audit.displayValue } : {}),
          ...(details ? { details } : {}),
        };
        return acc;
      }, {} as Record<string, AuditLighthouseResult['audits'][string]>),
      categories: Object.entries(lhr.categories).reduce((acc, [, category]) => {
        const auditRefs = category.auditRefs.map((ref) => {
          const mappedRef: { id: string; weight: number; group?: string } = {
            id: ref.id,
            weight: ref.weight,
          };
          if (ref.group !== undefined) {
            mappedRef.group = ref.group;
          }
          return mappedRef;
        });
        acc[category.id] = {
          id: category.id,
          title: category.title,
          score: category.score,
          description: category.description ?? '',
          ...(category.manualDescription ? { manualDescription: category.manualDescription } : {}),
          auditRefs,
        };
        return acc;
      }, {} as Record<string, AuditLighthouseResult['categories'][string]>),
    };
  }
}

