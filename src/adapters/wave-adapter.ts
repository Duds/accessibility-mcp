import type { WaveResult } from '../types/audit.js';
import { resolveUrl, type ResolvedUrl } from '../utils/url-resolver.js';

const DEFAULT_WAVE_API_URL = 'https://wave.webaim.org/api/request';

export interface WaveAdapterOptions {
  apiKey?: string;
  apiUrl?: string;
}

export class WaveAdapter {
  private readonly apiKey: string | undefined;
  private readonly apiUrl: string;

  constructor(options: WaveAdapterOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.WAVE_API_KEY;
    this.apiUrl = options.apiUrl ?? process.env.WAVE_API_URL ?? DEFAULT_WAVE_API_URL;
  }

  async audit(urlOrPath: string, options?: WaveAdapterOptions): Promise<WaveResult> {
    const resolved: ResolvedUrl = await resolveUrl(urlOrPath);
    
    if (!resolved.url.startsWith('http://') && !resolved.url.startsWith('https://')) {
      throw new Error('WAVE API only supports HTTP/HTTPS URLs. Local files must be served via a local server.');
    }

    const apiKey = options?.apiKey ?? this.apiKey;
    const apiUrl = options?.apiUrl ?? this.apiUrl;

    if (!apiKey) {
      throw new Error('WAVE API key is required. Set WAVE_API_KEY environment variable or pass apiKey option.');
    }

    let result: WaveResult;
    try {
      const requestUrl = new URL(apiUrl);
      requestUrl.searchParams.set('key', apiKey);
      requestUrl.searchParams.set('url', resolved.url);
      requestUrl.searchParams.set('format', 'json');

    const response = await fetch(requestUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WAVE API request failed: ${response.status} ${response.statusText}`);
    }

      const data = await response.json();
      result = this.transformResult(data, resolved.url);
    } finally {
      if (resolved.cleanup) {
        await resolved.cleanup();
      }
    }

    return result;
  }

  private transformResult(data: unknown, url: string): WaveResult {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid WAVE API response');
    }

    const waveData = data as {
      statsummary?: {
        total?: number;
        error?: number;
        contrast?: number;
        alert?: number;
        feature?: number;
        structure?: number;
        aria?: number;
      };
      categories?: {
        error?: Array<{
          code?: string;
          count?: number;
          pages?: number;
          description?: string;
        }>;
        contrast?: Array<{
          code?: string;
          count?: number;
          pages?: number;
          description?: string;
          contrast?: {
            ratio?: string;
            large?: boolean;
            expected?: string;
          };
        }>;
        alert?: Array<{
          code?: string;
          count?: number;
          pages?: number;
          description?: string;
        }>;
        feature?: Array<{
          code?: string;
          count?: number;
          pages?: number;
          description?: string;
        }>;
        structure?: Array<{
          code?: string;
          count?: number;
          pages?: number;
          description?: string;
        }>;
        aria?: Array<{
          code?: string;
          count?: number;
          pages?: number;
          description?: string;
        }>;
      };
    };

    const statsummary = waveData.statsummary ?? {};
    const categories = waveData.categories ?? {};

    return {
      statsummary: {
        total: statsummary.total ?? 0,
        error: statsummary.error ?? 0,
        contrast: statsummary.contrast ?? 0,
        alert: statsummary.alert ?? 0,
        feature: statsummary.feature ?? 0,
        structure: statsummary.structure ?? 0,
        aria: statsummary.aria ?? 0,
      },
      categories: {
        error: (categories.error ?? []).map((item) => ({
          code: item.code ?? '',
          count: item.count ?? 0,
          pages: item.pages ?? 0,
          description: item.description ?? '',
        })),
        contrast: (categories.contrast ?? []).map((item) => ({
          code: item.code ?? '',
          count: item.count ?? 0,
          pages: item.pages ?? 0,
          description: item.description ?? '',
          contrast: item.contrast
            ? {
                ratio: item.contrast.ratio ?? '',
                large: item.contrast.large ?? false,
                expected: item.contrast.expected ?? '',
              }
            : undefined,
        })),
        alert: (categories.alert ?? []).map((item) => ({
          code: item.code ?? '',
          count: item.count ?? 0,
          pages: item.pages ?? 0,
          description: item.description ?? '',
        })),
        feature: (categories.feature ?? []).map((item) => ({
          code: item.code ?? '',
          count: item.count ?? 0,
          pages: item.pages ?? 0,
          description: item.description ?? '',
        })),
        structure: (categories.structure ?? []).map((item) => ({
          code: item.code ?? '',
          count: item.count ?? 0,
          pages: item.pages ?? 0,
          description: item.description ?? '',
        })),
        aria: (categories.aria ?? []).map((item) => ({
          code: item.code ?? '',
          count: item.count ?? 0,
          pages: item.pages ?? 0,
          description: item.description ?? '',
        })),
      },
      url,
      timestamp: new Date().toISOString(),
    };
  }
}

