import { existsSync, readFileSync } from 'fs';
import { resolve, extname } from 'path';
import { createServer } from 'http';

export interface ResolvedUrl {
  url: string;
  isLocal: boolean;
  cleanup?: () => Promise<void>;
}

const TEMP_SERVER_PORT_START = 30000;
let tempServerPort = TEMP_SERVER_PORT_START;

function isUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isFileProtocol(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === 'file:';
  } catch {
    return false;
  }
}

function isLocalhost(input: string): boolean {
  try {
    const url = new URL(input);
    return url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1';
  } catch {
    return false;
  }
}

function isFilePath(input: string): boolean {
  if (isUrl(input) || isFileProtocol(input)) {
    return false;
  }
  const resolved = resolve(input);
  return existsSync(resolved) && (extname(resolved) === '.html' || extname(resolved) === '.htm');
}

export async function resolveUrl(input: string): Promise<ResolvedUrl> {
  if (isUrl(input)) {
    return {
      url: input,
      isLocal: isLocalhost(input),
    };
  }

  if (isFileProtocol(input)) {
    return {
      url: input,
      isLocal: true,
    };
  }

  if (isFilePath(input)) {
    const filePath = resolve(input);
    const fileContent = readFileSync(filePath, 'utf-8');
    const server = await createTempServer(fileContent);
    const url = `http://localhost:${server.port}`;

    return {
      url,
      isLocal: true,
      cleanup: async () => {
        await new Promise<void>((resolve) => {
          server.server.close(() => resolve());
        });
      },
    };
  }

  throw new Error(`Invalid input: "${input}" is not a valid URL, file:// URL, or local file path`);
}

async function createTempServer(htmlContent: string): Promise<{ server: ReturnType<typeof createServer>; port: number }> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 10;

    const tryCreateServer = (port: number) => {
      const server = createServer((req, res) => {
        if (req.url === '/' || req.url === '/index.html') {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(htmlContent);
        } else {
          res.writeHead(404);
          res.end('Not found');
        }
      });

      server.listen(port, '127.0.0.1', () => {
        resolve({ server, port });
      });

      server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          attempts++;
          if (attempts < maxAttempts) {
            tryCreateServer(port + 1);
          } else {
            reject(new Error('Could not find available port for temporary server'));
          }
        } else {
          reject(err);
        }
      });
    };

    const port = tempServerPort++;
    tryCreateServer(port);
  });
}

