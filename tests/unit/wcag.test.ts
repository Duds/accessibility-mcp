import { describe, it, expect } from 'vitest';
import { getWCAGMapping, mapImpactToSeverity, getConfidenceFromImpact } from '../../src/utils/wcag.js';

describe('WCAG Utilities', () => {
  describe('getWCAGMapping', () => {
    it('should return WCAG mapping for axe rule', () => {
      const mapping = getWCAGMapping('image-alt', 'axe');
      expect(mapping).toBeDefined();
      expect(mapping?.wcagRefs).toContain('WCAG2.1:1.1.1');
      expect(mapping?.severity).toBe('critical');
    });

    it('should return WCAG mapping for lighthouse audit', () => {
      const mapping = getWCAGMapping('image-alt', 'lighthouse');
      expect(mapping).toBeDefined();
      expect(mapping?.wcagRefs).toContain('WCAG2.1:1.1.1');
    });

    it('should return WCAG mapping for wave error', () => {
      const mapping = getWCAGMapping('error_alt_missing', 'wave');
      expect(mapping).toBeDefined();
      expect(mapping?.wcagRefs).toContain('WCAG2.1:1.1.1');
    });

    it('should return undefined for unknown rule', () => {
      const mapping = getWCAGMapping('unknown-rule', 'axe');
      expect(mapping).toBeUndefined();
    });
  });

  describe('mapImpactToSeverity', () => {
    it('should map critical impact to critical severity', () => {
      expect(mapImpactToSeverity('critical')).toBe('critical');
    });

    it('should map null impact to moderate severity', () => {
      expect(mapImpactToSeverity(null)).toBe('moderate');
    });
  });

  describe('getConfidenceFromImpact', () => {
    it('should return high confidence for critical impact', () => {
      expect(getConfidenceFromImpact('critical')).toBe('high');
    });

    it('should return medium confidence for moderate impact', () => {
      expect(getConfidenceFromImpact('moderate')).toBe('medium');
    });

    it('should return low confidence for minor impact', () => {
      expect(getConfidenceFromImpact('minor')).toBe('low');
    });
  });
});

