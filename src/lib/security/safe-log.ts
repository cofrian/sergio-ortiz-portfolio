import "server-only";

const secretPatterns = [
  /bearer\s+[a-z0-9._~-]+/gi,
  /\b(?:nvapi|gh[pousr]|sb_secret)_[a-z0-9._-]{8,}\b/gi,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/gi,
  /postgres(?:ql)?:\/\/[^\s@]+@/gi,
  /(?:api[_-]?key|token|secret|password)\s*[:=]\s*[^\s,;]+/gi,
  /https?:\/\/[^\s?]+\?[^\s]*(?:token|key|secret)=[^\s&]+/gi,
];

export function redactSecrets(value: string) {
  return secretPatterns.reduce((result, pattern) => result.replace(pattern, "[REDACTED]"), value);
}

export function safeLog(operation: string, data: { requestId: string; status: string; latencyMs?: number; code?: string }) {
  const event = { operation, requestId: data.requestId, status: data.status, latencyMs: data.latencyMs, code: data.code };
  console.info(JSON.stringify(event));
}

export function publicError() {
  return { error: "The request could not be completed." };
}
