import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { AuditExecutor } from '../services/audits/audit-executor.js';

const executor = new AuditExecutor();

const TOOLS = [
  {
    name: 'axe_audit',
    description: 'Run an accessibility audit using axe-core via Playwright. Supports URLs, local file paths, and localhost URLs.',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The URL to audit (http://, https://), local file path (./file.html), or file:// URL',
        },
        options: {
          type: 'object',
          description: 'Optional axe-core configuration',
          properties: {
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'WCAG tags to include (e.g., ["wcag2a", "wcag2aa"])',
            },
            rules: {
              type: 'object',
              description: 'Rule-specific configuration',
            },
            timeout: {
              type: 'number',
              description: 'Timeout in milliseconds',
            },
            browser: {
              type: 'string',
              enum: ['chromium', 'firefox', 'webkit'],
              description: 'Browser to use',
            },
          },
        },
      },
      required: ['url'],
    },
  },
  {
    name: 'lighthouse_audit',
    description: 'Run an accessibility audit using Lighthouse CLI. Supports URLs, local file paths, and localhost URLs.',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The URL to audit (http://, https://), local file path (./file.html), or file:// URL',
        },
        categories: {
          type: 'array',
          items: { type: 'string' },
          description: 'Lighthouse categories to include (default: accessibility)',
        },
        options: {
          type: 'object',
          description: 'Optional Lighthouse configuration',
          properties: {
            onlyCategories: {
              type: 'array',
              items: { type: 'string' },
              description: 'Categories to include',
            },
            skipAudits: {
              type: 'array',
              items: { type: 'string' },
              description: 'Audits to skip',
            },
            timeout: {
              type: 'number',
              description: 'Timeout in milliseconds',
            },
          },
        },
      },
      required: ['url'],
    },
  },
  {
    name: 'wave_audit',
    description: 'Run an accessibility audit using WAVE API (requires WAVE_API_KEY). Supports URLs and localhost URLs. Local files are automatically served via temporary local server.',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The URL to audit (http://, https://), local file path (./file.html), or localhost URL. Local files will be served via temporary server.',
        },
        apiKey: {
          type: 'string',
          description: 'WAVE API key (optional, uses WAVE_API_KEY env var if not provided)',
        },
      },
      required: ['url'],
    },
  },
];

export async function registerTools(server: Server): Promise<void> {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: TOOLS,
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name as string;
    const args = request.params.arguments as Record<string, unknown>;

    switch (toolName) {
      case 'axe_audit': {
        if (!args?.url || typeof args.url !== 'string') {
          throw new Error('URL is required');
        }
        const result = await executor.executeAxeAudit(args.url, args.options as Record<string, unknown>);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'lighthouse_audit': {
        if (!args?.url || typeof args.url !== 'string') {
          throw new Error('URL is required');
        }
        const config: {
          categories?: string[];
          timeout?: number;
          onlyCategories?: string[];
          skipAudits?: string[];
        } = {};
        if (args.categories !== undefined) {
          config.categories = args.categories as string[];
        }
        if (args.options && typeof args.options === 'object') {
          const opts = args.options as Record<string, unknown>;
          if (opts.timeout !== undefined) {
            config.timeout = opts.timeout as number;
          }
          if (opts.onlyCategories !== undefined) {
            config.onlyCategories = opts.onlyCategories as string[];
          }
          if (opts.skipAudits !== undefined) {
            config.skipAudits = opts.skipAudits as string[];
          }
        }
        const result = await executor.executeLighthouseAudit(args.url, config);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'wave_audit': {
        if (!args?.url || typeof args.url !== 'string') {
          throw new Error('URL is required');
        }
        const config: { apiKey?: string } = {};
        if (args.apiKey !== undefined) {
          config.apiKey = args.apiKey as string;
        }
        const result = await executor.executeWaveAudit(args.url, config);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  });
}

