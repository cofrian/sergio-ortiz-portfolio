import type { NextRequest } from "next/server";

export function hasValidJsonRequest(request: NextRequest) {
  const contentType = request.headers.get("content-type")?.split(";")[0];
  if (contentType !== "application/json") return false;
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  try {
    const originUrl = new URL(origin);
    const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    const protocolAllowed = process.env.NODE_ENV === "production" ? originUrl.protocol === "https:" : ["http:", "https:"].includes(originUrl.protocol);
    return originUrl.host === forwardedHost && protocolAllowed;
  } catch {
    return false;
  }
}
