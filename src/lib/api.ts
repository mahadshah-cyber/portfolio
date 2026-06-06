import { NextResponse } from "next/server";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function parseJsonBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return {
      ok: false as const,
      status: 415,
      error: "Content-Type must be application/json",
    };
  }

  try {
    const data = await request.json();
    return { ok: true as const, data };
  } catch {
    return { ok: false as const, status: 400, error: "Invalid JSON body" };
  }
}
