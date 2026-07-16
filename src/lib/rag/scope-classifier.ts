const injectionPatterns = [
  /ignore (all|any|previous|prior) instructions?/i,
  /system prompt/i,
  /reveal (your|the) (prompt|secret|key|context)/i,
  /jailbreak/i,
  /developer message/i,
  /act as/i,
];

const scopeTerms = ["sergio", "project", "portfolio", "github", "research", "experience", "gemf", "exist", "urbanflow", "aion", "upv", "earth", "mlops", "llm", "smart city", "smart-city", "data", "modelo", "proyecto", "investigación", "experiencia", "despliegue", "demo", "optimisation", "optimización"];

export type Scope = "IN_SCOPE" | "OUT_OF_SCOPE" | "MALICIOUS_OR_INJECTION";

export function classifyScope(message: string): Scope {
  if (injectionPatterns.some((pattern) => pattern.test(message))) return "MALICIOUS_OR_INJECTION";
  const normalized = message.toLowerCase();
  return scopeTerms.some((term) => normalized.includes(term)) ? "IN_SCOPE" : "OUT_OF_SCOPE";
}
