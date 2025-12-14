export function normaliseSelector(target: string | string[]): string {
  if (Array.isArray(target)) {
    return target.join(' > ');
  }
  return target;
}

export function extractDOMContext(html: string, maxLength: number = 200): string {
  if (!html) {
    return '';
  }
  const trimmed = html.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return trimmed.substring(0, maxLength) + '...';
}

export function buildSelectorPath(target: string[]): string {
  return target.join(' > ');
}

