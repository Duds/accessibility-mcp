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
    const result = await this.axeAdapter.audit(url, {
      timeout: config?.timeout,
      browser: config?.browser,
      tags: config?.tags,
      rules: config?.rules,
    });
    return this.normaliser.normaliseAxeResult(result);
  }

  async executeLighthouseAudit(url: string, config?: AuditConfig): Promise<NormalisedAuditResult> {
    const result = await this.lighthouseAdapter.audit(url, {
      timeout: config?.timeout,
      categories: config?.categories,
      onlyCategories: config?.onlyCategories,
      skipAudits: config?.skipAudits,
    });
    return this.normaliser.normaliseLighthouseResult(result);
  }

  async executeWaveAudit(url: string, config?: AuditConfig & { apiKey?: string }): Promise<NormalisedAuditResult> {
    const result = await this.waveAdapter.audit(url, {
      apiKey: config?.apiKey,
    });
    return this.normaliser.normaliseWaveResult(result);
  }

  async close(): Promise<void> {
    await this.axeAdapter.close();
  }
}

