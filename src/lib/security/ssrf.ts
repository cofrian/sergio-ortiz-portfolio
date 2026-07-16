import { isIP } from "node:net";
import { promises as dns } from "node:dns";

const blockedV4 = [
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^0\./,
  /^100\.(6[4-9]|[78]\d|9\d|1[01]\d|12[0-7])\./,
];

function isPrivateAddress(address: string) {
  if (isIP(address) === 4) return blockedV4.some((pattern) => pattern.test(address)) || address === "169.254.169.254";
  if (isIP(address) === 6) {
    const lower = address.toLowerCase();
    return lower === "::1" || lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe80:") || lower.startsWith("::ffff:127.");
  }
  return true;
}

export async function validateCaptureUrl(value: string, allowedHosts: string[]) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.port) throw new Error("Only credential-free HTTPS URLs are allowed");
  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".local")) throw new Error("Local hosts are blocked");
  const hostAllowed = allowedHosts.some((host) => hostname === host || hostname.endsWith(`.${host}`));
  if (!hostAllowed) throw new Error("Host is not allowlisted");
  const addresses = await dns.lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) throw new Error("Private or unresolved address blocked");
  return url;
}
