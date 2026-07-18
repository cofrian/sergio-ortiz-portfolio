const forbiddenOutputPatterns = [
  /\b(?:system|developer)\s+(?:prompt|message)\b/i,
  /\bprocess\.env\b/i,
  /\b(?:NVIDIA_API_KEY|SUPABASE_SECRET_KEY|SUPABASE_SERVICE_ROLE_KEY|GITHUB_TOKEN|RESEND_API_KEY)\b/i,
  /\b(?:nvapi|gh[pousr]|sb_secret)_[a-z0-9._-]{8,}\b/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /\bauthorization\s*:\s*bearer\s+/i,
  /\b(?:can|could)\s+be\s+inferred\b/i,
  /\bse\s+puede\s+inferir\b/i,
];

export function validateGeneratedAnswer(value: string | null | undefined) {
  if (!value) return null;
  const normalized = value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
  if (!normalized || normalized.length > 2_400) return null;
  if (forbiddenOutputPatterns.some((pattern) => pattern.test(normalized))) return null;
  return normalized;
}
