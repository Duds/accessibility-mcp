import { describe, it, expect } from 'vitest';
import { Normaliser } from '../../src/services/normalisation/normaliser.js';
import type { AxeResult, LighthouseResult, WaveResult } from '../../src/types/audit.js';
import { readFileSync } from 'fs';
import { join } from 'path';

const axeFixture = JSON.parse(readFileSync(join(__dirname, '../fixtures/axe-result.json'), 'utf-8'));
const lighthouseFixture = JSON.parse(readFileSync(join(__dirname, '../fixtures/lighthouse-result.json'), 'utf-8'));
const waveFixture = JSON.parse(readFileSync(join(__dirname, '../fixtures/wave-result.json'), 'utf-8'));

describe('Normaliser', () => {
  const normaliser = new Normaliser();

  describe('normaliseAxeResult', () => {
    it('should normalise axe violations to NormalisedResult', () => {
      const result = normaliser.normaliseAxeResult(axeFixture as AxeResult);

      expect(result.tool).toBe('axe');
      expect(result.url).toBe('https://example.com');
      expect(result.results).toHaveLength(1);
      expect(result.results[0]).toMatchObject({
        rule_id: 'image-alt',
        outcome: 'fail',
        severity: 'critical',
        wcag_ref: expect.arrayContaining(['WCAG2.1:1.1.1']),
      });
    });

    it('should include selector and DOM context', () => {
      const result = normaliser.normaliseAxeResult(axeFixture as AxeResult);

      expect(result.results[0].selector).toBeTruthy();
      expect(result.results[0].dom_context).toBeTruthy();
    });

    it('should generate summary statistics', () => {
      const result = normaliser.normaliseAxeResult(axeFixture as AxeResult);

      expect(result.summary.total).toBe(1);
      expect(result.summary.fail).toBe(1);
      expect(result.summary.pass).toBe(0);
      expect(result.summary.by_severity.critical).toBe(1);
    });
  });

  describe('normaliseLighthouseResult', () => {
    it('should normalise Lighthouse audits to NormalisedResult', () => {
      const result = normaliser.normaliseLighthouseResult(lighthouseFixture as LighthouseResult);

      expect(result.tool).toBe('lighthouse');
      expect(result.url).toBe('https://example.com');
      expect(result.results.length).toBeGreaterThan(0);
    });

    it('should map scores to outcomes', () => {
      const result = normaliser.normaliseLighthouseResult(lighthouseFixture as LighthouseResult);

      const imageAltResult = result.results.find((r) => r.rule_id === 'image-alt');
      expect(imageAltResult?.outcome).toBe('fail');
    });
  });

  describe('normaliseWaveResult', () => {
    it('should normalise WAVE errors to NormalisedResult', () => {
      const result = normaliser.normaliseWaveResult(waveFixture as WaveResult);

      expect(result.tool).toBe('wave');
      expect(result.url).toBe('https://example.com');
      expect(result.results).toHaveLength(1);
      expect(result.results[0]).toMatchObject({
        rule_id: 'error_alt_missing',
        outcome: 'fail',
        wcag_ref: expect.arrayContaining(['WCAG2.1:1.1.1']),
      });
    });

    it('should generate summary statistics', () => {
      const result = normaliser.normaliseWaveResult(waveFixture as WaveResult);

      expect(result.summary.total).toBe(1);
      expect(result.summary.fail).toBe(1);
    });
  });
});

