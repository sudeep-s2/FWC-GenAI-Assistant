export function sanitizeInput(input: string): string {
  if (!input) return '';
  // Strip HTML tag boundaries to defend against injection
  return input
    .trim()
    .replace(/<[^>]*>?/gm, '')
    // Escape standard characters for console / text display safety
    .replace(/[&<>"']/g, (m) => {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        default: return m;
      }
    });
}

export function validateApiKey(key: string): boolean {
  return typeof key === 'string' && key.length > 10;
}

export function validatePrompt(prompt: string): boolean {
  if (!prompt || prompt.length > 4000) {
    return false;
  }
  
  // Guard against common prompt injection attacks
  const injectionPatterns = [
    /ignore previous instructions/i,
    /system prompt bypass/i,
    /new system instruction/i,
    /bypass safety checks/i,
    /forget rules/i
  ];

  return !injectionPatterns.some(pattern => pattern.test(prompt));
}

export function rateLimiter(): boolean {
  try {
    const limitKey = 'stadiumos_session_api_calls';
    const currentCallsStr = sessionStorage.getItem(limitKey) || '0';
    const currentCalls = parseInt(currentCallsStr, 10);
    
    if (currentCalls >= 30) {
      return false; // Blocks requests exceeding 30 calls
    }
    
    sessionStorage.setItem(limitKey, (currentCalls + 1).toString());
    return true;
  } catch {
    return true;
  }
}

export function getSessionCallsRemaining(): number {
  try {
    const limitKey = 'stadiumos_session_api_calls';
    const currentCallsStr = sessionStorage.getItem(limitKey) || '0';
    const currentCalls = parseInt(currentCallsStr, 10);
    return Math.max(0, 30 - currentCalls);
  } catch {
    return 30;
  }
}

export function resetSessionRateLimit(): void {
  try {
    sessionStorage.setItem('stadiumos_session_api_calls', '0');
  } catch {
    // ignore
  }
}
