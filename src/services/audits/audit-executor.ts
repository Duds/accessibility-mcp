import { AxeAdapter } from '../../adapters/axe-adapter.js';
import { LighthouseAdapter } from '../../adapters/lighthouse-adapter.js';
import { WaveAdapter } from '../../adapters/wave-adapter.js';
import { Normaliser } from '../normalisation/normaliser.js';
import type { NormalisedAuditResult } from '../../types/normalised.js';
import type { AuditConfig } from './audit-config.js';

export class AuditExecutor {
  private readonly axeAdapter: AxeAdapter;
  private readonly lighthouseAdapter: LighthouseAdapter;
  private readonly waveAdapter: WaveAdapter;
  private readonly normaliser: Normaliser;

  constructor() {
    this.axeAdapter = new AxeAdapter();
    this.lighthouseAdapter = new LighthouseAdapter();
    this.waveAdapter = new WaveAdapter();
    this.normaliser = new Normaliser();
  }

  async executeAxeAudit(url: string, config?: AuditConfig): Promise<NormalisedAuditResult> {
    const options: {
      timeout?: number;
      browser?: 'chromium' | 'firefox' | 'webkit';
      tags?: string[];
      rules?: Record<string, { enabled: boolean }>;
    } = {};
    if (config?.timeout !== undefined) {
      options.timeout = config.timeout;
    }
    if (config?.browser !== undefined) {
      options.browser = config.browser;
    }
    if (config?.tags !== undefined) {
      options.tags = config.tags;
    }
    if (config?.rules !== undefined) {
      options.rules = config.rules;
    }
    const result = await this.axeAdapter.audit(url, options);
    return this.normaliser.normaliseAxeResult(result);
  }

  async executeLighthouseAudit(url: string, config?: AuditConfig): Promise<NormalisedAuditResult> {
    const options: {
      timeout?: number;
      categories?: string[];
      onlyCategories?: string[];
      skipAudits?: string[];
    } = {};
    if (config?.timeout !== undefined) {
      options.timeout = config.timeout;
    }
    if (config?.categories !== undefined) {
      options.categories = config.categories;
    }
    if (config?.onlyCategories !== undefined) {
      options.onlyCategories = config.onlyCategories;
    }
    if (config?.skipAudits !== undefined) {
      options.skipAudits = config.skipAudits;
    }
    const result = await this.lighthouseAdapter.audit(url, options);
    return this.normaliser.normaliseLighthouseResult(result);
  }

  async executeWaveAudit(url: string, config?: AuditConfig & { apiKey?: string }): Promise<NormalisedAuditResult> {
    const options: { apiKey?: string } = {};
    if (config?.apiKey !== undefined) {
      options.apiKey = config.apiKey;
    }
    const result = await this.waveAdapter.audit(url, options);
    return this.normaliser.normaliseWaveResult(result);
  }

  async close(): Promise<void> {
    await this.axeAdapter.close();
  }
}

