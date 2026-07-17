import { NextResponse } from "next/server";

export function noStoreJson<T>(body: T, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store, max-age=0");
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");
  return NextResponse.json(body, { ...init, headers });
}
