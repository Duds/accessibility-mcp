import { chromium, type Browser } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResult } from '../types/audit.js';
import { resolveUrl, type ResolvedUrl } from '../utils/url-resolver.js';

const DEFAULT_TIMEOUT = 30000;
const DEFAULT_BROWSER = 'chromium';

export interface AxeAdapterOptions {
  timeout?: number;
  browser?: 'chromium' | 'firefox' | 'webkit';
  tags?: string[];
  rules?: Record<string, { enabled: boolean }>;
}

export class AxeAdapter {
  private browser: Browser | null = null;
  private readonly timeout: number;
  private readonly browserType: 'chromium' | 'firefox' | 'webkit';

  constructor(options: AxeAdapterOptions = {}) {
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
    this.browserType = options.browser ?? DEFAULT_BROWSER;
  }

  async audit(urlOrPath: string, options?: AxeAdapterOptions): Promise<AxeResult> {
    const resolved: ResolvedUrl = await resolveUrl(urlOrPath);
    const browser = await this.getBrowser();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto(resolved.url, { waitUntil: 'networkidle', timeout: this.timeout });
      
      const axeBuilder = new AxeBuilder({ page });
      
      if (options?.tags) {
        axeBuilder.withTags(options.tags);
      }

      if (options?.rules) {
        Object.entries(options.rules).forEach(([ruleId, config]) => {
          if (config.enabled) {
            axeBuilder.withRules([ruleId]);
          } else {
            axeBuilder.disableRules([ruleId]);
          }
        });
      }

      const axeResults = await axeBuilder.analyze();

      // Helper to convert target to string[]
      const normalizeTarget = (target: unknown): string[] => {
        if (Array.isArray(target)) {
          return target.map(String);
        }
        if (typeof target === 'string') {
          return [target];
        }
        return [];
      };

      const result: AxeResult = {
        violations: axeResults.violations.map((v) => ({
          id: v.id,
          impact: v.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          tags: v.tags,
          nodes: v.nodes.map((node) => ({
            html: node.html,
            target: normalizeTarget(node.target),
            any: node.any?.map((check) => ({
              id: check.id,
              impact: check.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
              message: check.message,
              data: check.data,
              relatedNodes: check.relatedNodes?.map((rn) => ({
                html: rn.html,
                target: normalizeTarget(rn.target),
                any: [],
                all: [],
                none: [],
              })) ?? [],
            })) ?? [],
            all: node.all?.map((check) => ({
              id: check.id,
              impact: check.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
              message: check.message,
              data: check.data,
              relatedNodes: [],
            })) ?? [],
            none: node.none?.map((check) => ({
              id: check.id,
              impact: check.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
              message: check.message,
              data: check.data,
              relatedNodes: [],
            })) ?? [],
          })),
        })),
        passes: (axeResults.passes ?? []).map((p) => ({
          id: p.id,
          impact: p.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
          description: p.description,
          help: p.help,
          helpUrl: p.helpUrl,
          tags: p.tags,
          nodes: p.nodes.map((node) => ({
            html: node.html,
            target: normalizeTarget(node.target),
            any: node.any?.map((check) => ({
              id: check.id,
              impact: check.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
              message: check.message,
              data: check.data,
              relatedNodes: check.relatedNodes?.map((rn) => ({
                html: rn.html,
                target: normalizeTarget(rn.target),
                any: [],
                all: [],
                none: [],
              })) ?? [],
            })) ?? [],
            all: node.all?.map((check) => ({
              id: check.id,
              impact: check.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
              message: check.message,
              data: check.data,
              relatedNodes: [],
            })) ?? [],
            none: node.none?.map((check) => ({
              id: check.id,
              impact: check.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
              message: check.message,
              data: check.data,
              relatedNodes: [],
            })) ?? [],
          })),
        })),
        incomplete: (axeResults.incomplete ?? []).map((inc) => ({
          id: inc.id,
          impact: inc.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
          description: inc.description,
          help: inc.help,
          helpUrl: inc.helpUrl,
          tags: inc.tags,
          nodes: inc.nodes.map((node) => ({
            html: node.html,
            target: normalizeTarget(node.target),
            any: node.any?.map((check) => ({
              id: check.id,
              impact: check.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
              message: check.message,
              data: check.data,
              relatedNodes: check.relatedNodes?.map((rn) => ({
                html: rn.html,
                target: normalizeTarget(rn.target),
                any: [],
                all: [],
                none: [],
              })) ?? [],
            })) ?? [],
            all: node.all?.map((check) => ({
              id: check.id,
              impact: check.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
              message: check.message,
              data: check.data,
              relatedNodes: [],
            })) ?? [],
            none: node.none?.map((check) => ({
              id: check.id,
              impact: check.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
              message: check.message,
              data: check.data,
              relatedNodes: [],
            })) ?? [],
          })),
        })),
        inapplicable: (axeResults.inapplicable ?? []).map((inapp) => ({
          id: inapp.id,
          impact: inapp.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
          description: inapp.description,
          help: inapp.help,
          helpUrl: inapp.helpUrl,
          tags: inapp.tags,
          nodes: inapp.nodes.map((node) => ({
            html: node.html,
            target: normalizeTarget(node.target),
            any: node.any?.map((check) => ({
              id: check.id,
              impact: check.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
              message: check.message,
              data: check.data,
              relatedNodes: check.relatedNodes?.map((rn) => ({
                html: rn.html,
                target: normalizeTarget(rn.target),
                any: [],
                all: [],
                none: [],
              })) ?? [],
            })) ?? [],
            all: node.all?.map((check) => ({
              id: check.id,
              impact: check.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
              message: check.message,
              data: check.data,
              relatedNodes: [],
            })) ?? [],
            none: node.none?.map((check) => ({
              id: check.id,
              impact: check.impact as 'critical' | 'serious' | 'moderate' | 'minor' | null,
              message: check.message,
              data: check.data,
              relatedNodes: [],
            })) ?? [],
          })),
        })),
        url: resolved.url,
        timestamp: new Date().toISOString(),
      };

      return result;
    } finally {
      await page.close();
      await context.close();
      if (resolved.cleanup) {
        await resolved.cleanup();
      }
    }
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      switch (this.browserType) {
        case 'chromium':
          this.browser = await chromium.launch({ headless: true });
          break;
        case 'firefox':
          const { firefox } = await import('playwright');
          this.browser = await firefox.launch({ headless: true });
          break;
        case 'webkit':
          const { webkit } = await import('playwright');
          this.browser = await webkit.launch({ headless: true });
          break;
      }
    }
    return this.browser;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

