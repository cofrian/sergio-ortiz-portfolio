import type { NextRequest } from "next/server";

export class RequestBodyTooLargeError extends Error {
  constructor() {
    super("Request body exceeds the configured limit");
    this.name = "RequestBodyTooLargeError";
  }
}

export class InvalidRequestBodyError extends Error {
  constructor() {
    super("Request body is not valid JSON");
    this.name = "InvalidRequestBodyError";
  }
}

export function hasValidJsonRequest(request: NextRequest) {
  const contentType = request.headers.get("content-type")?.split(";")[0];
  if (contentType !== "application/json") return false;
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  try {
    const originUrl = new URL(origin);
    const configuredHost = process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host
      : null;
    const allowedHosts = new Set(
      [
        request.nextUrl.host,
        request.headers.get("host"),
        request.headers.get("x-forwarded-host"),
        configuredHost,
      ].filter((value): value is string => Boolean(value)),
    );
    const protocolAllowed = process.env.NODE_ENV === "production" ? originUrl.protocol === "https:" : ["http:", "https:"].includes(originUrl.protocol);
    return allowedHosts.has(originUrl.host) && protocolAllowed;
  } catch {
    return false;
  }
}

export async function readRequestText(request: Request, maxBytes: number) {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength) {
    const parsedLength = Number(declaredLength);
    if (!Number.isSafeInteger(parsedLength) || parsedLength < 0) throw new InvalidRequestBodyError();
    if (parsedLength > maxBytes) throw new RequestBodyTooLargeError();
  }

  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let total = 0;
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new RequestBodyTooLargeError();
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) throw error;
    throw new InvalidRequestBodyError();
  } finally {
    reader.releaseLock();
  }
}

export async function readJsonWithLimit(request: Request, maxBytes: number): Promise<unknown> {
  const text = await readRequestText(request, maxBytes);
  if (!text) throw new InvalidRequestBodyError();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new InvalidRequestBodyError();
  }
}
