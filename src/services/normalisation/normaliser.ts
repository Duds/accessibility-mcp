import type { AxeResult, LighthouseResult, WaveResult } from '../../types/audit.js';
import type { NormalisedResult, NormalisedAuditResult } from '../../types/normalised.js';
import { getWCAGMapping, getDefaultWCAGMapping, mapImpactToSeverity, getConfidenceFromImpact } from '../../utils/wcag.js';
import { normaliseSelector, extractDOMContext } from '../../utils/selectors.js';

export class Normaliser {
  normaliseAxeResult(result: AxeResult): NormalisedAuditResult {
    const normalisedResults: NormalisedResult[] = [];

    for (const violation of result.violations) {
      const mapping = getWCAGMapping(violation.id, 'axe') ?? getDefaultWCAGMapping(violation.id);

      for (const node of violation.nodes) {
        const selector = normaliseSelector(node.target);
        const domContext = extractDOMContext(node.html);

        normalisedResults.push({
          rule_id: violation.id,
          wcag_ref: mapping.wcagRefs,
          severity: mapImpactToSeverity(violation.impact),
          confidence: getConfidenceFromImpact(violation.impact),
          outcome: 'fail',
          selector,
          dom_context: domContext,
          message: violation.help,
        });
      }
    }

    for (const pass of result.passes) {
      const mapping = getWCAGMapping(pass.id, 'axe') ?? getDefaultWCAGMapping(pass.id);

      for (const node of pass.nodes) {
        const selector = normaliseSelector(node.target);
        const domContext = extractDOMContext(node.html);

        normalisedResults.push({
          rule_id: pass.id,
          wcag_ref: mapping.wcagRefs,
          severity: mapImpactToSeverity(pass.impact),
          confidence: getConfidenceFromImpact(pass.impact),
          outcome: 'pass',
          selector,
          dom_context: domContext,
          message: pass.help,
        });
      }
    }

    for (const incomplete of result.incomplete) {
      const mapping = getWCAGMapping(incomplete.id, 'axe') ?? getDefaultWCAGMapping(incomplete.id);

      for (const node of incomplete.nodes) {
        const selector = normaliseSelector(node.target);
        const domContext = extractDOMContext(node.html);

        normalisedResults.push({
          rule_id: incomplete.id,
          wcag_ref: mapping.wcagRefs,
          severity: mapImpactToSeverity(incomplete.impact),
          confidence: 'low',
          outcome: 'unknown',
          selector,
          dom_context: domContext,
            message: incomplete.help,
            ...(incomplete.help ? { reason_code: 'INCOMPLETE_CHECK' as const } : {}),
          });
      }
    }

    return this.buildAuditResult(result.url, 'axe', normalisedResults);
  }

  normaliseLighthouseResult(result: LighthouseResult): NormalisedAuditResult {
    const normalisedResults: NormalisedResult[] = [];

    const accessibilityCategory = result.categories.accessibility;
    if (!accessibilityCategory) {
      return this.buildAuditResult(result.url, 'lighthouse', []);
    }

    for (const auditRef of accessibilityCategory.auditRefs) {
      const audit = result.audits[auditRef.id];
      if (!audit) {
        continue;
      }

      const mapping = getWCAGMapping(audit.id, 'lighthouse') ?? getDefaultWCAGMapping(audit.id);

      if (audit.scoreDisplayMode === 'notApplicable' || audit.scoreDisplayMode === 'error') {
        continue;
      }

      const outcome: 'pass' | 'fail' | 'unknown' =
        audit.score === null
          ? 'unknown'
          : audit.score >= 0.9
            ? 'pass'
            : audit.score === 0
              ? 'fail'
              : 'unknown';

      if (audit.details?.nodes) {
        for (const node of audit.details.nodes) {
          normalisedResults.push({
            rule_id: audit.id,
            wcag_ref: mapping.wcagRefs,
            severity: mapping.severity,
            confidence: outcome === 'pass' ? 'high' : outcome === 'fail' ? 'high' : 'medium',
            outcome,
            selector: node.selector ?? '',
            dom_context: node.snippet ?? '',
            message: audit.description,
            ...(outcome === 'unknown' ? { reason_code: 'SCORE_AMBIGUOUS' as const } : {}),
          });
        }
      } else {
        normalisedResults.push({
          rule_id: audit.id,
          wcag_ref: mapping.wcagRefs,
          severity: mapping.severity,
          confidence: outcome === 'pass' ? 'high' : outcome === 'fail' ? 'high' : 'medium',
          outcome,
          selector: '',
          dom_context: '',
          message: audit.description,
        });
        if (outcome === 'unknown') {
          const lastItem = normalisedResults[normalisedResults.length - 1];
          if (lastItem) {
            lastItem.reason_code = 'SCORE_AMBIGUOUS';
          }
        }
      }
    }

    return this.buildAuditResult(result.url, 'lighthouse', normalisedResults);
  }

  normaliseWaveResult(result: WaveResult): NormalisedAuditResult {
    const normalisedResults: NormalisedResult[] = [];

    for (const error of result.categories.error) {
      const mapping = getWCAGMapping(error.code, 'wave') ?? getDefaultWCAGMapping(error.code);

      normalisedResults.push({
        rule_id: error.code,
        wcag_ref: mapping.wcagRefs,
        severity: mapping.severity,
        confidence: 'high',
        outcome: 'fail',
        selector: '',
        dom_context: '',
        message: error.description,
      });
    }

    for (const contrast of result.categories.contrast) {
      const mapping = getWCAGMapping(contrast.code, 'wave') ?? getDefaultWCAGMapping(contrast.code);

      normalisedResults.push({
        rule_id: contrast.code,
        wcag_ref: mapping.wcagRefs,
        severity: mapping.severity,
        confidence: 'high',
        outcome: 'fail',
        selector: '',
        dom_context: '',
        message: contrast.description,
      });
    }

    for (const alert of result.categories.alert) {
      const mapping = getWCAGMapping(alert.code, 'wave') ?? getDefaultWCAGMapping(alert.code);

      normalisedResults.push({
        rule_id: alert.code,
        wcag_ref: mapping.wcagRefs,
        severity: 'moderate',
        confidence: 'medium',
        outcome: 'unknown',
        selector: '',
        dom_context: '',
        message: alert.description,
        reason_code: 'WAVE_ALERT',
      });
    }

    return this.buildAuditResult(result.url, 'wave', normalisedResults);
  }

  private buildAuditResult(url: string, tool: 'axe' | 'lighthouse' | 'wave', results: NormalisedResult[]): NormalisedAuditResult {
    const summary = {
      total: results.length,
      pass: results.filter((r) => r.outcome === 'pass').length,
      fail: results.filter((r) => r.outcome === 'fail').length,
      unknown: results.filter((r) => r.outcome === 'unknown').length,
      by_severity: {
        critical: results.filter((r) => r.severity === 'critical').length,
        serious: results.filter((r) => r.severity === 'serious').length,
        moderate: results.filter((r) => r.severity === 'moderate').length,
        minor: results.filter((r) => r.severity === 'minor').length,
      },
    };

    return {
      url,
      tool,
      timestamp: new Date().toISOString(),
      results,
      summary,
    };
  }
}

